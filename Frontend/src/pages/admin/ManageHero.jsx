import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { img } from '../../utils/img';
import { inputClass, labelClass, goldBtn } from '../../utils/ui';
import PageHeader from '../../components/admin/PageHeader';
import ImageInput from '../../components/admin/ImageInput';

const ManageHero = () => {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const [bg, setBg] = useState(null);
  const [existing, setExisting] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/hero')
      .then((res) => {
        const h = res.data.data;
        reset({
          heading: h.heading,
          subheading: h.subheading,
          ctaText: h.ctaText,
          ctaLink: h.ctaLink,
        });
        setExisting(h.backgroundImage?.url || '');
      })
      .catch(() => toast.error('Hero load nahi hua'))
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (values) => {
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => fd.append(k, v ?? ''));
    if (bg) fd.append('backgroundImage', bg);
    try {
      const res = await api.put('/hero', fd);
      setExisting(res.data.data.backgroundImage?.url || '');
      setBg(null);
      toast.success('Hero section updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save nahi hua');
    }
  };

  if (loading) return <p className="text-neutral-500">Loading...</p>;

  return (
    <div className="max-w-3xl">
      <PageHeader title="Hero Section" subtitle="Home page ka sabse upar wala banner" />

      <form onSubmit={handleSubmit(onSubmit)} className="bg-surface border border-line p-6 md:p-8 space-y-5">
        <div>
          <label className={labelClass}>Heading</label>
          <input className={inputClass} {...register('heading')} />
        </div>
        <div>
          <label className={labelClass}>Subheading</label>
          <textarea rows={3} className={inputClass} {...register('subheading')} />
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Button text</label>
            <input className={inputClass} {...register('ctaText')} />
          </div>
          <div>
            <label className={labelClass}>Button link</label>
            <input className={inputClass} placeholder="/projects" {...register('ctaLink')} />
          </div>
        </div>
        <ImageInput
          label="Background image (landscape, high quality)"
          file={bg}
          existing={existing && img(existing, 400)}
          onChange={setBg}
          wide
        />
        <div className="pt-4 border-t border-line flex justify-end">
          <button type="submit" disabled={isSubmitting} className={goldBtn}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageHero;