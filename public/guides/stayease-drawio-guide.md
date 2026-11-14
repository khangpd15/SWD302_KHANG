# Dùng draw.io để hoàn thành 3 câu StayEase

Hướng dẫn thao tác kèm bộ .drawio đã giải. Mở mẫu để sửa hoặc dùng các bước này khi vẽ từ trang trắng. Menu có thể khác nhẹ giữa Desktop/Web, theme và ngôn ngữ.

## Chuẩn bị draw.io trước khi vẽ

Có công cụ mở được file offline, đủ thư viện UML và một bản .drawio để sửa.

### Cần chuẩn bị

- **Ứng dụng:** draw.io Desktop nếu cần làm offline; cài và mở thử trước buổi thi theo quy định.
- **File nguồn:** Tải bộ .drawio của đề đang chọn. StayEase có bản đầy đủ và Q1/Q2/Q3 riêng.
- **Thư viện hình:** General, UML và UML 2.5. Dùng More Shapes ở cuối cột trái để bật.
- **Ba trang bài làm:** Q1 Class, Q2 Sequence, Q3 Activity/State; bản mẫu có thêm tab kiến trúc để tham khảo.

### 1. Mở mẫu và lưu một bản riêng

1. Bấm Tải bộ .drawio trên trang này. Mở draw.io Desktop, dùng File → Open (hoặc Open From → Device ở bản web), chọn file vừa tải.
2. Nhìn các tab ở đáy canvas và chọn đúng Q1, Q2 hoặc Q3. File Q1 riêng chỉ có một tab.
3. Dùng Save As để lưu bản làm việc, ví dụ StayEase_[StudentID].drawio; đây là tên luyện tập, không phải tên nộp bắt buộc. Nhấn Ctrl+S sau các bước sửa.

Kết quả cần có:

```text
Có file .drawio sửa được và giữ được mẫu ban đầu.
```

**Nếu bị vướng:** Không đổi đuôi .png thành .drawio. Ảnh thông thường không biến thành các hộp chỉnh sửa được.

### 2. Bật đúng thư viện hình

1. Ở cột hình bên trái, kéo xuống More Shapes… → Software → chọn UML và UML 2.5 → Apply; giữ General để dùng rectangle, text và diamond.
2. Dùng ô Search Shapes để tìm Class, Lifeline, Activation, Frame, Swimlane, Decision; nếu bản offline không tìm ra, mở trực tiếp nhóm thư viện vừa bật.
3. Rê chuột lên một hình để xem trước; kéo hình từ thư viện vào canvas. Tên hình/menu có thể khác nhẹ theo phiên bản hoặc ngôn ngữ.

Kết quả cần có:

```text
Thấy các hình UML ở cột trái, không phải đi tìm từng ảnh trên mạng.
```

**Nếu bị vướng:** Không thấy hình không có nghĩa là cần cài thêm plugin: kiểm tra More Shapes trước.

### 3. Nhận ra bốn vùng của giao diện

1. Cột trái là hình; vùng giữa là canvas; bảng bên phải có Style / Text / Arrange để sửa đối tượng đang chọn; đáy là các trang.
2. Nhấp một hộp để chọn rồi kéo các tay nắm ở viền để đổi kích thước. Nhấp đúp chữ để sửa tên/nội dung.
3. Chọn đường nối mới thấy cài đặt đường, chọn hộp sẽ thấy cài đặt hộp. Nếu bảng phải đang ẩn, bật Format Panel từ menu View của giao diện đang dùng.

Kết quả cần có:

```text
Biết phải chọn hộp hay đường trước khi đổi style.
```

**Nếu bị vướng:** Đổi màu hộp không thay đổi kiểu mũi tên. Cần chọn đúng đường nối.

### 4. Nắm các thao tác dùng cả ba câu

1. Kéo connector từ một điểm nối của hình nguồn sang hình đích; thả khi đích được nhận kết nối. Di chuyển hộp thử để kiểm tra đường còn bám đúng.
2. Nhấp đúp lên đường tại vị trí muốn gắn nhãn. Kéo tay nắm của nhãn để tránh đè lên đường hoặc chữ khác.
3. Ctrl+D nhân bản đối tượng đang chọn; Ctrl+Z hoàn tác; Delete xóa đối tượng đang chọn. Khi sửa chữ, chọn phần chữ cần thay, tránh Ctrl+A lúc chưa vào chế độ sửa vì có thể chọn toàn canvas.

Kết quả cần có:

```text
Tạo hộp → nối → đặt nhãn → căn lại → lưu.
```

**Nếu bị vướng:** Nếu kéo hộp mà đường bị rời, nối lại đầu connector vào đúng hộp; đừng dùng các đoạn line rời để giả liên kết.

### Tự kiểm trước khi qua phần tiếp theo

- [ ] Mở lại được file .drawio đã lưu.
- [ ] Thấy UML/UML 2.5 trong cột hình.
- [ ] Sửa được chữ và kiểu của một connector.
- [ ] Có tab riêng cho từng câu.

## Q1 · Vẽ Class Diagram từ các hộp và quan hệ

Hoàn thành các lớp, thuộc tính, method và quan hệ của StayEase; tên method sẽ được dùng lại ở Q2.

### Cần chuẩn bị

- **Class 3 ngăn:** Các lớp nghiệp vụ: User, Customer, Host, Room, Reservation, Payment. Ba ngăn là tên / thuộc tính / method.
- **Service và repository:** Bản StayEase có 17 hộp: 6 lớp nghiệp vụ, 4 control/service, 4 interface và 3 concrete repositories.
- **Connector:** Association, generalization, realization, dependency; composition ở quan hệ có vòng đời phụ thuộc.
- **Text / Note:** Multiplicity hai đầu; giải thích giả định về status, vòng đời hoặc số lượng.

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

### Phân tích: Từ đoạn đề đến từng ô và đường trong Class

Làm theo thứ tự: xác định lớp → điền thuộc tính/method → nối quan hệ → thêm Service/Repository → đối chiếu Q2. Đừng chỉ đổi tên trên một hình có sẵn rồi nộp.

#### 1. Gạch danh từ để biết cần những class nào

1. Trong đề StayEase, đánh dấu Customer, Host, Room, Reservation, Payment. Danh từ riêng chỉ hệ thống như StayEase không nhất thiết trở thành một class.
2. Tách người dùng, tài nguyên, giao dịch và khoản tiền. Vai trò nào đề nói kế thừa User thì tạo lớp con; không biến mọi vai trò xuất hiện trong một use case thành class mới.
3. Guest ở Q3 là Customer lúc lưu trú/trả phòng. Customer và Host kế thừa User; Staff/Admin trong overview có thể bổ sung nhưng không thay Host.

```text
Nhóm người: User, Customer, Host
Tài nguyên: Room
Giao dịch: Reservation
Khoản tiền / phạt: Payment
```

#### 2. Chuyển dữ liệu thành thuộc tính, hành động thành method

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

#### 3. Đọc từng quan hệ thành hai câu trước khi ghi số lượng

1. Một Customer có thể có bao nhiêu Reservation? Một Reservation thuộc bao nhiêu Customer? Câu “can create multiple” thường cho phép chưa có giao dịch nên dùng 0..*, trừ khi đề ràng buộc khác.
2. Mỗi Reservation gắn đúng một Room: số 1 nằm gần Room. Một tài nguyên có nhiều giao dịch theo lịch sử không có nghĩa là cho phép các giao dịch hiệu lực trùng thời gian.
3. Cụm one or more → 1..*; at most one → 0..1; exactly one → 1. Với Payment, đề này dùng 1..*; không lấy số lượng từ đề khác.

```text
Customer 1 ─── 0..* Reservation
Room 1 ─── 0..* Reservation
Reservation 1 ─── 1..* Payment
```

#### 4. Phân biệt association, aggregation, composition và kế thừa

1. Association chỉ liên kết hai đối tượng. Kế thừa thể hiện “là một loại”: lớp con → User, nét liền và tam giác rỗng.
2. Composition dùng khi part phụ thuộc vòng đời whole, thoi đặc tại whole. Aggregation là whole–part mà part tồn tại độc lập, thoi rỗng tại whole; ví dụ Department/Employee dưới giả định nhân viên vẫn tồn tại khi phòng ban bị xóa.
3. StayEase ghi Payment không tồn tại nếu thiếu Reservation: composition bắt buộc, Reservation 1 ◆—1..* Payment. Không đảo thoi sang Payment.

```text
Kế thừa: Customer ──▷ User
Association: hai đầu không có thoi
Composition: Whole ◆── Part
Aggregation: Whole ◇── Part
```

#### 5. Suy ra repository từ dữ liệu cần lưu và service từ nghiệp vụ

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

#### 6. Tự đọc lại hình như một lời giải

1. Với mỗi đường, nói được loại quan hệ, chiều phụ thuộc và số lượng ở hai đầu. Có nhãn chưa hợp lệ như 0..1* thì sửa thành 0..1 hoặc 0..* theo đề.
2. Đọc Q2 rồi kiểm tra các message dự định dùng đã có method tương ứng ở class/interface chưa. Bổ sung method cụ thể, xóa placeholder field: type hoặc method(type): type.
3. Đọc câu hỏi để biết tên nào bắt buộc. Tái sử dụng khung không đồng nghĩa đổi tùy ý tên BookingService/BookingController/IGenericRepository khi đề đã chỉ định.

```text
Soát Q1: lớp đủ → field/method rõ → số lượng đúng
→ thoi/tam giác đúng đầu → service/repository đúng vai trò
```

#### Giải thích ngắn tham khảo

This design-level class diagram models Customer, Host, Room, Reservation and Payment. It separates business logic from data access through services and repository interfaces. Multiplicities and whole-part relationships follow the business requirements and the assumptions shown in the diagram.

Chỉ dùng nếu đúng với hình và giả định của bài làm; không phải bảo đảm điểm.

### 1. Đặt hộp Class và điền ba ngăn

1. Kéo hình Class trong UML/UML 2.5. Tạo một hộp cho mỗi tên trong danh sách cần dùng, không tạo mỗi thuộc tính thành một hộp.
2. Ngăn đầu ghi tên Reservation; ngăn giữa ghi mỗi dòng một thuộc tính, ví dụ - id: Long, - status: String; ngăn cuối ghi + complete(): void. Dấu - là private, + là public.
3. Với hình Class của thư viện, có thể chọn từng hàng để sửa hoặc nhân bản hàng. Với file mẫu trên trang, một số hộp là nhãn HTML gộp: nhấp đúp nội dung để sửa từng dòng; không phải hộp nào cũng có Insert Row.

Kết quả cần có:

```text
Reservation
- id: Long
- status: String
+ complete(): void
```

**Nếu bị vướng:** Nếu thêm chữ làm tràn hộp, tăng chiều cao/rộng rồi đọc lại; đừng thu font quá nhỏ.

### 2. Nối association và ghi multiplicity

1. Kéo một connector giữa Customer và Reservation. Chọn đường → Style → chọn nét liền, bỏ đầu mũi tên ở cả Start/Source và End/Target.
2. Nhấp đúp gần đầu Customer để thêm 1, gần đầu Reservation để thêm 0..*. Kéo nhãn sát đúng đầu; mỗi đường có thể có nhiều nhãn.
3. Nối Room 1 — 0..* Reservation theo lịch sử giao dịch. Đọc lại cả hai chiều. Số lượng Payment/Fine phải lấy từ đề đang chọn, không chép từ bài khác.

Kết quả cần có:

```text
Customer 1 ─── 0..* Reservation
Room 1 ─── 0..* Reservation
```

**Nếu bị vướng:** Số 1 ở đầu Room nghĩa là mỗi Reservation chọn 1 Room. Không đặt số lượng tùy theo hướng kéo chuột.

### 3. Chỉnh kế thừa, implements và dependency

1. Nối Customer → User và Host → User: chọn đường nét liền + tam giác rỗng ở đầu User.
2. Concrete Repository → interface: chọn nét đứt + tam giác rỗng ở interface. Với StayEase, interface chuyên biệt kế thừa IGenericRepository<T> bằng nét liền + tam giác rỗng.
3. BookingService → interface được dùng: chọn nét đứt + đầu mũi tên mở. Dùng bảng hình đường nối bên dưới để phân biệt đầu mở với tam giác rỗng.

Kết quả cần có:

```text
Lớp con ──▷ User
ConcreteRepository - - ▷ Interface
Service - - > RepositoryInterface
```

**Nếu bị vướng:** Tam giác rỗng hướng về cha/interface; dependency không dùng tam giác. Đầu kết thúc phụ thuộc hướng bạn kéo đường.

### 4. Thêm composition đúng đầu và method đủ dùng

1. Nối từ Reservation tới Payment, chọn thoi đặc ở Start/Source và bỏ mũi tên End/Target. Ghi 1 ở Reservation, 1..* ở Payment.
2. Điền method ở BookingController / BookingService, repository và các entity để khớp lời gọi Q2. Ví dụ getById, save, isAvailable và updateStatus phải có nơi định nghĩa.
3. Đặt entity ở một vùng, control/service ở vùng khác, interface và repositories ở dưới. Chọn nhiều hộp để căn đều qua Arrange; sửa các đường bị đè lên chữ.

Kết quả cần có:

```text
Reservation 1 ◆──── 1..* Payment
BookingService → IRoomRepository / IReservationRepository
```

**Nếu bị vướng:** StayEase bắt buộc BookingService phụ thuộc interface. Giữ cả BookingController để đối chiếu Q2.

### Bảng kiểu đường nối

- **Association:** nét liền; Không mũi tên hai đầu. Nối hai class; số lượng đặt sát mỗi đầu. Ví dụ: Customer 1 — 0..* Reservation.
- **Kế thừa / Generalization:** nét liền; Tam giác rỗng ở lớp cha. Bắt đầu ở lớp con → kết thúc ở User. Ví dụ: Customer → User; Host → User.
- **Implements / Realization:** nét đứt; Tam giác rỗng ở interface. Concrete Repository → interface nó thực hiện. Ví dụ: RoomRepository → IRoomRepository.
- **Composition:** nét liền; Thoi đặc ở đối tượng whole. Kéo từ Reservation tới Payment: thoi ở đầu Start / Source. Ví dụ: Reservation 1 ◆— 1..* Payment.
- **Aggregation:** nét liền; Thoi rỗng ở đối tượng whole. Part tồn tại độc lập khi whole mất; chỉ dùng khi quan hệ whole–part và giả định vòng đời phù hợp. Ví dụ: Department ◇— Employee (nhân viên tồn tại độc lập).
- **Dependency / uses:** nét đứt; Đầu mũi tên mở ở đối tượng được dùng. Service → repository interface; không dùng tam giác rỗng. Ví dụ: BookingService → IRoomRepository.

### Tự kiểm trước khi qua phần tiếp theo

- [ ] Mỗi class có tên, thuộc tính và method phù hợp.
- [ ] Kế thừa và implements đúng nét/đầu/hướng.
- [ ] Multiplicity nằm sát đúng hai đầu.
- [ ] Service, interfaces, concrete repositories thể hiện rõ.
- [ ] Method Q2 có mặt ở Class; không còn placeholder.

## Q2 · Vẽ Sequence với lifeline, message và hai alt

Book Room and Pay Deposit: đọc từ trên xuống và thể hiện riêng cả thành công lẫn thất bại.

### Cần chuẩn bị

- **Lifeline:** 9 cột: Customer, BookingUI, BookingController, RoomRepository, PaymentService, PaymentGateway, ReservationRepository, :Room, :Reservation.
- **Message + return:** Đường gọi nét liền có mũi tên, đường trả kết quả nét đứt. Thời gian tăng từ trên xuống.
- **Frame / Combined Fragment:** Hai alt: available/unavailable; payment success/failure. Alt thứ hai nằm trong nhánh đủ điều kiện.
- **Activation (nếu dùng):** Thanh dọc nhỏ trên lifeline lúc đang xử lý; không dùng activation thay message.

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

### Phân tích: Từ use case đến từng message và nhánh của Sequence

Sequence kể sự tương tác theo thời gian. Dựng cột trước, viết happy path, rồi tách các tình huống thay thế; không bắt đầu bằng một mạng mũi tên chưa có tên.

#### 1. Xác định actor và các vai trò tham gia

1. Ai bắt đầu use case? Ở đây là Customer. Giao diện là BookingUI; component điều phối/xử lý là BookingController.
2. UI nhận dữ liệu và hiện kết quả. Controller điều phối request. Service xử lý nghiệp vụ. Repository đọc/ghi. Entity giữ trạng thái và hành vi của đối tượng. Gateway là hệ thống ngoài nếu use case có tương tác đó.
3. Q2 StayEase gọi rõ BookingController → RoomRepository / PaymentService / ReservationRepository. Giữ các lời gọi đó; Q1 vẫn có BookingService theo yêu cầu riêng, kèm giả định phân tầng trong lời giải.

```text
Customer | BookingUI | BookingController
| RoomRepository | ReservationRepository
| PaymentRepository nếu cần | :DomainEntity
| PaymentGateway nếu use case dùng hệ thống ngoài
```

#### 2. Ghi lời gọi dưới dạng động từ và dữ liệu đầu vào

1. Đọc “selects / submits / requests” để lấy thao tác đầu. Dữ liệu truyền phải đủ: ID Room và khoảng ngày/giờ nếu đề kiểm tra availability theo thời gian.
2. Mỗi message có nơi gửi, nơi nhận và việc thực hiện. Ghi method(args), không chỉ ghi “request” cho tất cả các mũi tên.
3. Lời gọi nằm ở phía trên; response đi ngược lại ở phía dưới và trả dữ liệu/kết quả. Dùng activation cho đoạn đang xử lý, không kéo thanh này thay cho message.

```text
BookingUI → BookingController: submitRequest(actorId, resourceId, start, end)
BookingController → RoomRepository: isAvailable(...)
Repository --→ BookingController: available
```

#### 3. Viết luồng đề này thành các bước trước khi vẽ

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

#### 4. Mỗi IF cần một cặp tình huống thay thế

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

#### 5. Soát riêng nhánh lỗi và các thay đổi trạng thái

1. Đi một lượt chỉ theo nhánh thất bại: tài nguyên còn bị giữ không, giao dịch đã tồn tại chưa, ai lưu Cancelled, actor có nhận lỗi không?
2. StayEase payment Failure chưa tạo Reservation, vì vậy không vẽ cancel một Reservation chưa tồn tại. Success mới Room=Booked.
3. Các method trên message phải đối chiếu được với Class. Nếu dùng repository.save(), chỉ rõ đang lưu entity nào; entity không tự thay thế toàn bộ tầng data access.

```text
Soát Q2: ai gọi ai → dữ liệu gì → trả gì
→ IF/ELSE nào → save/update đâu → lỗi dừng ở đâu
```

#### Giải thích ngắn tham khảo

The sequence checks room availability before processing the deposit. Only a successful payment creates and saves a Reservation and changes the Room status to Booked. Alternative fragments show unavailable rooms and payment failure, which return an error without creating a Reservation.

Chỉ dùng nếu đúng với hình và giả định của bài làm; không phải bảo đảm điểm.

### 1. Xếp các lifeline thành cột

1. Kéo Lifeline từ UML/UML 2.5, nhân bản để có đủ đối tượng. Sửa tên ở ô đầu cột; kéo phần lifeline xuống đủ dài.
2. Đặt actor/UI bên trái, control/service ở giữa, repositories và entities bên phải. Chừa khoảng ngang để tên method đọc được.
3. Riêng :Reservation được tạo sau payment Success: đầu đối tượng đặt ngang mũi tên «create» trong nhánh Success, không xuất hiện như đối tượng đã tồn tại từ đầu.

Kết quả cần có:

```text
Customer | BookingUI | BookingController | Repository | :Entity
```

**Nếu bị vướng:** Không nối các đầu cột thành một hàng ngang. Message phải nối các lifeline ở các thời điểm khác nhau.

### 2. Vẽ một request và response mẫu

1. Kéo connector từ lifeline BookingUI sang BookingController. Dùng hình message gọi đồng bộ của thư viện UML, hoặc connector thẳng nét liền với đầu tam giác đặc hướng về bên nhận; nhấp đúp ghi tên method và tham số.
2. Thêm đường trả kết quả ở thấp hơn, hướng ngược lại; chọn nét đứt và đầu mũi tên mở, ghi result/available thay vì chép nguyên tên request.
3. Giữ các message gần nằm ngang, thứ tự trên xuống. Có thể thêm Activation vào lifeline nơi nhận request, dài tới khi xử lý xong.

Kết quả cần có:

```text
BookingUI ──submitBooking(...)──> BookingController
BookingUI < - - result - - - - BookingController
```

**Nếu bị vướng:** Mũi tên nét đứt trả kết quả không phải dependency Class, dù hình thức gần giống; ngữ cảnh diagram khác nhau.

### 3. Dựng alt bằng frame và hai ngăn

1. Tìm Frame / Combined Fragment trong UML, kéo bao quanh vùng xử lý điều kiện. Ghi alt ở góc trên trái.
2. Ghi guard ngăn trên [Available], kẻ đường phân cách ngang nét đứt và ghi guard ngăn dưới [Occupied / unavailable]. Nếu có sẵn combined fragment, chỉnh operand tương ứng.
3. Đặt các message đúng ngăn. Có thể dùng rectangle không tô nền + text + đường phân cách để dựng khung nếu không thấy shape fragment. Cho frame ra sau bằng Arrange → Send to Back để không che message.

Kết quả cần có:

```text
alt [Available]
    xử lý khi còn tài nguyên
---------------------------
[Occupied]
    báo không khả dụng
```

**Nếu bị vướng:** Đường phân ngăn chỉ là line, không có mũi tên. Nhãn guard nằm trong dấu [ ].

### 4. Lồng alt thứ hai và điền đúng thứ tự đề

1. Trong [Available], vẽ Controller → PaymentService → PaymentGateway và các kết quả trả về. Sau kết quả mới đặt alt [payment Success]/[payment Failure].
2. Success: «create» Reservation → ReservationRepository.save(...) → Room.markBooked() → RoomRepository.updateStatus(roomId, Booked) → UI success.
3. Failure chỉ báo lỗi về BookingUI và dừng: không create/save Reservation, không Room=Booked. Đối chiếu các method với Q1.

Kết quả cần có:

```text
[Available] → processDeposit()
  alt [Success] → create → save → Room=Booked
      [Failure] → showPaymentError() → STOP
[Occupied] → showRoomUnavailable() → STOP
```

**Nếu bị vướng:** Frame trong phải nằm trọn trong ngăn thành công của frame ngoài, không bao cả ngăn Occupied.

### Tự kiểm trước khi qua phần tiếp theo

- [ ] Lifeline có tên và message theo thời gian trên xuống.
- [ ] UI, control/service, repository và entity đều có mặt.
- [ ] Hai alt có guard và ngăn rõ ràng.
- [ ] Repository được gọi bằng method cụ thể.
- [ ] Payment Success nằm trước create Reservation; Failure không create.
- [ ] Tên method và status khớp Q1.

## Q3 · Activity Diagram: chia làn và vẽ quy trình

Check-out and Inspection ở Level 2 – Design: biết ai làm gì và khi nào mới kết thúc.

### Cần chuẩn bị

- **Swimlane:** Host | System / CheckoutService | Guest (Customer). Hai làn đầu là tối thiểu theo đề.
- **Action:** Hộp bo góc cho inspect, nhập kết quả, tính phí, lập invoice và cập nhật trạng thái.
- **Decision / Merge:** Hình thoi tách có/không phí và nhập lại hai phương án; guard đặt trên cạnh ra.
- **Initial / Activity Final:** Một tròn đặc bắt đầu; final dạng vòng tròn có chấm giữa.
- **Control Flow:** Connector nét liền có mũi tên chỉ thứ tự; không phải message request/return.

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

### Phân tích: Từ mô tả quy trình đến lane, action và điều kiện

Đọc theo từng động từ và gắn trách nhiệm trước khi kéo mũi tên. Activity trả lời ai làm gì, trong điều kiện nào, rồi bước tiếp theo là gì.

#### 1. Đọc use case, chọn điểm bắt đầu và phạm vi

1. Câu này là Check-out and Inspection, không phải đặt giao dịch mới hay đăng nhập. Viết một dòng xác định lúc quy trình bắt đầu và lúc kết thúc.
2. Actor xử lý là Host; System dùng CheckoutService. Có thể thêm Guest (Customer) nếu cần thể hiện trả tiền.
3. Lấy tên lane từ đề. Không giữ Car Owner/Staff khi đề đặt phòng yêu cầu Host, hoặc giữ Host khi đề thư viện yêu cầu Librarian.

```text
Bắt đầu: trả Room / bắt đầu kiểm tra
Kết thúc: đóng Reservation + cập nhật Room
```

#### 2. Đặt từng động từ vào đúng lane

1. Host thực hiện Inspect và Enter inspection result. System thực hiện Evaluate report, Calculate fee, Generate invoice và lưu status.
2. Mỗi action là một hộp bo góc với động từ ngắn. Nối từ initial theo thứ tự; khi đổi người chịu trách nhiệm, đường đi sang làn khác.
3. Level 2 – Design cần thể hiện Actor/Role và Component/Service. Tên System/CheckoutService làm rõ nơi xử lý thay vì dồn mọi action vào một làn chung.

```text
Host: Inspect → Enter report
System/Service: Evaluate report → Calculate fee
```

#### 3. Đổi điều kiện thành decision, không bỏ nhánh không phát sinh phí

1. Điều kiện là Damage found?. Có hỏng thì tính Damage Fee; không hỏng thì fee=0 và vẫn lập Final Invoice.
2. Decision dùng diamond có hai cạnh ra ghi guard. Hai phương án thay thế nhập lại bằng merge trước invoice/final amount.
3. Không dùng fork/join cho hai nhánh có/không phí: đó không phải hai luồng bắt buộc chạy song song.

```text
◇ Damage / Additional fee?
[yes] → Calculate fee ─┐
[no]  → Fee = 0 ──────┴→ merge → Invoice
```

#### 4. Xử lý thanh toán trước khi hoàn tất

1. Final Invoice = remaining stay balance + Damage Fee. Giả định remaining balance đã trừ Deposit; không cộng lại cọc để thu hai lần.
2. System lập invoice → Host yêu cầu Guest settle payment → Guest trả → System nhận xác nhận.
3. Không cần tự thêm nhánh ngoài phạm vi đề, nhưng mọi giả định để nối các bước còn thiếu phải hợp lý và được ghi rõ.

```text
Payment confirmed?
[yes] → hoàn tất giao dịch
[no] → chờ / thử lại (giả định)
```

#### 5. Ghi riêng tên đối tượng và trạng thái mới

1. Phải là Reservation.status=Completed và Room.status=Cleaning. Không viết Room=Completed hoặc Room=Available chỉ vì nhìn một mẫu trả xe.
2. Đặt bước lưu trạng thái trong System/service, rồi nối tới activity final. Soát đường đi của cả nhánh có phí và không phí.
3. Đọc từng action cuối theo mẫu “đối tượng nào → thuộc tính nào → giá trị mới gì” để tránh đổi nhầm status của hai entity.

```text
Reservation.status = Completed
Room.status = Cleaning
Persist both → ◎
```

#### Giải thích ngắn tham khảo

The activity separates Host, System/CheckoutService and Guest responsibilities. The System adds a Damage Fee only when damage is found, then waits for confirmed final payment. It completes the Reservation and changes the Room status to Cleaning before ending.

Chỉ dùng nếu đúng với hình và giả định của bài làm; không phải bảo đảm điểm.

### 1. Chia ba làn trước khi đặt action

1. Kéo Swimlane từ thư viện UML/General hoặc tìm Cross-functional flowchart. Thêm/nhân bản làn, đổi tên và tăng kích thước.
2. Đặt làn Host bên trái, System/Service ở giữa, Guest (Customer) bên phải. Tên lane hệ thống kèm service để rõ mức Design.
3. Kéo action vào trong đúng làn. Nếu lane được dùng như container, di chuyển thử lane để kiểm tra action đi cùng; tránh vô tình làm lane thành con của action.

Kết quả cần có:

```text
Host: inspect / enter report
System: evaluate / calculate / update
Guest: pay
```

**Nếu bị vướng:** Một action thuộc làn của người/component chịu trách nhiệm thực hiện nó. Không đặt calculate fee ở làn Host nếu đề nói System tính.

### 2. Thêm initial và các action

1. Kéo Initial tròn đặc, nối tới action Inspect bằng control flow nét liền có mũi tên.
2. Đặt Inspect Room và Enter inspection results ở làn Host; Evaluate report ở System.
3. Nhấp đúp action để ghi động từ ngắn. Kéo hộp rộng hơn nếu chữ bị che; đi theo luồng từ trên xuống.

Kết quả cần có:

```text
● → Inspect Room → Enter report → Evaluate report
```

**Nếu bị vướng:** Tên action mô tả việc đang làm, không phải tên trạng thái Requested/Completed. Không dùng hình tròn rỗng làm action đầu hoặc vẽ hộp không có đường nối.

### 3. Rẽ nhánh và gom về invoice

1. Kéo Decision hình thoi ghi Damage found?.
2. Hai cạnh ra ghi [yes]/[no] hoặc guard nghiệp vụ rõ. Có phí → Calculate fee; không phí → fee=0.
3. Dùng một diamond merge nhập lại hai phương án trước bước Generate invoice / final amount. Hai nhánh thay thế không cần fork/join.

Kết quả cần có:

```text
              ◇ điều kiện?
[yes] → Calculate fee ─┐
[no]  → Fee = 0 ──────┴→ ◇ merge → Invoice
```

**Nếu bị vướng:** Một đường vào, nhiều đường ra thường là decision; nhiều đường vào, một đường ra là merge. Diamond rẽ nhánh phải có nhãn guard ở cạnh; không dùng thoi đặc composition của Q1.

### 4. Thu tiền, xác nhận rồi cập nhật hai trạng thái

1. System lập Final Invoice; Host yêu cầu Guest trả tiền; Guest Settle payment; System decision Payment confirmed?.
2. Chưa xác nhận → chờ/thử lại theo giả định. Đã xác nhận → cập nhật giao dịch và tài nguyên ở làn System.
3. Ghi chính xác Reservation.status=Completed và Room.status=Cleaning, lưu cả hai rồi nối Activity Final. Không đặt Room=Available.

Kết quả cần có:

```text
Payment confirmed?
[yes] → Reservation=Completed
      → Room=Cleaning → persist → ◎
[no]  → wait / retry
```

**Nếu bị vướng:** Đọc câu cuối của đề để lấy tên trạng thái, không đoán theo mẫu. Chưa thanh toán thành công thì không đi tới action hoàn thành.

### Tự kiểm trước khi qua phần tiếp theo

- [ ] Tiêu đề ghi Level 2 – Design.
- [ ] Có ít nhất hai lane đúng vai trò/component.
- [ ] Action nằm ở đúng lane.
- [ ] Decision có guard, hai nhánh được merge hợp lý.
- [ ] Sau payment confirmed: Completed + Cleaning.
- [ ] Có initial và activity final.

## Lưu .drawio và xuất hình để đưa vào bài nộp

Giữ nguồn chỉnh sửa, đồng thời có ảnh rõ chữ cho đúng từng câu.

### Cần chuẩn bị

- **File .drawio:** Bản nguồn chỉnh sửa đầy đủ các trang.
- **Ảnh cho Q1, Q2, Q3:** PNG hoặc định dạng được đề cho phép để chèn vào bài nộp.
- **Quy định nộp:** Tên file và Word/archive theo đề đầy đủ; ảnh StayEase hiện chưa có phần này.

### 1. Soát và lưu nguồn

1. Mở lần lượt tab Q1, Q2, Q3; kiểm tra không sót placeholder, nhãn bị che hoặc mũi tên rời.
2. Ctrl+S lưu .drawio. Đóng/mở lại bản vừa lưu nếu cần kiểm tra; xác nhận vẫn có đủ trang.
3. Giữ bản mẫu riêng để có thể quay lại khi sửa nhầm.

Kết quả cần có:

```text
Một file .drawio chỉnh sửa được, đủ các trang bài làm.
```

**Nếu bị vướng:** Save .drawio và Export PNG là hai thao tác khác nhau.

### 2. Xuất từng câu thành ảnh

1. Chọn tab Q1, bỏ chọn đối tượng nếu không muốn chỉ xuất một phần. File → Export as → PNG; chọn xuất toàn trang/diagram thay vì Selection only.
2. Xem kích thước/zoom ở hộp export và tăng nếu chữ nhỏ; kiểm tra ảnh xuất ra ở kích thước đọc thực tế. Có thể bật tùy chọn nhúng dữ liệu diagram nếu muốn, nhưng vẫn giữ .drawio riêng.
3. Lưu Q1_Class.png, lặp với Q2_Sequence.png và Q3_Activity.png hoặc Q3_State.png. Đây là tên ảnh gợi ý khi luyện tập.

Kết quả cần có:

```text
Mỗi câu có một ảnh đầy đủ, đọc được method/guard/multiplicity.
```

**Nếu bị vướng:** Không dùng ảnh chụp màn hình cắt mất nhánh Occupied hoặc final ở đáy.

### 3. Đưa vào bài nộp và mở kiểm tra lần cuối

1. Chèn đúng ảnh vào đúng mục Q1/Q2/Q3 của tài liệu bài làm nếu đề yêu cầu Word; dùng trang ngang hoặc hình lớn khi cần để còn đọc được chữ.
2. Ghi giả định thiết kế ngắn cạnh hình: transaction lưu deposit, cách chờ thanh toán, cardinality phụ thuộc vòng đời nếu có.
3. Đặt tên file/đóng archive theo hướng dẫn của ca thi. Mở thử file cuối và xem đủ ba hình trước khi nộp.

Kết quả cần có:

```text
Bài nộp đúng định dạng đề yêu cầu, không chỉ có nguồn .drawio.
```

**Nếu bị vướng:** Đừng áp dụng tên file/mã môn hoặc 85 phút từ đề khác khi ảnh đề hiện tại chưa cho thông tin đó.

### Tự kiểm trước khi qua phần tiếp theo

- [ ] Lưu .drawio thành công.
- [ ] Xuất đủ 3 ảnh, không chỉ vùng đang chọn.
- [ ] Đọc được chữ khi đưa vào tài liệu.
- [ ] Đúng thứ tự Q1/Q2/Q3.
- [ ] Tên và định dạng file theo đề thực tế.

## Tài liệu thao tác draw.io

- [Bật thư viện UML](https://www.drawio.com/docs/diagram-types/uml/)
- [Sửa Class và các hàng](https://www.drawio.com/docs/diagram-types/uml/class-diagrams/)
- [Lifeline và Sequence](https://www.drawio.com/docs/diagram-types/uml/sequence-diagrams/)
- [Kiểu đường nối](https://www.drawio.com/docs/manual/styles/connector-styles/)
- [Nhãn trên đường nối](https://www.drawio.com/docs/manual/connectors/connector-labels/)
- [Hình cho Activity](https://www.drawio.com/docs/diagram-types/uml/activity-diagrams/)
- [Mở file](https://www.drawio.com/docs/manual/open-diagram-file/)
- [Lưu và xuất ảnh](https://www.drawio.com/docs/manual/export/export-diagram/)

Ảnh StayEase không có thời gian hay quy cách nộp. Tuân theo hướng dẫn của đề đầy đủ; .drawio là nguồn chỉnh sửa.
