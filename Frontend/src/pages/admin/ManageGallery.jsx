import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaStar, FaCheck } from 'react-icons/fa';
import api from '../../api/axios';
import { img } from '../../utils/img';
import { inputClass, labelClass, goldBtn, outlineBtn } from '../../utils/ui';
import PageHeader from '../../components/admin/PageHeader';
import Modal from '../../components/admin/Modal';
import ImageInput, { MultiImageInput } from '../../components/admin/ImageInput';

const DEFAULT_CATS = ['Living Room', 'Bedroom', 'Kitchen', 'Office', 'Bathroom', 'Exterior'];
const MAX_MB = 8;

const CategoryField = ({ register, cats }) => (
  <div>
    <label className={labelClass}>Category</label>
    <input className={inputClass} list="gallery-cats" placeholder="Living Room" {...register('category')} />
    <datalist id="gallery-cats">
      {cats.map((c) => (
        <option key={c} value={c} />
      ))}
    </datalist>
    <p className="text-neutral-600 text-xs mt-1">Choose an existing category or type a new name.</p>
  </div>
);

const UploadForm = ({ cats, onClose, onSaved }) => {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: { category: cats[0] || 'General', title: '', order: 0, featured: false, isPublished: true },
  });

  const addFiles = (next) => {
    const ok = next.filter((f) => f.size <= MAX_MB * 1024 * 1024);
    if (ok.length !== next.length) toast.error(`Some photos were larger than ${MAX_MB}MB and were removed`);
    if (ok.length > 20) toast.error('Maximum 20 photos at a time');
    setFiles(ok.slice(0, 20));
  };

  const onSubmit = async (v) => {
    if (!files.length) return toast.error('Choose at least one photo');
    const fd = new FormData();
    files.forEach((f) => fd.append('images', f));
    fd.append('category', v.category);
    fd.append('order', v.order || 0);
    fd.append('featured', v.featured);
    fd.append('isPublished', v.isPublished);
    if (files.length === 1) fd.append('title', v.title);
    try {
      await api.post('/gallery', fd, {
        onUploadProgress: (e) => e.total && setProgress(Math.round((e.loaded / e.total) * 100)),
      });
      toast.success(`${files.length} photo${files.length > 1 ? 's' : ''} uploaded`);
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <MultiImageInput label={`Photos * (${files.length}/20)`} files={files} onChange={addFiles} />
      <CategoryField register={register} cats={cats} />
      {files.length === 1 && (
        <div>
          <label className={labelClass}>Title (optional)</label>
          <input className={inputClass} maxLength={120} placeholder="Modern minimal living room" {...register('title')} />
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-5 items-end">
        <div>
          <label className={labelClass}>Display order</label>
          <input type="number" className={inputClass} {...register('order')} />
        </div>
        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer min-h-11">
            <input type="checkbox" className="accent-gold h-4 w-4" {...register('featured')} /> Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer min-h-11">
            <input type="checkbox" className="accent-gold h-4 w-4" {...register('isPublished')} /> Published (show on site)
          </label>
        </div>
      </div>

      {isSubmitting && (
        <div>
          <div className="h-1.5 bg-line"><div className="h-full bg-gold transition-all" style={{ width: `${progress}%` }} /></div>
          <p className="text-xs text-neutral-500 mt-1">{progress < 100 ? `Uploading ${progress}%` : 'Processing...'}</p>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-line">
        <button type="button" onClick={onClose} disabled={isSubmitting} className={outlineBtn}>Cancel</button>
        <button type="submit" disabled={isSubmitting} className={goldBtn}>
          {isSubmitting ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </form>
  );
};

const EditForm = ({ item, cats, onClose, onSaved }) => {
  const [file, setFile] = useState(null);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      title: item.title || '',
      category: item.category || 'General',
      order: item.order ?? 0,
      featured: item.featured ?? false,
      isPublished: item.isPublished ?? true,
    },
  });

  const onSubmit = async (v) => {
    const fd = new FormData();
    fd.append('title', v.title);
    fd.append('category', v.category);
    fd.append('order', v.order || 0);
    fd.append('featured', v.featured);
    fd.append('isPublished', v.isPublished);
    if (file) fd.append('image', file);
    try {
      await api.put(`/gallery/${item._id}`, fd);
      toast.success('Photo updated');
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <ImageInput label="Photo" file={file} existing={img(item.image.url, 300)} onChange={setFile} wide />
      <div>
        <label className={labelClass}>Title (optional)</label>
        <input className={inputClass} maxLength={120} {...register('title')} />
      </div>
      <CategoryField register={register} cats={cats} />
      <div className="grid sm:grid-cols-2 gap-5 items-end">
        <div>
          <label className={labelClass}>Display order</label>
          <input type="number" className={inputClass} {...register('order')} />
        </div>
        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer min-h-11">
            <input type="checkbox" className="accent-gold h-4 w-4" {...register('featured')} /> Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer min-h-11">
            <input type="checkbox" className="accent-gold h-4 w-4" {...register('isPublished')} /> Published
          </label>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-line">
        <button type="button" onClick={onClose} className={outlineBtn}>Cancel</button>
        <button type="submit" disabled={isSubmitting} className={goldBtn}>{isSubmitting ? 'Saving...' : 'Update'}</button>
      </div>
    </form>
  );
};

const ManageGallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // 'upload' | item
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(() => new Set());

  const load = useCallback(
    () =>
      api
        .get('/gallery/admin/all')
        .then((res) => setItems(res.data.data))
        .catch(() => toast.error('Could not load the gallery'))
        .finally(() => setLoading(false)),
    []
  );

  useEffect(() => {
    load();
  }, [load]);

  const cats = useMemo(() => [...new Set([...items.map((i) => i.category), ...DEFAULT_CATS])], [items]);
  const filterCats = useMemo(() => ['All', ...new Set(items.map((i) => i.category))], [items]);
  const activeFilter = filterCats.includes(filter) ? filter : 'All';
  const visible = activeFilter === 'All' ? items : items.filter((i) => i.category === activeFilter);

  const toggleSel = (id) =>
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const allVisibleSelected = visible.length > 0 && visible.every((i) => selected.has(i._id));
  const selectAllVisible = () =>
    setSelected((s) => {
      const n = new Set(s);
      visible.forEach((i) => (allVisibleSelected ? n.delete(i._id) : n.add(i._id)));
      return n;
    });

  const removeOne = async (it) => {
    if (!window.confirm('Delete this photo?')) return;
    try {
      await api.delete(`/gallery/${it._id}`);
      toast.success('Photo deleted');
      setSelected((s) => {
        const n = new Set(s);
        n.delete(it._id);
        return n;
      });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete');
    }
  };

  const removeSelected = async () => {
    const ids = [...selected];
    if (!ids.length || !window.confirm(`Delete ${ids.length} photos?`)) return;
    try {
      await api.delete('/gallery', { data: { ids } });
      toast.success(`${ids.length} photos deleted`);
      setSelected(new Set());
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete');
    }
  };

  const togglePublish = async (it) => {
    try {
      const { data } = await api.put(`/gallery/${it._id}`, { isPublished: !it.isPublished });
      setItems((list) => list.map((i) => (i._id === it._id ? data.data : i)));
      toast.success(data.data.isPublished ? 'Photo visible' : 'Photo hidden');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update');
    }
  };

  const close = () => setModal(null);
  const iconBtn = 'h-11 flex-1 flex items-center justify-center border border-line text-neutral-300 hover:border-gold hover:text-gold';

  return (
    <div>
      <PageHeader
        title="Gallery"
        subtitle={`${items.length} photos`}
        action={<button onClick={() => setModal('upload')} className={goldBtn}><FaPlus /> Upload Photos</button>}
      />

      {!loading && items.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto no-scrollbar max-w-full">
            {filterCats.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`shrink-0 px-4 min-h-10 text-[11px] uppercase tracking-[0.15em] border transition-colors ${
                  activeFilter === c ? 'bg-gold text-black border-gold' : 'border-line text-neutral-400 hover:border-gold hover:text-gold'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 sm:ml-auto">
            <button onClick={selectAllVisible} className="text-xs text-neutral-400 hover:text-gold min-h-10 px-2">
              {allVisibleSelected ? 'Unselect all' : 'Select all'}
            </button>
            {selected.size > 0 && (
              <button onClick={removeSelected} className="border border-red-500/60 text-red-400 hover:bg-red-500/10 px-4 min-h-10 text-xs uppercase tracking-wider inline-flex items-center gap-2">
                <FaTrash /> Delete ({selected.size})
              </button>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-neutral-500">Loading...</p>
      ) : items.length === 0 ? (
        <div className="border border-dashed border-line p-12 text-center text-neutral-500">There are no photos in the gallery yet.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {visible.map((it) => {
            const sel = selected.has(it._id);
            return (
              <div key={it._id} className={`bg-surface border ${sel ? 'border-gold' : 'border-line'} flex flex-col`}>
                <div className="relative aspect-square overflow-hidden bg-ink">
                  <img
                    src={img(it.image.url, 400)}
                    alt={it.title || it.category}
                    loading="lazy"
                    className={`h-full w-full object-cover ${it.isPublished ? '' : 'opacity-40'}`}
                  />
                  <button
                    onClick={() => toggleSel(it._id)}
                    aria-label={sel ? 'Unselect' : 'Select'}
                    aria-pressed={sel}
                    className={`absolute top-1 left-1 h-9 w-9 flex items-center justify-center border text-xs ${
                      sel ? 'bg-gold text-black border-gold' : 'bg-black/60 text-transparent border-neutral-500'
                    }`}
                  >
                    <FaCheck />
                  </button>
                  <div className="absolute top-1 right-1 flex flex-col gap-1 items-end">
                    {it.featured && <span className="bg-black/70 text-gold text-[10px] px-1.5 py-0.5 inline-flex items-center gap-1"><FaStar /> Featured</span>}
                    {!it.isPublished && <span className="bg-black/70 text-neutral-300 text-[10px] px-1.5 py-0.5 uppercase">Hidden</span>}
                  </div>
                </div>
                <div className="p-2.5 min-w-0">
                  <p className="text-white text-sm truncate">{it.title || <span className="text-neutral-600">No title</span>}</p>
                  <p className="text-[10px] text-gold uppercase tracking-wider truncate">{it.category}</p>
                </div>
                <div className="flex gap-1.5 p-2.5 pt-0 mt-auto">
                  <button onClick={() => togglePublish(it)} className={iconBtn} aria-label={it.isPublished ? 'Hide' : 'Show'}>
                    {it.isPublished ? <FaEye /> : <FaEyeSlash />}
                  </button>
                  <button onClick={() => setModal(it)} className={iconBtn} aria-label="Edit"><FaEdit /></button>
                  <button onClick={() => removeOne(it)} className={`${iconBtn} hover:!border-red-500 hover:!text-red-400`} aria-label="Delete"><FaTrash /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <Modal title={modal === 'upload' ? 'Upload Photos' : 'Edit Photo'} onClose={close}>
          {modal === 'upload' ? (
            <UploadForm cats={cats} onClose={close} onSaved={() => { close(); load(); }} />
          ) : (
            <EditForm key={modal._id} item={modal} cats={cats} onClose={close} onSaved={() => { close(); load(); }} />
          )}
        </Modal>
      )}
    </div>
  );
};

export default ManageGallery;