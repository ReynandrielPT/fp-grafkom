const BASE = import.meta.env.BASE_URL ?? '/';

/**
 * Prefixes a public asset path with the Vite base path so assets resolve on GitHub Pages.
 */
export function resolveAssetPath(path = '') {
  const normalizedBase = BASE.endsWith('/') ? BASE : `${BASE}/`;
  const normalizedPath = String(path ?? '').replace(/^\/+/, '');
  return `${normalizedBase}${normalizedPath}`;
}
