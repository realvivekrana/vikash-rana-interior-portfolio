import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../../api/axios';
import { inputClass, labelClass, goldBtn, outlineBtn } from '../../utils/ui';
import { SERVICE_ICONS, getServiceIcon } from '../../utils/icons';
import PageHeader from '../../components/admin/PageHeader';
import Modal from '../../components/admin/Modal';

const ICONS = Object.keys(SERVICE_ICONS);

const ServiceForm = ({ service, onClose, onSaved }) => {
  const isEdit = !!service;
  const [icon, setIcon] = useState(service?.icon || 'FaPencilRuler');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: service?.title || '',
      description: service?.description || '',
      order: service?.order ?? 0,
      isActive: service?.isActive ?? true,
    },
  });

  const onSubmit = async (values) => {
    const payload = { ...values, icon, order: Number(values.order) || 0 };
    try {
      if (isEdit) await api.put(`/services/${service._id}`, payload);
      else await api.post('/services', payload);
      toast.success(isEdit ? 'Service updated' : 'Service added');
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className={labelClass}>Title *</label>
        <input className={inputClass} {...register('title', { required: 'Title required' })} />
        {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Description *</label>
        <textarea rows={4} className={inputClass} {...register('description', { required: 'Description required' })} />
        {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Icon</label>
        <div className="flex flex-wrap gap-2">
          {ICONS.map((name) => {
            const Icon = SERVICE_ICONS[name];
            return (
              <button
                type="button"
                key={name}
                onClick={() => setIcon(name)}
                className={`h-11 w-11 flex items-center justify-center border text-lg transition-colors ${
                  icon === name ? 'border-gold text-gold bg-gold/10' : 'border-line text-neutral-400 hover:border-gold/60'
                }`}
              >
                <Icon />
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 items-end">
        <div>
          <label className={labelClass}>Display order</label>
          <input type="number" className={inputClass} {...register('order')} />
        </div>
        <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer pb-2">
          <input type="checkbox" className="accent-gold h-4 w-4" {...register('isActive')} />
          Active (show on site)
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-line">
        <button type="button" onClick={onClose} className={outlineBtn}>Cancel</button>
        <button type="submit" disabled={isSubmitting} className={goldBtn}>
          {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Add Service'}
        </button>
      </div>
    </form>
  );
};

const ManageServices = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(() => {
    return api
      .get('/services/admin/all')
      .then((res) => setItems(res.data.data))
      .catch(() => toast.error('Could not load services'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (s) => {
    if (!window.confirm(`Delete "${s.title}"?`)) return;
    try {
      await api.delete(`/services/${s._id}`);
      toast.success('Service deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete');
    }
  };

  const toggleActive = async (s) => {
    try {
      const { data } = await api.put(`/services/${s._id}`, { isActive: !s.isActive });
      setItems((list) => list.map((i) => (i._id === s._id ? data.data : i)));
      toast.success(data.data.isActive ? 'Service visible' : 'Service hidden');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update');
    }
  };

  const close = () => setModal(null);

  return (
    <div>
      <PageHeader
        title="Services"
        subtitle={`${items.length} total`}
        action={<button onClick={() => setModal('new')} className={goldBtn}><FaPlus /> Add Service</button>}
      />

      {loading ? (
        <p className="text-neutral-500">Loading...</p>
      ) : items.length === 0 ? (
        <div className="border border-dashed border-line p-12 text-center text-neutral-500">
          There are no services yet.
        </div>
      ) : (
        <div className="bg-surface border border-line divide-y divide-line">
          {items.map((s) => {
            const Icon = getServiceIcon(s.icon);
            return (
              <div key={s._id} className="p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
                <div className="h-12 w-12 shrink-0 flex items-center justify-center border border-gold/40 text-gold text-xl">
                  <Icon />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-white font-medium">
                    {s.title}
                    {!s.isActive && (
                      <span className="ml-2 text-[10px] text-neutral-400 border border-line px-1.5 py-0.5 uppercase">Hidden</span>
                    )}
                  </h3>
                  <p className="text-neutral-500 text-sm truncate">{s.description}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => toggleActive(s)}
                    className="h-11 w-11 flex items-center justify-center border border-line text-neutral-300 hover:border-gold hover:text-gold"
                    aria-label={s.isActive ? 'Hide' : 'Show'}
                    title={s.isActive ? 'Visible on site' : 'Hidden'}
                  >
                    {s.isActive ? <FaEye /> : <FaEyeSlash />}
                  </button>
                  <button
                    onClick={() => setModal(s)}
                    className="h-11 w-11 flex items-center justify-center border border-line text-neutral-300 hover:border-gold hover:text-gold"
                    aria-label="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => remove(s)}
                    className="h-11 w-11 flex items-center justify-center border border-line text-neutral-300 hover:border-red-500 hover:text-red-400"
                    aria-label="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <Modal title={modal === 'new' ? 'Add Service' : 'Edit Service'} onClose={close}>
          <ServiceForm
            key={modal === 'new' ? 'new' : modal._id}
            service={modal === 'new' ? null : modal}
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

export default ManageServices;