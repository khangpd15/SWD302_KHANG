import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { questions, chapters, questionMap, tipFor, chapterTitle, filterQuestions } from './data';
import { generate, score } from './engine';
import { load, persist, validSession } from './storage';
import PePage from './PePage';

const StudyContext = createContext(null);
const useStudy = () => useContext(StudyContext);
const navItems = [
  ['home', 'home', 'Tổng quan'], ['exams', 'exam', 'Luyện đề'], ['pe', 'shuffle', 'Thi PE'], ['bank', 'book', 'Ngân hàng câu hỏi'],
  ['tips', 'bulb', 'Mẹo ghi nhớ'], ['saved', 'bookmark', 'Câu đã lưu'], ['history', 'history', 'Lịch sử làm bài'],
];
const paths = {
  home: 'M3 10 12 3l9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Zm6 11v-8h6v8',
  book: 'M12 5C8 2 3 4 3 4v15s5-2 9 1c4-3 9-1 9-1V4s-5-2-9 1Zm0 0v15',
  exam: 'M7 4H5v17h14V4h-2M9 3h6v4H9zM8 11h8m-8 4h8',
  bulb: 'M9 18h6m-6 3h6M8 14a7 7 0 1 1 8 0c-1 1-1 2-1 2H9s0-1-1-2Z',
  bookmark: 'M6 3h12v18l-6-4-6 4V3Z', history: 'M3 11a9 9 0 1 1 2 7M3 4v7h7m2-4v6l4 2',
  arrow: 'M4 12h16m-6-6 6 6-6 6', check: 'm5 12 4 4L19 6',
  search: 'M21 21l-5-5m2-6a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
  clock: 'M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  shuffle: 'm3 4 18 16m-4 0h4v-4M3 20l6-6m5-5 7-5m-4 0h4v4',
  flag: 'M5 21V3m0 1h14l-3 4 3 4H5', back: 'M20 12H4m6-6-6 6 6 6',
};
function Icon({ name }) { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={paths[name] || paths.book} /></svg>; }
function Button({ children, secondary = false, className = '', ...props }) {
  return <button className={`btn ${secondary ? 'secondary' : ''} ${className}`} {...props}>{children}</button>;
}
function Heading({ eyebrow, title, sub, children }) {
  return <div className="page-title"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p className="subtitle">{sub}</p></div>{children}</div>;
}
function SourceNote() {
  return <div className="source-note"><strong>Minh bạch nguồn câu hỏi:</strong> File Word ghi 202 câu nhưng có 198 câu thực tế. Bộ học gồm <strong>198 câu gốc + 4 câu bổ sung</strong> ở Chapter 5, có nhãn riêng. Đáp án câu gốc giữ theo tài liệu; mẹo là gợi ý ôn tập, không thay thế việc hiểu bài.</div>;
}
function Stats({ values }) {
  return <div className="stats">{values.map(([icon, value, label]) => <div className="stat" key={label}><div className="stat-icon"><Icon name={icon} /></div><div><div className="stat-value">{value}</div><div className="stat-label">{label}</div></div></div>)}</div>;
}
function Empty({ title, children }) { return <div className="empty"><h3>{title}</h3>{children}</div>; }
function QuestionMeta({ question: q }) {
  const { bookmarks, toggleBookmark } = useStudy();
  const saved = bookmarks.includes(q.id);
  return <div className="question-meta"><span className="chapter-tag">Chapter {q.chapter}</span><span>Câu {q.number} · {chapterTitle(q.chapter)}</span>{q.supplemental && <span className="extra-tag">Câu bổ sung</span>}<button className={`icon-btn ${saved ? 'on' : ''}`} onClick={() => toggleBookmark(q.id)} aria-label={saved ? 'Bỏ lưu câu hỏi' : 'Lưu câu hỏi'} title={saved ? 'Bỏ lưu câu hỏi' : 'Lưu câu hỏi'} aria-pressed={saved}><Icon name="bookmark" /></button></div>;
}
function Tip({ question }) { return <div className="tip-text">✦ <strong>Mẹo nhớ:</strong> {tipFor(question)}</div>; }
function ReviewOptions({ question: q, answer }) {
  return q.options.map((option, i) => <div className={`review-option ${q.answer === i ? 'right' : answer === i ? 'wrong' : ''}`} key={i}>{String.fromCharCode(65 + i)}. {option} {q.answer === i && '✓ Đáp án đúng'} {answer === i && '· Bạn chọn'}</div>);
}
function ExamCard({ exam }) {
  const { history, setModal } = useStudy();
  const latest = history.find(h => h.code === exam.code && h.kind === 'exam' && JSON.stringify(h.ids) === JSON.stringify(exam.ids));
  return <article className="exam-card"><span className="exam-code">PRACTICE TEST</span><span className="exam-symbol"><Icon name="exam" /></span><h3>Mã đề {exam.code}</h3><div className="exam-meta">60 câu hỏi <span>·</span> 20 chương</div><span className={`status-label ${latest ? 'done' : ''}`}>{latest ? `Đã làm · ${latest.correct}/60` : 'Sẵn sàng luyện tập'}</span><button className="text-link" onClick={() => setModal({ type: 'start', exam })}>Bắt đầu làm bài <Icon name="arrow" /></button></article>;
}
function HistoryRow({ entry }) {
  const { viewResult } = useStudy();
  return <div className="history-row"><div className="history-icon"><Icon name={entry.kind === 'exam' ? 'exam' : 'book'} /></div><div className="history-info"><strong>{entry.kind === 'exam' ? `Mã đề ${entry.code}` : 'Ôn tập tự do'}</strong><br /><small>{new Date(entry.endedAt).toLocaleString('vi-VN')} · {entry.ids.length} câu</small></div><div className="history-score">{entry.correct}<span className="quiet">/{entry.ids.length}</span></div><button className="text-link" onClick={() => viewResult(entry)}>Xem lại <Icon name="arrow" /></button></div>;
}
function Home() {
  const { session, sets, mastery, history, setModal, navigate } = useStudy();
  return <>
    <Heading eyebrow="MỖI NGÀY MỘT CHÚT, VỮNG HƠN MỘT CHÚT" title="Sẵn sàng chinh phục SWD301?" sub="Một góc nhỏ để ôn kiến thức, luyện đề và ghi nhớ những điều quan trọng."><div className="date-badge"><Icon name="book" /> &nbsp; Học theo nhịp của bạn</div></Heading>
    <section className="hero"><div className="hero-copy"><span className="mini-pill">YOUR NEXT CHAPTER STARTS HERE</span><h2>Ôn tập có lộ trình.<br /><em>Tự tin trong từng câu hỏi.</em></h2><p>202 câu hỏi, 20 mã đề và những mẹo nhớ thật gọn.<br />Chọn một đề, bắt đầu với 60 câu hôm nay.</p><div className="flex"><Button onClick={() => session ? navigate('quiz') : setModal({ type: 'start', exam: sets[0] })}>{session ? 'Tiếp tục bài đang làm' : 'Luyện đề ngay'} <Icon name="arrow" /></Button><a className="btn ghost" href="#bank">Khám phá câu hỏi</a></div></div><div className="hero-art" aria-hidden="true"><div className="art-orbit" /><div className="art-orbit two" /><div className="art-star">✦</div><div className="paper"><div className="paper-top"><span>SWD301</span><Icon name="book" /></div><strong>A little practice,<br />a lot of confidence.</strong><div className="paper-line" /><div className="paper-line" style={{ width: '75%' }} /><div className="paper-option"><i />Understand the concept</div><div className="paper-option yes"><i>✓</i>Remember the keyword</div><div className="paper-option"><i />Keep moving forward</div></div><div className="art-chip">✦ &nbsp; Mỗi câu hỏi, một bước tiến</div></div></section>
    <Stats values={[
      ['book', 202, 'Câu hỏi trong ngân hàng'], ['exam', 20, 'Mã đề ngẫu nhiên'],
      ['clock', 60, 'Câu hỏi trong mỗi đề'], ['check', Object.values(mastery).filter(Boolean).length, 'Câu đã trả lời đúng gần nhất'],
    ]} />
    <div className="home-grid"><section><div className="section-head"><div><h2>Chọn một đề, bắt đầu thôi</h2><p>Mỗi đề là một cơ hội để hiểu bài hơn.</p></div><a className="text-link" href="#exams">Tất cả 20 mã đề <Icon name="arrow" /></a></div><div className="exam-grid">{sets.slice(0, 4).map(exam => <ExamCard key={exam.code} exam={exam} />)}</div><div className="section-space"><div className="section-head"><h2>Nhịp học của bạn</h2><a className="text-link" href="#history">Xem lịch sử <Icon name="arrow" /></a></div>{history[0] ? <HistoryRow entry={history[0]} /> : <Empty title="Hành trình bắt đầu từ câu đầu tiên">Làm một đề để theo dõi kết quả của bạn ở đây.</Empty>}</div></section><aside className="tips-card"><div className="eyebrow">✦ LITTLE TIPS, BIG DIFFERENCE</div><h3>Nhìn từ khóa, nhớ ý chính</h3><div className="tip-row"><b>Validation vs. Verification</b>Right system vs. System right.</div><div className="tip-row"><b>PIM vs. PSM</b>Chưa chọn vs. Đã chọn nền tảng.</div><div className="tip-row"><b>Composition vs. Aggregation</b>Quan hệ whole/part mạnh vs. yếu.</div><a className="text-link" href="#tips">Khám phá tất cả mẹo <Icon name="arrow" /></a></aside></div>
    <SourceNote />
  </>;
}
function Exams() {
  const { sets, setModal } = useStudy();
  return <><Heading eyebrow="LUYỆN TẬP ĐỂ TIẾN BỘ" title="20 mã đề. 20 lần vững hơn." sub="Mỗi đề gồm 60 câu không trùng, lấy từ toàn bộ ngân hàng. Các đề có thể trùng câu với nhau."><Button secondary onClick={() => setModal({ type: 'regenerate' })}><Icon name="shuffle" /> Tạo lại 20 mã đề</Button></Heading><div className="source-note" style={{ margin: '0 0 24px' }}>Các mã đề được tạo ngẫu nhiên một lần và lưu trên trình duyệt này. Bạn có thể chọn thời gian khi bắt đầu. Chế độ thi chỉ hiện đáp án và mẹo sau khi nộp bài.</div><div className="exam-grid">{sets.map(exam => <ExamCard key={exam.code} exam={exam} />)}</div><SourceNote /></>;
}
function Filters({ search, chapter, onSearch, onChapter, tips = false }) {
  return <div className="toolbar"><div className="search"><Icon name="search" /><input type="search" placeholder={tips ? 'Tìm mẹo, từ khóa…' : 'Tìm câu hỏi, đáp án hoặc từ khóa…'} value={search} onChange={e => onSearch(e.target.value)} aria-label="Tìm kiếm" /></div><select value={chapter} onChange={e => onChapter(e.target.value)} aria-label="Lọc theo chương"><option value="">Tất cả 20 chương</option>{chapters.map(c => <option key={c.id} value={c.id}>Ch {c.id} · {c.title}</option>)}</select></div>;
}
function Bank({ saved = false }) {
  const { bookmarks, practice, bankFilter, setBankFilter } = useStudy();
  const { search, chapter, page } = bankFilter;
  const list = filterQuestions(saved ? questions.filter(q => bookmarks.includes(q.id)) : questions, search, chapter);
  const pages = Math.max(1, Math.ceil(list.length / 12)), current = Math.min(page, pages);
  const changeFilter = field => value => setBankFilter(f => ({ ...f, [field]: value, page: 1 }));
  return <><Heading eyebrow={saved ? 'DÀNH CHO LẦN ÔN TẬP TIẾP THEO' : 'KIẾN THỨC TRONG TẦM TAY'} title={saved ? 'Những câu bạn muốn nhớ.' : 'Ngân hàng 202 câu hỏi.'} sub={saved ? 'Lưu câu khó, quay lại khi cần và luyện thêm một lần.' : 'Giữ nguyên câu hỏi tiếng Anh. Hiểu nhanh hơn với mẹo tiếng Việt.'}><Button disabled={!list.length} onClick={() => practice(list.map(q => q.id))}><Icon name="book" /> Ôn {list.length} câu <Icon name="arrow" /></Button></Heading><Filters search={search} chapter={chapter} onSearch={changeFilter('search')} onChapter={changeFilter('chapter')} /><div className="section-head"><span className="quiet">{list.length} câu hỏi{chapter && ` · Chapter ${chapter}`}</span><span className="quiet">Bấm biểu tượng dấu trang để lưu</span></div><div className="bank-list">{list.slice((current - 1) * 12, current * 12).map(q => <article className="bank-card" key={q.id}><QuestionMeta question={q} /><h3>{q.text}</h3><details><summary className="text-link">Xem đáp án & mẹo ghi nhớ</summary><div className="reveal"><ReviewOptions question={q} /><Tip question={q} /></div></details></article>)}{!list.length && <Empty title={saved ? 'Chưa có câu hỏi phù hợp được lưu' : 'Không tìm thấy câu hỏi'}>Thử từ khóa khác, chọn tất cả chương hoặc lưu thêm câu hỏi.</Empty>}</div>{pages > 1 && <div className="pagination"><Button secondary disabled={current === 1} onClick={() => setBankFilter(f => ({ ...f, page: current - 1 }))}>← Trước</Button><span>{current} / {pages}</span><Button secondary disabled={current === pages} onClick={() => setBankFilter(f => ({ ...f, page: current + 1 }))}>Sau →</Button></div>}{!saved && <SourceNote />}</>;
}
function Tips() {
  const [search, setSearch] = useState(''), [chapter, setChapter] = useState('');
  const list = filterQuestions(questions, search, chapter);
  return <><Heading eyebrow="ÍT CHỮ HƠN, NHỚ NHIỀU HƠN" title="Bắt từ khóa. Nắm ý chính." sub="Mẹo giúp gợi nhớ kiến thức, không phải quy tắc đoán đáp án. Lưu ý các câu có NOT / DOES NOT." /><Filters tips search={search} chapter={chapter} onSearch={setSearch} onChapter={setChapter} /><p className="quiet">{list.length} mẹo theo từng câu hỏi</p><div className="tip-grid">{list.map(q => <article className="tip-tile" key={q.id}><QuestionMeta question={q} /><h3>{q.text}</h3><p>✦ {tipFor(q)}</p></article>)}</div>{!list.length && <Empty title="Không tìm thấy mẹo phù hợp." />}</>;
}
function History() {
  const { history, mastery, bookmarks, practice } = useStudy();
  const wrongIds = Object.keys(mastery).filter(id => mastery[id] === false).map(Number);
  return <><Heading eyebrow="NHÌN LẠI ĐỂ TIẾN XA HƠN" title="Mỗi lần luyện, một chút tiến bộ." sub="Xem lại đáp án, ghi nhớ từ khóa và luyện lại những câu bạn còn nhầm."><Button disabled={!wrongIds.length} onClick={() => practice(wrongIds)}>Ôn {wrongIds.length} câu sai gần nhất <Icon name="arrow" /></Button></Heading><Stats values={[
    ['exam', history.length, 'Bài đã hoàn thành'], ['check', Object.values(mastery).filter(Boolean).length, 'Câu đúng gần nhất'], ['book', wrongIds.length, 'Câu cần ôn lại'], ['bookmark', bookmarks.length, 'Câu hỏi đã lưu'],
  ]} />{history.length ? history.map(h => <HistoryRow entry={h} key={h.id} />) : <Empty title="Chưa có bài làm nào">Hoàn thành bài ôn tập hoặc một mã đề để xem kết quả.</Empty>}</>;
}
function Timer({ session }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, []);
  const remaining = session.deadline ? session.deadline - now : now - session.startedAt;
  const seconds = Math.max(0, Math.ceil(remaining / 1000));
  return <div className={`timer ${session.deadline && remaining < 300000 ? 'urgent' : ''}`}>{String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}</div>;
}
function Quiz() {
  const { session: s, chooseAnswer, move, toggleFlag, setModal, navigate, notify } = useStudy();
  if (!s) return <Empty title="Chưa có bài đang làm"><a className="btn mt" href="#exams">Chọn mã đề</a></Empty>;
  const q = questionMap.get(s.ids[s.index]), chosen = s.answers[q.id];
  const show = s.kind === 'practice' && Number.isInteger(chosen), answered = Object.keys(s.answers).length;
  return <><Heading eyebrow={s.kind === 'exam' ? 'TẬP TRUNG MỘT CHÚT, TIẾN BỘ MỘT CHÚT' : 'VỪA LÀM, VỪA GHI NHỚ'} title={s.kind === 'exam' ? `Mã đề ${s.code}` : 'Ôn tập tự do'} sub={`${s.ids.length} câu hỏi · ${s.kind === 'exam' ? 'Đáp án được ẩn cho đến khi nộp bài' : 'Đáp án và mẹo hiện sau khi chọn'}`}><Button secondary onClick={() => { navigate('home'); notify('Đã lưu bài. Bạn có thể tiếp tục bất cứ lúc nào.'); }}>Lưu & về tổng quan</Button></Heading><div className="study-layout"><section className="question-panel"><QuestionMeta question={q} /><div className="section-head mt"><span className="eyebrow">CÂU {s.index + 1} / {s.ids.length}</span><button className="text-link" onClick={toggleFlag} aria-pressed={s.flags.includes(q.id)}><Icon name="flag" /> {s.flags.includes(q.id) ? 'Đã đánh dấu' : 'Đánh dấu xem lại'}</button></div><h2>{q.text}</h2>{q.options.map((option, i) => <button className={`option ${chosen === i ? 'selected' : ''} ${show && q.answer === i ? 'correct' : ''} ${show && chosen === i && chosen !== q.answer ? 'incorrect' : ''}`} key={i} onClick={() => chooseAnswer(i)} disabled={show} aria-pressed={chosen === i}><span className="option-letter">{String.fromCharCode(65 + i)}</span><span>{option}</span></button>)}{show && <div className={`feedback ${chosen === q.answer ? '' : 'bad'}`}>{chosen === q.answer ? '✓ Chính xác!' : `Đáp án đúng: ${String.fromCharCode(65 + q.answer)}`}<Tip question={q} /></div>}<div className="question-bottom"><Button secondary disabled={s.index === 0} onClick={() => move(s.index - 1)}><Icon name="back" /> Câu trước</Button>{s.index < s.ids.length - 1 ? <Button onClick={() => move(s.index + 1)}>Câu tiếp theo <Icon name="arrow" /></Button> : <Button onClick={() => setModal({ type: 'submit' })}>Hoàn thành bài</Button>}</div></section><aside><div className="map-card"><span className="quiet">{s.deadline ? 'THỜI GIAN CÒN LẠI' : 'THỜI GIAN ĐÃ LÀM'}</span><Timer key={s.id} session={s} /><div className="section-head"><h3>Tiến độ bài làm</h3><span className="quiet">{answered}/{s.ids.length}</span></div><div className="progress-track"><i style={{ width: `${answered / s.ids.length * 100}%` }} /></div><div className="map-grid">{s.ids.map((id, i) => <button className={`map-num ${Number.isInteger(s.answers[id]) ? 'answered' : ''} ${s.index === i ? 'current' : ''} ${s.flags.includes(id) ? 'flagged' : ''}`} key={id} onClick={() => move(i)} aria-label={`Câu ${i + 1}${Number.isInteger(s.answers[id]) ? ', đã trả lời' : ''}${s.flags.includes(id) ? ', đã đánh dấu' : ''}`} aria-current={s.index === i ? 'step' : undefined}>{i + 1}</button>)}</div><div className="legend">■ Tím nhạt: đã chọn đáp án<br />◩ Góc vàng: đã đánh dấu xem lại</div><Button onClick={() => setModal({ type: 'submit' })}><Icon name="check" /> Nộp bài</Button></div><p className="hint-note">Tiến độ tự lưu sau mỗi câu.<br />Phím 1–4: chọn đáp án · ← →: chuyển câu.<br />{s.kind === 'exam' ? 'Đồng hồ vẫn chạy khi rời trang. Hết giờ, bài tự nộp.' : 'Cứ sai rồi sửa, bạn sẽ nhớ lâu hơn.'}</p></aside></div></>;
}
function Result() {
  const { selectedResult, history, practice } = useStudy();
  const [filter, setFilter] = useState('all');
  const h = selectedResult || history[0];
  if (!h) return <Empty title="Chưa có kết quả"><a href="#exams">Chọn mã đề để bắt đầu.</a></Empty>;
  const ids = h.ids.filter(id => filter === 'all' || (filter === 'wrong' && Number.isInteger(h.answers[id]) && h.answers[id] !== questionMap.get(id).answer) || (filter === 'blank' && !Number.isInteger(h.answers[id])));
  return <><Heading eyebrow="HOÀN THÀNH MỘT BƯỚC TIẾN" title={h.kind === 'exam' ? `Kết quả mã đề ${h.code}` : 'Kết quả ôn tập'} sub="Xem lại câu trả lời và mẹo ghi nhớ để lần sau vững vàng hơn." /><section className="result-hero"><div className="eyebrow">{h.expired ? 'BÀI ĐƯỢC NỘP KHI HẾT GIỜ' : 'BÀI LÀM ĐÃ ĐƯỢC LƯU'}</div><div className="result-score">{h.correct}<span> / {h.total} câu đúng</span></div><h2>{Math.round(h.correct / h.total * 100)}% chính xác · {(h.correct / h.total * 10).toFixed(2)} / 10 điểm</h2><p>{h.wrong} câu sai · {h.blank} câu chưa trả lời · {Math.floor((h.endedAt - h.startedAt) / 60000)} phút làm bài</p><div className="result-actions"><Button disabled={h.correct === h.total} onClick={() => practice(h.ids.filter(id => h.answers[id] !== questionMap.get(id).answer))}>Ôn lại {h.total - h.correct} câu chưa đúng <Icon name="arrow" /></Button><a className="btn secondary" href="#exams">Chọn đề tiếp theo</a></div></section><div className="result-tabs">{[['all', 'Tất cả', h.total], ['wrong', 'Câu sai', h.wrong], ['blank', 'Chưa trả lời', h.blank]].map(([key, label, count]) => <button className={`filter-btn ${filter === key ? 'active' : ''}`} key={key} onClick={() => setFilter(key)}>{label} ({count})</button>)}</div><div className="bank-list">{ids.map(id => { const q = questionMap.get(id); return <article className="bank-card" key={id}><QuestionMeta question={q} /><h3>{q.text}</h3><ReviewOptions question={q} answer={h.answers[id]} />{!Number.isInteger(h.answers[id]) && <p className="quiet">Bạn chưa trả lời câu này.</p>}<Tip question={q} /></article>; })}{!ids.length && <Empty title="Không có câu hỏi trong mục này." />}</div></>;
}

function Modal() {
  const { modal, setModal, session, begin, finish, regenerate } = useStudy();
  const ref = useRef(null);
  const [duration, setDuration] = useState('60');
  useEffect(() => {
    if (modal && !ref.current.open) ref.current.showModal();
    if (!modal && ref.current.open) ref.current.close();
  }, [modal]);
  const close = () => setModal(null);
  let content = null;
  if (modal?.type === 'start') content = <form onSubmit={e => { e.preventDefault(); begin(modal.exam.ids, 'exam', modal.exam.code, Number(duration)); }}><div className="eyebrow">SẴN SÀNG CHƯA?</div><h2>Mã đề {modal.exam.code} · 60 câu hỏi</h2><p>Chọn một đáp án cho mỗi câu. Bạn có thể đánh dấu để xem lại. Đáp án và mẹo sẽ hiện sau khi nộp bài.</p>{session && <p style={{ color: 'var(--amber)' }}>Bạn đang có bài làm dở. Bắt đầu bài mới sẽ thay thế tiến độ bài đó.</p>}<label htmlFor="duration">Thời gian làm bài</label><select id="duration" value={duration} onChange={e => setDuration(e.target.value)}><option value="60">60 phút</option><option value="45">45 phút</option><option value="90">90 phút</option><option value="0">Không giới hạn</option></select><div className="dialog-actions"><Button type="button" secondary onClick={close}>Để sau</Button><Button type="submit">Bắt đầu <Icon name="arrow" /></Button></div></form>;
  if (modal?.type === 'practice') content = <><h2>Bắt đầu lượt ôn mới?</h2><p>Bạn đang có bài làm dở. Lượt ôn mới gồm {modal.ids.length} câu và sẽ thay thế tiến độ bài hiện tại.</p><div className="dialog-actions"><Button secondary onClick={close}>Quay lại</Button><Button onClick={() => begin(modal.ids)}>Bắt đầu ôn</Button></div></>;
  if (modal?.type === 'submit' && session) {
    const result = score(session.ids, session.answers, questions);
    content = <><h2>Nộp bài và xem kết quả?</h2><p>Bạn đã trả lời <strong>{result.answered}/{result.total}</strong> câu. {result.blank > 0 && `Còn ${result.blank} câu chưa trả lời; những câu này được tính 0 điểm. `}{session.flags.length > 0 && `Có ${session.flags.length} câu được đánh dấu xem lại.`}</p><div className="dialog-actions"><Button secondary onClick={close}>Tiếp tục làm</Button><Button onClick={() => finish()}>Nộp bài</Button></div></>;
  }
  if (modal?.type === 'regenerate') content = <><h2>Tạo lại 20 mã đề?</h2><p>Bộ mã đề hiện tại sẽ được thay bằng 20 đề ngẫu nhiên mới, mỗi đề 60 câu không trùng. Lịch sử và bài đang làm vẫn được giữ.</p><div className="dialog-actions"><Button secondary onClick={close}>Giữ bộ hiện tại</Button><Button onClick={regenerate}>Tạo bộ mới</Button></div></>;
  return <dialog ref={ref} onCancel={e => { e.preventDefault(); close(); }} aria-label="Xác nhận thao tác">{content}</dialog>;
}

function useStoredState(key, fallback, validate, onFailure) {
  const [value, setValue] = useState(() => load(key, fallback, validate));
  useEffect(() => { if (!persist(key, value)) onFailure(true); }, [key, value, onFailure]);
  return [value, setValue];
}
const getRoute = () => {
  const route = window.location.hash.slice(1);
  return ['home', 'exams', 'pe', 'bank', 'tips', 'saved', 'history', 'quiz', 'result'].includes(route) ? route : 'home';
};
const validSets = sets => Array.isArray(sets) && sets.length === 20 && new Set(sets.map(s => s.code)).size === 20 && sets.every(s =>
  Array.isArray(s.ids) && s.ids.length === 60 && new Set(s.ids).size === 60 && s.ids.every(id => questionMap.has(id)));

export default function App() {
  const [storageWarning, setStorageWarning] = useState(false);
  const [sets, setSets] = useStoredState('sets', () => generate(questions), validSets, setStorageWarning);
  const [bookmarks, setBookmarks] = useStoredState('bookmarks', [], value => Array.isArray(value) && value.every(id => questionMap.has(id)), setStorageWarning);
  const [history, setHistory] = useStoredState('history', [], value => Array.isArray(value) && value.every(h => validSession(h, questionMap) && Number.isFinite(h.correct) && Number.isFinite(h.total) && Number.isFinite(h.endedAt)), setStorageWarning);
  const [mastery, setMastery] = useStoredState('mastery', {}, value => value && !Array.isArray(value) && typeof value === 'object' && Object.entries(value).every(([id, result]) => questionMap.has(Number(id)) && typeof result === 'boolean'), setStorageWarning);
  const [session, setSession] = useStoredState('session', null, value => validSession(value, questionMap), setStorageWarning);
  const [route, setRoute] = useState(getRoute);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [bankFilter, setBankFilter] = useState({ search: '', chapter: '', page: 1 });
  const activeSession = useRef(session);
  activeSession.current = session;
  const completed = useRef(new Set());

  const navigate = next => { window.location.hash = next; setRoute(next); };
  const notify = text => setToast({ text, id: Date.now() });
  function begin(ids, kind = 'practice', code = null, minutes = 0) {
    const startedAt = Date.now();
    const next = { id: crypto.randomUUID(), ids: [...ids], kind, code, answers: {}, flags: [], index: 0, startedAt, deadline: minutes ? startedAt + minutes * 60000 : null };
    activeSession.current = next;
    setSession(next);
    setModal(null);
    navigate('quiz');
  }
  function practice(ids) {
    if (!ids.length) return;
    if (session) setModal({ type: 'practice', ids });
    else begin(ids);
  }
  function finish(expired = false) {
    const current = activeSession.current;
    if (!current || completed.current.has(current.id)) return;
    completed.current.add(current.id);
    const entry = { ...current, ...score(current.ids, current.answers, questions), endedAt: Date.now(), expired };
    setHistory(previous => [entry, ...previous].slice(0, 100));
    setMastery(previous => ({ ...previous, ...Object.fromEntries(current.ids.map(id => [id, current.answers[id] === questionMap.get(id).answer])) }));
    activeSession.current = null;
    setSession(null);
    setSelectedResult(entry);
    setModal(null);
    navigate('result');
    if (expired) notify('Đã hết giờ. Bài được nộp tự động.');
  }
  function chooseAnswer(answer) {
    setSession(current => {
      if (!current) return current;
      const id = current.ids[current.index];
      if (current.kind === 'practice' && Number.isInteger(current.answers[id])) return current;
      return { ...current, answers: { ...current.answers, [id]: answer } };
    });
  }
  function move(index) { setSession(current => current && index >= 0 && index < current.ids.length ? { ...current, index } : current); }
  function toggleFlag() {
    setSession(current => {
      if (!current) return current;
      const id = current.ids[current.index];
      return { ...current, flags: current.flags.includes(id) ? current.flags.filter(x => x !== id) : [...current.flags, id] };
    });
  }
  function toggleBookmark(id) {
    const saved = bookmarks.includes(id);
    setBookmarks(previous => previous.includes(id) ? previous.filter(x => x !== id) : [...previous, id]);
    notify(saved ? 'Đã bỏ lưu câu hỏi' : 'Đã lưu câu hỏi');
  }
  function viewResult(entry) { setSelectedResult(entry); navigate('result'); }
  function regenerate() { setSets(generate(questions)); setModal(null); notify('Đã tạo bộ 20 mã đề mới'); }

  useEffect(() => {
    const update = () => setRoute(getRoute());
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  useEffect(() => { window.scrollTo(0, 0); }, [route]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    if (!session?.deadline) return;
    const check = () => {
      const current = activeSession.current;
      if (current?.deadline && current.deadline <= Date.now()) finish(true);
    };
    check();
    const timer = setInterval(check, 1000);
    window.addEventListener('pageshow', check);
    document.addEventListener('visibilitychange', check);
    return () => { clearInterval(timer); window.removeEventListener('pageshow', check); document.removeEventListener('visibilitychange', check); };
    // Reading the current session via a ref avoids stale answers at the deadline.
  }, [session?.id, session?.deadline]);
  useEffect(() => {
    const onKey = e => {
      if (route !== 'quiz' || !session || modal || e.ctrlKey || e.metaKey || e.altKey || ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (/^[1-4]$/.test(e.key)) { e.preventDefault(); chooseAnswer(Number(e.key) - 1); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); move(session.index + (e.key === 'ArrowRight' ? 1 : -1)); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [route, session, modal]);

  const context = { sets, bookmarks, history, mastery, session, modal, selectedResult, bankFilter, setBankFilter, setModal, navigate, notify, begin, practice, finish, chooseAnswer, move, toggleFlag, toggleBookmark, viewResult, regenerate };
  const pages = { home: <Home />, exams: <Exams />, pe: <PePage />, bank: <Bank />, tips: <Tips />, saved: <Bank saved />, history: <History />, quiz: <Quiz />, result: <Result key={selectedResult?.id || history[0]?.id || 'empty'} /> };
  const pageName = navItems.find(item => item[0] === route)?.[2] || (route === 'quiz' ? 'Đang làm bài' : 'Kết quả');
  return <StudyContext.Provider value={context}><div className="shell"><aside className="sidebar"><a className="brand" href="#home" aria-label="SWD Study — Tổng quan"><span className="brand-icon">s<span>↗</span></span><span>SWD<span className="brand-light">study</span><small>SOFTWARE MODELING & DESIGN</small></span></a><div className="side-label">GÓC HỌC TẬP CỦA BẠN</div><nav aria-label="Điều hướng chính">{navItems.map(([key, icon, label]) => <a key={key} href={`#${key}`} aria-label={label} className={`nav-item ${route === key ? 'active' : ''}`} aria-current={route === key ? 'page' : undefined}><Icon name={icon} /><span>{label}</span>{key === 'exams' && <span className="count">20</span>}</a>)}</nav><div className="sidebar-bottom"><div className="tiny-spark">✦</div><strong>Hiểu từ khóa.<br />Nhớ lâu hơn.</strong><p>Mỗi câu hỏi, một mẹo nhỏ.<br />Từng chút một, bạn sẽ vững hơn.</p><span className="course-pill">SWD301 · 20 chương</span></div><div className="local-note"><span className="dot" /> Tiến độ lưu trên trình duyệt này</div></aside><div className="workspace"><header className="topbar"><span>Không gian ôn tập <span>/</span> {pageName}</span><div className="topbar-right"><span className="subject-tag">{route === 'pe' ? 'SWD392 · PE' : 'SWD301'}</span><span className="avatar">S</span></div></header><main tabIndex={-1}>{storageWarning && <div className="source-note" role="status">Trình duyệt không cho lưu dữ liệu. Tiến độ chỉ giữ trong phiên này.</div>}{pages[route]}</main><footer>SWD Study <span>·</span> Học có hệ thống, thi tự tin hơn.<span className="footer-right">Dựa trên tài liệu Software Modeling and Design</span></footer></div></div><Modal /><div id="toast" className={toast ? 'show' : ''} role="status" aria-live="polite">{toast?.text}</div></StudyContext.Provider>;
}
