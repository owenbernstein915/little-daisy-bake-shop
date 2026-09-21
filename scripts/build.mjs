import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const templatePath = resolve(root, 'src/index.html');
const contentPath = resolve(root, 'content/site.json');
const publicPath = resolve(root, 'public');
const outputPath = resolve(root, 'dist');

const [template, rawContent] = await Promise.all([
  readFile(templatePath, 'utf8'),
  readFile(contentPath, 'utf8'),
]);

const content = JSON.parse(rawContent);
const escapeHtml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const embeddedContent = JSON.stringify(content).replaceAll('<', '\\u003c');
let html = template
  .replaceAll('{{SEO_TITLE}}', escapeHtml(content.site.seo_title))
  .replaceAll('{{SEO_DESCRIPTION}}', escapeHtml(content.site.seo_description))
  .replace(
    '<!-- CMS_DATA -->',
    `<script id="cms-data" type="application/json">${embeddedContent}</script>`,
  );

await rm(outputPath, { recursive: true, force: true });
await mkdir(outputPath, { recursive: true });
await cp(publicPath, outputPath, { recursive: true });
await cp(resolve(root, 'src/cms.js'), resolve(outputPath, 'cms.js'));
await writeFile(resolve(outputPath, 'index.html'), html, 'utf8');

console.log('Built Little Daisy Bake Shop into dist/.');
