import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

const base = process.env.VITE_BASE_PATH || '/'
const site = process.env.VITE_SITE_URL?.replace(/\/$/, '')
if (!/^\/(?:[a-zA-Z0-9._-]+\/)*$/.test(base)) throw new Error('VITE_BASE_PATH must start and end with /')
if (!site || !/^https:\/\//.test(site) || new URL(site).pathname.replace(/\/?$/, '/') !== base) {
  throw new Error('Set VITE_SITE_URL to the full HTTPS site URL, including VITE_BASE_PATH')
}

let html = await readFile('dist/index.html', 'utf8')
if (!html.includes(`src="${base}assets/`)) throw new Error('Build base differs from VITE_BASE_PATH; rebuild first')
html = html.replaceAll('https://triathlon-lipiany.pl', site)
const sitemap = await readFile('public/sitemap.xml', 'utf8')
const content = JSON.parse(await readFile('src/content.json', 'utf8'))
const routes = new Set([
  ...Array.from(sitemap.matchAll(/<loc>(.*?)<\/loc>/g), match => new URL(match[1]).pathname),
  ...Object.keys(content.redirects),
  ...Object.keys(content.pages).flatMap(slug => [`/${slug}/`, `/de/${slug}/`]),
  '/szukaj/', '/de/suche/', '/aktualnosci/', '/de/aktualnosci/',
])
// Real index files let Pages serve refreshed/deep links without an SPA redirect.
for (const route of routes) {
  if (!/^\/(?:[^./][^/]*\/)*$/.test(route) || route.includes('..')) throw new Error(`Invalid route: ${route}`)
  const destination = join('dist', route.slice(1), 'index.html')
  await mkdir(dirname(destination), { recursive: true })
  let pageHtml = html
  if (route.startsWith('/de/')) pageHtml = pageHtml.replace('<html lang="pl">', '<html lang="de">')
  pageHtml = pageHtml.replace(/(<link rel="canonical" href=")[^"]+/, `$1${site}${route}`)
  pageHtml = pageHtml.replace(/(<meta property="og:url" content=")[^"]+/, `$1${site}${route}`)
  await writeFile(destination, pageHtml)
}
await writeFile('dist/404.html', html)
await writeFile('dist/.nojekyll', '')
await writeFile('dist/sitemap.xml', sitemap.replaceAll('https://triathlon-lipiany.pl', site))
const robots = await readFile('public/robots.txt', 'utf8')
await writeFile('dist/robots.txt', robots.replaceAll('https://triathlon-lipiany.pl', site))
// Pages is static; the app retains its existing email-client fallback.
for (const filename of ['kontakt/wyslij.php', '.htaccess', '_redirects']) await rm(join('dist', filename), { force: true })
console.log(`GitHub Pages: prepared ${routes.size} routes for ${site}/`)
