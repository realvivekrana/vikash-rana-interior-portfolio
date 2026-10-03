import { useEffect } from 'react';
import { useSite } from '../../context/SiteContext';

const setMeta = (attr, key, content) => {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

// Har page apna title / description / share image set karta hai.
// Kuch na diya to Admin > Settings > SEO wali values use hoti hain.
const Seo = ({ title, description, image }) => {
  const { settings } = useSite();
  const siteName = settings?.siteName || 'Vikash Rana Interiors';
  const fullTitle = title ? `${title} | ${siteName}` : settings?.seo?.title || siteName;
  const desc = description || settings?.seo?.description || '';
  const clean = desc.replace(/\s+/g, ' ').trim().slice(0, 160);

  useEffect(() => {
    document.title = fullTitle;
    setMeta('name', 'description', clean);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', clean);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', siteName);
    setMeta('property', 'og:url', window.location.href);
    setMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    if (image) {
      setMeta('property', 'og:image', image);
      setMeta('name', 'twitter:image', image);
    }
  }, [fullTitle, clean, image, siteName]);

  return null;
};

export default Seo;