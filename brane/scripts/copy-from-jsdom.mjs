import { fileURLToPath } from 'node:url';
import * as path from 'node:path';
import * as fs from 'node:fs';

import sourceMap from './jsdom-source-map.mjs';

const dirName = path.dirname(fileURLToPath(import.meta.url));
const baseDir = path.resolve(dirName, '..');

for (const [src, dest] of sourceMap) {
  const srcResolved = path.resolve(baseDir, '../../jsdom', src);
  const destResolved = path.resolve(baseDir, dest);
  fs.copyFileSync(srcResolved, destResolved);
}
