import { graph, xmlEscape as h } from './pe-graph.js';
import { standardClass } from './standard-class.js';
import { standardActivity } from './standard-activity.js';

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

function sequence(c) {
  const g=graph(`${c.system} · Q2 Book room + pay deposit (4.0 points)`,2100,2500);
  const x=[90,290,500,730,960,1190,1430,1650,1860];
  const names=[c.actor,'BookingUI','BookingController',`${c.resource}Repository`,'PaymentService','PaymentGateway',`${c.record}Repository`, `:${c.resource}`, `:${c.record}`];
  names.forEach((name,i)=>g.lifeline(name,x[i],i===8?1075:110,2240,170));
  const msg=(a,b,text,y,reply=false)=>{if(!reply&&!text.startsWith('«create»'))g.activation(x[b],y,35);g.line(x[a],y,x[b],y,text,reply || text.startsWith('«create»') ? 'dashed=1;' : 'endArrow=block;endFill=1;');};
  msg(0,1,'submitBooking(roomId, start, end)',235);msg(1,2,'submitBooking(customerId, roomId, dates)',295);
  msg(2,3,'getById(roomId)',355);msg(3,2,'room',415,true);msg(2,3,'isAvailable(roomId, start, end)',475);msg(3,7,'isAvailable(start, end)',535);msg(7,3,'available',595,true);msg(3,2,'available',655,true);
  g.frame('[Available]',25,710,2010,1460);
  msg(2,4,'processDeposit(customerId, roomId, dates)',790);msg(4,5,'chargeDeposit(amount, requestId)',850);msg(5,4,'paymentResult(success, receipt)',910,true);msg(4,2,'paymentResult',970,true);
  g.frame('[payment Success]',50,1030,1960,880);
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

export function stayeasePages(c) {
  return [['architecture','00 Layered Architecture',()=>architecture(c)],['class','Q1 StayEase Class',()=>standardClass(c,'stayease')],['sequence','Q2 StayEase Sequence',()=>sequence(c)],['third','Q3 StayEase Activity',()=>standardActivity(c,'stayease')]];
}
