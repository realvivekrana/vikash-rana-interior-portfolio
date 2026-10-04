import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaStar, FaEyeSlash } from 'react-icons/fa';
import api from '../../api/axios';
import { img } from '../../utils/img';
import { inputClass, labelClass, goldBtn, outlineBtn } from '../../utils/ui';
import PageHeader from '../../components/admin/PageHeader';
import Modal from '../../components/admin/Modal';
import ImageInput, { MultiImageInput } from '../../components/admin/ImageInput';

const SUGGESTED = [
  'Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Dining Room',
  'Kids Room', 'Office', 'Commercial', 'Full Home',
];

const ProjectForm = ({ project, categories, onClose, onSaved }) => {
  const isEdit = !!project;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: project?.title || '',
      category: project?.category || '',
      location: project?.location || '',
      area: project?.area || '',
      year: project?.year || '',
      client: project?.client || '',
      order: project?.order ?? 0,
      description: project?.description || '',
      featured: project?.featured || false,
      isPublished: project?.isPublished ?? true,
    },
  });

  const [cover, setCover] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [removeIds, setRemoveIds] = useState([]);

  const toggleRemove = (id) =>
    setRemoveIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  const onSubmit = async (values) => {
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => fd.append(k, String(v)));
    if (cover) fd.append('coverImage', cover);
    newImages.forEach((f) => fd.append('images', f));
    if (isEdit && removeIds.length) fd.append('removeImages', JSON.stringify(removeIds));

    try {
      if (isEdit) await api.put(`/projects/${project._id}`, fd);
      else await api.post('/projects', fd);
      toast.success(isEdit ? 'Project updated' : 'Project created');
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Title *</label>
          <input className={inputClass} {...register('title', { required: 'Title required' })} />
          {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Category *</label>
          <input
            list="category-list"
            className={inputClass}
            placeholder="Living Room, Bedroom..."
            {...register('category', { required: 'Category required' })}
          />
          <datalist id="category-list">
            {categories.map((c) => <option key={c} value={c} />)}
          </datalist>
          {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-4 gap-5">
        <div className="sm:col-span-2">
          <label className={labelClass}>Location</label>
          <input className={inputClass} placeholder="Pune, Maharashtra" {...register('location')} />
        </div>
        <div>
          <label className={labelClass}>Area</label>
          <input className={inputClass} placeholder="1800 sq ft" {...register('area')} />
        </div>
        <div>
          <label className={labelClass}>Year</label>
          <input className={inputClass} placeholder="2026" {...register('year')} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Client</label>
          <input className={inputClass} {...register('client')} />
        </div>
        <div>
          <label className={labelClass}>Display order (lower number comes first)</label>
          <input type="number" className={inputClass} {...register('order')} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea rows={5} className={inputClass} {...register('description')} />
      </div>

      <ImageInput
        label="Cover image"
        file={cover}
        existing={project?.coverImage?.url && img(project.coverImage.url, 200)}
        onChange={setCover}
        wide
      />

      {isEdit && project.images?.length > 0 && (
        <div>
          <label className={labelClass}>Current gallery (click an image to mark it for removal)</label>
          <div className="flex flex-wrap gap-3">
            {project.images.map((g) => {
              const marked = removeIds.includes(g.public_id);
              return (
                <button
                  type="button"
                  key={g.public_id}
                  onClick={() => toggleRemove(g.public_id)}
                  className={`relative h-20 w-20 border overflow-hidden ${marked ? 'border-red-500' : 'border-line'}`}
                >
                  <img src={img(g.url, 200)} alt="" className={`h-full w-full object-cover ${marked ? 'opacity-30' : ''}`} />
                  {marked && (
                    <span className="absolute inset-0 flex items-center justify-center text-red-400 text-[10px] uppercase">
                      Remove
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <MultiImageInput label="Add gallery images" files={newImages} onChange={setNewImages} />

      <div className="flex flex-wrap gap-8 pt-1">
        <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
          <input type="checkbox" className="accent-gold h-4 w-4" {...register('featured')} />
          Featured (show on Home page)
        </label>
        <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
          <input type="checkbox" className="accent-gold h-4 w-4" {...register('isPublished')} />
          Published
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-line">
        <button type="button" onClick={onClose} className={outlineBtn}>Cancel</button>
        <button type="submit" disabled={isSubmitting} className={goldBtn}>
          {isSubmitting ? 'Uploading...' : isEdit ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
};

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'new' | project object

  const load = useCallback(() => {
    return api
      .get('/projects/admin/all')
      .then((res) => setProjects(res.data.data))
      .catch(() => toast.error('Could not load projects'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.title}"? All its images will be removed too.`)) return;
    try {
      await api.delete(`/projects/${p._id}`);
      toast.success('Project deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete');
    }
  };

  const categories = [...new Set([...SUGGESTED, ...projects.map((p) => p.category)])];
  const close = () => setModal(null);

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle={`${projects.length} total`}
        action={
          <button onClick={() => setModal('new')} className={goldBtn}>
            <FaPlus /> Add Project
          </button>
        }
      />

      {loading ? (
        <p className="text-neutral-500">Loading...</p>
      ) : projects.length === 0 ? (
        <div className="border border-dashed border-line p-12 text-center text-neutral-500">
          There are no projects yet. Use "Add Project" to add your first one.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((p) => (
            <div key={p._id} className="bg-surface border border-line">
              <div className="relative aspect-[4/3] bg-ink overflow-hidden">
                {p.coverImage?.url ? (
                  <img src={img(p.coverImage.url, 600)} alt={p.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full flex items-center justify-center text-neutral-700 text-sm">No cover</div>
                )}
                <div className="absolute top-2 left-2 flex gap-2">
                  {p.featured && (
                    <span className="bg-gold text-black text-[10px] px-2 py-0.5 uppercase tracking-wider flex items-center gap-1">
                      <FaStar /> Featured
                    </span>
                  )}
                  {!p.isPublished && (
                    <span className="bg-black/80 text-neutral-300 text-[10px] px-2 py-0.5 uppercase tracking-wider flex items-center gap-1">
                      <FaEyeSlash /> Draft
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-gold text-[10px] uppercase tracking-[0.25em]">{p.category}</p>
                  <h3 className="font-serif text-white truncate">{p.title}</h3>
                  <p className="text-neutral-600 text-xs mt-1">{p.images?.length || 0} gallery images</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setModal(p)}
                    className="h-9 w-9 flex items-center justify-center border border-line text-neutral-300 hover:border-gold hover:text-gold"
                    aria-label="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => remove(p)}
                    className="h-9 w-9 flex items-center justify-center border border-line text-neutral-300 hover:border-red-500 hover:text-red-400"
                    aria-label="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal title={modal === 'new' ? 'Add Project' : 'Edit Project'} onClose={close} wide>
          <ProjectForm
            key={modal === 'new' ? 'new' : modal._id}
            project={modal === 'new' ? null : modal}
            categories={categories}
            onClose={close}
            onSaved={() => {
              close();
              load();
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default ManageProjects;