import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const templatePath = resolve(root, 'src/index.html');
const contentPath = resolve(root, 'content/site.json');
const publicPath = resolve(root, 'public');
const outputPath = resolve(root, 'dist');

const [template, rawContent, teamTemplate, rawTeam] = await Promise.all([
  readFile(templatePath, 'utf8'),
  readFile(contentPath, 'utf8'),
  readFile(resolve(root, 'src/team.html'), 'utf8'),
  readFile(resolve(root, 'content/team.json'), 'utf8'),
]);

const content = JSON.parse(rawContent);
const escapeHtml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const embeddedContent = JSON.stringify(content).replaceAll('<', '\\u003c');
const sections = template.split('<!-- PAGE_MAIN -->');
if (sections.length !== 3) throw new Error('The site template must enclose its main content between two PAGE_MAIN markers.');
const [header, homeMain, footer] = sections;

function renderPage(main, { title, description, teamPage = false }) {
  return (header + main + footer)
    .replaceAll('{{SEO_TITLE}}', () => escapeHtml(title))
    .replaceAll('{{SEO_DESCRIPTION}}', () => escapeHtml(description))
    .replaceAll('{{TEAM_CURRENT}}', teamPage ? ' aria-current="page"' : '')
    .replace('<!-- PAGE_STYLES -->', teamPage ? '<link rel="stylesheet" href="/team.css">' : '')
    .replace('<!-- CMS_DATA -->', () => `<script id="cms-data" type="application/json">${embeddedContent}</script>`);
}

function renderMember(member, index) {
  const owner = index === 0;
  const portrait = member.image
    ? `<div class="team-portrait"><img src="${escapeHtml(member.image)}" alt="${escapeHtml(member.image_alt || member.name)}" decoding="async"></div>`
    : '<div class="team-portrait team-portrait--illustrated" aria-hidden="true"><img src="/favicon.svg" alt=""></div>';
  return `<li class="team-member"${owner ? ' data-team-owner' : ''}>
        ${portrait}
        <h2>${escapeHtml(member.name)}</h2>
        <p class="team-role">${escapeHtml(member.role)}</p>
      </li>`;
}

const members = [content.owner, ...JSON.parse(rawTeam)];
const teamMain = teamTemplate.replace('{{TEAM_MEMBERS}}', () => members.map(renderMember).join('\n      '));
const teamTitle = `Meet the Team | ${content.site.business_name}`;
const teamDescription = `Meet the people in the kitchen and behind the counter at ${content.site.business_name} in Upper Montclair, NJ.`;

await rm(outputPath, { recursive: true, force: true });
await mkdir(resolve(outputPath, 'team'), { recursive: true });
await cp(publicPath, outputPath, { recursive: true });
await cp(resolve(root, 'src/cms.js'), resolve(outputPath, 'cms.js'));
await writeFile(resolve(outputPath, 'index.html'), renderPage(homeMain, {
  title: content.site.seo_title,
  description: content.site.seo_description,
}), 'utf8');
await writeFile(resolve(outputPath, 'team/index.html'), renderPage(teamMain, {
  title: teamTitle,
  description: teamDescription,
  teamPage: true,
}), 'utf8');

console.log('Built Little Daisy Bake Shop into dist/.');
