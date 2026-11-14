import { writeFile, mkdir } from 'node:fs/promises';
import { cases } from '../src/pe-data.js';
import { buildDrawio } from '../src/pe-diagrams.js';
const folder = new URL('../public/templates/', import.meta.url);
await mkdir(folder, { recursive: true });
for (const [kind, config] of Object.entries(cases)) {
  await writeFile(new URL(`${kind}_PE.drawio`, folder), buildDrawio(config, kind));
  if (kind === 'stayease') for (const only of ['class', 'sequence', 'third']) {
    await writeFile(new URL(`${kind}_${only}.drawio`, folder), buildDrawio(config, kind, only));
  }
}
console.log(`Generated ${Object.keys(cases).length} editable PE workbooks and 3 StayEase question files (.drawio).`);
