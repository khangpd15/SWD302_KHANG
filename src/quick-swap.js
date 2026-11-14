export const swapFields = [
  ['system','Tên hệ thống','StayEase','Tiêu đề, UI; không tự tạo class tên hệ thống.'],
  ['actor','Người dùng chính','Customer','Entity, Repository, lifeline, lane và tham số actorId.'],
  ['staff','Người xử lý','Host','Entity, Repository, quan hệ kế thừa và lane kiểm tra/duyệt.'],
  ['resource','Tài nguyên','Room','Entity + Repository + field ID + availability + trạng thái cuối.'],
  ['record','Giao dịch','Reservation','Entity + Repository + Service/Controller nếu đề cho phép + save/update.'],
  ['payment','Tiền / phạt','Payment','Entity + Repository + amount + guard trả tiền; Fine không luôn tồn tại.'],
];

export function swapPlan(c,kind,stage){
  const stay=kind==='stayease',lib=kind==='library',med=kind==='medicare';
  const common={
    source:'drawio_thiet_ke_chuan.drawio',
    anchors: swapFields.map(([key,label,from,where])=>({key,label,from,to:c[key],where})),
    fixed:stay?'Đề gọi đúng BookingController, BookingService, IGenericRepository<T>: giữ các tên bắt buộc này. Guest ở checkout là Customer.':lib?'Giữ Book khác BookCopy; Reader là lớp cha của Student và Lecturer; Librarian duyệt yêu cầu.':med?'Giữ thêm Doctor, Schedule, MedicalRecord, PrescriptionItem. Q3 là State của Appointment.':'User là lớp cha của Customer và Staff. Booking có Payment loại Deposit / Final.',
  };
  if(stage==='q1')return{...common,title:'Q1 · Thay tên lớp, rồi sửa thuộc tính và quan hệ',
    read:'Đọc Business Overview để lấy người / tài nguyên / giao dịch / tiền. Đọc Requirements Q1 để lấy kế thừa, số lượng và tầng Service/Repository.',
    locate:'Trong tab Q1, đi từ Controller → Service → generic interface → repositories → entities. Các class có từng dòng thuộc tính/method riêng như mẫu mới.',
    edits:[
      ['Entity / Repository',`Room → ${c.resource}; RoomRepository → ${c.resource}Repository`, `Đổi cả roomId → ${c.resource[0].toLowerCase()+c.resource.slice(1)}Id; đọc lại kiểu dữ liệu và method, không chỉ thay tiêu đề.`],
      ['Bội số gần Payment',lib?'0..1 Fine':med?'1 Payment':'1..* Payment',lib?'“at most one” → 0..1, không giữ 1..* của mẫu phòng.':med?'MedicalRecord là 0..1 trước hoàn thành; thêm {Completed implies 1}.':'“one or more” → 1..*. Với AutoGo Pending có thể chưa trả tiền: ghi rõ ràng buộc vòng đời.'],
      ['Đầu thoi / tam giác',stay?'Reservation ◆— Payment':lib?'Book ◆— BookCopy (giả định)':med?'MedicalRecord ◆— PrescriptionItem':'Booking ◆— Payment (giả định)', 'Tam giác về lớp cha/interface; thoi về whole. Không dùng has/contains để đoán vòng đời.'],
    ],
    stop:['Tên class ở Q1 khớp receiver và method ở Q2.','Mỗi đường có nghĩa đúng và bội số theo đề; không mang quan hệ phòng sang sách/lịch khám.',common.fixed],
  };
  if(stage==='q2')return{...common,title:'Q2 · Đổi cột, lời gọi, guard rồi kiểm tra thứ tự',
    read:'Đọc tên use case, ai bắt đầu, dữ liệu nhập và từng câu if / when / success / failure. Viết thứ tự tạo giao dịch so với thanh toán trước khi sửa mũi tên.',
    locate:'Trong tab Q2: actor → UI → controller/service; các cột Repository/Entity/Gateway ở phía phải. Alt ngoài kiểm tra điều kiện, alt trong là kết quả xử lý.',
    edits:[
      ['Kiểm tra đầu tiên',`isAvailable(${c.resource.toLowerCase()}Id, start, end)`,lib?'Bổ sung hasUnpaidFine(readerId) và countActiveLoans(readerId); guard phải đủ cả 3 điều kiện.':'Kiểm tra tài nguyên và khoảng thời gian; không chỉ xét status tổng quát.'],
      ['Thứ tự bắt buộc',stay?'check Room → pay Deposit → [Success] create Reservation':lib?'available + eligible → create Loan(Requested) → Librarian approves':'check available → create '+c.record+' → pay → confirm / cancel',stay?'Không đưa create ra trước payment. Failure chưa có Reservation để cancel.':lib?'Thay Payment Success/Failure bằng Approved/Rejected; không giữ gateway thanh toán của mẫu.':'Khác mẫu StayEase: đã tạo giao dịch trước khi trả tiền, nên failure cần cancel, save và release tài nguyên nếu đã giữ.'],
      ['Alt ngoài / trong',lib?'[available AND noUnpaidFine AND belowLimit] → [approved] / [rejected]':'[available] → [payment success] / [payment failure]', 'Nhánh lỗi trả thông báo rồi dừng; alt trong nằm gọn trong ngăn đủ điều kiện.'],
      ['Lưu và cập nhật',stay?'save(reservationWithDeposit) → Room=Booked':lib?'save Loan → Borrowed khi Approved':med?'save Payment → Appointment=Paid; chờ Receptionist xác nhận':'save Payment → Booking=Confirmed', 'Nói rõ entity nào được lưu. Giữ nhánh unavailable, failure/rejected và kết quả về UI.'],
    ],
    stop:['Đọc riêng đường thành công và từng đường thất bại từ trên xuống.','Instance chỉ nhận message sau lúc tạo; reply trả về bên gọi; message khớp method Q1.',common.fixed],
  };
  if(med)return{...common,title:'Q3 · State: thay bảng vòng đời, không đổi chữ trên Activity',
    read:'Đọc đối tượng cần theo dõi và toàn bộ state/event đề nêu. MediCare theo một Appointment, không chia lane Host/System/Guest.',
    locate:'Tab Q3 State là phần bổ sung vì mẫu mới chỉ có Activity. Giữ phong cách chữ/đường đơn giản nhưng dùng đúng state, initial, final và transition.',
    edits:[
      ['Các hộp state','Requested → Paid → Confirmed → InProgress → Completed','Nhánh Cancelled cho thất bại/hủy; không dùng Inspect/Pay fee làm tên state.'],
      ['Event trên cạnh','payFee; confirmAppointment; startExamination; finishExamination','Mỗi cạnh ghi event [guard] / effect khi cần.'],
      ['Nhánh hủy','payFail / releaseSlot; cancelAppointment [allowed] / releaseSlot','Chính sách hủy sau trả tiền phải ghi giả định. Không đặt releaseSlot trong exit của Requested vì sẽ chạy cả khi trả tiền thành công.'],
    ],stop:['Có ít nhất 6 chuyển mang event; không tính initial/final để thay thế.','Paid / Confirmed / Cancelled nhất quán với Q2.','Completed tạo đúng một MedicalRecord.']};
  return{...common,title:'Q3 · Activity: đổi lane, điều kiện phí và hai trạng thái cuối',
    read:'Đọc riêng use case trả tài nguyên/checkout. Gạch động từ, ghi ai làm từng việc và điều kiện nào cho phép hoàn tất.',
    locate:'Tab Q3 dùng thứ tự lane như mẫu: System/service | nhân viên | khách. Bắt đầu ở khách, đi qua kiểm tra, tính phí, thanh toán và lưu trạng thái.',
    edits:[
      ['Lane & action',`Host → ${c.staff}; Guest → ${c.actor}; inspect Room → inspect ${c.resource}`, 'Đổi cả tên lane và danh từ trong từng action. Loại luồng đăng nhập trong canvas gốc.'],
      ['Decision tính phí',lib?'late OR damaged':stay?'damage found':'additional fee', lib?'Trễ HOẶC hỏng đều tính Fine; không chỉ xét hỏng như mẫu phòng.':'Hai nhánh có/không phí gom bằng merge hình thoi; không dùng thanh join cho lựa chọn loại trừ nhau.'],
      ['Thanh toán',lib?'Fine > 0 mới yêu cầu trả Fine':stay?'remaining balance + Damage Fee (đã trừ Deposit)':'Số dư + phụ phí theo đề',lib?'Không Fine thì đi thẳng tới đóng Loan.':'Chỉ hoàn tất sau payment confirmed; chưa xác nhận thì chờ/thử lại theo giả định.'],
      ['Hai status cuối',stay?'Reservation=Completed; Room=Cleaning':lib?'Loan=Closed; BookCopy=Available nếu không hỏng':'Booking=Completed; Car=Available / Maintenance', 'Tên entity và status là hai việc khác nhau. Không đổi Room thành Car rồi giữ Cleaning nếu đề trả xe yêu cầu khác.'],
    ],stop:['Có initial/final, lane đúng người, nhánh có/không phí đầy đủ.','Action cập nhật và persist thuộc System/service.','Status của tài nguyên khác status của giao dịch.']};
}

export function swapMarkdown(c,kind,stage){
  const p=swapPlan(c,kind,stage);
  return [`## ${p.title}`,'',`**Đọc:** ${p.read}`,'',`**Tìm trên mẫu:** ${p.locate}`,'','| Vai trò | Chữ trong mẫu gốc | Đổi thành | Sửa kèm |','| --- | --- | --- | --- |',...p.anchors.map(r=>`| ${r.label} | ${r.from} | ${r.to} | ${r.where} |`),'',...p.edits.flatMap(([where,text,why])=>[`### ${where}`,'',text,'',why,'']),'### Dừng lại để soát','',...p.stop.map(s=>`- [ ] ${s}`),'',p.fixed,''];
}
