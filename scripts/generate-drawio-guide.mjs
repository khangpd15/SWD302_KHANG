import { mkdir, writeFile } from 'node:fs/promises';
import { cases } from '../src/pe-data.js';
import { drawioGuide, connectorGuide, drawioSources } from '../src/drawio-guide.js';

const guide = drawioGuide(cases.stayease, 'stayease');
const parts = ['# Dùng draw.io để hoàn thành 3 câu StayEase', '', 'Hướng dẫn thao tác kèm bộ .drawio đã giải. Mở mẫu để sửa hoặc dùng các bước này khi vẽ từ trang trắng. Menu có thể khác nhẹ giữa Desktop/Web, theme và ngôn ngữ.', ''];
for (const [key, stage] of Object.entries(guide)) {
  parts.push(`## ${stage.title}`, '', stage.goal, '', '### Cần chuẩn bị', '');
  for (const [name, desc] of stage.inventory) parts.push(`- **${name}:** ${desc}`);
  parts.push('');
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
console.log('Generated offline StayEase draw.io tutorial.');
