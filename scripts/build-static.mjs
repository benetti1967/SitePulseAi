import { cp, copyFile, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');

const staticFiles = [
  'index.html',
  'manifest.json',
  'service-worker.js'
];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const file of staticFiles) {
  await copyFile(resolve(root, file), resolve(dist, file));
}

await cp(resolve(root, 'assets'), resolve(dist, 'assets'), { recursive: true });

console.log('Prepared static app in dist/');
