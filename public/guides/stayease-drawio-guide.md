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
