import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import api from '../../api/axios';
import { useSite } from '../../context/SiteContext';
import Seo from '../../components/common/Seo';
import SectionTitle from '../../components/common/SectionTitle';

const inputClass =
  'w-full bg-surface border border-line px-4 py-3 min-h-12 text-base text-white placeholder-neutral-600 focus:outline-none focus:border-gold transition-colors';

const Contact = () => {
  const { settings: s } = useSite();
  const [params] = useSearchParams();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  // /contact?subject=... se subject pehle se bhar jaata hai (project page ka Enquire button)
  useEffect(() => {
    const subject = params.get('subject');
    if (subject) setValue('subject', subject);
  }, [params, setValue]);

  const onSubmit = async (values) => {
    try {
      await api.post('/messages', values);
      toast.success('Message sent. We will get back to you soon!');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send your message. Please try again.');
    }
  };

  const info = [
    [FaPhoneAlt, s?.phone],
    [FaEnvelope, s?.email],
    [FaMapMarkerAlt, s?.address],
    [FaClock, s?.workingHours],
  ].filter(([, v]) => v);

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 pt-28 md:pt-36 pb-10">
      <Seo title="Contact" description="Tell us about your space and get a free consultation." />
      <SectionTitle eyebrow="Contact" title="Let's Create Together" subtitle="Tell us about your space and we will get back to you." />

      <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {info.map(([Icon, value], i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="h-11 w-11 shrink-0 flex items-center justify-center border border-gold/50 text-gold">
                <Icon />
              </div>
              <p className="text-neutral-300 text-sm pt-3 break-words whitespace-pre-line min-w-0">{value}</p>
            </div>
          ))}
          {s?.mapEmbed?.startsWith('http') && (
            <iframe
              src={s.mapEmbed}
              title="Map"
              loading="lazy"
              className="w-full h-64 border border-line grayscale invert-[.9] contrast-[.9]"
            />
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-3 space-y-5" noValidate>
          {/* Spam trap: insaan ko dikhta nahi, bots bhar dete hain */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
            {...register('website')}
          />
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <input placeholder="Your Name *" className={inputClass} {...register('name', { required: 'Name is required' })} />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <input
                type="email"
                inputMode="email"
                placeholder="Email *"
                className={inputClass}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Please enter a valid email' },
                })}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <input type="tel" inputMode="tel" placeholder="Phone" className={inputClass} {...register('phone')} />
            <input placeholder="Subject" className={inputClass} {...register('subject')} />
          </div>
          <div>
            <textarea
              rows={6}
              placeholder="Tell us about your project *"
              className={inputClass}
              {...register('message', { required: 'Message is required' })}
            />
            {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto min-h-12 bg-gold hover:bg-gold-light text-black px-10 text-xs uppercase tracking-[0.25em] transition-colors disabled:opacity-60"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;