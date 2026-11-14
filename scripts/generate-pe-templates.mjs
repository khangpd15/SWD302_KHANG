import { writeFile, mkdir } from 'node:fs/promises';
import { cases } from '../src/pe-data.js';
import { buildDrawio } from '../src/pe-diagrams.js';
const folder = new URL('../public/templates/', import.meta.url);
await mkdir(folder, { recursive: true });
for (const [kind, config] of Object.entries(cases)) {
  await writeFile(new URL(`${kind}_PE.drawio`, folder), buildDrawio(config, kind));
}
console.log('Generated 3 editable PE .drawio workbooks.');
