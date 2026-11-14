// Synthesized teaching notes from the three supplied PDFs; no source media bundled.
export function umlReading(c, kind, stage) {
  const stay = kind === 'stayease';
  const state = c.third === 'State';
  if (stage === 'q1') return {
    title: 'Đọc ký hiệu Class trước khi điền mẫu',
    source: 'Class-Diagram.pdf · trang 2–8',
    intro: 'Danh từ chỉ là ứng viên. Hỏi nó có dữ liệu, hành vi và danh tính riêng không, rồi mới tạo class. Ví dụ Room là lớp; room101:Room là một đối tượng cụ thể.',
    headers: ['Bạn cần diễn đạt', 'Viết / vẽ thế nào', 'Cách tự kiểm'],
    rows: [
      ['Dữ liệu và hành vi', '- status: String\n+ complete(): void', 'Thuộc tính ở ngăn giữa; operation ở ngăn dưới. Method có tham số thì ghi tên: kiểu và kiểu trả về.'],
      ['Phạm vi truy cập', '+ public; - private; # protected; ~ package', 'Chọn theo thiết kế. Dùng private cho field và public cho API là lựa chọn thường gặp, không phải luật cho mọi thành viên.'],
      [`Một ${c.actor} có nhiều ${c.record}`, `${c.actor} 1 — 0..* ${c.record}`, `Giữ cố định MỘT ${c.actor}, nhìn số gần ${c.record}. Đọc ngược để biết một giao dịch thuộc bao nhiêu người.`],
      ['Liên kết lâu dài hay chỉ sử dụng?', 'Association: nét liền. Dependency: nét đứt, mũi tên từ bên dùng tới bên được dùng.', 'Mũi tên association chỉ khả năng điều hướng tới đối tượng liên kết; không biểu diễn thứ tự gọi hàm theo thời gian.'],
      ['Là một loại / thực hiện hợp đồng', 'Generalization: nét liền + tam giác rỗng. Realization: nét đứt + tam giác rỗng.', 'Tam giác hướng về lớp cha hoặc interface. Interface con kế thừa interface cha bằng generalization; concrete implements interface bằng realization.'],
      ['Whole–part có phụ thuộc vòng đời?', 'Composition: thoi đặc ở whole. Aggregation: thoi rỗng ở whole.', 'Has/contains chưa đủ kết luận. Nếu chỉ dùng tạm, xem dependency; nếu chỉ liên kết, xem association.'],
    ],
    repair: {wrong: `${c.resource} 0..* — 1 ${c.record} (nhưng định diễn đạt mỗi giao dịch gắn một tài nguyên)`, right: `${c.resource} 1 — 0..* ${c.record}`, why: 'Số cạnh đầu nào mô tả số đối tượng ở đầu đó cho một đối tượng đầu kia. Lịch sử nhiều giao dịch vẫn cần ràng buộc không trùng lịch riêng.'},
    quiz: {question: stay ? 'Reservation chứa Payment; đề nói Payment không tồn tại nếu thiếu Reservation. Thoi ở đâu? Nếu IRoomRepository kế thừa IGenericRepository<T> thì dùng nét nào?' : `“${c.actor} là một loại User” khác “service dùng repository” ở đường nối nào?`, answer: stay ? 'Thoi đặc ở Reservation. IRoomRepository → IGenericRepository<T> là nét liền + tam giác rỗng; RoomRepository implements IRoomRepository mới dùng nét đứt + tam giác rỗng.' : 'Lớp con → User dùng generalization, tam giác rỗng và nét liền. Service → repository dùng dependency nét đứt + mũi tên mở nếu đang mô tả sự sử dụng.'},
    optional: 'Chỉ thêm in/out/inout khi đề hoặc thiết kế cần mô tả hướng tham số. Chúng không quyết định hướng connector giữa hai class.',
  };
  if (stage === 'q2') return {
    title: 'Chọn đúng message và fragment cho Sequence',
    source: 'Sequence-Diagram.pdf · trang 2–8',
    intro: 'Trước khi vẽ, lập mỗi dòng theo mẫu: Ai gửi | Ai nhận | method(dữ liệu) | kết quả | điều kiện. Sau đó đặt các dòng từ trên xuống theo thứ tự trong từng nhánh.',
    headers: ['Tình huống trong đề', 'Ký hiệu cần chọn', 'Cách áp dụng'],
    rows: [
      ['Một đối tượng tham gia', 'role:Class hoặc :Class trên lifeline', `resource:${c.resource} là instance, ${c.resource} là type. UI, controller/service, repository và entity có trách nhiệm khác nhau.`],
      ['Gọi và chờ kết quả', 'Synchronous: nét liền, đầu tam giác đặc', `Gọi ${c.resource}Repository.isAvailable(id, start, end); caller chờ kết quả trước khi chọn nhánh.`],
      ['Trả kết quả', 'Reply: nét đứt, đầu mũi tên mở, về bên gọi', 'Đặt tên dữ liệu như available hoặc receipt. Có thể lược reply không cần thiết; giữ kết quả quyết định nhánh để bài dễ đọc.'],
      ['Gửi và không chờ xử lý xong', 'Asynchronous: nét liền, đầu mũi tên mở', 'Chỉ dùng khi tình huống thật sự không chờ. Một hệ thống ở bên ngoài không tự động có nghĩa là lời gọi bất đồng bộ.'],
      ['Đang xử lý / tạo mới', 'Activation ≠ create', 'Activation là khoảng thực thi. Create tới đầu lifeline mới ở đúng thời điểm tạo; không để instance nhận lời gọi trước lúc nó tồn tại.'],
      ['Chọn một trong nhiều nhánh', 'alt [guard] / [else]', 'Các guard cần rõ và các phương án phải được bao quát. Khung alt trong chỉ nằm trong nhánh nơi nó được phép chạy.'],
      ['Có thể bỏ qua / lặp lại', 'opt [guard] / loop [điều kiện]', 'opt là một khối tùy điều kiện, không có else. loop chỉ dùng khi đề có lặp; không thay alt thành công/thất bại bằng loop.'],
    ],
    repair: {wrong: stay ? 'create Reservation → processDeposit → [Failure] vẫn Room=Booked' : 'UI → Repository trực tiếp, dù đề yêu cầu xử lý qua service/controller', right: stay ? '[Available] → processDeposit → [Success] create Reservation, save, Room=Booked; [Failure] trả lỗi' : `UI → service/controller → ${c.resource}Repository; kết quả trả về qua bên gọi`, why: stay ? 'Lệnh tạo phải nằm trong nhánh thành công theo đề StayEase. AutoGo có thứ tự tạo trước thanh toán nên không đổi đồng loạt mọi mẫu.' : 'Giữ trách nhiệm và kiến trúc đề yêu cầu. Mỗi lời gọi phải có receiver phù hợp và method tương ứng ở Q1.'},
    quiz: {question: '“Nếu còn tài nguyên thì xử lý tiếp; nếu hết thì báo lỗi.” Dùng alt hay opt? Thanh activation có chứng minh đối tượng vừa được tạo không?', answer: 'Dùng alt vì có hai kết quả cần thể hiện. Activation chỉ thể hiện thực thi; muốn chỉ thời điểm tạo phải dùng create và bắt đầu lifeline ở đó.'},
    optional: 'Self-message khi đối tượng gọi chính nó; ref khi tách tương tác sang hình khác. Dấu X là kết thúc lifeline do hủy đối tượng, không phải trả lỗi hay kết thúc một request. Chỉ thêm khi use case cần.',
  };
  if (stage === 'q3' && state) return {
    title: 'Lập bảng chuyển trạng thái rồi mới kéo mũi tên',
    source: 'State-Machine-Diagram.pdf · trang 2–6',
    intro: `Đối tượng đang theo dõi là một ${c.record}. Cùng một event có thể cho kết quả khác nhau tùy state hiện tại; danh sách hành động của nhiều người chưa phải State Diagram.`,
    headers: ['State nguồn', 'event [guard] / effect', 'State đích'],
    rows: [
      ['Requested', 'payFee [success] / savePayment', 'Paid'],
      ['Paid', 'confirmAppointment', 'Confirmed'],
      ['Confirmed', 'startExamination', 'InProgress'],
      ['InProgress', 'finishExamination / issueMedicalRecord', 'Completed'],
      ['Requested', 'payFail / releaseSlot', 'Cancelled'],
      ['Paid', 'cancelAppointment [allowed] / releaseSlot', 'Cancelled (ghi giả định chính sách hủy)'],
    ],
    repair: {wrong: 'Hộp “Pay fee” → hộp “Confirm appointment”; hoặc đặt releaseSlot ở exit / releaseSlot của Requested', right: 'Hộp Requested ─ payFee [success] / savePayment → hộp Paid; chỉ releaseSlot trên nhánh hủy cần giải phóng.', why: 'Tên hộp là tình trạng. exit chạy mỗi lần rời state: đặt releaseSlot ở exit của Requested sẽ giải phóng cả khi thanh toán thành công.'},
    quiz: {question: 'Trong payFee [success] / savePayment, đâu là event, guard và effect? Vào final có đồng nghĩa xóa Appointment khỏi database không?', answer: 'payFee là event; success là guard được kiểm tra khi xét chuyển; savePayment là effect thực hiện trên chuyển đó. Final kết thúc region đang xét, không tự xóa entity khỏi database.'},
    optional: 'entry / action chạy mỗi lần vào state; do / activity thực hiện trong state; exit / action chạy khi rời state. Composite, history và các vùng song song chỉ cần khi đề có hành vi đó; bài MediCare hiện tại dùng state đơn đã đủ diễn đạt vòng đời.',
  };
  if (stage === 'q3') return {
    title: 'Q3 này cần Activity: dùng đúng loại hướng dẫn',
    source: 'Đối chiếu State-Machine-Diagram.pdf · trang 2 với yêu cầu Q3 của đề đang chọn',
    intro: 'Ba PDF mới không có tài liệu Activity riêng. Dùng phần State để phân biệt mục tiêu, còn các bước Activity dưới đây vẫn bám đúng câu hỏi của đề.',
    headers: ['Cần trả lời', 'Activity của đề này', 'Nếu là State thì khác gì?'],
    rows: [
      ['Theo dõi điều gì?', `${c.returnCase}: ai làm gì và bước tiếp theo`, `Vòng đời một ${c.record}, trạng thái hiện tại và event làm nó chuyển trạng thái.`],
      ['Nhãn trong hộp', 'Động từ: Inspect, Calculate fee, Confirm payment', 'Tình trạng: Requested, Paid, Completed'],
      ['Ai chịu trách nhiệm?', `Lane ${c.staff}, System/service, ${c.actor} nếu cần`, 'Không chia lane theo vai trò để kể toàn bộ quy trình.'],
      ['Có điều kiện?', 'Decision có các cạnh [guard]; merge nhập các phương án thay thế.', 'Transition mang event [guard] / effect giữa các state.'],
    ],
    repair: {wrong: 'Thấy PDF State mới → đổi Q3 đang yêu cầu Activity thành các state Paid/Completed', right: 'Giữ Activity, lane và action đúng use case. Cập nhật status là action trong lane System.', why: 'Loại diagram do câu hỏi quyết định. Tài liệu tham khảo bổ sung cách hiểu, không thay yêu cầu đề.'},
    quiz: {question: '“System cập nhật Room.status=Cleaning” là một action trong Activity hay bắt buộc phải vẽ một State Diagram mới?', answer: 'Là action trong Activity checkout của StayEase. Chỉ vẽ State Diagram mới nếu câu hỏi yêu cầu vòng đời Room.'},
    optional: 'Hoàn thành luồng chính, nhánh có/không phí và điều kiện hoàn tất trước khi thêm tình huống ngoài đề.',
  };
  return null;
}

export function readingMarkdown(reading) {
  if (!reading) return [];
  return [`### ${reading.title}`, '', reading.intro, '', `Tham khảo: ${reading.source}.`, '',
    `| ${reading.headers.join(' | ')} |`, '| --- | --- | --- |',
    ...reading.rows.map(row => `| ${row.map(cell => cell.replaceAll('\n','<br>').replaceAll('|','/')).join(' | ')} |`), '',
    `**Ví dụ sai:** ${reading.repair.wrong}`, '', `**Sửa thành:** ${reading.repair.right}`, '', reading.repair.why, '',
    `**Tự trả lời:** ${reading.quiz.question}`, '', `**Đáp án:** ${reading.quiz.answer}`, '', `**Chỉ thêm khi cần:** ${reading.optional}`, ''];
}
