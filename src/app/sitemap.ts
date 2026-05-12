import type { MetadataRoute } from 'next';

function siteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  try {
    return new URL(raw);
  } catch {
    return new URL('http://localhost:3000');
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl().origin;
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/cctv`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ];
}
