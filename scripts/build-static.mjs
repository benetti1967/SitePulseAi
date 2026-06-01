import { copyFile, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');

const staticFiles = [
  'index.html',
  'app.html',
  'app.js',
  'styles.css'
];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const file of staticFiles) {
  await copyFile(resolve(root, file), resolve(dist, file));
}

console.log(`Prepared ${staticFiles.length} static files in dist/`);
