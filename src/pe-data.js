export const cases = {
  autogo: {
    title: 'AutoGo · Thuê xe', tag: 'Đề chính · Activity',
    system: 'AutoGo', actor: 'Customer', staff: 'Staff', resource: 'Car', record: 'Booking', payment: 'Payment',
    usecase: 'Create Booking and Pay Deposit', third: 'Activity', returnCase: 'Return Car',
    summary: 'Khách chọn xe và khoảng thời gian → kiểm tra trống → tạo booking → trả cọc → xác nhận hoặc hủy. Trả xe: nhân viên kiểm tra, tính phụ phí và cập nhật trạng thái.',
    relations: ['Customer, Staff kế thừa User.', 'Customer 1 — 0..* Booking; mỗi Booking thuộc 1 Customer.', 'Car 1 — 0..* Booking theo thời gian; mỗi Booking gắn đúng 1 Car.', 'Booking 1 — 1..* Payment theo yêu cầu đề; có loại Deposit / Final. Khi mô hình hóa cả trước lúc trả tiền, ghi giả định 0..* ở trạng thái Pending.', 'Composition Booking–Payment chỉ dùng khi giả định Payment phụ thuộc vòng đời Booking; ghi rõ giả định.'],
    branches: ['[car available] / [car unavailable]', '[payment success] / [payment failure]', 'Activity: [additional fee > 0] / [no additional fee]'],
    statuses: 'Pending → Confirmed / Cancelled → InProgress → Completed',
    sample: 'Customers can create bookings. Each booking is linked to exactly one car. A booking may involve one or more payments such as deposit or final payment. Check car availability for the selected period. Confirm the booking on payment success; cancel on payment failure. Staff inspect the returned car and the system calculates additional fees.',
    source: 'SWD392_PE_SP26_AutoGo_CarRental_Exam.docx; Đề thi thật Spring 2026/Đề.pdf',
  },
  library: {
    title: 'FPT Library · Mượn sách', tag: 'Đề luyện B · Activity',
    system: 'Library', actor: 'Reader', staff: 'Librarian', resource: 'BookCopy', record: 'Loan', payment: 'Fine',
    usecase: 'Borrow Book', third: 'Activity', returnCase: 'Return Book',
    summary: 'Kiểm tra bản sách còn và điều kiện bạn đọc (không nợ phạt, chưa vượt hạn mức) → tạo yêu cầu → thủ thư duyệt/giao sách. Khi trả: phạt nếu muộn hoặc hỏng; trả phạt trước khi đóng loan.',
    relations: ['Student, Lecturer, Librarian là các kiểu User; có thể thêm Reader trừu tượng giữa User và Student/Lecturer.', 'Book 1 chứa 1..* BookCopy; nêu giả định vòng đời nếu dùng composition.', 'Reader 1 — 0..* Loan; BookCopy 1 — 0..* Loan theo thời gian.', 'Loan 1 — 0..1 Fine; không sao chép 1..* Payment của bài thuê xe.', 'Loan có Requested, Approved, Borrowed, Returned, Overdue, Closed.'],
    branches: ['[copy available AND eligible] / [unavailable OR ineligible]', '[approved] / [rejected]', 'Activity: [late OR damaged] / [on time AND undamaged]'],
    statuses: 'Requested → Approved → Borrowed → Returned / Overdue → Closed',
    sample: 'Student, Lecturer and Librarian are specialized types of User. A Book contains multiple BookCopy objects. A Reader can create multiple Loan objects. A Loan may be associated with at most one Fine. Check copy availability and reader eligibility: no unpaid fines and below borrowing limit. Librarian approves or rejects the request. When returned late or damaged, pay the fine before the loan is closed.',
    source: 'SWD392_Practice_ExamB_FPT_Library.docx',
  },
  medicare: {
    title: 'MediCare · Đặt lịch khám', tag: 'Đề luyện C · State',
    system: 'MediCare', actor: 'Patient', staff: 'Receptionist', resource: 'TimeSlot', record: 'Appointment', payment: 'Payment',
    usecase: 'Book Appointment and Pay Fee', third: 'State', returnCase: 'Appointment Lifecycle',
    summary: 'Kiểm tra slot → tạo lịch → trả phí → lễ tân xác nhận. Thất bại phải hủy và giải phóng slot. Câu 3 vẽ vòng đời Appointment, không vẽ quy trình trả xe.',
    relations: ['Patient, Receptionist, Doctor kế thừa User.', 'Doctor 1 — 1 Schedule; Schedule 1 chứa 1..* TimeSlot.', 'Patient 1 — 0..* Appointment; mỗi Appointment gắn 1 TimeSlot và 1 Payment.', 'Appointment hoàn thành có đúng 1 MedicalRecord; trước hoàn thành có thể 0..1, ghi ràng buộc {Completed implies 1}.', 'MedicalRecord composition 1..* PrescriptionItem theo đề; không thêm giao thuốc hoặc bảo hiểm.'],
    branches: ['[slot available] / [slot unavailable]', '[payment success] / [payment failure → cancel + release slot]', 'State: payFee, payFail, confirmAppointment, startExamination, finishExamination, cancelAppointment'],
    statuses: 'Requested → Paid → Confirmed → InProgress → Completed; nhánh Cancelled',
    sample: 'Patient, Receptionist and Doctor inherit User. A Doctor has one Schedule containing multiple TimeSlot objects. An Appointment has exactly one Payment. A completed Appointment produces exactly one MedicalRecord composed of multiple PrescriptionItem objects. Check time slot availability. On payment failure cancel and release the time slot. State Diagram: Requested, Paid, Confirmed, InProgress, Completed, Cancelled.',
    source: 'SWD392_Practice_ExamC_MediCare_Clinic.docx',
  },
};

export const keywordRules = [
  { terms: ['specialized', 'inherit', 'is a', 'kế thừa'], title: 'Kế thừa / Generalization', diagram: 'Class', action: 'Lớp con → lớp cha: nét liền, tam giác rỗng hướng về User. Không vẽ mũi tên association thay thế.', example: 'Customer —▷ User; Staff —▷ User' },
  { terms: ['exactly one', 'one and only', 'đúng một'], title: 'Đúng 1', diagram: 'Class', action: 'Gắn multiplicity 1 ở đầu đối tượng được nhắc tới. Đọc cả chiều ngược trước khi ghi đầu còn lại.', example: 'Each Booking linked to exactly one Car → ghi 1 ở đầu Car.' },
  { terms: ['multiple', 'many', 'nhiều'], title: 'Nhiều đối tượng', diagram: 'Class', action: 'Xét có thể chưa có đối tượng hay bắt buộc có ít nhất một: 0..* hoặc 1..*. Từ multiple một mình chưa đủ kết luận vòng đời.', example: 'Customer can create multiple Bookings → 0..* ở đầu Booking.' },
  { terms: ['at most one', 'optional', 'tối đa một'], title: 'Có thể không có / tối đa 1', diagram: 'Class', action: 'Dùng 0..1, không dùng 1..*.', example: 'Loan may have at most one Fine → 0..1 ở đầu Fine.' },
  { terms: ['contains', 'composed', 'part of', 'chứa'], title: 'Quan hệ whole–part', diagram: 'Class', action: 'Chỉ dùng composition (thoi đặc tại whole) nếu part phụ thuộc vòng đời whole; aggregation dùng thoi rỗng khi part tồn tại độc lập. Ghi giả định khi đề chưa nói rõ.', example: 'MedicalRecord ◆— PrescriptionItem; không biến mọi has-a thành composition.' },
  { terms: ['repository', 'generic', 'data access'], title: 'Repository Pattern bắt buộc', diagram: 'Class + Sequence', action: 'Repository<T> có findById/save. ConcreteRepository realization nét đứt tam giác rỗng → interface; Service dependency → Repository. Sequence phải gọi phương thức repository cụ thể.', example: 'CarRepository.isAvailable(id, start, end), BookingRepository.save(booking)' },
  { terms: ['available', 'availability', 'eligible', 'điều kiện'], title: 'Nhánh kiểm tra đầu vào', diagram: 'Sequence', action: 'Vẽ alt với guard thành công/thất bại. Nhánh thất bại trả thông báo và không tạo giao dịch. Library phải kiểm tra cả hạn mức và nợ phạt.', example: '[available AND eligible] / [unavailable OR ineligible]' },
  { terms: ['payment', 'deposit', 'pay fee', 'thanh toán'], title: 'Nhánh kết quả thanh toán', diagram: 'Sequence', action: 'Tạo bản ghi Pending trước khi trả tiền theo đề. alt thành công: lưu payment + xác nhận; thất bại: hủy và lưu trạng thái, giải phóng tài nguyên nếu đã giữ.', example: '[payment success] / [payment failure]' },
  { terms: ['approve', 'approval', 'reject', 'duyệt'], title: 'Duyệt hoặc từ chối', diagram: 'Sequence', action: 'Đặt actor phê duyệt đúng vai trò. Với Library, sau Requested cần alt Approved/Rejected và chỉ giao sách ở nhánh được duyệt.', example: 'Librarian → UI → LoanService.approve(loanId)' },
  { terms: ['inspect', 'late', 'damaged', 'additional', 'fine', 'phụ phí'], title: 'Kiểm tra và tính phí', diagram: 'Activity', action: 'Actor nhập kết quả; Service tính phí. Decision tách có/không phí, merge trước khi hoàn tất. Nếu thu phí chưa thành công thì chưa đóng giao dịch.', example: '[late OR damaged] → calculateFine() → collectFine()' },
  { terms: ['swimlane', 'level 2', 'activity', 'return car', 'return book'], title: 'Activity Level 2', diagram: 'Activity', action: 'Phân làn theo Actor/Role và Component/Service. Tối thiểu Staff/Librarian và System; có initial, final, decision + guard và cập nhật trạng thái.', example: 'Staff.inspect() → BookingService.calculateFee() → completeBooking()' },
  { terms: ['state diagram', 'lifecycle', 'state-chart', 'vòng đời'], title: 'Vòng đời một entity', diagram: 'State', action: 'Hộp ghi trạng thái; cạnh ghi event [guard] / action. MediCare cần ít nhất 6 chuyển trạng thái, initial/final và nhánh Cancelled hoặc PaymentFailed.', example: 'Requested —payFee→ Paid —confirmAppointment→ Confirmed' },
];

export const checklist = [
  'Đọc đúng loại diagram câu 3; ghi kiến trúc Layered nhất quán.',
  'Class có thuộc tính, kiểu dữ liệu, phương thức, kế thừa và đủ multiplicity hai đầu.',
  'Repository<T>, realization và dependency có hướng đúng.',
  'Sequence có UI, Service/Controller, Repository và domain entity; tên method khớp Class.',
  'Sequence có cả nhánh không sẵn sàng và thất bại thanh toán / từ chối duyệt.',
  'Không xác nhận khi trả tiền lỗi; lưu trạng thái và giải phóng tài nguyên đúng nghiệp vụ.',
  'Activity có phân làn Actor + Service, decision/merge, start/end; hoặc State đủ event và nhánh hủy.',
  'Tên entity, trạng thái và business rule thống nhất giữa cả 3 hình.',
  'Ghi giả định về vòng đời, cardinality hoặc bước xử lý chưa được đề quy định.',
  'Mở thử .drawio offline, xuất hình vào bài nộp; kiểm tra tên và định dạng nộp theo đề thực tế.',
];

export const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
export function matchKeywords(text) {
  const input = normalize(text);
  return keywordRules.filter(rule => rule.terms.some(term => input.includes(normalize(term))));
}
