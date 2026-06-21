export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return import.meta.env.VITE_SITE_URL || window.location.origin;
  }
  return import.meta.env.VITE_SITE_URL || 'http://localhost:5173';
};

export const buildUrl = (path: string) => {
  const base = getBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};
