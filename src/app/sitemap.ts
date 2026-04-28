import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://hie.eng.uci.edu';

  // Define all your main routes here
  const routes = [
    '',
    '/research',
    '/publications',
    '/team',
    '/chip-gallery',
    '/news',
    '/teaching',
    '/contact',
    '/available-positions',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}
