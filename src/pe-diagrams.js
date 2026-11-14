import { graph, xmlEscape } from './pe-graph.js';
import { stayeasePages } from './stayease-diagrams.js';
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

function classDiagram(c, kind) {
  const g = graph(`${c.system} · Q1 Design-level Class Diagram`, 1600, 1800);
  const cls = (name, fields, methods, x, y, w = 260, h = 150) => g.box(`<b>${html(name)}</b><hr/>${html(fields).replace(/\n/g, '<br/>')}<hr/>${html(methods).replace(/\n/g, '<br/>')}`, x, y, w, h, 'align=left;verticalAlign=top;');
  const user = cls('User {abstract}', '- id: Long\n- name: String\n- email: String', '+ login(): boolean', 50, 130);
  const actor = cls(c.actor + (kind === 'library' ? ' {abstract}' : ''), '- userId: Long', '+ request(): void', 50, 390);
  const staff = cls(c.staff, '- employeeCode: String', '+ inspect(): void\n+ confirm(): void', 370, 130);
  g.edge(actor, user, '', 'endArrow=block;endFill=0;'); g.edge(staff, user, '', 'endArrow=block;endFill=0;');
  const record = cls(c.record, `- id: Long\n- startAt: DateTime\n- endAt: DateTime\n- status: ${c.record}Status`, `+ confirm(): void\n+ cancel(): void\n+ complete(): void${kind === 'library' ? '\n+ approve(): void\n+ markBorrowed(): void' : kind === 'medicare' ? '\n+ markPaid(): void' : ''}`, 400, 390, 280, 240);
  const resource = cls(c.resource, '- id: Long\n- status: String', '+ isAvailable(): boolean\n+ reserve(): void\n+ release(): void', 790, 390, 270, 200);
  const pay = cls(c.payment, `- id: Long\n- amount: Decimal\n- status: String${kind === 'autogo' ? '\n- type: Deposit | Final' : ''}`, '+ markPaid(): void', 1180, 390, 280, 200);
  g.edge(actor, record, '1                  0..*', 'endArrow=none;');
  g.edge(record, resource, '0..*                  1', 'endArrow=none;');
  g.edge(record, pay, `1                ${kind === 'library' ? '0..1' : kind === 'autogo' ? '1..*' : '1'}`, kind === 'autogo' ? 'startArrow=diamond;startFill=1;endArrow=none;' : 'endArrow=none;');
  if (kind === 'library') {
    const student = cls('Student', '- studentCode: String', '+ borrow(): void', 30, 680, 190);
    const lecturer = cls('Lecturer', '- lecturerCode: String', '+ borrow(): void', 240, 680, 190);
    g.edge(student, actor, '', 'endArrow=block;endFill=0;');g.edge(lecturer, actor, '', 'endArrow=block;endFill=0;');
    const book = cls('Book', '- isbn: String\n- title: String', '+ addCopy(): void', 790, 130);
    g.edge(book, resource, '1                  1..*', 'startArrow=diamond;startFill=1;endArrow=none;');
    g.note('Reader là User trừu tượng; Student/Lecturer kế thừa Reader. LoanStatus: Requested, Approved, Borrowed, Returned, Overdue, Closed. Composition Book–BookCopy: giả định vòng đời phụ thuộc.', 40, 880, 1480, 85);
  } else if (kind === 'medicare') {
    const doctor = cls('Doctor', '- specialty: String', '+ examine(): void', 740, 130, 240);
    const schedule = cls('Schedule', '- id: Long', '+ getAvailableSlots(): List<TimeSlot>', 1120, 130, 330);
    g.edge(doctor, user, '', 'endArrow=block;endFill=0;');g.edge(doctor, schedule, '1               1', 'endArrow=none;');
    g.edge(schedule, resource, '1               1..*', 'startArrow=diamond;startFill=1;endArrow=none;');
    const med = cls('MedicalRecord', '- diagnosis: String', '+ issue(): void', 700, 700, 270);
    const item = cls('PrescriptionItem', '- medicine: String\n- dose: String', '+ validate(): boolean', 1160, 700, 280);
    g.edge(record, med, '1        0..1 {Completed implies 1}', 'endArrow=none;');
    g.edge(med, item, '1                1..*', 'startArrow=diamond;startFill=1;endArrow=none;');
  } else {
    g.note('Giả định: Payment phụ thuộc vòng đời Booking nên dùng composition. 1..* theo đề ở giao dịch có payment; nếu bao gồm Pending trước thanh toán, giải thích ràng buộc 0..* trước / 1..* sau. Car 1 — 0..* Booking theo thời gian, không phải 1–1 toàn hệ thống.', 40, 730, 1480, 100);
  }
  const serviceMethods = kind === 'library' ? `+ create${c.record}(actorId, id, start, end): ${c.record}\n+ checkEligibility(readerId): boolean\n+ approvalDecision(loanId, decision): void\n+ returnBook(loanId): void` : `+ create${c.record}(actorId, id, start, end): ${c.record}\n+ processPayment(id): boolean\n+ complete(id): void${kind === 'medicare' ? '\n+ confirmAppointment(id): void' : ''}`;
  const service = cls(`${c.record}Service`, '- repositories: Repository', serviceMethods, 50, 1050, 350, 240);
  const generic = cls('«interface» Repository<T>', '', '+ findById(id: Long): T\n+ save(entity: T): T\n+ update(entity: T): void', 1080, 1430, 400, 160);
  const repos = [c.record, c.resource, c.payment].map((name, i) => cls(`${name}Repository`, '', `${i === 1 ? '+ isAvailable(id, start, end): boolean\n' : ''}+ findById(id): ${name}\n+ save(entity): ${name}${kind === 'library' && i === 0 ? '\n+ countActiveLoans(readerId): int' : kind === 'library' && i === 2 ? '\n+ hasUnpaidFine(readerId): boolean' : ''}`, 500 + i * 350, 1100, 310, 200));
  for (const repo of repos) { g.edge(service, repo, 'uses', 'dashed=1;');g.edge(repo, generic, 'implements', 'dashed=1;endArrow=block;endFill=0;'); }
  g.note('Mẫu ôn tập tự biên soạn. Kiểm tra lại tên, method và cardinality theo đề mới. Nét liền tam giác rỗng: kế thừa; nét đứt tam giác rỗng: implements; dependency hướng từ Service tới Repository. Library cần FineRepository kiểm tra nợ và LoanRepository đếm khoản mượn đang mở.', 40, 1650, 1480, 110);
  return g.finish();
}

function sequence(c, kind) {
  const height = kind === 'library' ? 2500 : 2200;
  const g = graph(`${c.system} · Q2 ${c.usecase}`, 1900, height);
  const names = [c.actor, `${c.system} UI`, `${c.record}Service`, `${c.resource}Repository`, `${c.record}Repository`, `${c.payment}Repository`, `:${c.resource}`, `:${c.record}`, `:${c.payment}`, kind === 'library' ? c.staff : 'PaymentGateway'];
  const xs = names.map((name, i) => 105 + i * 185);
  names.forEach((name, i) => { g.box(html(name), xs[i] - 80, 110, 160, 65, i === 0 || (kind === 'library' && i === 9) ? 'fillColor=#fff8df;' : 'fillColor=#efecfc;');g.line(xs[i], 175, xs[i], height - 180, '', 'endArrow=none;dashed=1;strokeColor=#c4c0d5;'); });
  const msg = (from, to, label, y, reply = false) => g.line(xs[from], y, xs[to], y, label, reply ? 'dashed=1;' : '');
  const frame = (label, y, h) => g.box(html(label), 20, y, 1850, h, 'fillColor=none;strokeColor=#333333;align=left;verticalAlign=top;spacingTop=2;fontStyle=1;');
  msg(0, 1, 'selectResource(id, start, end)', 225);msg(1, 2, `create${c.record}(actorId, id, start, end)`, 280);
  msg(2, 3, 'isAvailable(id, start, end)', 335);msg(3, 6, 'isAvailable()', 390);msg(6, 3, 'available', 435, true);msg(3, 2, 'available', 480, true);
  if (kind === 'library') {
    msg(2, 5, 'hasUnpaidFine(readerId)', 535);msg(5, 8, 'getStatus()', 590);msg(8, 5, 'fineStatus', 645, true);msg(5, 2, 'hasUnpaidFine', 700, true);msg(2, 4, 'countActiveLoans(readerId)', 755);msg(4, 2, 'activeLoanCount', 810, true);
  }
  const top = kind === 'library' ? 870 : 540;
  frame(`alt [${kind === 'library' ? 'available AND noUnpaidFine AND belowLimit' : 'available'}]`, top, 1250);
  msg(2, 7, `«create» ${c.record}(status=${kind === 'library' ? 'Requested' : 'Pending'})`, top + 90);
  msg(2, 4, `save(${c.record.toLowerCase()})`, top + 150);
  if (kind !== 'library') msg(2, 8, `«create» ${c.payment}(amount, Pending)`, top + 185);
  msg(2, 6, 'reserve()', top + 210);msg(2, 3, `save(${c.resource.toLowerCase()})`, top + 270);
  if (kind === 'library') { msg(9, 1, 'approve(loanId) / reject(loanId)', top + 330);msg(1, 2, 'approvalDecision(loanId, decision)', top + 390); }
  else { msg(2, 9, 'payDepositOrFee(recordId, amount)', top + 330);msg(9, 2, 'paymentResult', top + 390, true); }
  g.box(html(`alt [${kind === 'library' ? 'approved' : 'payment success'}]`), 45, top + 430, 1800, 600, 'fillColor=none;strokeColor=#333333;align=left;verticalAlign=top;');
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

function activity(c, kind) {
  const g = graph(`${c.system} · Q3 ${c.returnCase} · Level 2 – Design`, 1200, 1700);
  g.box(html(c.staff), 30, 100, 330, 1450, 'shape=swimlane;startSize=45;fillColor=#fff8df;');
  g.box(`${html(c.record)}Service / System`, 360, 100, 500, 1450, 'shape=swimlane;startSize=45;fillColor=#efecfc;');
  g.box(html(c.actor), 860, 100, 310, 1450, 'shape=swimlane;startSize=45;fillColor=#edf7f1;');
  const action = (text, x, y, w = 240) => g.box(html(text), x, y, w, 70, 'rounded=1;');
  const start = g.box('', 1000, 170, 25, 25, 'ellipse;fillColor=#222222;strokeColor=#222222;');
  const ret = action(`Return ${c.resource}`, 900, 240, 230);
  const inspect = action(kind === 'library' ? 'Inspect condition + due date' : 'Inspect condition', 65, 360);
  const report = action('Submit inspection report', 65, 480);
  const evaluate = action('Evaluate report', 490, 590);
  const decision = g.box(html(kind === 'library' ? 'Late OR damaged?' : 'Additional fee?'), 510, 720, 180, 100, 'rhombus;');
  const calc = action(kind === 'library' ? 'Calculate fine' : 'Calculate additional charge', 385, 880, 210);
  const base = action(kind === 'library' ? 'No fine' : 'Base remaining amount', 630, 880, 210);
  const merge = g.box('', 595, 1010, 30, 30, 'rhombus;');
  const bill = g.box(html('Amount > 0?'), 500, 1070, 210, 100, 'rhombus;');
  const pay = action(kind === 'library' ? 'Pay fine' : 'Pay remaining amount', 900, 1080, 230);
  const paid = g.box('Paid?', 950, 1220, 120, 80, 'rhombus;');
  const close = action(`Close ${c.record}; update ${c.resource} status`, 475, 1390, 300);
  const end = g.box('', 595, 1500, 30, 30, 'ellipse;shape=doubleEllipse;fillColor=#222222;strokeColor=#222222;');
  g.edge(start, ret);g.edge(ret, inspect);g.edge(inspect, report);g.edge(report, evaluate);g.edge(evaluate, decision);
  g.edge(decision, calc, '[yes]');g.edge(decision, base, '[no]');g.edge(calc, merge);g.edge(base, merge);g.edge(merge, bill);
  g.edge(bill, pay, '[amount > 0]');g.edge(bill, close, '[amount = 0]');g.edge(pay, paid);g.edge(paid, close, '[success]');g.edge(paid, pay, '[failure / retry]');g.edge(close, end);
  g.note('Giả định trả tiền thất bại thì chờ/thử lại, chưa đóng giao dịch. Trạng thái tài nguyên sau trả xe hỏng có thể là Maintenance thay vì Available; ghi theo đề và giả định. Library đóng Loan sau khi fine được thanh toán.', 30, 1580, 1140, 90);
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
    ['class', 'Q1 Class Diagram', () => classDiagram(c, kind)],
    ['sequence', 'Q2 Sequence Diagram', () => sequence(c, kind)],
    ['third', `Q3 ${c.third} Diagram`, () => c.third === 'State' ? state(c) : activity(c, kind)],
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
