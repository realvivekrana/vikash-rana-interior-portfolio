// Cloudinary URL ko optimized (auto format/quality + width) version mein badalta hai
export const img = (url, width = 800) =>
  url && url.includes('/upload/') ? url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`) : url || '';