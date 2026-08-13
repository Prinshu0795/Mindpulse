import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { blogArticles } from '../src/data/blogData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://mindpulseco.in';

const staticRoutes = [
  '/',
  '/about',
  '/assessments',
  '/resources',
  '/blog',
  '/experts',
  '/contact',
  '/faq'
];

function generateSitemap() {
  const urls = [];

  // Add static routes
  staticRoutes.forEach(route => {
    urls.push(`
  <url>
    <loc>${SITE_URL}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`);
  });

  // Add dynamic blog routes
  blogArticles.forEach(article => {
    urls.push(`
  <url>
    <loc>${SITE_URL}/blog/${article.slug}</loc>
    <lastmod>${new Date(article.date).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`;

  const publicDir = path.resolve(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log('✅ Generated sitemap.xml');
}

function generateRobotsTxt() {
  const robotsTxt = `User-agent: *
Allow: /

Disallow: /dashboard
Disallow: /profile
Disallow: /my-assessments
Disallow: /appointments
Disallow: /insights
Disallow: /check-in

Sitemap: ${SITE_URL}/sitemap.xml
`;

  const publicDir = path.resolve(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
  console.log('✅ Generated robots.txt');
}

generateSitemap();
generateRobotsTxt();
