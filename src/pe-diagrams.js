import { graph, xmlEscape } from './pe-graph.js';
import { stayeasePages } from './stayease-diagrams.js';
import { standardClass } from './standard-class.js';
import { standardActivity } from './standard-activity.js';
export { xmlEscape } from './pe-graph.js';
const html = xmlEscape;

function architecture(c) {
  const g = graph(`${c.system} · Layered Architecture`, 1100, 1000);
  const a = g.box('Presentation<br/>UI / Controller', 310, 140, 420, 100);
  const b = g.box(`Business Logic<br/>${html(c.record)}Service`, 310, 310, 420, 100);
  const d = g.box(`Data Access<br/>Repository&lt;T&gt; / concrete repositories`, 310, 480, 420, 100);
  const e = g.box('Database', 310, 650, 420, 100, 'shape=cylinder;');
  g.edge(a, b, 'delegate'); g.edge(b, d, 'depends on', 'dashed=1;'); g.edge(d, e, 'read / persist');
  g.note('Domain entities được Service sử dụng. UI không gọi thẳng database. Giữ cùng kiến trúc trong Class và Sequence.', 80, 820, 940, 80);
  return g.finish();
}

function sequence(c, kind) {
  const height = kind === 'library' ? 2500 : 2200;
  const top = kind === 'library' ? 870 : 540;
  const g = graph(`${c.system} · Q2 ${c.usecase}`, 1900, height);
  const names = [c.actor, `${c.system} UI`, `${c.record}Service`, `${c.resource}Repository`, `${c.record}Repository`, `${c.payment}Repository`, `:${c.resource}`, `:${c.record}`, `:${c.payment}`, kind === 'library' ? c.staff : 'PaymentGateway'];
  const xs = names.map((name, i) => 105 + i * 185);
  names.forEach((name, i) => {
    const headY = i === 7 ? top + 90 - 32 : i === 8 && kind !== 'library' ? top + 185 - 32 : 110;
    g.lifeline(name,xs[i],headY,height-180,170);
  });
  const msg = (from, to, label, y, reply = false) => { if(!reply&&!label.startsWith('«create»'))g.activation(xs[to],y,30);g.line(xs[from], y, xs[to], y, label, reply || label.startsWith('«create»') ? 'dashed=1;' : 'endArrow=block;endFill=1;'); };
  const frame = (label, y, h) => g.frame(label.replace(/^alt /,''),20,y,1850,h);
  msg(0, 1, 'selectResource(id, start, end)', 225);msg(1, 2, `create${c.record}(actorId, id, start, end)`, 280);
  msg(2, 3, 'isAvailable(id, start, end)', 335);msg(3, 6, 'isAvailable()', 390);msg(6, 3, 'available', 435, true);msg(3, 2, 'available', 480, true);
  if (kind === 'library') {
    msg(2, 5, 'hasUnpaidFine(readerId)', 535);msg(5, 8, 'getStatus()', 590);msg(8, 5, 'fineStatus', 645, true);msg(5, 2, 'hasUnpaidFine', 700, true);msg(2, 4, 'countActiveLoans(readerId)', 755);msg(4, 2, 'activeLoanCount', 810, true);
  }
  frame(`alt [${kind === 'library' ? 'available AND noUnpaidFine AND belowLimit' : 'available'}]`, top, 1250);
  msg(2, 7, `«create» ${c.record}(status=${kind === 'library' ? 'Requested' : 'Pending'})`, top + 90);
  msg(2, 4, `save(${c.record.toLowerCase()})`, top + 150);
  if (kind !== 'library') msg(2, 8, `«create» ${c.payment}(amount, Pending)`, top + 185);
  msg(2, 6, 'reserve()', top + 210);msg(2, 3, `save(${c.resource.toLowerCase()})`, top + 270);
  if (kind === 'library') { msg(9, 1, 'approve(loanId) / reject(loanId)', top + 330);msg(1, 2, 'approvalDecision(loanId, decision)', top + 390); }
  else { msg(2, 9, 'payDepositOrFee(recordId, amount)', top + 330);msg(9, 2, 'paymentResult', top + 390, true); }
  g.frame(`[${kind === 'library' ? 'approved' : 'payment success'}]`,45,top+430,1800,600);
  if (kind === 'library') { msg(2, 7, 'approve(); markBorrowed()', top + 490);msg(9, 0, 'handOverBookCopy()', top + 545); }
  else { msg(2, 8, 'markPaid()', top + 475);msg(2, 5, `save(${c.payment.toLowerCase()})`, top + 525);msg(2, 7, kind === 'medicare' ? 'markPaid()' : 'confirm()', top + 575); }
  msg(2, 4, `save(${c.record.toLowerCase()})`, top + 625);msg(2, 1, kind === 'medicare' ? 'paid; awaiting receptionist confirmation' : 'success', top + 670, true);
  g.line(45, top + 700, 1845, top + 700, `[${kind === 'library' ? 'rejected' : 'payment failure'}]`, 'dashed=1;endArrow=none;');
  msg(2, 7, 'cancel()', top + 755);msg(2, 4, 'save(cancelledRecord)', top + 810);msg(2, 6, 'release()', top + 865);msg(2, 3, 'save(releasedResource)', top + 920);msg(2, 1, 'showFailure()', top + 975, true);
  g.line(20, top + 1070, 1870, top + 1070, `[${kind === 'library' ? 'unavailable OR ineligible' : 'unavailable'}]`, 'dashed=1;endArrow=none;');
  msg(2, 1, 'showUnavailableOrIneligible() — no record created', top + 1150, true);
  g.note(kind === 'medicare' ? 'Sau Paid, Receptionist gọi confirmAppointment để chuyển Confirmed (xem State). Nếu payment fail phải hủy và giải phóng TimeSlot. Tên method cần thêm/đối chiếu ở Class.' : 'Giả định giữ tài nguyên sau khi tạo yêu cầu, nhánh thất bại phải giải phóng. Library: chỉ giao sách khi Approved. Bổ sung method đặc thù vào Class để khớp Sequence. Không bắt buộc thêm authentication nếu đề không yêu cầu.', 30, height - 100, 1840, 75);
  return g.finish();
}

function state(c) {
  const g = graph(`${c.system} · Q3 ${c.record} Lifecycle`, 1200, 1200);
  const start = g.box('', 110, 160, 25, 25, 'ellipse;fillColor=#222222;');
  const requested = g.box('Requested', 50, 290, 230, 90, 'rounded=1;');
  const paid = g.box('Paid', 440, 290, 230, 90, 'rounded=1;');
  const confirmed = g.box('Confirmed', 840, 290, 230, 90, 'rounded=1;');
  const progress = g.box('InProgress', 840, 550, 230, 90, 'rounded=1;');
  const completed = g.box('Completed', 840, 820, 230, 90, 'rounded=1;');
  const cancelled = g.box('Cancelled', 50, 820, 230, 90, 'rounded=1;');
  const end = g.box('', 540, 1030, 35, 35, 'ellipse;shape=doubleEllipse;fillColor=#222222;');
  g.edge(start, requested, 'requestAppointment / reserveSlot');g.edge(requested, paid, 'payFee [success] / savePayment');g.edge(paid, confirmed, 'confirmAppointment');g.edge(confirmed, progress, 'startExamination');g.edge(progress, completed, 'finishExamination / issueMedicalRecord');
  g.edge(requested, cancelled, 'payFail / releaseSlot');g.edge(paid, cancelled, 'cancelAppointment [allowed] / releaseSlot');
  g.edge(completed, end);g.edge(cancelled, end);
  g.note('Ít nhất 6 transitions có event; initial/final rõ ràng. Giả định chính sách hủy sau trả phí cho phép hủy và hoàn tiền riêng nếu áp dụng. MedicalRecord tồn tại đúng 1 khi Completed. Không thay state bằng tên hành động.', 40, 1100, 1120, 80);
  return g.finish();
}

export function buildDrawio(config, kind, only = 'all') {
  const c = Object.fromEntries(Object.entries(config).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v]));
  const pages = (kind === 'stayease' ? stayeasePages(c) : [
    ['architecture', '00 Layered Architecture', () => architecture(c)],
    ['class', 'Q1 Class Diagram', () => standardClass(c, kind)],
    ['sequence', 'Q2 Sequence Diagram', () => sequence(c, kind)],
    ['third', `Q3 ${c.third} Diagram`, () => c.third === 'State' ? state(c) : standardActivity(c, kind)],
  ]).filter(([id]) => only === 'all' || only === id);
  return `<?xml version="1.0" encoding="UTF-8"?><mxfile host="app.diagrams.net" agent="SWD Study PE" version="24.7.17">${pages.map(([id, name, render]) => `<diagram id="${id}" name="${xmlEscape(name)}">${render()}</diagram>`).join('')}</mxfile>`;
}

export function downloadDrawio(config, kind, only = 'all') {
  const blob = new Blob([buildDrawio(config, kind, only)], { type: 'application/xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${config.system.replace(/[^a-zA-Z0-9_-]/g, '_') || 'SWD'}_PE_${only}.drawio`;
  document.body.append(a);a.click();a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
