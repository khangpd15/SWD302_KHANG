# SWD Study

Web quiz tĩnh, tiếng Việt, không cần cài thư viện.

## Chạy trên máy

Trong thư mục `D:\SWD_TOOL_WEB\swd-quiz`, chạy `npm start` rồi mở http://127.0.0.1:4173. Cũng có thể mở trực tiếp `dist/index.html`; chế độ lưu trên trình duyệt phụ thuộc chính sách đối với file cục bộ.

## Tính năng

- 202 câu, 4 đáp án mỗi câu, mẹo tiếng Việt cho từng câu.
- 20 mã đề ngẫu nhiên lưu riêng trên mỗi trình duyệt; mỗi mã 60 câu khác nhau, đủ 20 chương. Các mã có thể trùng câu với nhau. Bộ 20 đề bao phủ toàn bộ ngân hàng.
- Tạo lại bộ đề; thời gian 45/60/90 phút hoặc không giới hạn; nộp tự động khi hết giờ. Đồng hồ tiếp tục chạy khi rời trang.
- Ôn tập hiện ngay đáp án và mẹo; thi ẩn đáp án đến khi nộp.
- Tìm kiếm, lọc theo chương, lưu câu, đánh dấu trong bài, điều hướng nhanh.
- Tự lưu bài đang làm, kết quả, câu sai; ôn lại câu chưa đúng. Dữ liệu chỉ lưu ở localStorage trên thiết bị/trình duyệt đang dùng, không đồng bộ tài khoản. Giữ tối đa 100 bài trong lịch sử.

## Nguồn dữ liệu

`202_cau_hoi_trac_nghiem_swd301.docx` có **198 câu thực tế**, dù tiêu đề ghi 202: Chapter 5 có 6 câu; Chapter 14 có 12; các chương khác có 10. Website giữ nguyên nội dung câu/đáp án gốc; thêm **4 câu biên soạn bổ sung**, đánh nhãn ở Chapter 5, để đạt 202 câu. Không trình bày các câu bổ sung như câu trích từ tài liệu.

`extract.mjs` tái tạo `dist/questions.js` từ `../source-paragraphs.txt` đã trích từ OOXML của tài liệu. `dist/tips.js` chứa mẹo tự biên soạn, không phải nội dung trích nguyên văn từ giáo trình. Mẹo chỉ giúp nhớ kiến thức, không phải quy tắc đoán đáp án.

## Kiểm tra

`npm test` kiểm tra số lượng, 4 lựa chọn và đáp án hợp lệ, mẹo cho toàn bộ 202 câu, 100 lượt tạo bộ 20 đề, độ phủ ngân hàng, chương, không trùng trong đề, tính điểm và bỏ trống.

Nguồn chạy ở `dist/`; `server.mjs` phục vụ bản cục bộ. Có thể triển khai `dist/` lên dịch vụ hosting tĩnh. Google Fonts chỉ phục vụ kiểu chữ; khi offline web dùng font hệ thống.
