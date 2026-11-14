# AutoGo — đọc đề và đổi chữ nhanh

Bộ .drawio được dựng lại theo drawio_thiet_ke_chuan.drawio: Class từng dòng, Sequence có lifeline/activation/alt, Activity có System/nhân viên/khách. State bổ sung riêng cho MediCare theo đề.

1. Chọn đúng đề và Q. Đọc các câu trích dẫn để nhận diện yêu cầu.
2. Dùng bảng tên: tìm chữ bằng Ctrl+F; nhấp đúp đúng tiêu đề/dòng để sửa. Đổi cùng Entity, Repository, ID, message và lane.
3. Dùng bảng sửa luồng. Tên đúng chưa đủ nếu số lượng, guard, thứ tự tạo và trạng thái khác đề.

## Q1 · Thay tên lớp, rồi sửa thuộc tính và quan hệ

**Đọc:** Đọc Business Overview để lấy người / tài nguyên / giao dịch / tiền. Đọc Requirements Q1 để lấy kế thừa, số lượng và tầng Service/Repository.

**Tìm trên mẫu:** Trong tab Q1, đi từ Controller → Service → generic interface → repositories → entities. Các class có từng dòng thuộc tính/method riêng như mẫu mới.

| Vai trò | Chữ trong mẫu gốc | Đổi thành | Sửa kèm |
| --- | --- | --- | --- |
| Tên hệ thống | StayEase | AutoGo | Tiêu đề, UI; không tự tạo class tên hệ thống. |
| Người dùng chính | Customer | Customer | Entity, Repository, lifeline, lane và tham số actorId. |
| Người xử lý | Host | Staff | Entity, Repository, quan hệ kế thừa và lane kiểm tra/duyệt. |
| Tài nguyên | Room | Car | Entity + Repository + field ID + availability + trạng thái cuối. |
| Giao dịch | Reservation | Booking | Entity + Repository + Service/Controller nếu đề cho phép + save/update. |
| Tiền / phạt | Payment | Payment | Entity + Repository + amount + guard trả tiền; Fine không luôn tồn tại. |

### Entity / Repository

Room → Car; RoomRepository → CarRepository

Đổi cả roomId → carId; đọc lại kiểu dữ liệu và method, không chỉ thay tiêu đề.

### Bội số gần Payment

1..* Payment

“one or more” → 1..*. Với AutoGo Pending có thể chưa trả tiền: ghi rõ ràng buộc vòng đời.

### Đầu thoi / tam giác

Booking ◆— Payment (giả định)

Tam giác về lớp cha/interface; thoi về whole. Không dùng has/contains để đoán vòng đời.

### Dừng lại để soát

- [ ] Tên class ở Q1 khớp receiver và method ở Q2.
- [ ] Mỗi đường có nghĩa đúng và bội số theo đề; không mang quan hệ phòng sang sách/lịch khám.
- [ ] User là lớp cha của Customer và Staff. Booking có Payment loại Deposit / Final.

User là lớp cha của Customer và Staff. Booking có Payment loại Deposit / Final.

### Câu đề cần đọc và việc cần làm

> The classes Customer and Staff are specialized types of User and must inherit from it.

**Đưa vào hình:** Kéo 3 hình Class, đặt tên User, Customer, Staff.

> A customer can create multiple bookings, while each booking is linked to exactly one car.

**Đưa vào hình:** Tạo thêm Booking và Car. Nối Customer—Booking bằng association nét liền.

> A booking may involve one or more payments, such as a deposit or final payment.

**Đưa vào hình:** Tạo Payment với - id: Long, - amount: Decimal, - type: PaymentType, - status: String; thêm + markPaid(): void.

> Repository classes must implement a generic repository interface.

**Đưa vào hình:** Tạo một hộp interface tên «interface» Repository<T>, ghi + findById(id: Long): T và + save(entity: T): T.

> Multiplicity, attributes, and methods should be defined clearly and reasonably.

**Đưa vào hình:** Booking: id, startAt, endAt, status; Car: id, price, status; Payment: amount, type, status. Dùng dấu - cho thuộc tính và + cho method công khai.

## Q2 · Đổi cột, lời gọi, guard rồi kiểm tra thứ tự

**Đọc:** Đọc tên use case, ai bắt đầu, dữ liệu nhập và từng câu if / when / success / failure. Viết thứ tự tạo giao dịch so với thanh toán trước khi sửa mũi tên.

**Tìm trên mẫu:** Trong tab Q2: actor → UI → controller/service; các cột Repository/Entity/Gateway ở phía phải. Alt ngoài kiểm tra điều kiện, alt trong là kết quả xử lý.

| Vai trò | Chữ trong mẫu gốc | Đổi thành | Sửa kèm |
| --- | --- | --- | --- |
| Tên hệ thống | StayEase | AutoGo | Tiêu đề, UI; không tự tạo class tên hệ thống. |
| Người dùng chính | Customer | Customer | Entity, Repository, lifeline, lane và tham số actorId. |
| Người xử lý | Host | Staff | Entity, Repository, quan hệ kế thừa và lane kiểm tra/duyệt. |
| Tài nguyên | Room | Car | Entity + Repository + field ID + availability + trạng thái cuối. |
| Giao dịch | Reservation | Booking | Entity + Repository + Service/Controller nếu đề cho phép + save/update. |
| Tiền / phạt | Payment | Payment | Entity + Repository + amount + guard trả tiền; Fine không luôn tồn tại. |

### Kiểm tra đầu tiên

isAvailable(carId, start, end)

Kiểm tra tài nguyên và khoảng thời gian; không chỉ xét status tổng quát.

### Thứ tự bắt buộc

check available → create Booking → pay → confirm / cancel

Khác mẫu StayEase: đã tạo giao dịch trước khi trả tiền, nên failure cần cancel, save và release tài nguyên nếu đã giữ.

### Alt ngoài / trong

[available] → [payment success] / [payment failure]

Nhánh lỗi trả thông báo rồi dừng; alt trong nằm gọn trong ngăn đủ điều kiện.

### Lưu và cập nhật

save Payment → Booking=Confirmed

Nói rõ entity nào được lưu. Giữ nhánh unavailable, failure/rejected và kết quả về UI.

### Dừng lại để soát

- [ ] Đọc riêng đường thành công và từng đường thất bại từ trên xuống.
- [ ] Instance chỉ nhận message sau lúc tạo; reply trả về bên gọi; message khớp method Q1.
- [ ] User là lớp cha của Customer và Staff. Booking có Payment loại Deposit / Final.

User là lớp cha của Customer và Staff. Booking có Payment loại Deposit / Final.

### Câu đề cần đọc và việc cần làm

> The process starts when the customer selects a car and requests to make a booking. The system checks the availability of the car for the selected period before proceeding.

**Đưa vào hình:** Xếp lifeline từ trái sang phải: Customer, Booking UI, BookingService, CarRepository, BookingRepository, PaymentRepository, :Car, :Booking và PaymentGateway / :Payment.

> If the car is available, a booking is created and the customer proceeds to payment.

**Đưa vào hình:** Thêm Combined Fragment ghi alt, bao quanh phần xử lý sau kiểm tra. Chia hai ngăn bằng đường ngang nét đứt.

> Depending on the payment result, the booking is either confirmed or cancelled.

**Đưa vào hình:** Bên trong [available], thêm alt [payment success] / [payment failure].

## Q3 · Activity: đổi lane, điều kiện phí và hai trạng thái cuối

**Đọc:** Đọc riêng use case trả tài nguyên/checkout. Gạch động từ, ghi ai làm từng việc và điều kiện nào cho phép hoàn tất.

**Tìm trên mẫu:** Tab Q3 dùng thứ tự lane như mẫu: System/service | nhân viên | khách. Bắt đầu ở khách, đi qua kiểm tra, tính phí, thanh toán và lưu trạng thái.

| Vai trò | Chữ trong mẫu gốc | Đổi thành | Sửa kèm |
| --- | --- | --- | --- |
| Tên hệ thống | StayEase | AutoGo | Tiêu đề, UI; không tự tạo class tên hệ thống. |
| Người dùng chính | Customer | Customer | Entity, Repository, lifeline, lane và tham số actorId. |
| Người xử lý | Host | Staff | Entity, Repository, quan hệ kế thừa và lane kiểm tra/duyệt. |
| Tài nguyên | Room | Car | Entity + Repository + field ID + availability + trạng thái cuối. |
| Giao dịch | Reservation | Booking | Entity + Repository + Service/Controller nếu đề cho phép + save/update. |
| Tiền / phạt | Payment | Payment | Entity + Repository + amount + guard trả tiền; Fine không luôn tồn tại. |

### Lane & action

Host → Staff; Guest → Customer; inspect Room → inspect Car

Đổi cả tên lane và danh từ trong từng action. Loại luồng đăng nhập trong canvas gốc.

### Decision tính phí

additional fee

Hai nhánh có/không phí gom bằng merge hình thoi; không dùng thanh join cho lựa chọn loại trừ nhau.

### Thanh toán

Số dư + phụ phí theo đề

Chỉ hoàn tất sau payment confirmed; chưa xác nhận thì chờ/thử lại theo giả định.

### Hai status cuối

Booking=Completed; Car=Available / Maintenance

Tên entity và status là hai việc khác nhau. Không đổi Room thành Car rồi giữ Cleaning nếu đề trả xe yêu cầu khác.

### Dừng lại để soát

- [ ] Có initial/final, lane đúng người, nhánh có/không phí đầy đủ.
- [ ] Action cập nhật và persist thuộc System/service.
- [ ] Status của tài nguyên khác status của giao dịch.

User là lớp cha của Customer và Staff. Booking có Payment loại Deposit / Final.

### Câu đề cần đọc và việc cần làm

> The diagram must include at least two swimlanes representing Staff and System responsibilities.

**Đưa vào hình:** Tạo ít nhất hai swimlane: Staff và BookingService / System. Có thể thêm Customer để thể hiện trả xe và trả tiền.

> Decision nodes must be used to determine whether additional fees are applied.

**Đưa vào hình:** Thêm hình thoi “Additional fee?” trong làn Service.

> The workflow must clearly show the completion of the booking and update of system status.

**Đưa vào hình:** Nếu còn tiền phải trả: yêu cầu thanh toán, kiểm tra [success] trước khi hoàn tất; giả định lỗi thì chờ/thử lại.
