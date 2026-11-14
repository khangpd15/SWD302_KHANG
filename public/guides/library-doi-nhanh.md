# Library — đọc đề và đổi chữ nhanh

Bộ .drawio được dựng lại theo drawio_thiet_ke_chuan.drawio: Class từng dòng, Sequence có lifeline/activation/alt, Activity có System/nhân viên/khách. State bổ sung riêng cho MediCare theo đề.

1. Chọn đúng đề và Q. Đọc các câu trích dẫn để nhận diện yêu cầu.
2. Dùng bảng tên: tìm chữ bằng Ctrl+F; nhấp đúp đúng tiêu đề/dòng để sửa. Đổi cùng Entity, Repository, ID, message và lane.
3. Dùng bảng sửa luồng. Tên đúng chưa đủ nếu số lượng, guard, thứ tự tạo và trạng thái khác đề.

## Q1 · Thay tên lớp, rồi sửa thuộc tính và quan hệ

**Đọc:** Đọc Business Overview để lấy người / tài nguyên / giao dịch / tiền. Đọc Requirements Q1 để lấy kế thừa, số lượng và tầng Service/Repository.

**Tìm trên mẫu:** Trong tab Q1, đi từ Controller → Service → generic interface → repositories → entities. Các class có từng dòng thuộc tính/method riêng như mẫu mới.

| Vai trò | Chữ trong mẫu gốc | Đổi thành | Sửa kèm |
| --- | --- | --- | --- |
| Tên hệ thống | StayEase | Library | Tiêu đề, UI; không tự tạo class tên hệ thống. |
| Người dùng chính | Customer | Reader | Entity, Repository, lifeline, lane và tham số actorId. |
| Người xử lý | Host | Librarian | Entity, Repository, quan hệ kế thừa và lane kiểm tra/duyệt. |
| Tài nguyên | Room | BookCopy | Entity + Repository + field ID + availability + trạng thái cuối. |
| Giao dịch | Reservation | Loan | Entity + Repository + Service/Controller nếu đề cho phép + save/update. |
| Tiền / phạt | Payment | Fine | Entity + Repository + amount + guard trả tiền; Fine không luôn tồn tại. |

### Entity / Repository

Room → BookCopy; RoomRepository → BookCopyRepository

Đổi cả roomId → bookCopyId; đọc lại kiểu dữ liệu và method, không chỉ thay tiêu đề.

### Bội số gần Payment

0..1 Fine

“at most one” → 0..1, không giữ 1..* của mẫu phòng.

### Đầu thoi / tam giác

Book ◆— BookCopy (giả định)

Tam giác về lớp cha/interface; thoi về whole. Không dùng has/contains để đoán vòng đời.

### Dừng lại để soát

- [ ] Tên class ở Q1 khớp receiver và method ở Q2.
- [ ] Mỗi đường có nghĩa đúng và bội số theo đề; không mang quan hệ phòng sang sách/lịch khám.
- [ ] Giữ Book khác BookCopy; Reader là lớp cha của Student và Lecturer; Librarian duyệt yêu cầu.

Giữ Book khác BookCopy; Reader là lớp cha của Student và Lecturer; Librarian duyệt yêu cầu.

### Câu đề cần đọc và việc cần làm

> Student, Lecturer, and Librarian must be specialized types of User using inheritance.

**Đưa vào hình:** Tạo User có id, name, email; tạo Student, Lecturer và Librarian.

> A Book contains multiple BookCopy objects.

**Đưa vào hình:** Tạo Book: isbn, title, author; BookCopy: copyId, status.

> Each Loan is associated with exactly one BookCopy.

**Đưa vào hình:** Tạo Loan với id, borrowDate, dueDate, returnDate, status.

> A Loan may be associated with at most one Fine.

**Đưa vào hình:** Tạo Fine có amount, reason, status và markPaid().

> Repository classes must implement a generic Repository<T> interface.

**Đưa vào hình:** Tạo một hộp interface tên «interface» Repository<T>, ghi + findById(id: Long): T và + save(entity: T): T.

## Q2 · Đổi cột, lời gọi, guard rồi kiểm tra thứ tự

**Đọc:** Đọc tên use case, ai bắt đầu, dữ liệu nhập và từng câu if / when / success / failure. Viết thứ tự tạo giao dịch so với thanh toán trước khi sửa mũi tên.

**Tìm trên mẫu:** Trong tab Q2: actor → UI → controller/service; các cột Repository/Entity/Gateway ở phía phải. Alt ngoài kiểm tra điều kiện, alt trong là kết quả xử lý.

| Vai trò | Chữ trong mẫu gốc | Đổi thành | Sửa kèm |
| --- | --- | --- | --- |
| Tên hệ thống | StayEase | Library | Tiêu đề, UI; không tự tạo class tên hệ thống. |
| Người dùng chính | Customer | Reader | Entity, Repository, lifeline, lane và tham số actorId. |
| Người xử lý | Host | Librarian | Entity, Repository, quan hệ kế thừa và lane kiểm tra/duyệt. |
| Tài nguyên | Room | BookCopy | Entity + Repository + field ID + availability + trạng thái cuối. |
| Giao dịch | Reservation | Loan | Entity + Repository + Service/Controller nếu đề cho phép + save/update. |
| Tiền / phạt | Payment | Fine | Entity + Repository + amount + guard trả tiền; Fine không luôn tồn tại. |

### Kiểm tra đầu tiên

isAvailable(bookcopyId, start, end)

Bổ sung hasUnpaidFine(readerId) và countActiveLoans(readerId); guard phải đủ cả 3 điều kiện.

### Thứ tự bắt buộc

available + eligible → create Loan(Requested) → Librarian approves

Thay Payment Success/Failure bằng Approved/Rejected; không giữ gateway thanh toán của mẫu.

### Alt ngoài / trong

[available AND noUnpaidFine AND belowLimit] → [approved] / [rejected]

Nhánh lỗi trả thông báo rồi dừng; alt trong nằm gọn trong ngăn đủ điều kiện.

### Lưu và cập nhật

save Loan → Borrowed khi Approved

Nói rõ entity nào được lưu. Giữ nhánh unavailable, failure/rejected và kết quả về UI.

### Dừng lại để soát

- [ ] Đọc riêng đường thành công và từng đường thất bại từ trên xuống.
- [ ] Instance chỉ nhận message sau lúc tạo; reply trả về bên gọi; message khớp method Q1.
- [ ] Giữ Book khác BookCopy; Reader là lớp cha của Student và Lecturer; Librarian duyệt yêu cầu.

Giữ Book khác BookCopy; Reader là lớp cha của Student và Lecturer; Librarian duyệt yêu cầu.

### Câu đề cần đọc và việc cần làm

> The system checks whether an available copy exists and whether the reader is eligible to borrow (e.g., no unpaid fines and below the borrowing limit).

**Đưa vào hình:** Tạo lifeline Reader, Library UI, LoanService, BookCopyRepository, FineRepository, LoanRepository, :BookCopy, :Loan, :Fine và Librarian.

> If the conditions are satisfied, a loan is created and a librarian approves the request and hands over the book copy.

**Đưa vào hình:** Trong nhánh đủ điều kiện, tạo :Loan(Requested), gọi LoanRepository.save(loan).

> If no copy is available or the reader is not eligible, the process ends without creating a loan.

**Đưa vào hình:** Đặt showUnavailableOrIneligible() trong ngăn thất bại của alt đầu tiên.

## Q3 · Activity: đổi lane, điều kiện phí và hai trạng thái cuối

**Đọc:** Đọc riêng use case trả tài nguyên/checkout. Gạch động từ, ghi ai làm từng việc và điều kiện nào cho phép hoàn tất.

**Tìm trên mẫu:** Tab Q3 dùng thứ tự lane như mẫu: System/service | nhân viên | khách. Bắt đầu ở khách, đi qua kiểm tra, tính phí, thanh toán và lưu trạng thái.

| Vai trò | Chữ trong mẫu gốc | Đổi thành | Sửa kèm |
| --- | --- | --- | --- |
| Tên hệ thống | StayEase | Library | Tiêu đề, UI; không tự tạo class tên hệ thống. |
| Người dùng chính | Customer | Reader | Entity, Repository, lifeline, lane và tham số actorId. |
| Người xử lý | Host | Librarian | Entity, Repository, quan hệ kế thừa và lane kiểm tra/duyệt. |
| Tài nguyên | Room | BookCopy | Entity + Repository + field ID + availability + trạng thái cuối. |
| Giao dịch | Reservation | Loan | Entity + Repository + Service/Controller nếu đề cho phép + save/update. |
| Tiền / phạt | Payment | Fine | Entity + Repository + amount + guard trả tiền; Fine không luôn tồn tại. |

### Lane & action

Host → Librarian; Guest → Reader; inspect Room → inspect BookCopy

Đổi cả tên lane và danh từ trong từng action. Loại luồng đăng nhập trong canvas gốc.

### Decision tính phí

late OR damaged

Trễ HOẶC hỏng đều tính Fine; không chỉ xét hỏng như mẫu phòng.

### Thanh toán

Fine > 0 mới yêu cầu trả Fine

Không Fine thì đi thẳng tới đóng Loan.

### Hai status cuối

Loan=Closed; BookCopy=Available nếu không hỏng

Tên entity và status là hai việc khác nhau. Không đổi Room thành Car rồi giữ Cleaning nếu đề trả xe yêu cầu khác.

### Dừng lại để soát

- [ ] Có initial/final, lane đúng người, nhánh có/không phí đầy đủ.
- [ ] Action cập nhật và persist thuộc System/service.
- [ ] Status của tài nguyên khác status của giao dịch.

Giữ Book khác BookCopy; Reader là lớp cha của Student và Lecturer; Librarian duyệt yêu cầu.

### Câu đề cần đọc và việc cần làm

> The diagram must include at least two swimlanes representing Librarian and System responsibilities.

**Đưa vào hình:** Tạo làn Reader, Librarian và LoanService/System. Ghi Level 2 – Design.

> Based on this inspection, the system determines whether a fine must be applied for late return or damage.

**Đưa vào hình:** Tạo decision hình thoi “late OR damaged?”.

> If a fine is applied, the reader pays the fine before the loan is closed.

**Đưa vào hình:** Nhánh fine > 0 đi tới Reader Pay fine, rồi decision kiểm tra kết quả.
