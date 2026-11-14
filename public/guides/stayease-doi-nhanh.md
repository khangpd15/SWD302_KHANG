# StayEase — đọc đề và đổi chữ nhanh

Bộ .drawio được dựng lại theo drawio_thiet_ke_chuan.drawio: Class từng dòng, Sequence có lifeline/activation/alt, Activity có System/nhân viên/khách. State bổ sung riêng cho MediCare theo đề.

1. Chọn đúng đề và Q. Đọc các câu trích dẫn để nhận diện yêu cầu.
2. Dùng bảng tên: tìm chữ bằng Ctrl+F; nhấp đúp đúng tiêu đề/dòng để sửa. Đổi cùng Entity, Repository, ID, message và lane.
3. Dùng bảng sửa luồng. Tên đúng chưa đủ nếu số lượng, guard, thứ tự tạo và trạng thái khác đề.

## Q1 · Thay tên lớp, rồi sửa thuộc tính và quan hệ

**Đọc:** Đọc Business Overview để lấy người / tài nguyên / giao dịch / tiền. Đọc Requirements Q1 để lấy kế thừa, số lượng và tầng Service/Repository.

**Tìm trên mẫu:** Trong tab Q1, đi từ Controller → Service → generic interface → repositories → entities. Các class có từng dòng thuộc tính/method riêng như mẫu mới.

| Vai trò | Chữ trong mẫu gốc | Đổi thành | Sửa kèm |
| --- | --- | --- | --- |
| Tên hệ thống | StayEase | StayEase | Tiêu đề, UI; không tự tạo class tên hệ thống. |
| Người dùng chính | Customer | Customer | Entity, Repository, lifeline, lane và tham số actorId. |
| Người xử lý | Host | Host | Entity, Repository, quan hệ kế thừa và lane kiểm tra/duyệt. |
| Tài nguyên | Room | Room | Entity + Repository + field ID + availability + trạng thái cuối. |
| Giao dịch | Reservation | Reservation | Entity + Repository + Service/Controller nếu đề cho phép + save/update. |
| Tiền / phạt | Payment | Payment | Entity + Repository + amount + guard trả tiền; Fine không luôn tồn tại. |

### Entity / Repository

Room → Room; RoomRepository → RoomRepository

Đổi cả roomId → roomId; đọc lại kiểu dữ liệu và method, không chỉ thay tiêu đề.

### Bội số gần Payment

1..* Payment

“one or more” → 1..*. Với AutoGo Pending có thể chưa trả tiền: ghi rõ ràng buộc vòng đời.

### Đầu thoi / tam giác

Reservation ◆— Payment

Tam giác về lớp cha/interface; thoi về whole. Không dùng has/contains để đoán vòng đời.

### Dừng lại để soát

- [ ] Tên class ở Q1 khớp receiver và method ở Q2.
- [ ] Mỗi đường có nghĩa đúng và bội số theo đề; không mang quan hệ phòng sang sách/lịch khám.
- [ ] Đề gọi đúng BookingController, BookingService, IGenericRepository<T>: giữ các tên bắt buộc này. Guest ở checkout là Customer.

Đề gọi đúng BookingController, BookingService, IGenericRepository<T>: giữ các tên bắt buộc này. Guest ở checkout là Customer.

### Câu đề cần đọc và việc cần làm

> The classes Customer and Host (Property Owner) are specialized types of User and must inherit from it.

**Đưa vào hình:** Tạo User {abstract}: id, fullName, email.

> A customer can create multiple reservations, while each reservation is linked to exactly one room.

**Đưa vào hình:** Room có id, location, nightlyRate, status; Reservation có id, startDate, endDate, totalAmount, depositAmount, status.

> A reservation involves one or more payments (such as a 'Deposit' or 'Final Payment'). A payment record cannot exist without a corresponding reservation.

**Đưa vào hình:** Tạo Payment: id, amount, type, status, gatewayRef; type là Deposit hoặc FinalPayment.

> This service class depends on repository interfaces to interact with data.

**Đưa vào hình:** Tạo BookingService: checkAvailability(...), createReservation(...).

> Multiplicity, attributes, and methods should be defined clearly and reasonably for each class (e.g., status for Rooms, totalAmount for Reservations).

**Đưa vào hình:** RoomRepository: getById, isAvailable(roomId,start,end), updateStatus. ReservationRepository: save(reservationWithDeposit).

## Q2 · Đổi cột, lời gọi, guard rồi kiểm tra thứ tự

**Đọc:** Đọc tên use case, ai bắt đầu, dữ liệu nhập và từng câu if / when / success / failure. Viết thứ tự tạo giao dịch so với thanh toán trước khi sửa mũi tên.

**Tìm trên mẫu:** Trong tab Q2: actor → UI → controller/service; các cột Repository/Entity/Gateway ở phía phải. Alt ngoài kiểm tra điều kiện, alt trong là kết quả xử lý.

| Vai trò | Chữ trong mẫu gốc | Đổi thành | Sửa kèm |
| --- | --- | --- | --- |
| Tên hệ thống | StayEase | StayEase | Tiêu đề, UI; không tự tạo class tên hệ thống. |
| Người dùng chính | Customer | Customer | Entity, Repository, lifeline, lane và tham số actorId. |
| Người xử lý | Host | Host | Entity, Repository, quan hệ kế thừa và lane kiểm tra/duyệt. |
| Tài nguyên | Room | Room | Entity + Repository + field ID + availability + trạng thái cuối. |
| Giao dịch | Reservation | Reservation | Entity + Repository + Service/Controller nếu đề cho phép + save/update. |
| Tiền / phạt | Payment | Payment | Entity + Repository + amount + guard trả tiền; Fine không luôn tồn tại. |

### Kiểm tra đầu tiên

isAvailable(roomId, start, end)

Kiểm tra tài nguyên và khoảng thời gian; không chỉ xét status tổng quát.

### Thứ tự bắt buộc

check Room → pay Deposit → [Success] create Reservation

Không đưa create ra trước payment. Failure chưa có Reservation để cancel.

### Alt ngoài / trong

[available] → [payment success] / [payment failure]

Nhánh lỗi trả thông báo rồi dừng; alt trong nằm gọn trong ngăn đủ điều kiện.

### Lưu và cập nhật

save(reservationWithDeposit) → Room=Booked

Nói rõ entity nào được lưu. Giữ nhánh unavailable, failure/rejected và kết quả về UI.

### Dừng lại để soát

- [ ] Đọc riêng đường thành công và từng đường thất bại từ trên xuống.
- [ ] Instance chỉ nhận message sau lúc tạo; reply trả về bên gọi; message khớp method Q1.
- [ ] Đề gọi đúng BookingController, BookingService, IGenericRepository<T>: giữ các tên bắt buộc này. Guest ở checkout là Customer.

Đề gọi đúng BookingController, BookingService, IGenericRepository<T>: giữ các tên bắt buộc này. Guest ở checkout là Customer.

### Câu đề cần đọc và việc cần làm

> The process starts when the customer interacts with the BookingUI (a boundary object) to submit their booking request (Room ID and dates).

**Đưa vào hình:** Xếp Customer, BookingUI, BookingController, RoomRepository, PaymentService, PaymentGateway, ReservationRepository, :Room, :Reservation.

> The controller calls a RoomRepository to verify the current status and availability of the selected room for the given dates.

**Đưa vào hình:** Controller → RoomRepository: getById(roomId) → room; sau đó isAvailable(roomId,start,end).

> If the room is available, the controller proceeds to call a PaymentService to process a mandatory Deposit Payment via an external gateway.

**Đưa vào hình:** Trong [Available], Controller → PaymentService: processDeposit(...).

> If successful: The controller creates a new Reservation record, saves it using the ReservationRepository, and updates the room's status to "Booked".

**Đưa vào hình:** Lồng alt [payment Success]/[payment Failure] bên trong [Available].

> If failed: The controller returns an error message to the BookingUI and the process stops.

**Đưa vào hình:** Trong ngăn [payment Failure], Controller → BookingUI: showPaymentError().

## Q3 · Activity: đổi lane, điều kiện phí và hai trạng thái cuối

**Đọc:** Đọc riêng use case trả tài nguyên/checkout. Gạch động từ, ghi ai làm từng việc và điều kiện nào cho phép hoàn tất.

**Tìm trên mẫu:** Tab Q3 dùng thứ tự lane như mẫu: System/service | nhân viên | khách. Bắt đầu ở khách, đi qua kiểm tra, tính phí, thanh toán và lưu trạng thái.

| Vai trò | Chữ trong mẫu gốc | Đổi thành | Sửa kèm |
| --- | --- | --- | --- |
| Tên hệ thống | StayEase | StayEase | Tiêu đề, UI; không tự tạo class tên hệ thống. |
| Người dùng chính | Customer | Customer | Entity, Repository, lifeline, lane và tham số actorId. |
| Người xử lý | Host | Host | Entity, Repository, quan hệ kế thừa và lane kiểm tra/duyệt. |
| Tài nguyên | Room | Room | Entity + Repository + field ID + availability + trạng thái cuối. |
| Giao dịch | Reservation | Reservation | Entity + Repository + Service/Controller nếu đề cho phép + save/update. |
| Tiền / phạt | Payment | Payment | Entity + Repository + amount + guard trả tiền; Fine không luôn tồn tại. |

### Lane & action

Host → Host; Guest → Customer; inspect Room → inspect Room

Đổi cả tên lane và danh từ trong từng action. Loại luồng đăng nhập trong canvas gốc.

### Decision tính phí

damage found

Hai nhánh có/không phí gom bằng merge hình thoi; không dùng thanh join cho lựa chọn loại trừ nhau.

### Thanh toán

remaining balance + Damage Fee (đã trừ Deposit)

Chỉ hoàn tất sau payment confirmed; chưa xác nhận thì chờ/thử lại theo giả định.

### Hai status cuối

Reservation=Completed; Room=Cleaning

Tên entity và status là hai việc khác nhau. Không đổi Room thành Car rồi giữ Cleaning nếu đề trả xe yêu cầu khác.

### Dừng lại để soát

- [ ] Có initial/final, lane đúng người, nhánh có/không phí đầy đủ.
- [ ] Action cập nhật và persist thuộc System/service.
- [ ] Status của tài nguyên khác status của giao dịch.

Đề gọi đúng BookingController, BookingService, IGenericRepository<T>: giữ các tên bắt buộc này. Guest ở checkout là Customer.

### Câu đề cần đọc và việc cần làm

> The Host then enters the inspection results into the StayEase system.

**Đưa vào hình:** Tạo làn Host, System/CheckoutService, Guest(Customer); tối thiểu Host và System.

> If damage is found: The System calculates an additional Damage Fee and adds it to the Final Invoice.

**Đưa vào hình:** Decision “Damage found?” ở System.

> The Host requests the Guest to settle the payment.

**Đưa vào hình:** System đưa invoice cho Host; Host: Request Guest to settle payment.

> After the payment is confirmed, the System updates the Reservation status to "Completed" and changes the Room status to "Cleaning".

**Đưa vào hình:** Ở System, Reservation.status=Completed.
