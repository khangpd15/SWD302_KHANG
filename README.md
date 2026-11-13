# SWD302_KHANG — SWD Study

Web quiz dùng **React 19 + Vite 7**, giao diện tiếng Việt, sẵn sàng triển khai trên Vercel. Toàn bộ giao diện là React component; dữ liệu, trạng thái bài làm và logic tạo đề được tách thành module.

## Chạy trên máy

Yêu cầu Node.js 22.12 trở lên (cũng hỗ trợ Node.js 24).

```sh
npm ci
npm run dev
```

Mở địa chỉ Vite in ra, mặc định http://127.0.0.1:5173.

```sh
npm test
npm run build
npm run preview
```

`npm run build` tạo bản production trong `dist/`. `dist/` là đầu ra tự sinh và không được commit.

## Triển khai Vercel

1. Import repository `khangpd15/SWD302_KHANG` trên Vercel.
2. Chọn nhánh `main`, **Root Directory: `.`** (thư mục gốc repository).
3. **Framework Preset: Vite**, **Build Command: `npm run build`**, **Output Directory: `dist`**.
4. Deploy. Không cần biến môi trường hoặc backend.

`vercel.json` đã khai báo framework, lệnh build và thư mục đầu ra. App dùng hash routing (`#exams`, `#bank`, ...), nên tải lại trang không cần rewrite phía server. Mỗi lần push mới vào nhánh production, Vercel có thể tự build và triển khai lại khi đã kết nối GitHub.

## Tính năng

- 202 câu, 4 đáp án mỗi câu, mẹo tiếng Việt cho từng câu.
- 20 mã đề ngẫu nhiên lưu riêng trên mỗi trình duyệt; mỗi mã 60 câu khác nhau, đủ 20 chương. Các mã có thể trùng câu với nhau. Bộ 20 đề bao phủ toàn bộ ngân hàng.
- Tạo lại bộ đề; thời gian 45/60/90 phút hoặc không giới hạn; nộp tự động khi hết giờ. Đồng hồ tiếp tục chạy khi rời trang.
- Ôn tập hiện ngay đáp án và mẹo; thi ẩn đáp án đến khi nộp.
- Tìm kiếm, lọc theo chương, lưu câu, đánh dấu trong bài, điều hướng nhanh.
- Tự lưu bài đang làm, kết quả, câu sai; ôn lại câu chưa đúng. Dữ liệu chỉ lưu ở localStorage trên thiết bị/trình duyệt đang dùng, không đồng bộ tài khoản. Giữ tối đa 100 bài trong lịch sử.

## Nguồn dữ liệu

`202_cau_hoi_trac_nghiem_swd301.docx` có **198 câu thực tế**, dù tiêu đề ghi 202: Chapter 5 có 6 câu; Chapter 14 có 12; các chương khác có 10. Website giữ nguyên nội dung câu/đáp án gốc; thêm **4 câu biên soạn bổ sung**, đánh nhãn ở Chapter 5, để đạt 202 câu. Không trình bày các câu bổ sung như câu trích từ tài liệu.

`src/data/questions.json` chứa ngân hàng câu hỏi; `src/data/tips.json` chứa mẹo tự biên soạn, không phải nội dung trích nguyên văn từ giáo trình. Mẹo chỉ giúp nhớ kiến thức, không phải quy tắc đoán đáp án. Khi cần nhập lại từ nội dung đã trích từ OOXML, chạy `node extract.mjs <duong-dan-source-paragraphs.txt>`; build thông thường không cần file Word hoặc bước trích xuất.

## Kiểm tra

`npm test` kiểm tra số lượng, 4 lựa chọn và đáp án hợp lệ, mẹo cho toàn bộ 202 câu, 100 lượt tạo bộ 20 đề, độ phủ ngân hàng, chương, không trùng trong đề, tính điểm, bỏ trống, khôi phục bài làm và dữ liệu lỗi. Kiểm tra render React cho cả 8 màn hình, bao gồm bài thi và lịch sử đã lưu.

## Cấu trúc

- `src/main.jsx`: khởi tạo React.
- `src/App.jsx`: các component, màn hình, state và hook của quiz.
- `src/engine.js`: tạo đề và tính điểm.
- `src/storage.js`: đọc/ghi localStorage, xác thực bài được khôi phục.
- `src/data/`: câu hỏi và mẹo.
- `src/styles.css`: giao diện responsive.
- `vite.config.js`, `vercel.json`: cấu hình build và triển khai.

Các khóa localStorage giữ tương thích với bản cũ khi chạy trên cùng origin. Chuyển sang domain Vercel tạo vùng lưu trình duyệt riêng; tiến độ ở domain cũ không tự đồng bộ. Google Fonts chỉ phục vụ kiểu chữ; khi offline web dùng font hệ thống.
