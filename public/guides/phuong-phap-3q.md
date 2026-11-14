# Phương pháp phân tích và hoàn thành 3 câu PE StayEase

Hướng dẫn bằng chữ: đọc đề, xác định thành phần, điền nội dung, vẽ quan hệ và kiểm tra bài. Các ví dụ bám theo đề StayEase trong de_chua_giai; giả định phải được ghi rõ và không trái đề.

## Q1 — Từ đoạn đề đến từng ô và đường trong Class

Làm theo thứ tự: xác định lớp → điền thuộc tính/method → nối quan hệ → thêm Service/Repository → đối chiếu Q2. Đừng chỉ đổi tên trên một hình có sẵn rồi nộp.

### Đọc ký hiệu Class trước khi điền mẫu

Danh từ chỉ là ứng viên. Hỏi nó có dữ liệu, hành vi và danh tính riêng không, rồi mới tạo class. Ví dụ Room là lớp; room101:Room là một đối tượng cụ thể.

Tham khảo: Class-Diagram.pdf · trang 2–8.

| Bạn cần diễn đạt | Viết / vẽ thế nào | Cách tự kiểm |
| --- | --- | --- |
| Dữ liệu và hành vi | - status: String<br>+ complete(): void | Thuộc tính ở ngăn giữa; operation ở ngăn dưới. Method có tham số thì ghi tên: kiểu và kiểu trả về. |
| Phạm vi truy cập | + public; - private; # protected; ~ package | Chọn theo thiết kế. Dùng private cho field và public cho API là lựa chọn thường gặp, không phải luật cho mọi thành viên. |
| Một Customer có nhiều Reservation | Customer 1 — 0..* Reservation | Giữ cố định MỘT Customer, nhìn số gần Reservation. Đọc ngược để biết một giao dịch thuộc bao nhiêu người. |
| Liên kết lâu dài hay chỉ sử dụng? | Association: nét liền. Dependency: nét đứt, mũi tên từ bên dùng tới bên được dùng. | Mũi tên association chỉ khả năng điều hướng tới đối tượng liên kết; không biểu diễn thứ tự gọi hàm theo thời gian. |
| Là một loại / thực hiện hợp đồng | Generalization: nét liền + tam giác rỗng. Realization: nét đứt + tam giác rỗng. | Tam giác hướng về lớp cha hoặc interface. Interface con kế thừa interface cha bằng generalization; concrete implements interface bằng realization. |
| Whole–part có phụ thuộc vòng đời? | Composition: thoi đặc ở whole. Aggregation: thoi rỗng ở whole. | Has/contains chưa đủ kết luận. Nếu chỉ dùng tạm, xem dependency; nếu chỉ liên kết, xem association. |

**Ví dụ sai:** Room 0..* — 1 Reservation (nhưng định diễn đạt mỗi giao dịch gắn một tài nguyên)

**Sửa thành:** Room 1 — 0..* Reservation

Số cạnh đầu nào mô tả số đối tượng ở đầu đó cho một đối tượng đầu kia. Lịch sử nhiều giao dịch vẫn cần ràng buộc không trùng lịch riêng.

**Tự trả lời:** Reservation chứa Payment; đề nói Payment không tồn tại nếu thiếu Reservation. Thoi ở đâu? Nếu IRoomRepository kế thừa IGenericRepository<T> thì dùng nét nào?

**Đáp án:** Thoi đặc ở Reservation. IRoomRepository → IGenericRepository<T> là nét liền + tam giác rỗng; RoomRepository implements IRoomRepository mới dùng nét đứt + tam giác rỗng.

**Chỉ thêm khi cần:** Chỉ thêm in/out/inout khi đề hoặc thiết kế cần mô tả hướng tham số. Chúng không quyết định hướng connector giữa hai class.

### 1. Gạch danh từ để biết cần những class nào

1. Trong đề StayEase, đánh dấu Customer, Host, Room, Reservation, Payment. Danh từ riêng chỉ hệ thống như StayEase không nhất thiết trở thành một class.
2. Tách người dùng, tài nguyên, giao dịch và khoản tiền. Vai trò nào đề nói kế thừa User thì tạo lớp con; không biến mọi vai trò xuất hiện trong một use case thành class mới.
3. Guest ở Q3 là Customer lúc lưu trú/trả phòng. Customer và Host kế thừa User; Staff/Admin trong overview có thể bổ sung nhưng không thay Host.

```text
Nhóm người: User, Customer, Host
Tài nguyên: Room
Giao dịch: Reservation
Khoản tiền / phạt: Payment
```

### 2. Chuyển dữ liệu thành thuộc tính, hành động thành method

1. Thuộc tính trả lời “đối tượng cần nhớ thông tin gì?”. Ghi tên và kiểu: - id: Long, - status: String. Method trả lời “đối tượng thực hiện được việc gì?”. Ghi tên động từ, tham số và kiểu trả về.
2. Dùng Business Overview để suy ra method: browse/search thuộc phần tìm Room; create/book/borrow liên quan Reservation; inspect thuộc vai trò xử lý. Không tự thêm chức năng ngoài phạm vi đề.
3. Dùng tên số ít cho class và đặt tên method thống nhất, ví dụ BookingService.createReservation(...). Nếu chọn tên khác thì dùng cùng tên đó trong Sequence.

```text
Reservation
- id: Long
- status: String
+ complete(): void

RoomRepository
+ isAvailable(id, start, end): boolean
```

### 3. Đọc từng quan hệ thành hai câu trước khi ghi số lượng

1. Một Customer có thể có bao nhiêu Reservation? Một Reservation thuộc bao nhiêu Customer? Câu “can create multiple” thường cho phép chưa có giao dịch nên dùng 0..*, trừ khi đề ràng buộc khác.
2. Mỗi Reservation gắn đúng một Room: số 1 nằm gần Room. Một tài nguyên có nhiều giao dịch theo lịch sử không có nghĩa là cho phép các giao dịch hiệu lực trùng thời gian.
3. Cụm one or more → 1..*; at most one → 0..1; exactly one → 1. Với Payment, đề này dùng 1..*; không lấy số lượng từ đề khác.

```text
Customer 1 ─── 0..* Reservation
Room 1 ─── 0..* Reservation
Reservation 1 ─── 1..* Payment
```

### 4. Phân biệt association, aggregation, composition và kế thừa

1. Association chỉ liên kết hai đối tượng. Kế thừa thể hiện “là một loại”: lớp con → User, nét liền và tam giác rỗng.
2. Composition dùng khi part phụ thuộc vòng đời whole, thoi đặc tại whole. Aggregation là whole–part mà part tồn tại độc lập, thoi rỗng tại whole; ví dụ Department/Employee dưới giả định nhân viên vẫn tồn tại khi phòng ban bị xóa.
3. StayEase ghi Payment không tồn tại nếu thiếu Reservation: composition bắt buộc, Reservation 1 ◆—1..* Payment. Không đảo thoi sang Payment.

```text
Kế thừa: Customer ──▷ User
Association: hai đầu không có thoi
Composition: Whole ◆── Part
Aggregation: Whole ◇── Part
```

### 5. Suy ra repository từ dữ liệu cần lưu và service từ nghiệp vụ

1. Có giao dịch Reservation cần lưu → cần ReservationRepository. Có tài nguyên Room cần tra cứu → cần RoomRepository. Repository làm việc đọc/ghi; không phải bản thân database.
2. BookingService xử lý nghiệp vụ và gọi repository. Entity là đối tượng nghiệp vụ chứa dữ liệu/hành vi, không phải một lifeline SQL Database được đổi tên.
3. Tạo IRoomRepository, IReservationRepository, IPaymentRepository kế thừa IGenericRepository<T>; concrete repositories implements các interface đó. BookingService phụ thuộc interfaces theo đề.

```text
«interface» IGenericRepository<T>
+ getById(id: Long): T
+ save(entity: T): T

BookingService
- rooms: IRoomRepository
- reservations: IReservationRepository
```

### 6. Tự đọc lại hình như một lời giải

1. Với mỗi đường, nói được loại quan hệ, chiều phụ thuộc và số lượng ở hai đầu. Có nhãn chưa hợp lệ như 0..1* thì sửa thành 0..1 hoặc 0..* theo đề.
2. Đọc Q2 rồi kiểm tra các message dự định dùng đã có method tương ứng ở class/interface chưa. Bổ sung method cụ thể, xóa placeholder field: type hoặc method(type): type.
3. Đọc câu hỏi để biết tên nào bắt buộc. Tái sử dụng khung không đồng nghĩa đổi tùy ý tên BookingService/BookingController/IGenericRepository khi đề đã chỉ định.

```text
Soát Q1: lớp đủ → field/method rõ → số lượng đúng
→ thoi/tam giác đúng đầu → service/repository đúng vai trò
```

### Giải thích ngắn tham khảo

This design-level class diagram models Customer, Host, Room, Reservation and Payment. It separates business logic from data access through services and repository interfaces. Multiplicities and whole-part relationships follow the business requirements and the assumptions shown in the diagram.

Đối chiếu lại với hình đã vẽ; không sao chép nếu khác giả định.

## Q2 — Từ use case đến từng message và nhánh của Sequence

Sequence kể sự tương tác theo thời gian. Dựng cột trước, viết happy path, rồi tách các tình huống thay thế; không bắt đầu bằng một mạng mũi tên chưa có tên.

### Chọn đúng message và fragment cho Sequence

Trước khi vẽ, lập mỗi dòng theo mẫu: Ai gửi | Ai nhận | method(dữ liệu) | kết quả | điều kiện. Sau đó đặt các dòng từ trên xuống theo thứ tự trong từng nhánh.

Tham khảo: Sequence-Diagram.pdf · trang 2–8.

| Tình huống trong đề | Ký hiệu cần chọn | Cách áp dụng |
| --- | --- | --- |
| Một đối tượng tham gia | role:Class hoặc :Class trên lifeline | resource:Room là instance, Room là type. UI, controller/service, repository và entity có trách nhiệm khác nhau. |
| Gọi và chờ kết quả | Synchronous: nét liền, đầu tam giác đặc | Gọi RoomRepository.isAvailable(id, start, end); caller chờ kết quả trước khi chọn nhánh. |
| Trả kết quả | Reply: nét đứt, đầu mũi tên mở, về bên gọi | Đặt tên dữ liệu như available hoặc receipt. Có thể lược reply không cần thiết; giữ kết quả quyết định nhánh để bài dễ đọc. |
| Gửi và không chờ xử lý xong | Asynchronous: nét liền, đầu mũi tên mở | Chỉ dùng khi tình huống thật sự không chờ. Một hệ thống ở bên ngoài không tự động có nghĩa là lời gọi bất đồng bộ. |
| Đang xử lý / tạo mới | Activation ≠ create | Activation là khoảng thực thi. Create tới đầu lifeline mới ở đúng thời điểm tạo; không để instance nhận lời gọi trước lúc nó tồn tại. |
| Chọn một trong nhiều nhánh | alt [guard] / [else] | Các guard cần rõ và các phương án phải được bao quát. Khung alt trong chỉ nằm trong nhánh nơi nó được phép chạy. |
| Có thể bỏ qua / lặp lại | opt [guard] / loop [điều kiện] | opt là một khối tùy điều kiện, không có else. loop chỉ dùng khi đề có lặp; không thay alt thành công/thất bại bằng loop. |

**Ví dụ sai:** create Reservation → processDeposit → [Failure] vẫn Room=Booked

**Sửa thành:** [Available] → processDeposit → [Success] create Reservation, save, Room=Booked; [Failure] trả lỗi

Lệnh tạo phải nằm trong nhánh thành công theo đề StayEase. AutoGo có thứ tự tạo trước thanh toán nên không đổi đồng loạt mọi mẫu.

**Tự trả lời:** “Nếu còn tài nguyên thì xử lý tiếp; nếu hết thì báo lỗi.” Dùng alt hay opt? Thanh activation có chứng minh đối tượng vừa được tạo không?

**Đáp án:** Dùng alt vì có hai kết quả cần thể hiện. Activation chỉ thể hiện thực thi; muốn chỉ thời điểm tạo phải dùng create và bắt đầu lifeline ở đó.

**Chỉ thêm khi cần:** Self-message khi đối tượng gọi chính nó; ref khi tách tương tác sang hình khác. Dấu X là kết thúc lifeline do hủy đối tượng, không phải trả lỗi hay kết thúc một request. Chỉ thêm khi use case cần.

### 1. Xác định actor và các vai trò tham gia

1. Ai bắt đầu use case? Ở đây là Customer. Giao diện là BookingUI; component điều phối/xử lý là BookingController.
2. UI nhận dữ liệu và hiện kết quả. Controller điều phối request. Service xử lý nghiệp vụ. Repository đọc/ghi. Entity giữ trạng thái và hành vi của đối tượng. Gateway là hệ thống ngoài nếu use case có tương tác đó.
3. Q2 StayEase gọi rõ BookingController → RoomRepository / PaymentService / ReservationRepository. Giữ các lời gọi đó; Q1 vẫn có BookingService theo yêu cầu riêng, kèm giả định phân tầng trong lời giải.

```text
Customer | BookingUI | BookingController
| RoomRepository | ReservationRepository
| PaymentRepository nếu cần | :DomainEntity
| PaymentGateway nếu use case dùng hệ thống ngoài
```

### 2. Ghi lời gọi dưới dạng động từ và dữ liệu đầu vào

1. Đọc “selects / submits / requests” để lấy thao tác đầu. Dữ liệu truyền phải đủ: ID Room và khoảng ngày/giờ nếu đề kiểm tra availability theo thời gian.
2. Mỗi message có nơi gửi, nơi nhận và việc thực hiện. Ghi method(args), không chỉ ghi “request” cho tất cả các mũi tên.
3. Lời gọi nằm ở phía trên; response đi ngược lại ở phía dưới và trả dữ liệu/kết quả. Dùng activation cho đoạn đang xử lý, không kéo thanh này thay cho message.

```text
BookingUI → BookingController: submitRequest(actorId, resourceId, start, end)
BookingController → RoomRepository: isAvailable(...)
Repository --→ BookingController: available
```

### 3. Viết luồng đề này thành các bước trước khi vẽ

1. Customer gửi roomId, start, end vào BookingUI; UI chuyển yêu cầu cho BookingController.
2. Controller gọi RoomRepository.getById(roomId) và isAvailable(roomId,start,end); :Room tham gia kiểm tra và trả kết quả.
3. Alt ngoài [Available]/[Occupied]. Occupied trả lỗi về UI rồi dừng; không gọi thanh toán.
4. Trong Available, Controller gọi PaymentService.processDeposit; service gọi gateway ngoài rồi nhận success/failure và receipt.
5. Lồng alt payment. Success mới tạo :Reservation, lưu ReservationRepository.save(reservationWithDeposit), đổi Room=Booked và trả thành công.
6. Failure trả showPaymentError() về UI và dừng; không create Reservation, không đổi Room=Booked. Lưu Reservation/owned Deposit Payment cùng nhau là giả định thiết kế cần ghi rõ.

```text
check room → pay Deposit → [Success]
→ create Reservation → save → Room=Booked
[Failure] → error → STOP
```

### 4. Mỗi IF cần một cặp tình huống thay thế

1. Tìm các từ if, depending on, success/failure, available/unavailable. Viết hai guard rõ ràng trong dấu [ ].
2. Alt có nhiều ngăn. Ngăn trên là một điều kiện; đường phân cách ngang nét đứt; ngăn dưới là điều kiện thay thế. Chỉ đặt message của nhánh đó vào đúng ngăn.
3. Alt payment nằm trọn trong ngăn tài nguyên khả dụng. Đừng để payment tiếp tục chạy ở ngăn unavailable.
4. Kéo khung ra sau message và tăng kích thước nếu nhãn chồng nhau; khung không phải một lời gọi nên không có đầu mũi tên.

```text
alt [Available]
  xử lý giao dịch
  alt [payment Success] / [payment Failure]
else [Unavailable]
  showUnavailable()
```

### 5. Soát riêng nhánh lỗi và các thay đổi trạng thái

1. Đi một lượt chỉ theo nhánh thất bại: tài nguyên còn bị giữ không, giao dịch đã tồn tại chưa, ai lưu Cancelled, actor có nhận lỗi không?
2. StayEase payment Failure chưa tạo Reservation, vì vậy không vẽ cancel một Reservation chưa tồn tại. Success mới Room=Booked.
3. Các method trên message phải đối chiếu được với Class. Nếu dùng repository.save(), chỉ rõ đang lưu entity nào; entity không tự thay thế toàn bộ tầng data access.

```text
Soát Q2: ai gọi ai → dữ liệu gì → trả gì
→ IF/ELSE nào → save/update đâu → lỗi dừng ở đâu
```

### Giải thích ngắn tham khảo

The sequence checks room availability before processing the deposit. Only a successful payment creates and saves a Reservation and changes the Room status to Booked. Alternative fragments show unavailable rooms and payment failure, which return an error without creating a Reservation.

Đối chiếu lại với hình đã vẽ; không sao chép nếu khác giả định.

## Q3 — Từ mô tả quy trình đến lane, action và điều kiện

Đọc theo từng động từ và gắn trách nhiệm trước khi kéo mũi tên. Activity trả lời ai làm gì, trong điều kiện nào, rồi bước tiếp theo là gì.

### Q3 này cần Activity: dùng đúng loại hướng dẫn

Ba PDF mới không có tài liệu Activity riêng. Dùng phần State để phân biệt mục tiêu, còn các bước Activity dưới đây vẫn bám đúng câu hỏi của đề.

Tham khảo: Đối chiếu State-Machine-Diagram.pdf · trang 2 với yêu cầu Q3 của đề đang chọn.

| Cần trả lời | Activity của đề này | Nếu là State thì khác gì? |
| --- | --- | --- |
| Theo dõi điều gì? | Check-out and Inspection: ai làm gì và bước tiếp theo | Vòng đời một Reservation, trạng thái hiện tại và event làm nó chuyển trạng thái. |
| Nhãn trong hộp | Động từ: Inspect, Calculate fee, Confirm payment | Tình trạng: Requested, Paid, Completed |
| Ai chịu trách nhiệm? | Lane Host, System/service, Customer nếu cần | Không chia lane theo vai trò để kể toàn bộ quy trình. |
| Có điều kiện? | Decision có các cạnh [guard]; merge nhập các phương án thay thế. | Transition mang event [guard] / effect giữa các state. |

**Ví dụ sai:** Thấy PDF State mới → đổi Q3 đang yêu cầu Activity thành các state Paid/Completed

**Sửa thành:** Giữ Activity, lane và action đúng use case. Cập nhật status là action trong lane System.

Loại diagram do câu hỏi quyết định. Tài liệu tham khảo bổ sung cách hiểu, không thay yêu cầu đề.

**Tự trả lời:** “System cập nhật Room.status=Cleaning” là một action trong Activity hay bắt buộc phải vẽ một State Diagram mới?

**Đáp án:** Là action trong Activity checkout của StayEase. Chỉ vẽ State Diagram mới nếu câu hỏi yêu cầu vòng đời Room.

**Chỉ thêm khi cần:** Hoàn thành luồng chính, nhánh có/không phí và điều kiện hoàn tất trước khi thêm tình huống ngoài đề.

### 1. Đọc use case, chọn điểm bắt đầu và phạm vi

1. Câu này là Check-out and Inspection, không phải đặt giao dịch mới hay đăng nhập. Viết một dòng xác định lúc quy trình bắt đầu và lúc kết thúc.
2. Actor xử lý là Host; System dùng CheckoutService. Có thể thêm Guest (Customer) nếu cần thể hiện trả tiền.
3. Lấy tên lane từ đề. Không giữ Car Owner/Staff khi đề đặt phòng yêu cầu Host, hoặc giữ Host khi đề thư viện yêu cầu Librarian.

```text
Bắt đầu: trả Room / bắt đầu kiểm tra
Kết thúc: đóng Reservation + cập nhật Room
```

### 2. Đặt từng động từ vào đúng lane

1. Host thực hiện Inspect và Enter inspection result. System thực hiện Evaluate report, Calculate fee, Generate invoice và lưu status.
2. Mỗi action là một hộp bo góc với động từ ngắn. Nối từ initial theo thứ tự; khi đổi người chịu trách nhiệm, đường đi sang làn khác.
3. Level 2 – Design cần thể hiện Actor/Role và Component/Service. Tên System/CheckoutService làm rõ nơi xử lý thay vì dồn mọi action vào một làn chung.

```text
Host: Inspect → Enter report
System/Service: Evaluate report → Calculate fee
```

### 3. Đổi điều kiện thành decision, không bỏ nhánh không phát sinh phí

1. Điều kiện là Damage found?. Có hỏng thì tính Damage Fee; không hỏng thì fee=0 và vẫn lập Final Invoice.
2. Decision dùng diamond có hai cạnh ra ghi guard. Hai phương án thay thế nhập lại bằng merge trước invoice/final amount.
3. Không dùng fork/join cho hai nhánh có/không phí: đó không phải hai luồng bắt buộc chạy song song.

```text
◇ Damage / Additional fee?
[yes] → Calculate fee ─┐
[no]  → Fee = 0 ──────┴→ merge → Invoice
```

### 4. Xử lý thanh toán trước khi hoàn tất

1. Final Invoice = remaining stay balance + Damage Fee. Giả định remaining balance đã trừ Deposit; không cộng lại cọc để thu hai lần.
2. System lập invoice → Host yêu cầu Guest settle payment → Guest trả → System nhận xác nhận.
3. Không cần tự thêm nhánh ngoài phạm vi đề, nhưng mọi giả định để nối các bước còn thiếu phải hợp lý và được ghi rõ.

```text
Payment confirmed?
[yes] → hoàn tất giao dịch
[no] → chờ / thử lại (giả định)
```

### 5. Ghi riêng tên đối tượng và trạng thái mới

1. Phải là Reservation.status=Completed và Room.status=Cleaning. Không viết Room=Completed hoặc Room=Available chỉ vì nhìn một mẫu trả xe.
2. Đặt bước lưu trạng thái trong System/service, rồi nối tới activity final. Soát đường đi của cả nhánh có phí và không phí.
3. Đọc từng action cuối theo mẫu “đối tượng nào → thuộc tính nào → giá trị mới gì” để tránh đổi nhầm status của hai entity.

```text
Reservation.status = Completed
Room.status = Cleaning
Persist both → ◎
```

### Giải thích ngắn tham khảo

The activity separates Host, System/CheckoutService and Guest responsibilities. The System adds a Damage Fee only when damage is found, then waits for confirmed final payment. It completes the Reservation and changes the Room status to Cleaning before ending.

Đối chiếu lại với hình đã vẽ; không sao chép nếu khác giả định.
