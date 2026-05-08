import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const postsDir = join(root, '_posts');
const publicAssetsDir = join(root, 'public', 'assets', 'img');
const treeUrl = 'https://api.github.com/repos/r4uzn/r4uzn.github.io/git/trees/main?recursive=1';
const rawBase = 'https://raw.githubusercontent.com/r4uzn/r4uzn.github.io/main';

async function getJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'rauzn-blog-sync'
    }
  });

  if (!response.ok) {
    throw new Error(`GitHub API failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function getText(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'rauzn-blog-sync'
    }
  });

  if (!response.ok) {
    throw new Error(`Download failed: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

async function getBytes(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'rauzn-blog-sync'
    }
  });

  if (!response.ok) {
    throw new Error(`Download failed: ${response.status} ${response.statusText}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

mkdirSync(postsDir, { recursive: true });

function rawUrl(path) {
  return `${rawBase}/${path.split('/').map(encodeURIComponent).join('/')}`;
}

const tree = await getJson(treeUrl);
const files = tree.tree.filter((entry) => entry.type === 'blob');
const posts = files.filter((entry) => entry.path.startsWith('_posts/') && entry.path.endsWith('.md'));
const images = files.filter((entry) => entry.path.startsWith('assets/img/'));

for (const post of posts) {
  const name = post.path.slice('_posts/'.length);
  const body = await getText(rawUrl(post.path));
  writeFileSync(join(postsDir, name), body);
}

rmSync(publicAssetsDir, { recursive: true, force: true });
mkdirSync(publicAssetsDir, { recursive: true });

for (const image of images) {
  const relativePath = image.path.slice('assets/img/'.length);
  const body = await getBytes(rawUrl(image.path));
  const target = join(publicAssetsDir, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, body);
}

console.log(`synced ${posts.length} posts`);
console.log(`synced ${images.length} image assets`);
