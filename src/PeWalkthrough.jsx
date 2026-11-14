import React, { useEffect, useRef, useState } from 'react';
import baseExams from './data/pe-exams.json';
import { stayeaseExam } from './stayease-data';
import { cases } from './pe-data';
import { lessons } from './pe-lessons';
import { downloadDrawio } from './pe-diagrams';
const exams = { ...baseExams, stayease: stayeaseExam };

export function Highlight({ text, terms }) {
  const escaped = [...terms].sort((a, b) => b.length - a.length).map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (!escaped.length) return text;
  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');
  return text.split(pattern).map((part, i) => i % 2 ? <mark key={i}>{part}</mark> : part);
}

export default function PeWalkthrough({ kind, onCustomize }) {
  const [question, setQuestion] = useState(0);
  const [message, setMessage] = useState('');
  const questionNav = useRef(null);
  const scrollPending = useRef(false);
  useEffect(() => {
    if (scrollPending.current) {
      questionNav.current?.scrollIntoView({ behavior: 'auto', block: 'start' });
      scrollPending.current = false;
    }
  }, [question]);
  const c = cases[kind];
  const source = exams[kind];
  const steps = lessons[kind][question];
  const names = ['Class', 'Sequence', c.third];
  const original = source.questions[question];
  const entityTerms = [...new Set([c.actor, c.staff, c.resource, c.record, c.payment, 'Customer', 'Staff', 'Book', 'Reader', 'Doctor', 'Patient', 'TimeSlot', 'Schedule'])];
  function chooseQuestion(index) {
    scrollPending.current = true;
    setQuestion(index);setMessage('');
  }
  function download() {
    downloadDrawio(c, kind, ['class', 'sequence', 'third'][question]);
    setMessage(`Đã tạo mẫu Q${question + 1} .drawio. Mở file và đối chiếu từng bước bên dưới.`);
  }
  return <section className="pe-lesson" aria-label="Hướng dẫn trực tiếp trên đề mẫu">
    <div className="pe-lesson-intro"><h2>Có sẵn đề. Đọc một câu, làm một bước.</h2><p>Bên trái là <b>câu tiếng Anh trong đề</b>, từ cần chú ý được tô vàng. Bên phải giải nghĩa và chỉ cụ thể cách đưa câu đó vào diagram.</p></div>
    <div className="pe-lesson-context"><div className="eyebrow">BUSINESS OVERVIEW · NGUYÊN VĂN ĐỀ {c.system}</div><blockquote><Highlight text={source.overview} terms={entityTerms}/></blockquote><p><b>Hiểu nhanh:</b> {c.summary}</p></div>
    {kind === 'stayease' && <div className="pe-alert"><strong>Ba điểm phải giữ đúng của đề ảnh:</strong> Payment Success mới tạo Reservation; Payment Failure chỉ báo lỗi và dừng; checkout xong Room phải là <b>Cleaning</b>. Q2 dùng đúng BookingController và Layered Architecture.</div>}
    {source.images && <details className="pe-full-question pe-original-images"><summary>Xem 4 ảnh đề gốc trong de_chua_giai</summary><p>Bấm ảnh để mở lớn. Nội dung đề bên dưới được chép lại từ chính các ảnh này.</p><div className="pe-source-images">{source.images.map((path, index) => <a href={`${import.meta.env.BASE_URL}${path}`} key={path} target="_blank" rel="noreferrer"><span>{index === 0 ? 'Business Overview' : `Question ${index}`}</span><img src={`${import.meta.env.BASE_URL}${path}`} alt={index === 0 ? 'Ảnh Business Overview StayEase' : `Ảnh đề StayEase câu ${index}`} loading="lazy"/></a>)}</div></details>}
    <div ref={questionNav} className="pe-question-tabs" aria-label="Chọn câu để học">{names.map((name, i) => <button key={i} className={question === i ? 'active' : ''} aria-pressed={question === i} onClick={() => chooseQuestion(i)}><span>Câu {i + 1} · {i === 1 ? 4 : 3} điểm</span><strong>{name} Diagram</strong></button>)}</div>
    <div className="pe-lesson-task"><div><span className="eyebrow">ĐANG LÀM CÂU {question + 1}</span><h2>{question === 0 ? 'Lấy danh từ, quan hệ và số lượng → dựng Class' : question === 1 ? `${c.usecase} → dựng luồng gọi và alt` : `${c.returnCase} → ${c.third === 'State' ? 'dựng vòng đời Appointment' : 'chia làn, rẽ nhánh, hoàn tất giao dịch'}`}</h2><p>{steps.length} bước giải thích bên dưới. Ví dụ method và giả định là gợi ý thiết kế, không phải nội dung nguyên văn.</p></div><button className="btn" onClick={download}>Tải mẫu câu {question + 1} .drawio ↓</button></div>
    <details className="pe-full-question"><summary>Đọc toàn bộ nguyên văn câu {question + 1}</summary><h3>{original.title}</h3><div>{original.text}</div><p>Nguồn: {source.source}</p></details>
    <div className="pe-lesson-columns" aria-hidden="true"><span>ĐỀ NÓI GÌ?</span><span>HIỂU VÀ LÀM NHƯ THẾ NÀO?</span></div>
    <div className="pe-lesson-steps">{steps.map((step, i) => <article className="pe-lesson-step" key={`${kind}-${question}-${i}`}>
      <div className="pe-quote-side"><span className="pe-step-number">BƯỚC {i + 1}</span><h3>{step.title}</h3><blockquote><Highlight text={step.quote} terms={step.terms}/></blockquote><div className="pe-quote-meaning"><b>Câu này có nghĩa là:</b><p>{step.meaning}</p></div></div>
      <div className="pe-instruction-side"><h4>Làm trong draw.io</h4><ol>{step.actions.map(action => <li key={action}>{action}</li>)}</ol><div className="pe-result"><span>KẾT QUẢ CẦN THỂ HIỆN</span><pre>{step.example}</pre></div><p className="pe-transfer"><b>Gặp đề khác:</b> {step.transfer}</p><p className="pe-pitfall"><b>Dễ sai ở chỗ:</b> {step.pitfall}</p></div>
    </article>)}</div>
    <div className="pe-lesson-finish"><div><h3>Đã hiểu câu {question + 1}?</h3><p>Tải mẫu đúng câu vừa đọc, mở từng hộp và đường nối để đối chiếu. Muốn áp dụng cho đề khác, chuyển sang phần đổi tên.</p></div><div className="flex"><button className="btn" onClick={download}>Tải Q{question + 1} .drawio ↓</button>{question < 2 && <button className="btn secondary" onClick={() => chooseQuestion(question + 1)}>Học tiếp câu {question + 2} →</button>}<button className="btn secondary" onClick={onCustomize}>Đổi tên theo đề của mình</button></div></div>
    <p className="pe-lesson-source">Trích đề: {source.source}. Phần giải nghĩa, cách vẽ, method và giả định do trang biên soạn để ôn tập. Chuẩn bị offline và theo quy định của ca thi.</p>
    <div role="status" aria-live="polite">{message && <p className="pe-alert">{message}</p>}</div>
  </section>;
}
