import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../../api/axios';
import { inputClass, labelClass, goldBtn, outlineBtn } from '../../utils/ui';
import PageHeader from '../../components/admin/PageHeader';
import Modal from '../../components/admin/Modal';

const CATEGORIES = ['Design', 'Software', 'Execution'];

const SkillForm = ({ skill, onClose, onSaved }) => {
  const isEdit = !!skill;
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: skill?.name || '',
      category: skill?.category || 'Design',
      level: skill?.level ?? 80,
      order: skill?.order ?? 0,
      isActive: skill?.isActive ?? true,
    },
  });
  const level = watch('level');

  const onSubmit = async (v) => {
    const payload = { ...v, level: Number(v.level), order: Number(v.order) || 0 };
    try {
      if (isEdit) await api.put(`/skills/${skill._id}`, payload);
      else await api.post('/skills', payload);
      toast.success(isEdit ? 'Skill updated' : 'Skill added');
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save nahi hua');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className={labelClass}>Skill name *</label>
        <input className={inputClass} placeholder="AutoCAD" {...register('name', { required: 'Name required' })} />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Category</label>
        <input className={inputClass} list="skill-cats" placeholder="Design" {...register('category')} />
        <datalist id="skill-cats">
          {CATEGORIES.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        <p className="text-neutral-600 text-xs mt-1">Same category ke skills site par ek card me dikhte hain. Naya naam bhi likh sakte ho.</p>
      </div>

      <div>
        <label className={labelClass}>Level: <span className="text-gold">{level}%</span></label>
        <input type="range" min="0" max="100" step="5" className="w-full accent-gold h-11" {...register('level')} />
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
          {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Add Skill'}
        </button>
      </div>
    </form>
  );
};

const ManageSkills = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(
    () =>
      api
        .get('/skills/admin/all')
        .then((res) => setItems(res.data.data))
        .catch(() => toast.error('Skills load nahi hui'))
        .finally(() => setLoading(false)),
    []
  );

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (s) => {
    if (!window.confirm(`"${s.name}" delete karna hai?`)) return;
    try {
      await api.delete(`/skills/${s._id}`);
      toast.success('Skill deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete nahi hua');
    }
  };

  const toggleActive = async (s) => {
    try {
      const { data } = await api.put(`/skills/${s._id}`, { isActive: !s.isActive });
      setItems((list) => list.map((i) => (i._id === s._id ? data.data : i)));
      toast.success(data.data.isActive ? 'Skill visible' : 'Skill hidden');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update nahi hua');
    }
  };

  const close = () => setModal(null);

  return (
    <div>
      <PageHeader
        title="Skills"
        subtitle={`${items.length} total`}
        action={<button onClick={() => setModal('new')} className={goldBtn}><FaPlus /> Add Skill</button>}
      />

      {loading ? (
        <p className="text-neutral-500">Loading...</p>
      ) : items.length === 0 ? (
        <div className="border border-dashed border-line p-12 text-center text-neutral-500">Abhi koi skill nahi hai.</div>
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
                <div className="flex items-center gap-3 mt-2">
                  <div className="h-1.5 flex-1 max-w-xs bg-line">
                    <div className="h-full bg-gold" style={{ width: `${s.level}%` }} />
                  </div>
                  <span className="text-xs text-neutral-500 tabular-nums">{s.level}%</span>
                </div>
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
        <Modal title={modal === 'new' ? 'Add Skill' : 'Edit Skill'} onClose={close}>
          <SkillForm
            key={modal === 'new' ? 'new' : modal._id}
            skill={modal === 'new' ? null : modal}
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

export default ManageSkills;