import { graph } from './pe-graph.js';

export function standardClass(c, kind) {
  const stay=kind==='stayease', lib=kind==='library', med=kind==='medicare';
  const g=graph(`${c.system} · Q1 Class · theo drawio_thiet_ke_chuan`,2200,2900);
  const cls=(name,role,fields,methods,x,y,w=350)=>g.umlClass(name,`«${role}»`,fields,methods,x,y,w);
  const service=stay?'BookingService':`${c.record}Service`;
  const controller=stay?'BookingController':`${c.record}Controller`;
  const genericName=stay?'IGenericRepository<T>':'Repository<T>';
  const control=cls(controller,'controller',[],[stay?'+ submitBooking(customerId, roomId, dates): Result':'+ submitRequest(actorId, resourceId, start, end): Result'],920,120,420);
  const business=cls(service,'service',[`- resources: ${stay?'I':''}${c.resource}Repository`,`- records: ${stay?'I':''}${c.record}Repository`], [
    `+ create${c.record}(actorId, resourceId, start, end): ${c.record}`,
    '+ checkAvailability(id, start, end): boolean',
    ...(lib?['+ approvalDecision(loanId, decision): void']:['+ processPayment(id): boolean']),
    `+ complete(id): void`,
    ...(med?['+ confirmAppointment(id): void']:[]),
  ],870,310,530);
  g.edge(control,business,'uses','dashed=1;exitX=0.5;exitY=1;entryX=0.5;entryY=0;');
  const generic=cls(genericName,'interface',[],['+ getById(id: Long): T','+ getAll(): List<T>','+ save(entity: T): T','+ update(entity: T): void'],900,650,470);
  const names=[c.payment,c.resource,c.record,c.actor,c.staff];
  const repoIds=[];
  names.forEach((name,i)=>{
    const extra=i===1?['+ isAvailable(id, start, end): boolean','+ updateStatus(id, status): void']:lib&&i===0?['+ hasUnpaidFine(readerId): boolean']:lib&&i===2?['+ countActiveLoans(readerId): int']:[];
    const repo=cls(`${name}Repository`,'repository',[],[`+ getById(id: Long): ${name}`,`+ save(entity: ${name}): ${name}`,...extra],40+i*430,1130,370);
    repoIds.push(repo);
    if(stay && i<3){
      const contract=cls(`I${name}Repository`,'interface',[],extra.length?extra:[`+ createWithDeposit(record, receipt): ${c.record}`],40+i*430,875,370);
      g.edge(contract,generic,'extends','endArrow=block;endFill=0;exitX=0.5;exitY=0;entryX=0.5;entryY=1;');
      g.edge(repo,contract,'implements','dashed=1;endArrow=block;endFill=0;exitX=0.5;exitY=0;entryX=0.5;entryY=1;');
      g.edge(business,contract,'uses','dashed=1;exitX=0;exitY=0.5;entryX=0.5;entryY=0;');
    }else{
      g.edge(repo,generic,'implements','dashed=1;endArrow=block;endFill=0;exitX=0.5;exitY=0;entryX=0.5;entryY=1;');
      if(i<3)g.edge(business,repo,'uses','dashed=1;exitX=0;exitY=0.5;entryX=0;entryY=0.5;');
    }
  });
  const payment=cls(c.payment,'entity',['- id: Long','- amount: Decimal','- status: String',...(!lib?['- type: Deposit | Final']:[])],['+ markPaid(): void','+ getStatus(): String'],40,1500);
  const resource=cls(c.resource,'entity',['- id: Long','- status: String',...(lib?['- barcode: String']:med?['- startAt: DateTime']:['- price: Decimal'])],['+ isAvailable(start, end): boolean','+ reserve(): void','+ release(): void',...(stay?['+ markBooked(): void']:[])],470,1500);
  const record=cls(c.record,'entity',['- id: Long',`- ${c.resource[0].toLowerCase()+c.resource.slice(1)}Id: Long`,'- startAt: DateTime','- endAt: DateTime',`- status: ${c.record}Status`],['+ confirm(): void','+ cancel(): void','+ complete(): void',...(lib?['+ approve(): void','+ markBorrowed(): void']:med?['+ markPaid(): void']:[])],900,1500);
  const actor=cls(c.actor,lib?'abstract entity':'entity',['- userId: Long'],[lib?'+ borrow(): void':'+ request(): void'],1330,1500);
  const staff=cls(c.staff,'entity',['- employeeCode: String'],[med?'+ confirmAppointment(id): void':lib?'+ approveLoan(id): boolean':'+ inspect(): void'],1760,1500);
  [payment,resource,record,actor,staff].forEach((entity,i)=>g.edge(repoIds[i],entity,'uses','dashed=1;exitX=0.5;exitY=1;entryX=0.5;entryY=0;'));
  const user=cls('User','abstract',['- id: Long','- name: String','- email: String','- phone: String'],['+ login(): boolean'],1540,1880);
  [actor,staff].forEach(child=>g.edge(child,user,'extends','endArrow=block;endFill=0;exitX=0.5;exitY=1;entryX=0.5;entryY=0;'));
  g.edge(resource,record,'1                  0..*','endArrow=none;exitX=1;exitY=0.25;entryX=0;entryY=0.25;');
  g.edge(record,actor,'0..*                  1','endArrow=none;exitX=1;exitY=0.15;entryX=0;entryY=0.25;');
  g.edge(record,payment,`1                  ${lib?'0..1':med?'1':'1..*'}`,stay||kind==='autogo'?'startArrow=diamond;startFill=1;endArrow=none;exitX=0.5;exitY=1;entryX=0.5;entryY=1;':'endArrow=none;exitX=0.5;exitY=1;entryX=0.5;entryY=1;');
  if(lib){
    const book=cls('Book','entity',['- isbn: String','- title: String'],['+ addCopy(): void'],470,2190);
    g.edge(book,resource,'1                  1..*','startArrow=diamond;startFill=1;endArrow=none;');
    for(const [name,x]of [['Student',1160],['Lecturer',1600]]){
      const subtype=cls(name,'entity',[`- code: String`],['+ borrow(): void'],x,2280);
      g.edge(subtype,actor,'extends','endArrow=block;endFill=0;');
    }
  }
  if(med){
    const doctor=cls('Doctor','entity',['- specialty: String'],['+ examine(): void'],40,2260);
    const schedule=cls('Schedule','entity',['- id: Long'],['+ getAvailableSlots(): List<TimeSlot>'],470,2260);
    const medical=cls('MedicalRecord','entity',['- diagnosis: String'],['+ issue(): void'],900,2260);
    const item=cls('PrescriptionItem','entity',['- medicine: String','- dose: String'],['+ validate(): boolean'],1330,2260);
    g.edge(doctor,user,'extends','endArrow=block;endFill=0;');
    g.edge(doctor,schedule,'1                  1','endArrow=none;');
    g.edge(schedule,resource,'1                  1..*','startArrow=diamond;startFill=1;endArrow=none;');
    g.edge(record,medical,'1                  0..1','endArrow=none;');
    g.edge(medical,item,'1                  1..*','startArrow=diamond;startFill=1;endArrow=none;');
  }
  if(stay){
    const payments=cls('PaymentService','service',[],['+ processDeposit(actorId, resourceId, dates): PaymentResult'],40,350,550);
    const checkout=cls('CheckoutService','service',[],['+ evaluateInspection(report): Money','+ generateFinalInvoice(id, fee): Invoice','+ completeCheckout(id): void'],1580,350,550);
    g.edge(control,payments,'Q2 calls','dashed=1;');g.edge(checkout,repoIds[1],'uses','dashed=1;');
  }
  const constraints=stay?'Payment phụ thuộc Reservation: composition bắt buộc. Q2 theo đề: Controller gọi RoomRepository, PaymentService, ReservationRepository qua contract; tạo Reservation sau payment Success.':lib?'Book–BookCopy composition dưới giả định vòng đời phụ thuộc; Loan chỉ có 0..1 Fine. Reader có Student/Lecturer; Librarian duyệt trước giao sách.':med?'Completed implies exactly 1 MedicalRecord; trước Completed có thể 0..1. MedicalRecord composition 1..* PrescriptionItem.':'Composition Booking–Payment theo giả định vòng đời. Pending có thể chưa có Payment: ghi {Pending: 0..*; giao dịch đã thanh toán: 1..*} nếu mô hình toàn vòng đời.';
  g.note(`C1 Người: ${c.actor}/${c.staff}/User; C2 Tài nguyên: ${c.resource}; C3 Giao dịch: ${c.record}; C4 Tiền/phạt: ${c.payment}. Đổi cùng entity, Repository, field ID, method, tham số và cả Q2/Q3. ${constraints} Không để hai giao dịch hiệu lực trùng lịch một tài nguyên.`,40,2660,2090,150);
  return g.finish();
}
