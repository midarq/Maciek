// Vite uses "/" locally and the repository path on GitHub Pages.
export const basePath = import.meta.env.BASE_URL

export function localUrl(url: string) {
  if (!url.startsWith('/') || url.startsWith('//') || (basePath !== '/' && url.startsWith(basePath))) return url
  return basePath + url.slice(1)
}

export function appPath(pathname: string) {
  return basePath !== '/' && pathname.startsWith(basePath) ? '/' + pathname.slice(basePath.length) : pathname
}

const siteUrl = (import.meta.env.VITE_SITE_URL || 'https://triathlon-lipiany.pl').replace(/\/$/, '')
export function absoluteUrl(pathname: string) { return siteUrl + '/' + pathname.replace(/^\//, '') }

export function localHtml(html: string) {
  return html
    .replace(/\b(href|src|poster)=(['"])(\/(?!\/)[^'"]*)\2/g, (_match, attr, quote, url) => `${attr}=${quote}${localUrl(url)}${quote}`)
    .replace(/\bsrcset=(['"])(.*?)\1/g, (_match, quote, value: string) => `srcset=${quote}${value.replace(/(^|,\s*)(\/(?!\/)[^\s,]+)/g, (_candidate, separator, url) => separator + localUrl(url))}${quote}`)
}
