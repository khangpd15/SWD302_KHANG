# Sổ tay đọc ký hiệu và sửa lỗi UML

Diễn giải từ ba PDF được cung cấp, kèm ví dụ theo đề. Ưu tiên yêu cầu đề thi; ký hiệu nâng cao chỉ dùng khi cần.

## StayEase · Q1

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

## StayEase · Q2

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

## StayEase · Q3

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

## MediCare · Q3

### Lập bảng chuyển trạng thái rồi mới kéo mũi tên

Đối tượng đang theo dõi là một Appointment. Cùng một event có thể cho kết quả khác nhau tùy state hiện tại; danh sách hành động của nhiều người chưa phải State Diagram.

Tham khảo: State-Machine-Diagram.pdf · trang 2–6.

| State nguồn | event [guard] / effect | State đích |
| --- | --- | --- |
| Requested | payFee [success] / savePayment | Paid |
| Paid | confirmAppointment | Confirmed |
| Confirmed | startExamination | InProgress |
| InProgress | finishExamination / issueMedicalRecord | Completed |
| Requested | payFail / releaseSlot | Cancelled |
| Paid | cancelAppointment [allowed] / releaseSlot | Cancelled (ghi giả định chính sách hủy) |

**Ví dụ sai:** Hộp “Pay fee” → hộp “Confirm appointment”; hoặc đặt releaseSlot ở exit / releaseSlot của Requested

**Sửa thành:** Hộp Requested ─ payFee [success] / savePayment → hộp Paid; chỉ releaseSlot trên nhánh hủy cần giải phóng.

Tên hộp là tình trạng. exit chạy mỗi lần rời state: đặt releaseSlot ở exit của Requested sẽ giải phóng cả khi thanh toán thành công.

**Tự trả lời:** Trong payFee [success] / savePayment, đâu là event, guard và effect? Vào final có đồng nghĩa xóa Appointment khỏi database không?

**Đáp án:** payFee là event; success là guard được kiểm tra khi xét chuyển; savePayment là effect thực hiện trên chuyển đó. Final kết thúc region đang xét, không tự xóa entity khỏi database.

**Chỉ thêm khi cần:** entry / action chạy mỗi lần vào state; do / activity thực hiện trong state; exit / action chạy khi rời state. Composite, history và các vùng song song chỉ cần khi đề có hành vi đó; bài MediCare hiện tại dùng state đơn đã đủ diễn đạt vòng đời.

## Tài liệu chính thức để đối chiếu

- [Class và thao tác draw.io](https://www.drawio.com/docs/diagram-types/uml/class-diagrams/)
- [Sequence: lifeline, message, fragment](https://docs.staruml.io/v7/working-with-uml-diagrams/sequence-diagram/)
- [State Machine: state, event và transition](https://www.visual-paradigm.com/guide/uml-unified-modeling-language/what-is-state-machine-diagram/)
