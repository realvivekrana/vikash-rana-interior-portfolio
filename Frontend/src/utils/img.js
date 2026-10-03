export const img = (url, width = 800) =>
  url ? url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`) : '';