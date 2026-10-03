import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { img } from '../../utils/img';
import { inputClass, labelClass, goldBtn } from '../../utils/ui';
import PageHeader from '../../components/admin/PageHeader';
import ImageInput from '../../components/admin/ImageInput';

// Agar poora <iframe ...> paste ho jaye to usme se sirf src nikal lo
const extractSrc = (v = '') => {
  const m = v.match(/src="([^"]+)"/);
  return m ? m[1] : v.trim();
};

const SOCIALS = ['instagram', 'facebook', 'linkedin', 'youtube', 'pinterest'];

const SiteSettings = () => {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const [logo, setLogo] = useState(null);
  const [existing, setExisting] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/settings')
      .then((res) => {
        const s = res.data.data;
        reset({
          siteName: s.siteName,
          tagline: s.tagline,
          workingHours: s.workingHours,
          phone: s.phone,
          whatsapp: s.whatsapp,
          email: s.email,
          address: s.address,
          mapEmbed: s.mapEmbed,
          socialLinks: s.socialLinks || {},
          seo: s.seo || {},
        });
        setExisting(s.logo?.url || '');
      })
      .catch(() => toast.error('Settings load nahi hui'))
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (v) => {
    const fd = new FormData();
    ['siteName', 'tagline', 'workingHours', 'phone', 'whatsapp', 'email', 'address'].forEach((k) => fd.append(k, v[k] ?? ''));
    fd.append('mapEmbed', extractSrc(v.mapEmbed));
    fd.append('socialLinks', JSON.stringify(v.socialLinks || {}));
    fd.append('seo', JSON.stringify(v.seo || {}));
    if (logo) fd.append('logo', logo);
    try {
      const res = await api.put('/settings', fd);
      setExisting(res.data.data.logo?.url || '');
      setLogo(null);
      toast.success('Settings saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save nahi hua');
    }
  };

  if (loading) return <p className="text-neutral-500">Loading...</p>;

  const card = 'bg-surface border border-line p-6 md:p-8 space-y-5';
  const heading = 'font-serif text-xl text-white';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className={card}>
        <h2 className={heading}>General</h2>
        <div>
          <label className={labelClass}>Site name</label>
          <input className={inputClass} {...register('siteName')} />
        </div>
        <div>
          <label className={labelClass}>Footer tagline</label>
          <textarea rows={2} className={inputClass} {...register('tagline')} />
        </div>
        <ImageInput
          label="Logo (optional, na ho to site name text dikhega)"
          file={logo}
          existing={existing && img(existing, 200)}
          onChange={setLogo}
        />
      </div>

      <div className={card}>
        <h2 className={heading}>Contact details</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Phone</label>
            <input className={inputClass} placeholder="+91 98765 43210" {...register('phone')} />
          </div>
          <div>
            <label className={labelClass}>WhatsApp (country code ke saath)</label>
            <input className={inputClass} placeholder="919876543210" {...register('whatsapp')} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input type="email" className={inputClass} {...register('email')} />
        </div>
        <div>
          <label className={labelClass}>Working hours</label>
          <textarea rows={2} className={inputClass} placeholder={'Mon - Sat: 10 AM - 7 PM'} {...register('workingHours')} />
        </div>
        <div>
          <label className={labelClass}>Address</label>
          <textarea rows={2} className={inputClass} {...register('address')} />
        </div>
        <div>
          <label className={labelClass}>Google Map embed</label>
          <textarea rows={2} className={inputClass} placeholder="Google Maps, Share, Embed a map, wahan ka code paste karo" {...register('mapEmbed')} />
          <p className="text-neutral-600 text-xs mt-1">Poora iframe code paste kar sakte ho, hum sirf link utha lenge.</p>
        </div>
      </div>

      <div className={card}>
        <h2 className={heading}>Social links</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {SOCIALS.map((k) => (
            <div key={k}>
              <label className={labelClass}>{k}</label>
              <input className={inputClass} placeholder="https://..." {...register(`socialLinks.${k}`)} />
            </div>
          ))}
        </div>
      </div>

      <div className={card}>
        <h2 className={heading}>SEO</h2>
        <div>
          <label className={labelClass}>Browser tab title</label>
          <input className={inputClass} placeholder="Vikash Rana | Interior Designer in Pune" {...register('seo.title')} />
        </div>
        <div>
          <label className={labelClass}>Meta description</label>
          <textarea rows={3} className={inputClass} {...register('seo.description')} />
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={isSubmitting} className={goldBtn}>
          {isSubmitting ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
};

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async ({ currentPassword, newPassword }) => {
    try {
      await api.put('/auth/change-password', { currentPassword, newPassword });
      toast.success('Password badal gaya');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password nahi badla');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-surface border border-line p-6 md:p-8 space-y-5">
      <h2 className="font-serif text-xl text-white">Change password</h2>
      <div>
        <label className={labelClass}>Current password</label>
        <input type="password" className={inputClass} {...register('currentPassword', { required: 'Required' })} />
        {errors.currentPassword && <p className="text-red-400 text-xs mt-1">{errors.currentPassword.message}</p>}
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>New password</label>
          <input
            type="password"
            className={inputClass}
            {...register('newPassword', { required: 'Required', minLength: { value: 8, message: 'Kam se kam 8 characters' } })}
          />
          {errors.newPassword && <p className="text-red-400 text-xs mt-1">{errors.newPassword.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Confirm new password</label>
          <input
            type="password"
            className={inputClass}
            {...register('confirm', {
              required: 'Required',
              validate: (v) => v === watch('newPassword') || 'Password match nahi kar raha',
            })}
          />
          {errors.confirm && <p className="text-red-400 text-xs mt-1">{errors.confirm.message}</p>}
        </div>
      </div>
      <div className="flex justify-end">
        <button type="submit" disabled={isSubmitting} className={goldBtn}>
          {isSubmitting ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </form>
  );
};

const Settings = () => (
  <div className="max-w-3xl">
    <PageHeader title="Settings" subtitle="Contact info, social links, SEO aur password" />
    <div className="space-y-6">
      <SiteSettings />
      <ChangePassword />
    </div>
  </div>
);

export default Settings;