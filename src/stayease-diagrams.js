import { graph, xmlEscape as h } from './pe-graph.js';

function architecture(c) {
  const g = graph(`${c.system} · Layered Architecture`, 1300, 1250);
  const ui = g.box(`Presentation<br/>${h(c.system)} BookingUI`, 400, 140, 450, 100);
  const control = g.box('Application / Control<br/>BookingController', 400, 330, 450, 100);
  const services = g.box('Business Services<br/>BookingService / PaymentService / CheckoutService', 300, 530, 650, 110);
  const repo = g.box('Data Access<br/>IRoomRepository / IReservationRepository / IPaymentRepository<br/>Concrete repositories implement IGenericRepository&lt;T&gt;', 280, 750, 690, 130);
  const db = g.box('Database', 420, 1000, 420, 100, 'shape=cylinder;');
  g.edge(ui, control, 'submitBooking(roomId, dates)');g.edge(control, services, 'delegate / orchestrate');g.edge(services, repo, 'depend on interfaces', 'dashed=1;');g.edge(repo, db, 'read / persist');
  g.edge(control, repo, 'Q2: direct repository calls via interfaces', 'dashed=1;exitX=0;exitY=0.5;entryX=0;entryY=0.5;', '<Array as="points"><mxPoint x="150" y="380"/><mxPoint x="150" y="810"/></Array>');
  g.note('Theo Q2, BookingController trực tiếp gọi RoomRepository, PaymentService, ReservationRepository. Giả định Controller thuộc tầng điều phối ứng dụng và truy cập repository qua interface (không phải UI gọi database). BookingService ở Q1 phụ thuộc các interface, độc lập database. Không thêm Microservices.', 40, 1130, 1220, 95);
  return g.finish();
}

function classes(c) {
  const g = graph(`${c.system} · Q1 Design-level Class Diagram (3.0 points)`, 1900, 2550);
  const cls = (name, attrs, methods, x, y, w = 310, height = 210) => g.box(`<b>${h(name)}</b><hr/>${h(attrs).replace(/\n/g,'<br/>')}<hr/>${h(methods).replace(/\n/g,'<br/>')}`, x, y, w, height, 'align=left;verticalAlign=top;');
  const user = cls('User {abstract}', '- id: Long\n- fullName: String\n- email: String', '+ login(): boolean', 70, 140);
  const host = cls(c.staff, '- hostCode: String', '+ listRoom(): void\n+ inspectRoom(roomId): Report', 480, 140);
  const customer = cls(c.actor, '', '+ searchRooms(location, dates): List<Room>\n+ bookRoom(roomId, dates): Reservation', 70, 470, 340);
  const room = cls(c.resource, '- id: Long\n- location: String\n- nightlyRate: Decimal\n- status: RoomStatus', '+ isAvailable(start, end): boolean\n+ markBooked(): void\n+ markCleaning(): void', 1050, 130, 380, 270);
  const reservation = cls(c.record, '- id: Long\n- startDate: Date\n- endDate: Date\n- totalAmount: Decimal\n- depositAmount: Decimal\n- status: ReservationStatus', '+ complete(): void', 550, 470, 370, 260);
  const payment = cls(c.payment, '- id: Long\n- amount: Decimal\n- type: Deposit | FinalPayment\n- status: PaymentStatus\n- gatewayRef: String', '+ markPaid(): void', 1100, 480, 350, 240);
  g.edge(customer,user,'','endArrow=block;endFill=0;');g.edge(host,user,'','endArrow=block;endFill=0;');
  g.edge(customer,reservation,'1                0..*','endArrow=none;');
  g.edge(reservation,room,'0..*                1','endArrow=none;exitX=1;exitY=0;entryX=0;entryY=1;');
  g.edge(reservation,payment,'1                1..*','startArrow=diamond;startFill=1;endArrow=none;');
  g.note('Composition BẮT BUỘC theo đề: Payment không tồn tại độc lập với Reservation; thoi đặc ở Reservation. Mỗi Room có nhiều Reservation theo lịch sử, nhưng không có hai booking hiệu lực trùng ngày. Sau checkout: Reservation=Completed; Room=Cleaning. Reservation chỉ tạo sau deposit thành công nên luôn có ít nhất 1 Payment.',40,790,1810,95);
  const controller=cls('BookingController','- rooms: IRoomRepository\n- reservations: IReservationRepository\n- payments: PaymentService','+ submitBooking(customerId, roomId, start, end): Result',50,990,400,230);
  const booking=cls('BookingService','- rooms: IRoomRepository\n- reservations: IReservationRepository','+ checkAvailability(roomId, start, end): boolean\n+ createReservation(customerId, room, dates): Reservation',510,990,430,230);
  const payService=cls('PaymentService','- gateway: PaymentGateway','+ processDeposit(customerId, roomId, dates): PaymentResult\n+ settleBalance(reservationId, invoice): PaymentResult',1010,990,420,230);
  const checkout=cls('CheckoutService','- rooms: IRoomRepository\n- reservations: IReservationRepository\n- payments: IPaymentRepository','+ evaluateInspection(report): Money\n+ generateFinalInvoice(id, fee): Invoice\n+ completeCheckout(id): void',1490,990,350,250);
  g.edge(controller,payService,'uses','dashed=1;exitX=1;exitY=0;entryX=0;entryY=0;');
  const generic=cls('«interface» IGenericRepository<T>','', '+ getById(id: Long): T\n+ save(entity: T): T\n+ update(entity: T): void',700,1360,490,180);
  const names=[c.resource,c.record,c.payment];
  const interfaces=names.map((name,i)=>cls(`«interface» I${name}Repository`, '', `${i===0 ? '+ isAvailable(roomId, start, end): boolean\n+ updateStatus(roomId, status): void' : i===1 ? '+ createWithDeposit(reservation, payment): Reservation' : '+ findByReservation(id): List<Payment>'}`,80+i*620,1680,500,180));
  for (let i=0;i<interfaces.length;i++) {
    g.edge(interfaces[i],generic,`extends <${names[i]}>`,'endArrow=block;endFill=0;');
    const concrete=cls(`${names[i]}Repository`,'- database: Database',`+ getById(id): ${names[i]}\n+ save(entity): ${names[i]}\n+ update(entity): void`,100+i*620,2080,460,190);
    g.edge(concrete,interfaces[i],'implements','dashed=1;endArrow=block;endFill=0;');
  }
  for(const service of [booking,controller,checkout]) {
    g.edge(service,interfaces[0],'uses IRoomRepository','dashed=1;exitX=0;exitY=1;entryX=0;entryY=0;');
    g.edge(service,interfaces[1],'uses IReservationRepository','dashed=1;exitX=1;exitY=1;entryX=1;entryY=0;');
  }
  g.edge(checkout,interfaces[2],'uses IPaymentRepository','dashed=1;');
  g.note('Concrete repositories realize specialized interfaces, which extend IGenericRepository<T> với đúng kiểu Room/Reservation/Payment, nên thực hiện generic contract qua kế thừa interface. Thuộc tính/method hiển thị dùng tên mặc định; đổi tên đồng bộ theo đề mới. Staff/Admin nằm ngoài use case chính; có thể bổ sung nếu cần. Không ép dùng aggregation khi đề chưa có whole–part độc lập phù hợp.',40,2380,1810,110);
  return g.finish();
}

function sequence(c) {
  const g=graph(`${c.system} · Q2 Book room + pay deposit (4.0 points)`,2100,2500);
  const x=[90,290,500,730,960,1190,1430,1650,1860];
  const names=[c.actor,'BookingUI','BookingController',`${c.resource}Repository`,'PaymentService','PaymentGateway',`${c.record}Repository`, `:${c.resource}`, `:${c.record}`];
  names.forEach((name,i)=>{const top=i===8 ? 1075 : 110;g.box(h(name),x[i]-85,top,170,75,'fillColor=#efecfc;');g.line(x[i],top+75,x[i],2240,'','endArrow=none;dashed=1;strokeColor=#c4c0d5;');});
  const msg=(a,b,text,y,reply=false)=>g.line(x[a],y,x[b],y,text,reply || text.startsWith('«create»') ? 'dashed=1;' : 'endArrow=block;endFill=1;');
  msg(0,1,'submitBooking(roomId, start, end)',235);msg(1,2,'submitBooking(customerId, roomId, dates)',295);
  msg(2,3,'getById(roomId)',355);msg(3,2,'room',415,true);msg(2,3,'isAvailable(roomId, start, end)',475);msg(3,7,'isAvailable(start, end)',535);msg(7,3,'available',595,true);msg(3,2,'available',655,true);
  g.box('alt [Available]',25,710,2010,1460,'fillColor=none;strokeColor=#333333;align=left;verticalAlign=top;spacingTop=2;');
  msg(2,4,'processDeposit(customerId, roomId, dates)',790);msg(4,5,'chargeDeposit(amount, requestId)',850);msg(5,4,'paymentResult(success, receipt)',910,true);msg(4,2,'paymentResult',970,true);
  g.box('alt [payment Success]',50,1030,1960,880,'fillColor=none;strokeColor=#333333;align=left;verticalAlign=top;spacingTop=2;');
  msg(2,8,`«create» ${c.record}(customer, room, dates, Confirmed)`,1110);
  // createWithDeposit atomically saves Reservation + its owned Deposit Payment.
  msg(2,6,'save(reservationWithDeposit(receipt))',1190);msg(6,2,'savedReservation',1270,true);
  msg(2,7,'markBooked()',1350);msg(2,3,'updateStatus(roomId, Booked)',1430);msg(3,2,'updated',1510,true);msg(2,1,'showBookingSuccess(reservationId)',1590,true);
  g.line(50,1650,2010,1650,'[payment Failure]','dashed=1;endArrow=none;');
  msg(2,1,'showPaymentError() — stop, no Reservation created',1740,true);msg(1,0,'display error',1830,true);
  g.line(25,1960,2035,1960,'[Occupied / unavailable for dates]','dashed=1;endArrow=none;');
  msg(2,1,'showRoomUnavailable() — stop',2045,true);msg(1,0,'display unavailable',2125,true);
  g.note('Thứ tự BẮT BUỘC của đề ảnh: check room → pay Deposit → SUCCESS mới create Reservation → save bằng ReservationRepository → Room=Booked. Payment Failure / Occupied: không tạo Reservation, không đổi Room thành Booked. Giả định PaymentService nhận receipt rồi lưu Deposit cùng Reservation trong một transaction (composition); cần timeout/refund/rollback ngoài phạm vi đề nếu lỗi lưu sau khi đã thu tiền.',35,2320,2020,130);
  return g.finish();
}

function activity(c) {
  const g=graph(`${c.system} · Q3 Check-out and Inspection · Level 2 – Design (3.0 points)`,1500,2050);
  g.box(h(c.staff),40,120,340,1740,'shape=swimlane;startSize=45;fillColor=#fff8df;');
  g.box('System / CheckoutService',380,120,660,1740,'shape=swimlane;startSize=45;fillColor=#efecfc;');
  g.box(`Guest (${h(c.actor)})`,1040,120,420,1740,'shape=swimlane;startSize=45;fillColor=#edf7f1;');
  const action=(label,x,y,w=270,height=75)=>g.box(h(label),x,y,w,height,'rounded=1;');
  const start=g.box('',195,190,28,28,'ellipse;fillColor=#222222;strokeColor=#222222;');
  const inspect=action('Inspect room condition',70,270);const report=action('Enter inspection results',70,400);
  const evaluate=action('Evaluate inspection report',545,530,330);
  const damage=g.box('Damage found?',620,680,190,110,'rhombus;');
  const fee=action('Calculate Damage Fee',400,870,280);const none=action('Damage Fee = 0',725,870,280);
  const merge=g.box('',695,1020,35,35,'rhombus;');
  const invoice=action('Generate Final Invoice\nremaining stay balance + Damage Fee',470,1120,490,95);
  const request=action('Request Guest to settle payment',60,1260,290);
  const pay=action('Settle final payment',1110,1260,280);
  const confirm=g.box('Payment confirmed?',620,1400,220,120,'rhombus;');
  const complete=action(`Set ${c.record}.status = Completed\nSet ${c.resource}.status = Cleaning\nPersist both updates`,470,1580,490,110);
  const final=g.box('',695,1770,35,35,'ellipse;shape=doubleEllipse;fillColor=#222222;strokeColor=#222222;');
  g.edge(start,inspect);g.edge(inspect,report);g.edge(report,evaluate);g.edge(evaluate,damage);
  g.edge(damage,fee,'[damage found]','exitX=0;exitY=0.5;entryX=0.5;entryY=0;');g.edge(damage,none,'[no damage]','exitX=1;exitY=0.5;entryX=0.5;entryY=0;');
  g.edge(fee,merge);g.edge(none,merge);g.edge(merge,invoice);g.edge(invoice,request);g.edge(request,pay);g.edge(pay,confirm);
  g.edge(confirm,complete,'[confirmed]','exitX=0.5;exitY=1;entryX=0.5;entryY=0;');
  g.edge(confirm,pay,'[not confirmed / retry]','exitX=1;exitY=0.5;entryX=1;entryY=0.5;','<Array as="points"><mxPoint x="1430" y="1460"/><mxPoint x="1430" y="1295"/></Array>');
  g.edge(complete,final);
  g.note('Theo đề: Host inspect + enter report; System evaluate + calculate fee + generate invoice; Host yêu cầu Guest trả tiền; chỉ sau xác nhận payment mới Reservation=Completed và Room=Cleaning. Giả định failure thì chờ/thử lại, chưa hoàn tất. Remaining balance đã trừ deposit; không thu deposit lần hai. Guest là Customer đang lưu trú, không phải lớp người dùng mới.',40,1900,1420,105);
  return g.finish();
}

export function stayeasePages(c) {
  return [['architecture','00 Layered Architecture',()=>architecture(c)],['class','Q1 StayEase Class',()=>classes(c)],['sequence','Q2 StayEase Sequence',()=>sequence(c)],['third','Q3 StayEase Activity',()=>activity(c)]];
}
