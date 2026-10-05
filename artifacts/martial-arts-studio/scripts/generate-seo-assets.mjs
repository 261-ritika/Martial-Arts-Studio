import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const artifactRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(artifactRoot, 'public');
const distDir = path.join(artifactRoot, 'dist', 'public');
const configuredSiteUrl = process.env.VITE_SITE_URL?.trim();
const basePath = (process.env.BASE_PATH ?? '/').replace(/\/$/, '');
const routes = [
  {
    path: '/',
    title: 'Martial Arts Training in Bhopal | Martial Arts Studio',
    description:
      'Train boxing, Jiu-Jitsu, kickboxing, MMA and fitness at Martial Arts Studio in Neelbad, Bhopal. Build skill, strength and discipline with focused coaching.',
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy | Martial Arts Studio',
    description:
      'Learn what data the Martial Arts Studio website in Neelbad, Bhopal handles, how analytics consent works, and how to contact us about your privacy choices.',
  },
  {
    path: '/terms-and-conditions',
    title: 'Terms & Conditions | Martial Arts Studio',
    description:
      'Review the terms for using the Martial Arts Studio website in Neelbad, Bhopal, including acceptable use, external links, website availability, and applicable laws.',
  },
];

let siteOrigin;
if (configuredSiteUrl) {
  const parsedUrl = new URL(configuredSiteUrl);
  if (parsedUrl.protocol !== 'https:') {
    throw new Error('VITE_SITE_URL must use HTTPS.');
  }
  if (parsedUrl.pathname !== '/' || parsedUrl.search || parsedUrl.hash) {
    throw new Error('VITE_SITE_URL must be the published site origin, without a path or query.');
  }
  siteOrigin = parsedUrl.origin;
}

function publicPath(route) {
  return `${basePath}${route === '/' ? '/' : route}` || '/';
}

function absoluteUrl(route) {
  const pathname = publicPath(route);
  return siteOrigin ? `${siteOrigin}${pathname}` : pathname;
}

const robots = [
  'User-agent: *',
  'Allow: /',
  ...(siteOrigin
    ? [`Sitemap: ${absoluteUrl('/sitemap.xml')}`]
    : ['# Set VITE_SITE_URL to the published HTTPS origin to enable the sitemap directive.']),
  '',
].join('\n');

await mkdir(publicDir, { recursive: true });
await mkdir(distDir, { recursive: true });
await writeFile(path.join(publicDir, 'robots.txt'), robots);
await writeFile(path.join(distDir, 'robots.txt'), robots);

if (siteOrigin) {
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...routes.map((route) => `  <url><loc>${absoluteUrl(route.path)}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n');
  await writeFile(path.join(publicDir, 'sitemap.xml'), sitemap);
  await writeFile(path.join(distDir, 'sitemap.xml'), sitemap);
} else {
  await rm(path.join(publicDir, 'sitemap.xml'), { force: true });
  await rm(path.join(distDir, 'sitemap.xml'), { force: true });
  console.warn('SEO sitemap skipped: set VITE_SITE_URL to the published HTTPS origin.');
}

const builtIndexPath = path.join(distDir, 'index.html');
const templateHtml = await readFile(builtIndexPath, 'utf8');

function escapeAttribute(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
}

function setMeta(html, attribute, key, content) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const tagPattern = new RegExp(`<meta\\s+${attribute}="${escapedKey}"[^>]*>`, 'i');
  const tag = `<meta ${attribute}="${escapeAttribute(key)}" content="${escapeAttribute(content)}" />`;
  if (!tagPattern.test(html)) throw new Error(`Missing ${attribute} metadata tag: ${key}`);
  return html.replace(tagPattern, tag);
}

function renderMetadata(html, route) {
  const canonicalUrl = absoluteUrl(route.path);
  const socialImageUrl = absoluteUrl('/images/martial-arts-social.jpg');
  let result = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeAttribute(route.title)}</title>`);
  result = setMeta(result, 'name', 'description', route.description);
  result = setMeta(result, 'property', 'og:title', route.title);
  result = setMeta(result, 'property', 'og:description', route.description);
  result = setMeta(result, 'property', 'og:url', canonicalUrl);
  result = setMeta(result, 'property', 'og:image', socialImageUrl);
  result = setMeta(result, 'name', 'twitter:title', route.title);
  result = setMeta(result, 'name', 'twitter:description', route.description);
  result = setMeta(result, 'name', 'twitter:image', socialImageUrl);
  const canonicalTag = `<link rel="canonical" href="${escapeAttribute(canonicalUrl)}" />`;
  if (/<link\s+rel="canonical"[^>]*>/i.test(result)) {
    return result.replace(/<link\s+rel="canonical"[^>]*>/i, canonicalTag);
  }
  return result.replace('</head>', `    ${canonicalTag}\n  </head>`);
}

await writeFile(builtIndexPath, renderMetadata(templateHtml, routes[0]));
for (const route of routes.slice(1)) {
  const routeDirectory = path.join(distDir, route.path.slice(1));
  await mkdir(routeDirectory, { recursive: true });
  await writeFile(
    path.join(routeDirectory, 'index.html'),
    renderMetadata(templateHtml, route),
  );
}

console.log(
  siteOrigin
    ? `Generated route metadata and a sitemap for ${siteOrigin}.`
    : 'Generated route-specific HTML metadata; configure VITE_SITE_URL to add absolute canonical and sitemap URLs.',
);
