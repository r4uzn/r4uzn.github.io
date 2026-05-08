import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import './generate-posts.mjs';

const require = createRequire(import.meta.url);
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'dist');

rmSync(dist, { recursive: true, force: true });
mkdirSync(join(dist, 'assets'), { recursive: true });
mkdirSync(join(dist, 'posts'), { recursive: true });

cpSync(join(root, 'index.html'), join(dist, 'index.html'));
cpSync(join(root, 'src', 'styles.css'), join(dist, 'assets', 'styles.css'));

if (existsSync(join(root, 'public'))) {
  cpSync(join(root, 'public'), dist, { recursive: true });
}

const postsDir = join(root, '_posts');
if (existsSync(postsDir)) {
  for (const file of readdirSync(postsDir)) {
    if (file.endsWith('.md')) {
      cpSync(join(postsDir, file), join(dist, 'posts', file));
    }
  }
}

const tsc = require.resolve('typescript/bin/tsc');
const result = spawnSync(process.execPath, [tsc, '-p', join(root, 'tsconfig.json')], {
  cwd: root,
  stdio: 'inherit'
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
