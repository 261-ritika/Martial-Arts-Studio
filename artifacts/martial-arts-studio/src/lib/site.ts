const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

export function sitePath(path = '/') {
  if (!path || path === '/') return `${basePath}/` || '/';
  return `${basePath}${path.startsWith('/') ? path : `/${path}`}`;
}

export function siteOrigin() {
  const configuredUrl = import.meta.env.VITE_SITE_URL?.trim();
  if (configuredUrl) {
    try {
      return new URL(configuredUrl).origin;
    } catch {
      // Avoid using a development host as the canonical production origin.
    }
  }

  return '';
}
