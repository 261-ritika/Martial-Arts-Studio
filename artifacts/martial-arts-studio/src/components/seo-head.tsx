import { useEffect } from 'react';
import { siteOrigin, sitePath } from '@/lib/site';

type SeoHeadProps = {
  title: string;
  description: string;
  noIndex?: boolean;
};

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

export function SeoHead({ title, description, noIndex = false }: SeoHeadProps) {
  useEffect(() => {
    const configuredOrigin = siteOrigin();
    const pageUrl = configuredOrigin
      ? new URL(window.location.pathname, configuredOrigin).toString()
      : window.location.pathname;
    const socialImageUrl = configuredOrigin
      ? new URL(sitePath('/images/martial-arts-social.jpg'), configuredOrigin).toString()
      : sitePath('/images/martial-arts-social.jpg');

    document.title = title;
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noIndex ? 'noindex, follow' : 'index, follow');
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', 'Martial Arts Studio');
    setMeta('property', 'og:locale', 'en_IN');
    setMeta('property', 'og:url', pageUrl);
    setMeta('property', 'og:image', socialImageUrl);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', socialImageUrl);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = pageUrl;
  }, [description, noIndex, title]);

  return null;
}
