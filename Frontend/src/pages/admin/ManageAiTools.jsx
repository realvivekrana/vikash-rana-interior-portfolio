import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../../api/axios';
import { inputClass, labelClass, goldBtn, outlineBtn } from '../../utils/ui';
import PageHeader from '../../components/admin/PageHeader';
import Modal from '../../components/admin/Modal';

const CATEGORIES = ['Design', 'Visualization', 'Writing', 'Productivity'];

const AiToolForm = ({ tool, onClose, onSaved }) => {
  const isEdit = !!tool;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: tool?.name || '',
      description: tool?.description || '',
      category: tool?.category || 'Design',
      url: tool?.url || '',
      order: tool?.order ?? 0,
      isActive: tool?.isActive ?? true,
    },
  });
  const onSubmit = async (v) => {
    const payload = { ...v, order: Number(v.order) || 0 };
    try {
      if (isEdit) await api.put(`/ai-tools/${tool._id}`, payload);
      else await api.post('/ai-tools', payload);
      toast.success(isEdit ? 'AI tool updated' : 'AI tool added');
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save nahi hua');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className={labelClass}>Tool name *</label>
        <input className={inputClass} maxLength={60} placeholder="Midjourney" {...register('name', { required: 'Name required' })} />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Category</label>
        <input className={inputClass} list="aitool-cats" placeholder="Design" {...register('category')} />
        <datalist id="aitool-cats">
          {CATEGORIES.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        <p className="text-neutral-600 text-xs mt-1">Same category ke tools site par ek group mein dikhte hain. Naya naam bhi likh sakte ho.</p>
      </div>

      <div>
        <label className={labelClass}>What do you use it for?</label>
        <textarea rows={3} maxLength={300} className={inputClass} placeholder="Concept renders and mood boards for client presentations" {...register('description')} />
      </div>

      <div>
        <label className={labelClass}>Website link (optional)</label>
        <input
          className={inputClass}
          placeholder="https://..."
          {...register('url', { pattern: { value: /^(https?:\/\/.+)?$/i, message: 'Link must start with http:// or https://' } })}
        />
        {errors.url && <p className="text-red-400 text-xs mt-1">{errors.url.message}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-5 items-end">
        <div>
          <label className={labelClass}>Display order</label>
          <input type="number" className={inputClass} {...register('order')} />
        </div>
        <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer pb-2 min-h-11">
          <input type="checkbox" className="accent-gold h-4 w-4" {...register('isActive')} />
          Active (site par dikhao)
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-line">
        <button type="button" onClick={onClose} className={outlineBtn}>Cancel</button>
        <button type="submit" disabled={isSubmitting} className={goldBtn}>
          {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Add AI Tool'}
        </button>
      </div>
    </form>
  );
};

const ManageAiTools = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(
    () =>
      api
        .get('/ai-tools/admin/all')
        .then((res) => setItems(res.data.data))
        .catch(() => toast.error('AI tools load nahi hue'))
        .finally(() => setLoading(false)),
    []
  );

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (s) => {
    if (!window.confirm(`"${s.name}" delete karna hai?`)) return;
    try {
      await api.delete(`/ai-tools/${s._id}`);
      toast.success('AI tool deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete nahi hua');
    }
  };

  const toggleActive = async (s) => {
    try {
      const { data } = await api.put(`/ai-tools/${s._id}`, { isActive: !s.isActive });
      setItems((list) => list.map((i) => (i._id === s._id ? data.data : i)));
      toast.success(data.data.isActive ? 'Tool visible' : 'Tool hidden');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update nahi hua');
    }
  };

  const close = () => setModal(null);

  return (
    <div>
      <PageHeader
        title="AI Tools"
        subtitle={`${items.length} total`}
        action={<button onClick={() => setModal('new')} className={goldBtn}><FaPlus /> Add AI Tool</button>}
      />

      {loading ? (
        <p className="text-neutral-500">Loading...</p>
      ) : items.length === 0 ? (
        <div className="border border-dashed border-line p-12 text-center text-neutral-500">Abhi koi AI tool nahi hai.</div>
      ) : (
        <div className="bg-surface border border-line divide-y divide-line">
          {items.map((s) => (
            <div key={s._id} className="p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-white font-medium break-words">{s.name}</h3>
                  <span className="text-[10px] text-gold border border-gold/50 px-1.5 py-0.5 uppercase">{s.category}</span>
                  {!s.isActive && (
                    <span className="text-[10px] text-neutral-400 border border-line px-1.5 py-0.5 uppercase">Hidden</span>
                  )}
                </div>
                {s.description && <p className="text-neutral-500 text-sm mt-1 line-clamp-2">{s.description}</p>}
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => toggleActive(s)}
                  className="h-11 w-11 flex items-center justify-center border border-line text-neutral-300 hover:border-gold hover:text-gold"
                  aria-label={s.isActive ? 'Hide' : 'Show'}
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
          ))}
        </div>
      )}

      {modal && (
        <Modal title={modal === 'new' ? 'Add AI Tool' : 'Edit AI Tool'} onClose={close}>
          <AiToolForm
            key={modal === 'new' ? 'new' : modal._id}
            tool={modal === 'new' ? null : modal}
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

export default ManageAiTools;