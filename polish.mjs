import fs from 'node:fs';
const file='dist/app.js';let app=fs.readFileSync(file,'utf8');
app=app.replace('href="#${key}" class="nav-item','href="#${key}" aria-label="${label}" class="nav-item');
app=app.replace('list.slice(0,80).map','list.map');
app=app.replace('${list.length>80?', '${false?');
app=app.replace('Lưu & tạm nghỉ','Lưu & về tổng quan');
app=app.replace('Hết giờ, bài được nộp tự động.','Đồng hồ vẫn chạy khi rời trang. Hết giờ, bài tự nộp.');
fs.writeFileSync(file,app);
