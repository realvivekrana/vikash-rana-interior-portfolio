import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaStar, FaUser } from 'react-icons/fa';
import api from '../../api/axios';
import { img } from '../../utils/img';
import { inputClass, labelClass, goldBtn, outlineBtn } from '../../utils/ui';
import PageHeader from '../../components/admin/PageHeader';
import Modal from '../../components/admin/Modal';
import ImageInput from '../../components/admin/ImageInput';

const TestimonialForm = ({ item, onClose, onSaved }) => {
  const isEdit = !!item;
  const [photo, setPhoto] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: item?.name || '',
      designation: item?.designation || '',
      message: item?.message || '',
      rating: item?.rating || 5,
      isActive: item?.isActive ?? true,
    },
  });

  const onSubmit = async (values) => {
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => fd.append(k, String(v)));
    if (photo) fd.append('image', photo);
    try {
      if (isEdit) await api.put(`/testimonials/${item._id}`, fd);
      else await api.post('/testimonials', fd);
      toast.success(isEdit ? 'Testimonial updated' : 'Testimonial added');
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save nahi hua');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Client name *</label>
          <input className={inputClass} {...register('name', { required: 'Name required' })} />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Designation / Location</label>
          <input className={inputClass} placeholder="Homeowner, Pune" {...register('designation')} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Review *</label>
        <textarea rows={5} className={inputClass} {...register('message', { required: 'Review required' })} />
        {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-5 items-end">
        <div>
          <label className={labelClass}>Rating</label>
          <select className={inputClass} {...register('rating')}>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer pb-2">
          <input type="checkbox" className="accent-gold h-4 w-4" {...register('isActive')} />
          Active (site par dikhao)
        </label>
      </div>

      <ImageInput
        label="Client photo (optional)"
        file={photo}
        existing={item?.image?.url && img(item.image.url, 200)}
        onChange={setPhoto}
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-line">
        <button type="button" onClick={onClose} className={outlineBtn}>Cancel</button>
        <button type="submit" disabled={isSubmitting} className={goldBtn}>
          {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Add Testimonial'}
        </button>
      </div>
    </form>
  );
};

const ManageTestimonials = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(() => {
    return api
      .get('/testimonials/admin/all')
      .then((res) => setItems(res.data.data))
      .catch(() => toast.error('Testimonials load nahi hue'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (t) => {
    if (!window.confirm(`${t.name} ka review delete karna hai?`)) return;
    try {
      await api.delete(`/testimonials/${t._id}`);
      toast.success('Testimonial deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete nahi hua');
    }
  };

  const close = () => setModal(null);

  return (
    <div>
      <PageHeader
        title="Testimonials"
        subtitle={`${items.length} total`}
        action={<button onClick={() => setModal('new')} className={goldBtn}><FaPlus /> Add Testimonial</button>}
      />

      {loading ? (
        <p className="text-neutral-500">Loading...</p>
      ) : items.length === 0 ? (
        <div className="border border-dashed border-line p-12 text-center text-neutral-500">
          Abhi koi testimonial nahi hai.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {items.map((t) => (
            <div key={t._id} className="bg-surface border border-line p-5">
              <div className="flex items-center gap-3 mb-3">
                {t.image?.url ? (
                  <img src={img(t.image.url, 120)} alt={t.name} className="h-11 w-11 rounded-full object-cover" />
                ) : (
                  <div className="h-11 w-11 rounded-full bg-ink border border-line flex items-center justify-center text-neutral-600">
                    <FaUser />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-medium truncate">
                    {t.name}
                    {!t.isActive && (
                      <span className="ml-2 text-[10px] text-neutral-400 border border-line px-1.5 py-0.5 uppercase">Hidden</span>
                    )}
                  </p>
                  <p className="text-neutral-500 text-xs truncate">{t.designation}</p>
                </div>
                <div className="flex gap-1 text-gold text-xs">
                  {Array.from({ length: t.rating }).map((_, i) => <FaStar key={i} />)}
                </div>
              </div>
              <p className="text-neutral-400 text-sm line-clamp-3">{t.message}</p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setModal(t)}
                  className="h-9 px-4 flex items-center gap-2 border border-line text-xs text-neutral-300 hover:border-gold hover:text-gold"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => remove(t)}
                  className="h-9 px-4 flex items-center gap-2 border border-line text-xs text-neutral-300 hover:border-red-500 hover:text-red-400"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal title={modal === 'new' ? 'Add Testimonial' : 'Edit Testimonial'} onClose={close}>
          <TestimonialForm
            key={modal === 'new' ? 'new' : modal._id}
            item={modal === 'new' ? null : modal}
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

export default ManageTestimonials;