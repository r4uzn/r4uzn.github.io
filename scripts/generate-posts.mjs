import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const postsDir = join(root, '_posts');
const outFile = join(root, 'src', 'posts.generated.ts');

function titleFromFile(file) {
  return file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
}

function slugify(title) {
  const normalized = title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return normalized || 'post';
}

function splitFrontMatter(markdown) {
  if (!markdown.startsWith('---')) {
    return { body: markdown, tags: [] };
  }

  const end = markdown.indexOf('\n---', 3);
  if (end === -1) {
    return { body: markdown, tags: [] };
  }

  const frontMatter = markdown.slice(3, end);
  const body = markdown.slice(end + 4).trimStart();
  const tagLine = frontMatter.match(/tags:\s*\[([^\]]+)]/i);
  const tags = tagLine
    ? tagLine[1].split(',').map((tag) => tag.trim()).filter(Boolean)
    : [];

  return { body, tags };
}

function normalizeTag(tag) {
  const lower = tag.toLowerCase();
  const map = new Map([
    ['blog', 'Blog'],
    ['ctf', 'CTF'],
    ['dev', 'Dev'],
    ['dreamhack', 'Dreamhack'],
    ['pwn', 'Pwn'],
    ['reversing', 'Reversing'],
    ['snort', 'SNORT'],
    ['system', 'System'],
    ['wargame', 'Wargame'],
    ['web', 'Web'],
    ['write up', 'Write-up'],
    ['write-up', 'Write-up']
  ]);

  return map.get(lower) ?? tag;
}

function cleanMarkdown(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/\[[^\]]+]\([^)]+\)/g, ' ')
    .replace(/[#>*_`~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function summaryFromBody(markdown) {
  const clean = cleanMarkdown(markdown);
  return clean.length > 150 ? `${clean.slice(0, 150).trim()}...` : clean;
}

function tagsForTitle(title) {
  const lower = title.toLowerCase();
  const tags = [];

  if (lower.includes('dreamhack')) tags.push('Dreamhack');
  if (lower.includes('hacktheon')) tags.push('HackTheon');
  if (lower.includes('ctf')) tags.push('CTF');
  if (lower.includes('pwn') || lower.includes('srop') || lower.includes('library')) tags.push('Pwn');
  if (lower.includes('xss') || lower.includes('curling')) tags.push('Web');
  if (lower.includes('scanner') || title.includes('스캐너') || lower.includes('snort')) tags.push('Tooling');
  if (lower.includes('reversing') || title.includes('리버싱')) tags.push('Reversing');
  if (title.includes('메모리') || lower.includes('srop')) tags.push('System');
  if (lower.includes('chirpy')) tags.push('Blog');

  return [...new Set(tags)];
}

function categoryForTitle(title, tags) {
  const lower = title.toLowerCase();

  if (lower.includes('xss') || lower.includes('curling')) return 'Web Security';
  if (tags.includes('Pwn') || title.includes('메모리')) return 'Pwn';
  if (tags.includes('Reversing')) return 'Reversing';
  if (tags.includes('Tooling') || tags.includes('Dev') || tags.includes('SNORT')) return 'Tooling';
  if (tags.includes('CTF') || tags.includes('HackTheon')) return 'CTF';
  if (tags.includes('Blog')) return 'Blog';

  return 'Notes';
}

function uniqueSlug(base, used) {
  let slug = base;
  let index = 2;

  while (used.has(slug)) {
    slug = `${base}-${index}`;
    index += 1;
  }

  used.add(slug);
  return slug;
}

const files = existsSync(postsDir)
  ? readdirSync(postsDir).filter((file) => /^\d{4}-\d{2}-\d{2}-.+\.md$/.test(file))
  : [];

const usedSlugs = new Set();
const posts = files
  .map((file) => {
    const date = file.slice(0, 10);
    const title = titleFromFile(file);
    const raw = readFileSync(join(postsDir, file), 'utf8');
    const { body, tags: frontMatterTags } = splitFrontMatter(raw);
    const tags = [
      ...new Set([
        ...frontMatterTags.map(normalizeTag),
        ...tagsForTitle(title)
      ])
    ];
    const category = categoryForTitle(title, tags);

    return {
      slug: uniqueSlug(slugify(title), usedSlugs),
      title,
      date,
      category,
      tags: tags.length ? tags : ['Notes'],
      summary: summaryFromBody(body),
      file
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

const categories = [...new Set(posts.map((post) => post.category))];
const generated = `export type Post = {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  summary: string;
  file: string;
};

export const posts: Post[] = ${JSON.stringify(posts, null, 2)};

export const categories = ${JSON.stringify(categories, null, 2)};
`;

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, generated);
