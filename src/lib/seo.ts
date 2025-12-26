export type PageSeo = {
  title: string;
  description?: string;
  canonical?: string;
  robots?: string;
};

function upsertMeta(name: string, content: string) {
  const head = document.head;
  const selector = `meta[name="${name}"]`;
  const existing = head.querySelector(selector) as HTMLMetaElement | null;

  const meta = existing ?? document.createElement('meta');
  meta.setAttribute('name', name);
  meta.setAttribute('content', content);

  if (!existing) head.appendChild(meta);
}

function upsertLink(rel: string, href: string) {
  const head = document.head;
  const selector = `link[rel="${rel}"]`;
  const existing = head.querySelector(selector) as HTMLLinkElement | null;

  const link = existing ?? document.createElement('link');
  link.setAttribute('rel', rel);
  link.setAttribute('href', href);

  if (!existing) head.appendChild(link);
}

export function setPageSeo(seo: PageSeo) {
  if (typeof document === 'undefined') return;

  document.title = seo.title;

  if (seo.description) upsertMeta('description', seo.description);
  if (seo.robots) upsertMeta('robots', seo.robots);
  if (seo.canonical) upsertLink('canonical', seo.canonical);
}
