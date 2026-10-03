import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaPlus, FaTrash } from 'react-icons/fa';
import api from '../../api/axios';
import { img } from '../../utils/img';
import { inputClass, labelClass, goldBtn, outlineBtn } from '../../utils/ui';
import PageHeader from '../../components/admin/PageHeader';
import ImageInput from '../../components/admin/ImageInput';

const ManageAbout = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
  } = useForm({ defaultValues: { name: '', title: '', bio: '', stats: [] } });
  const { fields, append, remove } = useFieldArray({ control, name: 'stats' });

  const [photo, setPhoto] = useState(null);
  const [existing, setExisting] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/about')
      .then((res) => {
        const a = res.data.data;
        reset({
          name: a.name,
          title: a.title,
          bio: a.bio,
          stats: (a.stats || []).map((s) => ({ label: s.label, value: s.value })),
        });
        setExisting(a.photo?.url || '');
      })
      .catch(() => toast.error('About load nahi hua'))
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (values) => {
    const stats = (values.stats || []).filter((s) => s.label?.trim() && s.value?.trim());
    const fd = new FormData();
    fd.append('name', values.name);
    fd.append('title', values.title);
    fd.append('bio', values.bio);
    fd.append('stats', JSON.stringify(stats));
    if (photo) fd.append('photo', photo);
    try {
      const res = await api.put('/about', fd);
      setExisting(res.data.data.photo?.url || '');
      setPhoto(null);
      toast.success('About page updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save nahi hua');
    }
  };

  if (loading) return <p className="text-neutral-500">Loading...</p>;

  return (
    <div className="max-w-3xl">
      <PageHeader title="About" subtitle="Tumhari kahani, photo aur stats" />

      <form onSubmit={handleSubmit(onSubmit)} className="bg-surface border border-line p-6 md:p-8 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Name</label>
            <input className={inputClass} {...register('name')} />
          </div>
          <div>
            <label className={labelClass}>Title</label>
            <input className={inputClass} placeholder="Interior Designer" {...register('title')} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Bio</label>
          <textarea rows={8} className={inputClass} {...register('bio')} />
        </div>

        <ImageInput
          label="Photo (portrait)"
          file={photo}
          existing={existing && img(existing, 300)}
          onChange={setPhoto}
        />

        <div>
          <label className={labelClass}>Stats (jaise: 150+ / Projects Done)</label>
          <div className="space-y-3">
            {fields.map((f, i) => (
              <div key={f.id} className="flex gap-3">
                <input className={`${inputClass} w-28`} placeholder="150+" {...register(`stats.${i}.value`)} />
                <input className={inputClass} placeholder="Projects Done" {...register(`stats.${i}.label`)} />
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="px-3 border border-line text-neutral-400 hover:border-red-500 hover:text-red-400"
                  aria-label="Remove stat"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
          {fields.length < 3 && (
            <button type="button" onClick={() => append({ value: '', label: '' })} className={`${outlineBtn} mt-3`}>
              <FaPlus /> Add stat
            </button>
          )}
          <p className="text-neutral-600 text-xs mt-2">Site par 3 stats ke liye jagah hai.</p>
        </div>

        <div className="pt-4 border-t border-line flex justify-end">
          <button type="submit" disabled={isSubmitting} className={goldBtn}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageAbout;