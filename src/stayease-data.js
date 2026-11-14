export const stayeaseCase = {
  title: 'StayEase · Đề trong de_chua_giai', tag: 'Đã giải · 4 ảnh đề gốc',
  system: 'StayEase', actor: 'Customer', staff: 'Host', resource: 'Room', record: 'Reservation', payment: 'Payment',
  usecase: 'Book Room and Pay Deposit', third: 'Activity', returnCase: 'Check-out and Inspection',
  durationLabel: 'Không có trong ảnh',
  formatNote: 'Bốn ảnh chỉ có Business Overview và Q1–Q3, không có thời gian, mã đề hay cách nộp. Không suy ra các quy định đó từ đề khác. Q2 bắt buộc Layered Architecture.',
  summary: 'Customer chọn phòng và ngày → BookingController kiểm tra Room → PaymentService thu cọc → thành công mới tạo/lưu Reservation và Room=Booked. Checkout: Host kiểm tra phòng; System tính phí hỏng nếu có và lập invoice; Guest trả tiền; sau xác nhận Reservation=Completed, Room=Cleaning.',
  relations: ['Customer và Host kế thừa User. Guest ở Q3 là Customer đang lưu trú.', 'Customer 1 — 0..* Reservation; Room 1 — 0..* Reservation theo lịch sử; mỗi Reservation gắn đúng 1 Room.', 'Reservation 1 ◆— 1..* Payment: composition BẮT BUỘC vì Payment không tồn tại nếu thiếu Reservation; loại Deposit / FinalPayment.', 'BookingService phụ thuộc repository INTERFACES. Concrete repositories thực hiện IGenericRepository<T> qua interface chuyên biệt.', 'Q2 giữ BookingUI, BookingController, RoomRepository, PaymentService, ReservationRepository và các entity Reservation, Room.'],
  branches: ['[Available] / [Occupied]', '[payment Success] → create Reservation → save → Room=Booked', '[payment Failure] → error → stop; KHÔNG tạo Reservation', 'Checkout: [damage found] / [no damage]; sau payment confirmed: Reservation=Completed, Room=Cleaning'],
  statuses: 'Reservation: Confirmed → Completed; Room: Available → Booked → Cleaning. Confirmed là giả định tên trạng thái sau khi trả cọc.',
  sample: 'StayEase connects Hosts with Customers. Customer and Host inherit User. A payment record cannot exist without a corresponding reservation. BookingController checks RoomRepository, then PaymentService processes Deposit Payment. If successful create and save Reservation, update Room to Booked. If failed return error and stop. Host inspects room, System calculates Damage Fee and Final Invoice. After payment is confirmed Reservation is Completed and Room is Cleaning.',
  source: 'de_chua_giai: 4 ảnh JPG (Business Overview, Question 1, Question 2, Question 3)',
};

export const stayeaseExam = {
  source: '4 ảnh JPG trong de_chua_giai · chép lại từ ảnh, giữ nội dung yêu cầu',
  images: ['exams/stayease/overview.jpg', 'exams/stayease/q1.jpg', 'exams/stayease/q2.jpg', 'exams/stayease/q3.jpg'],
  overview: `StayEase is a comprehensive digital platform designed to connect Property Owners (Hosts) with Travelers (Customers). The system streamlines the entire process of finding, reserving, and managing short-term accommodations.

Customers: Can search for available rooms based on location and dates, create reservations, and process payments. They are responsible for paying a deposit to confirm their booking.
Hosts: Responsible for listing their properties, managing room details (amenities, pricing), and performing room inspections upon guest departure.
Staff/Administrators: Oversee the platform's operations, manage user accounts, and generate financial reports.`,
  questions: [
    { title: 'Question 1 (3.0 points) – Design-level Class Diagram', text: `Business Scenario: You are required to design a design-level Class Diagram for the StayEase homestay booking system. The system is built around a predefined set of classes representing users, rooms, reservations, and payments. Your task is to enrich these classes with appropriate attributes, methods, and relationships to reflect the business logic.

In this system, different types of users exist with shared and specialized responsibilities. Customers can browse and create reservations, each Reservation is associated with a specific Room, and Payments are recorded for each reservation to track deposits and final balances. The system follows the Repository Pattern to separate business logic from data access logic, ensuring the service layer remains independent of the database implementation.

Your Class Diagram must satisfy the following requirements:
Inheritance: The classes Customer and Host (Property Owner) are specialized types of User and must inherit from it.
Multiplicity & Association: A customer can create multiple reservations, while each reservation is linked to exactly one room.
Composition: A reservation involves one or more payments (such as a 'Deposit' or 'Final Payment'). A payment record cannot exist without a corresponding reservation.
Layered Dependency: Business logic related to room availability and booking is handled by a service class (BookingService). This service class depends on repository interfaces to interact with data.
Interface Implementation: All repository classes (e.g., RoomRepository, ReservationRepository) must implement a generic interface named IGenericRepository.

Your diagram must correctly apply UML relationships, including:
Inheritance (Generalization) and Interface Implementation (Realization).
Association, Aggregation, and Composition where appropriate.
Dependency relationships between the Service layer and the Repository layer.
Multiplicity, attributes, and methods should be defined clearly and reasonably for each class (e.g., status for Rooms, totalAmount for Reservations).` },
    { title: 'Question 2 (4.0 points) – Sequence Diagram', text: `Business Scenario: A Customer wants to book a homestay room through the StayEase platform. The process starts when the customer interacts with the BookingUI (a boundary object) to submit their booking request (Room ID and dates).

The request is handled by a BookingController (a control object). The system then performs the following steps:
1. The controller calls a RoomRepository to verify the current status and availability of the selected room for the given dates.
2. If the room is available, the controller proceeds to call a PaymentService to process a mandatory Deposit Payment via an external gateway.
3. Depending on the payment result:
If successful: The controller creates a new Reservation record, saves it using the ReservationRepository, and updates the room's status to "Booked".
If failed: The controller returns an error message to the BookingUI and the process stops.

Your Sequence Diagram must meet the following requirements:
The diagram must be designed using Layered Architecture.
The interaction flow must clearly show:
A user-facing component (BookingUI).
A controller/service component handling business logic (BookingController).
Repository components responsible for data access (RoomRepository, ReservationRepository).
Domain entities such as Reservation and Room.
Repository Pattern usage must be explicit through repository method calls (e.g., getById, save, updateStatus).
Conditional behavior must be modeled using alt (alternative) fragments for:
1. Room availability (Available vs. Occupied).
2. Payment status (Success vs. Failure).` },
    { title: 'Question 3 (3.0 points) – Activity Diagram', text: `Use Case: Check-out and Inspection

Business Scenario: This workflow describes the process when a Guest checks out of a homestay. The Host (Property Owner) must perform a physical inspection of the room to ensure no damage has occurred.

The process follows these steps:
1. The Host starts by inspecting the room condition.
2. The Host then enters the inspection results into the StayEase system.
3. The System evaluates the inspection report:
If damage is found: The System calculates an additional Damage Fee and adds it to the Final Invoice.
If no damage is found: The System generates the Final Invoice based only on the remaining stay balance.
4. The Host requests the Guest to settle the payment.
5. After the payment is confirmed, the System updates the Reservation status to "Completed" and changes the Room status to "Cleaning".

Task: You are required to model this process using an Activity Diagram with the following characteristics:
The diagram must include at least two swimlanes representing Host and System responsibilities.
Decision nodes must be used to determine whether additional fees (Damage Fees) are applied.
The workflow must clearly show the update of both Reservation and Room statuses.
Start and end points of the activity must be clearly indicated using proper UML notation.
Your diagram must be created at the design level, including Actors/Roles and Components/Services.` },
  ],
};

const s = (title, quote, terms, meaning, actions, example, transfer, pitfall) => ({title, quote, terms, meaning, actions, example, transfer, pitfall});
export const stayeaseLessons = [
  [
    s('Tạo User, Customer và Host', 'The classes Customer and Host (Property Owner) are specialized types of User and must inherit from it.', ['Customer', 'Host', 'specialized types', 'User', 'inherit'], 'Hai vai trò dùng chung dữ liệu User. Guest ở Q3 là Customer lúc trả phòng.', ['Tạo User {abstract}: id, fullName, email.', 'Tạo Customer có searchRooms(), bookRoom(); Host có listRoom(), inspectRoom(). Staff/Admin có thể bổ sung, nhưng không thay hai lớp được chỉ định.', 'Nối Customer → User và Host → User: nét liền, tam giác rỗng ở User.'], 'Customer ──▷ User ◁── Host', 'specialized types / inherit → generalization.', 'Không giữ tên Staff từ mẫu thuê xe thay cho Host.'),
    s('Ghi đúng số lượng Reservation và Room', 'A customer can create multiple reservations, while each reservation is linked to exactly one room.', ['multiple reservations', 'exactly one room'], 'Một khách đặt nhiều lần. Một Reservation chỉ chọn một Room; một Room có nhiều Reservation ở các ngày khác nhau.', ['Room có id, location, nightlyRate, status; Reservation có id, startDate, endDate, totalAmount, depositAmount, status.', 'Nối Customer 1—0..* Reservation; số 1 gần Customer, 0..* gần Reservation.', 'Nối Room 1—0..* Reservation. Thêm ràng buộc không có hai Reservation hiệu lực trùng ngày cho cùng một Room.'], 'Customer 1 ─── 0..* Reservation\nRoom     1 ─── 0..* Reservation', 'Đọc cả hai chiều; startDate/endDate hỗ trợ kiểm tra phòng theo ngày.', 'Không ghi Room 1—1 Reservation cho toàn lịch sử.'),
    s('Composition Payment là bắt buộc', "A reservation involves one or more payments (such as a 'Deposit' or 'Final Payment'). A payment record cannot exist without a corresponding reservation.", ['one or more payments', 'Deposit', 'Final Payment', 'cannot exist without'], 'Đề đã nói rõ Payment không tồn tại độc lập với Reservation.', ['Tạo Payment: id, amount, type, status, gatewayRef; type là Deposit hoặc FinalPayment.', 'Nối Reservation 1 ◆—1..* Payment: thoi đặc ở Reservation.', 'Q2 chỉ tạo Reservation sau payment success. Trước đó PaymentService nhận receipt; khi thành công lưu Reservation và owned Deposit Payment trong một aggregate/transaction (giả định).'], 'Reservation 1 ◆──── 1..* Payment\nPayment.type = Deposit | FinalPayment', 'cannot exist without → vòng đời phụ thuộc.', 'Không đảo thoi sang Payment hoặc dùng 0..1 như Fine.'),
    s('Service phụ thuộc repository interfaces', 'This service class depends on repository interfaces to interact with data.', ['depends on', 'repository interfaces'], 'BookingService dùng contract, không buộc vào triển khai database.', ['Tạo BookingService: checkAvailability(...), createReservation(...).', 'Tạo IGenericRepository<T>: getById, save, update. IRoomRepository/IReservationRepository/IPaymentRepository kế thừa generic contract với kiểu tương ứng.', 'Concrete repositories realization nét đứt tam giác rỗng → interface chuyên biệt; BookingService dependency nét đứt → interface. Nhờ kế thừa contract, concrete repositories cũng thực hiện IGenericRepository<T>.'], 'IRoomRepository ──▷ IGenericRepository<Room>\nRoomRepository - - ▷ IRoomRepository\nBookingService - - > IRoomRepository', 'Giữ đúng tên generic interface đề cho: IGenericRepository.', 'Không chỉ nối Service tới concrete classes rồi bỏ interface.'),
    s('Điền method khớp Q2 và checkout', 'Multiplicity, attributes, and methods should be defined clearly and reasonably for each class (e.g., status for Rooms, totalAmount for Reservations).', ['attributes', 'methods', 'status', 'totalAmount'], 'Method phải hỗ trợ check room, trả cọc, lưu reservation và checkout.', ['RoomRepository: getById, isAvailable(roomId,start,end), updateStatus. ReservationRepository: save(reservationWithDeposit).', 'PaymentService: processDeposit(...): PaymentResult; BookingController: submitBooking(...): Result.', 'CheckoutService: evaluateInspection, generateFinalInvoice, completeCheckout; Room.markBooked(), Room.markCleaning(); Reservation.complete().'], 'Room.status = Available | Booked | Cleaning\nReservation.totalAmount: Decimal\nPaymentService.processDeposit(...): PaymentResult', 'Đối chiếu tên method giữa Class và Sequence.', 'Room sau checkout phải là Cleaning theo đề.'),
  ],
  [
    s('Giữ đúng BookingUI và BookingController', 'The process starts when the customer interacts with the BookingUI (a boundary object) to submit their booking request (Room ID and dates).', ['BookingUI', 'boundary object', 'Room ID and dates'], 'Q2 chỉ định rõ component và bắt buộc Layered Architecture.', ['Xếp Customer, BookingUI, BookingController, RoomRepository, PaymentService, PaymentGateway, ReservationRepository, :Room, :Reservation.', 'Customer → BookingUI: submitBooking(roomId,start,end); UI → BookingController: submitBooking(...).', 'Controller là tầng điều phối ứng dụng, dùng repository qua interface. Q1 vẫn có BookingService; Q2 giữ đúng các lời gọi trực tiếp từ Controller mà đề chỉ định.'], 'Customer → BookingUI → BookingController\nController → RoomRepository / PaymentService / ReservationRepository', 'Ưu tiên tên component đề cho sẵn.', 'Không thay BookingController bằng ReservationService hoặc dùng Microservices.'),
    s('Kiểm tra theo ngày và dựng alt ngoài', 'The controller calls a RoomRepository to verify the current status and availability of the selected room for the given dates.', ['RoomRepository', 'availability', 'given dates'], 'Kiểm tra cả status và khoảng đặt phòng. Nhánh Occupied không được thu cọc.', ['Controller → RoomRepository: getById(roomId) → room; sau đó isAvailable(roomId,start,end).', 'Thể hiện :Room tham gia kiểm tra; dùng nét đứt cho kết quả trả về.', 'Khung alt [Available]/[Occupied]. Occupied → showRoomUnavailable() về UI rồi dừng.'], 'getById(roomId) → room\nisAvailable(roomId,start,end) → available\nalt [Available] / [Occupied]', 'given dates nghĩa là không chỉ check status hiện tại.', 'Không đặt payment ở ngoài alt khiến phòng Occupied vẫn bị thu tiền.'),
    s('Thu Deposit trước khi tạo Reservation', 'If the room is available, the controller proceeds to call a PaymentService to process a mandatory Deposit Payment via an external gateway.', ['PaymentService', 'mandatory Deposit Payment', 'external gateway'], 'Khác AutoGo: StayEase trả cọc trước, thành công mới tạo Reservation.', ['Trong [Available], Controller → PaymentService: processDeposit(...).', 'PaymentService → PaymentGateway: chargeDeposit(amount,requestId); nhận paymentResult + receipt.', 'PaymentService trả kết quả cho Controller; chưa đặt «create» Reservation ở phía trên bước này.'], 'Controller → PaymentService: processDeposit(...)\nPaymentService → PaymentGateway: chargeDeposit(...)\nPaymentGateway - - → PaymentService: result\nPaymentService - - → Controller: result', 'Đọc lại thứ tự đề mới; không có quy tắc create-before-payment cho mọi bài.', 'Không copy luồng Pending Booking trước payment của AutoGo.'),
    s('Success mới tạo, lưu Reservation và đổi Room=Booked', 'If successful: The controller creates a new Reservation record, saves it using the ReservationRepository, and updates the room\'s status to "Booked".', ['If successful', 'creates', 'ReservationRepository', 'Booked'], 'Các mũi tên tạo/lưu/cập nhật chỉ nằm trong ngăn payment Success.', ['Lồng alt [payment Success]/[payment Failure] bên trong [Available].', 'Success: «create» :Reservation(...,Confirmed), gọi ReservationRepository.save(reservationWithDeposit(receipt)). Confirmed là giả định tên trạng thái đã trả cọc.', 'Sau lưu, :Room.markBooked(); RoomRepository.updateStatus(roomId,Booked); trả success/reservationId về BookingUI.'], '[payment Success]\n  «create» Reservation\n  ReservationRepository.save(reservationWithDeposit)\n  Room.markBooked()\n  RoomRepository.updateStatus(roomId,Booked)', 'Bám thứ tự creates → saves → updates.', 'Không đổi Room=Booked trước payment hoặc quên lưu Reservation.'),
    s('Failure trả lỗi và dừng, không tạo Reservation', 'If failed: The controller returns an error message to the BookingUI and the process stops.', ['If failed', 'error message', 'process stops'], 'Không tạo Reservation và không đổi Room thành Booked khi payment thất bại.', ['Trong ngăn [payment Failure], Controller → BookingUI: showPaymentError().', 'UI báo lỗi cho Customer; không create/save/markBooked trong ngăn này.', 'Phân biệt Occupied (không thu cọc) với payment Failure (đã thử thu nhưng không thành công). Lỗi lưu sau thu thành công cần compensation riêng nếu mở rộng, không trộn vào payment Failure của đề.'], '[payment Failure]\n  showPaymentError() → STOP\n  no Reservation; no Room=Booked', '“process stops” giới hạn phần xử lý nhánh này.', 'Không cancel một Reservation chưa từng được tạo.'),
  ],
  [
    s('Host kiểm tra và nhập; System đánh giá', 'The Host then enters the inspection results into the StayEase system.', ['Host', 'inspection results', 'StayEase system'], 'Host kiểm tra vật lý và nhập kết quả. System xử lý báo cáo và tính phí.', ['Tạo làn Host, System/CheckoutService, Guest(Customer); tối thiểu Host và System.', 'Initial ● ở Host → Inspect room condition → Enter inspection results.', 'Nối sang System → Evaluate inspection report; ghi Level 2 – Design.'], 'Host: ● → Inspect room → Enter results\nSystem/CheckoutService: Evaluate report', 'Guest ánh xạ Customer, không cần class Guest mới.', 'Không dùng Staff từ mẫu trả xe thay Host.'),
    s('Tách có/không damage trước khi lập invoice', 'If damage is found: The System calculates an additional Damage Fee and adds it to the Final Invoice.', ['If damage is found', 'Damage Fee', 'Final Invoice'], 'Có hỏng thì cộng phí; không hỏng vẫn lập invoice từ số dư còn lại.', ['Decision “Damage found?” ở System.', '[damage found] → Calculate Damage Fee; [no damage] → Damage Fee=0. Dùng merge gom lại.', 'Final Invoice = remaining stay balance + damageFee. Giả định remaining balance đã trừ Deposit; không thu cọc hai lần.'], '◇ Damage found?\n[yes] → Calculate Fee ─┐\n[no]  → Fee = 0 ──────┴→ merge\nFinal Invoice = remaining balance + fee', 'Điều kiện là damage, không tự thêm overdue của Library.', 'Không bỏ invoice ở nhánh không hỏng.'),
    s('Host yêu cầu Guest trả tiền rồi chờ xác nhận', 'The Host requests the Guest to settle the payment.', ['Host', 'Guest', 'settle the payment'], 'Host yêu cầu, Guest trả tiền, System xác nhận trước khi hoàn tất.', ['System đưa invoice cho Host; Host: Request Guest to settle payment.', 'Guest: Settle final payment; System nhận kết quả và decision “Payment confirmed?”.', '[not confirmed] chờ/thử lại theo giả định. [confirmed] mới cập nhật trạng thái.'], 'System: Generate invoice\nHost: Request payment → Guest: Pay\nSystem: Payment confirmed?\n[no] → wait/retry; [yes] → complete', 'after payment confirmed là điều kiện bắt buộc.', 'Không đóng Reservation trước xác nhận thanh toán.'),
    s('Kết thúc bằng Completed và Cleaning', 'After the payment is confirmed, the System updates the Reservation status to "Completed" and changes the Room status to "Cleaning".', ['payment is confirmed', 'Completed', 'Cleaning'], 'Cần cập nhật hai đối tượng; Room chờ dọn sau khi khách đi.', ['Ở System, Reservation.status=Completed.', 'Room.status=Cleaning; persist cả hai, có thể trong một action transaction.', 'Đi tới final ◎. Soát các guard yes/no và đường đi của cả nhánh damage/no damage.'], 'System: Reservation.status = Completed\nSystem: Room.status = Cleaning\nPersist updates → ◎', 'Giữ nguyên tên status nếu đề chỉ định.', 'Không đổi Room sang Available: ảnh đề ghi Cleaning.'),
  ],
];
