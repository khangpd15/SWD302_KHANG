# MediCare — đọc đề và đổi chữ nhanh

Bộ .drawio được dựng lại theo drawio_thiet_ke_chuan.drawio: Class từng dòng, Sequence có lifeline/activation/alt, Activity có System/nhân viên/khách. State bổ sung riêng cho MediCare theo đề.

1. Chọn đúng đề và Q. Đọc các câu trích dẫn để nhận diện yêu cầu.
2. Dùng bảng tên: tìm chữ bằng Ctrl+F; nhấp đúp đúng tiêu đề/dòng để sửa. Đổi cùng Entity, Repository, ID, message và lane.
3. Dùng bảng sửa luồng. Tên đúng chưa đủ nếu số lượng, guard, thứ tự tạo và trạng thái khác đề.

## Q1 · Thay tên lớp, rồi sửa thuộc tính và quan hệ

**Đọc:** Đọc Business Overview để lấy người / tài nguyên / giao dịch / tiền. Đọc Requirements Q1 để lấy kế thừa, số lượng và tầng Service/Repository.

**Tìm trên mẫu:** Trong tab Q1, đi từ Controller → Service → generic interface → repositories → entities. Các class có từng dòng thuộc tính/method riêng như mẫu mới.

| Vai trò | Chữ trong mẫu gốc | Đổi thành | Sửa kèm |
| --- | --- | --- | --- |
| Tên hệ thống | StayEase | MediCare | Tiêu đề, UI; không tự tạo class tên hệ thống. |
| Người dùng chính | Customer | Patient | Entity, Repository, lifeline, lane và tham số actorId. |
| Người xử lý | Host | Receptionist | Entity, Repository, quan hệ kế thừa và lane kiểm tra/duyệt. |
| Tài nguyên | Room | TimeSlot | Entity + Repository + field ID + availability + trạng thái cuối. |
| Giao dịch | Reservation | Appointment | Entity + Repository + Service/Controller nếu đề cho phép + save/update. |
| Tiền / phạt | Payment | Payment | Entity + Repository + amount + guard trả tiền; Fine không luôn tồn tại. |

### Entity / Repository

Room → TimeSlot; RoomRepository → TimeSlotRepository

Đổi cả roomId → timeSlotId; đọc lại kiểu dữ liệu và method, không chỉ thay tiêu đề.

### Bội số gần Payment

1 Payment

MedicalRecord là 0..1 trước hoàn thành; thêm {Completed implies 1}.

### Đầu thoi / tam giác

MedicalRecord ◆— PrescriptionItem

Tam giác về lớp cha/interface; thoi về whole. Không dùng has/contains để đoán vòng đời.

### Dừng lại để soát

- [ ] Tên class ở Q1 khớp receiver và method ở Q2.
- [ ] Mỗi đường có nghĩa đúng và bội số theo đề; không mang quan hệ phòng sang sách/lịch khám.
- [ ] Giữ thêm Doctor, Schedule, MedicalRecord, PrescriptionItem. Q3 là State của Appointment.

Giữ thêm Doctor, Schedule, MedicalRecord, PrescriptionItem. Q3 là State của Appointment.

### Câu đề cần đọc và việc cần làm

> Patient, Receptionist, and Doctor must be specialized types of User using inheritance.

**Đưa vào hình:** Tạo User với id, name, email và các class Patient, Receptionist, Doctor.

> A Doctor has one Schedule, and a Schedule contains multiple TimeSlot objects.

**Đưa vào hình:** Tạo Schedule và TimeSlot; TimeSlot có startAt, endAt, status.

> Each Appointment is linked to exactly one TimeSlot and is associated with exactly one Payment.

**Đưa vào hình:** Tạo Appointment: id, status; Payment: amount, status. Patient 1—0..* Appointment.

> A completed Appointment produces exactly one MedicalRecord, which is composed of multiple PrescriptionItem objects.

**Đưa vào hình:** Tạo MedicalRecord với diagnosis và issue(); PrescriptionItem với medicine, dose.

> Repository classes must implement a generic Repository<T> interface.

**Đưa vào hình:** Tạo một hộp interface tên «interface» Repository<T>, ghi + findById(id: Long): T và + save(entity: T): T.

## Q2 · Đổi cột, lời gọi, guard rồi kiểm tra thứ tự

**Đọc:** Đọc tên use case, ai bắt đầu, dữ liệu nhập và từng câu if / when / success / failure. Viết thứ tự tạo giao dịch so với thanh toán trước khi sửa mũi tên.

**Tìm trên mẫu:** Trong tab Q2: actor → UI → controller/service; các cột Repository/Entity/Gateway ở phía phải. Alt ngoài kiểm tra điều kiện, alt trong là kết quả xử lý.

| Vai trò | Chữ trong mẫu gốc | Đổi thành | Sửa kèm |
| --- | --- | --- | --- |
| Tên hệ thống | StayEase | MediCare | Tiêu đề, UI; không tự tạo class tên hệ thống. |
| Người dùng chính | Customer | Patient | Entity, Repository, lifeline, lane và tham số actorId. |
| Người xử lý | Host | Receptionist | Entity, Repository, quan hệ kế thừa và lane kiểm tra/duyệt. |
| Tài nguyên | Room | TimeSlot | Entity + Repository + field ID + availability + trạng thái cuối. |
| Giao dịch | Reservation | Appointment | Entity + Repository + Service/Controller nếu đề cho phép + save/update. |
| Tiền / phạt | Payment | Payment | Entity + Repository + amount + guard trả tiền; Fine không luôn tồn tại. |

### Kiểm tra đầu tiên

isAvailable(timeslotId, start, end)

Kiểm tra tài nguyên và khoảng thời gian; không chỉ xét status tổng quát.

### Thứ tự bắt buộc

check available → create Appointment → pay → confirm / cancel

Khác mẫu StayEase: đã tạo giao dịch trước khi trả tiền, nên failure cần cancel, save và release tài nguyên nếu đã giữ.

### Alt ngoài / trong

[available] → [payment success] / [payment failure]

Nhánh lỗi trả thông báo rồi dừng; alt trong nằm gọn trong ngăn đủ điều kiện.

### Lưu và cập nhật

save Payment → Appointment=Paid; chờ Receptionist xác nhận

Nói rõ entity nào được lưu. Giữ nhánh unavailable, failure/rejected và kết quả về UI.

### Dừng lại để soát

- [ ] Đọc riêng đường thành công và từng đường thất bại từ trên xuống.
- [ ] Instance chỉ nhận message sau lúc tạo; reply trả về bên gọi; message khớp method Q1.
- [ ] Giữ thêm Doctor, Schedule, MedicalRecord, PrescriptionItem. Q3 là State của Appointment.

Giữ thêm Doctor, Schedule, MedicalRecord, PrescriptionItem. Q3 là State của Appointment.

### Câu đề cần đọc và việc cần làm

> The process starts when the patient selects a doctor and a time slot. The system checks the availability of the time slot before proceeding.

**Đưa vào hình:** Tạo Patient, Patient UI, AppointmentService, TimeSlotRepository, AppointmentRepository, PaymentRepository và các entity Appointment, TimeSlot, Payment.

> If the time slot is available, an appointment is created and the patient proceeds to payment.

**Đưa vào hình:** Trong [available], Service tạo :Appointment(Requested/Pending) và gọi save(appointment). Ghi rõ ánh xạ Pending với Requested nếu dùng tên khác.

> Depending on the payment result, the appointment is either confirmed or cancelled and the time slot is released.

**Đưa vào hình:** Success: Payment.markPaid(); save(payment); Appointment.markPaid(); save(appointment).

## Q3 · State: thay bảng vòng đời, không đổi chữ trên Activity

**Đọc:** Đọc đối tượng cần theo dõi và toàn bộ state/event đề nêu. MediCare theo một Appointment, không chia lane Host/System/Guest.

**Tìm trên mẫu:** Tab Q3 State là phần bổ sung vì mẫu mới chỉ có Activity. Giữ phong cách chữ/đường đơn giản nhưng dùng đúng state, initial, final và transition.

| Vai trò | Chữ trong mẫu gốc | Đổi thành | Sửa kèm |
| --- | --- | --- | --- |
| Tên hệ thống | StayEase | MediCare | Tiêu đề, UI; không tự tạo class tên hệ thống. |
| Người dùng chính | Customer | Patient | Entity, Repository, lifeline, lane và tham số actorId. |
| Người xử lý | Host | Receptionist | Entity, Repository, quan hệ kế thừa và lane kiểm tra/duyệt. |
| Tài nguyên | Room | TimeSlot | Entity + Repository + field ID + availability + trạng thái cuối. |
| Giao dịch | Reservation | Appointment | Entity + Repository + Service/Controller nếu đề cho phép + save/update. |
| Tiền / phạt | Payment | Payment | Entity + Repository + amount + guard trả tiền; Fine không luôn tồn tại. |

### Các hộp state

Requested → Paid → Confirmed → InProgress → Completed

Nhánh Cancelled cho thất bại/hủy; không dùng Inspect/Pay fee làm tên state.

### Event trên cạnh

payFee; confirmAppointment; startExamination; finishExamination

Mỗi cạnh ghi event [guard] / effect khi cần.

### Nhánh hủy

payFail / releaseSlot; cancelAppointment [allowed] / releaseSlot

Chính sách hủy sau trả tiền phải ghi giả định. Không đặt releaseSlot trong exit của Requested vì sẽ chạy cả khi trả tiền thành công.

### Dừng lại để soát

- [ ] Có ít nhất 6 chuyển mang event; không tính initial/final để thay thế.
- [ ] Paid / Confirmed / Cancelled nhất quán với Q2.
- [ ] Completed tạo đúng một MedicalRecord.

Giữ thêm Doctor, Schedule, MedicalRecord, PrescriptionItem. Q3 là State của Appointment.

### Câu đề cần đọc và việc cần làm

> You are required to design a State Diagram for the Appointment entity, describing the full lifecycle of an appointment.

**Đưa vào hình:** Ghi tiêu đề Appointment Lifecycle. Không chia swimlane Staff/System ở State Diagram.

> At least six state transitions must be shown, each with a clear triggering event, such as:

**Đưa vào hình:** Requested → Paid ghi payFee [success]; Paid → Confirmed ghi confirmAppointment.

> At least one branching path must represent payment failure or appointment cancellation.

**Đưa vào hình:** Từ Requested vẽ payFail tới Cancelled (hoặc PaymentFailed nếu chọn mô hình đó).
