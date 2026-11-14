import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { cases, matchKeywords } from './src/pe-data.js';
import { buildDrawio } from './src/pe-diagrams.js';
import { lessons } from './src/pe-lessons.js';
import { stayeaseExam } from './src/stayease-data.js';

const exams = JSON.parse(await readFile(new URL('./src/data/pe-exams.json', import.meta.url), 'utf8'));
exams.stayease = stayeaseExam;
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
  const sequence = buildDrawio(config, kind, 'sequence');
  const cells = [...sequence.matchAll(/<mxCell\b[\s\S]*?<\/mxCell>/g)].map(match => match[0]);
  const call = cells.find(cell => cell.includes('isAvailable(') && cell.includes('edge="1"'));
  assert.ok(call?.includes('endArrow=block;endFill=1;'), `${kind}: synchronous calls use filled heads`);
  const create = cells.find(cell => cell.includes('«create»') && cell.includes('edge="1"'));
  assert.ok(create?.includes('dashed=1;') && !create.includes('endArrow=block'), `${kind}: create message differs from synchronous call`);
  const head = cells.find(cell => cell.includes(`value=":${config.record}"`));
  const headY = Number(head?.match(/<mxGeometry[^>]* y="([\d.]+)"/)?.[1]);
  const createY = Number(create?.match(/<mxPoint[^>]* y="([\d.]+)"/)?.[1]);
  assert.ok(headY > 110 && Math.abs(createY-headY) < 75, `${kind}: created entity starts at create message`);
  assert.equal((xml.match(/<diagram /g) || []).length, 4);
  assert.ok(xml.includes('Repository&amp;lt;T&amp;gt;'));
  assert.ok(kind === 'library' ? xml.includes('countActiveLoans') : /payment failure/i.test(xml));
  assert.ok(xml.includes(kind === 'medicare' ? 'payFail / releaseSlot' : 'Level 2'));
  assert.equal(await readFile(new URL(`./public/templates/${kind}_PE.drawio`, import.meta.url), 'utf8'), xml, 'Static download matches current generator');
  for (const only of ['architecture', 'class', 'sequence', 'third']) {
    assert.equal((buildDrawio(config, kind, only).match(/<diagram /g) || []).length, 1);
  }
  const changed = buildDrawio({ ...config, actor: 'Buyer', record: 'Order', resource: 'Product', system: 'Shop', payment: 'Receipt', staff: 'Seller' }, kind);
  for (const token of ['Buyer', kind === 'stayease' ? 'BookingService' : 'OrderService', 'ProductRepository', 'ReceiptRepository', 'Shop']) assert.ok(changed.includes(token));
}
const escaped = buildDrawio({ ...cases.autogo, system: '<img src=x onerror="test"> & <diagram id="injected">' }, 'autogo');
assert.ok(!escaped.includes('<img'));
assert.equal((escaped.match(/<diagram /g) || []).length, 4, 'User labels cannot inject XML nodes');
const staySequence = buildDrawio(cases.stayease, 'stayease', 'sequence');
assert.ok(staySequence.indexOf('processDeposit') < staySequence.indexOf('«create»'), 'StayEase only creates Reservation after payment');
assert.ok(staySequence.indexOf('payment Success') < staySequence.indexOf('«create»'));
assert.ok(staySequence.indexOf('«create»') < staySequence.indexOf('updateStatus(roomId, Booked)'));
const failure = staySequence.slice(staySequence.indexOf('[payment Failure]'), staySequence.indexOf('[Occupied /'));
assert.ok(!failure.includes('«create»') && failure.includes('showPaymentError'));
const stayActivity = buildDrawio(cases.stayease, 'stayease', 'third');
assert.ok(stayActivity.includes('Completed') && stayActivity.includes('Cleaning') && stayActivity.includes('Damage Fee'));
for (const only of ['class', 'sequence', 'third']) {
  assert.equal(await readFile(new URL(`./public/templates/stayease_${only}.drawio`, import.meta.url), 'utf8'), buildDrawio(cases.stayease, 'stayease', only));
}
console.log('PASS: quoted lessons, PE keywords, 4 domain exports, StayEase payment-before-create, final statuses, individual pages, renaming, XML escaping and static templates.');
