import { mkdir, writeFile } from 'node:fs/promises';
import { cases } from '../src/pe-data.js';
import { drawioGuide, connectorGuide, drawioSources } from '../src/drawio-guide.js';
import { methodGuide, explanationDraft } from '../src/pe-method.js';

const guide = drawioGuide(cases.stayease, 'stayease');
const parts = ['# Dùng draw.io để hoàn thành 3 câu StayEase', '', 'Hướng dẫn thao tác kèm bộ .drawio đã giải. Mở mẫu để sửa hoặc dùng các bước này khi vẽ từ trang trắng. Menu có thể khác nhẹ giữa Desktop/Web, theme và ngôn ngữ.', ''];
for (const [key, stage] of Object.entries(guide)) {
  parts.push(`## ${stage.title}`, '', stage.goal, '', '### Cần chuẩn bị', '');
  for (const [name, desc] of stage.inventory) parts.push(`- **${name}:** ${desc}`);
  parts.push('');
  const method = methodGuide(cases.stayease,'stayease',key);
  if (method) {
    parts.push(`### Phân tích: ${method.title}`, '', method.intro, '');
    for (const step of method.steps) {
      parts.push(`#### ${step.title}`, '');
      step.text.forEach((text,i) => parts.push(`${i+1}. ${text}`));
      parts.push('', '```text', step.example, '```', '');
    }
    parts.push('#### Giải thích ngắn tham khảo', '', explanationDraft('stayease',cases.stayease,key), '', 'Chỉ dùng nếu đúng với hình và giả định của bài làm; không phải bảo đảm điểm.', '');
  }
  for (const task of stage.tasks) {
    parts.push(`### ${task.title}`, '');
    task.actions.forEach((action, i) => parts.push(`${i + 1}. ${action}`));
    parts.push('', 'Kết quả cần có:', '', '```text', task.result, '```', '', `**Nếu bị vướng:** ${task.mistake}`, '');
  }
  if (key === 'q1') {
    parts.push('### Bảng kiểu đường nối', '');
    for (const item of connectorGuide) parts.push(`- **${item.title}:** nét ${item.line.toLowerCase()}; ${item.ends}. ${item.direction} Ví dụ: ${item.example}.`);
    parts.push('');
  }
  parts.push('### Tự kiểm trước khi qua phần tiếp theo', '');
  stage.checks.forEach(check => parts.push(`- [ ] ${check}`));
  parts.push('');
}
parts.push('## Tài liệu thao tác draw.io', '');
for (const [name,url] of drawioSources) parts.push(`- [${name}](${url})`);
parts.push('', 'Ảnh StayEase không có thời gian hay quy cách nộp. Tuân theo hướng dẫn của đề đầy đủ; .drawio là nguồn chỉnh sửa.', '');
const folder = new URL('../public/guides/', import.meta.url);
await mkdir(folder, { recursive: true });
await writeFile(new URL('stayease-drawio-guide.md', folder), parts.join('\n'));
const methods = ['# Phương pháp phân tích và hoàn thành 3 câu PE StayEase', '', 'Hướng dẫn bằng chữ: đọc đề, xác định thành phần, điền nội dung, vẽ quan hệ và kiểm tra bài. Các ví dụ bám theo đề StayEase trong de_chua_giai; giả định phải được ghi rõ và không trái đề.', ''];
for (const stage of ['q1','q2','q3']) {
  const method = methodGuide(cases.stayease,'stayease',stage);
  methods.push(`## ${stage.toUpperCase()} — ${method.title}`, '', method.intro, '');
  for (const step of method.steps) {
    methods.push(`### ${step.title}`, '');
    step.text.forEach((text,i) => methods.push(`${i+1}. ${text}`));
    methods.push('', '```text', step.example, '```', '');
  }
  methods.push('### Giải thích ngắn tham khảo', '', explanationDraft('stayease',cases.stayease,stage), '', 'Đối chiếu lại với hình đã vẽ; không sao chép nếu khác giả định.', '');
}
await writeFile(new URL('phuong-phap-3q.md',folder),methods.join('\n'));
console.log('Generated offline StayEase draw.io tutorial.');
