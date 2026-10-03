const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

// Document ka view / download link (server count badha kar file par redirect karta hai)
export const fileUrl = (id, mode = 'download') => `${BASE}/documents/${id}/file?mode=${mode}`;

export const formatBytes = (b = 0) => {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${Math.round(b / 1024)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
};

export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

export const formatDay = (key) =>
  new Date(`${key}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

export const timeAgo = (d) => {
  const s = Math.max(1, Math.floor((Date.now() - new Date(d).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(d);
};

export const DOC_TYPE_LABELS = {
  resume: 'Resume',
  portfolio: 'Portfolio',
  brochure: 'Brochure',
  other: 'Document',
};