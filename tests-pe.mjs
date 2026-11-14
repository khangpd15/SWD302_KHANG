import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { cases, matchKeywords } from './src/pe-data.js';
import { buildDrawio } from './src/pe-diagrams.js';
import { lessons } from './src/pe-lessons.js';

const exams = JSON.parse(await readFile(new URL('./src/data/pe-exams.json', import.meta.url), 'utf8'));
for (const kind of Object.keys(cases)) {
  assert.equal(lessons[kind].length, 3);
  for (const [index, steps] of lessons[kind].entries()) {
    assert.ok(steps.length >= 3, `${kind} Q${index + 1} has a detailed walkthrough`);
    for (const step of steps) {
      assert.ok(exams[kind].questions[index].text.includes(step.quote), `${kind} Q${index + 1}: quote matches supplied exam: ${step.title}`);
      assert.ok(step.terms.some(term => step.quote.toLowerCase().includes(term.toLowerCase())));
      assert.ok(step.actions.length >= 3 && step.example && step.transfer && step.pitfall);
    }
  }
}

assert.ok(matchKeywords('KE THUA va thanh toan, vong doi').some(r => r.title.includes('Kế thừa')));
assert.ok(matchKeywords('at most one Fine').some(r => r.example.includes('0..1')));
assert.equal(matchKeywords('').length, 0);
for (const [kind, config] of Object.entries(cases)) {
  const xml = buildDrawio(config, kind);
  assert.equal((xml.match(/<diagram /g) || []).length, 4);
  assert.ok(xml.includes('Repository&amp;lt;T&amp;gt;'));
  assert.ok(xml.includes(kind === 'library' ? 'countActiveLoans' : 'payment failure'));
  assert.ok(xml.includes(kind === 'medicare' ? 'payFail / releaseSlot' : 'Level 2'));
  assert.equal(await readFile(new URL(`./public/templates/${kind}_PE.drawio`, import.meta.url), 'utf8'), xml, 'Static download matches current generator');
  for (const only of ['architecture', 'class', 'sequence', 'third']) {
    assert.equal((buildDrawio(config, kind, only).match(/<diagram /g) || []).length, 1);
  }
  const changed = buildDrawio({ ...config, actor: 'Buyer', record: 'Order', resource: 'Product', system: 'Shop', payment: 'Receipt', staff: 'Seller' }, kind);
  for (const token of ['Buyer', 'OrderService', 'ProductRepository', 'ReceiptRepository', 'Shop']) assert.ok(changed.includes(token));
}
const escaped = buildDrawio({ ...cases.autogo, system: '<img src=x onerror="test"> & <diagram id="injected">' }, 'autogo');
assert.ok(!escaped.includes('<img'));
assert.equal((escaped.match(/<diagram /g) || []).length, 4, 'User labels cannot inject XML nodes');
console.log('PASS: PE keyword matching, 3 domain exports, individual pages, rename propagation, XML escaping, static template freshness.');
