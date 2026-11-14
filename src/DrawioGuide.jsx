import React, { useEffect, useRef, useState } from 'react';
import { connectorGuide, drawioGuide, drawioSources } from './drawio-guide';
import { downloadDrawio } from './pe-diagrams';
import './drawio-guide.css';

function ConnectorSketch({ item }) {
  const triangle = ['inheritance', 'realization'].includes(item.id);
  return <svg viewBox="0 0 180 70" role="img" aria-label={`${item.title}: nét ${item.line.toLowerCase()}, ${item.ends}`}><g fill="none" stroke="#6551ce" strokeWidth="2"><path d={item.id === 'composition' ? 'M42 30H154' : 'M24 30H154'} strokeDasharray={['realization','dependency'].includes(item.id) ? '6 4' : undefined}/>{triangle && <path d="m154 30-19-10v20Z" fill="white"/>}{item.id === 'dependency' && <path d="m141 20 14 10-14 10"/>}{item.id === 'composition' && <path d="m18 30 12-9 12 9-12 9Z" fill="#6551ce"/>}</g><g fontSize="10" fill="#8b7c9d"><text x="12" y="59">Nguồn</text><text x="127" y="59">Đích</text></g></svg>;
}

function ShapeSketch({ type, label }) {
  return <div className="dg-shape"><svg viewBox="0 0 180 105" role="img" aria-label={`Minh họa ${label}`}><g fill="#fff" stroke="#8d79b3" strokeWidth="1.7">
    {type === 'class' && <><rect x="25" y="10" width="130" height="85" rx="2"/><path d="M25 35h130M25 65h130"/></>}
    {type === 'lifeline' && <><rect x="35" y="7" width="110" height="32"/><path d="M90 39v60" strokeDasharray="5 4"/></>}
    {type === 'activation' && <><path d="M90 5v95" strokeDasharray="5 4"/><rect x="82" y="23" width="16" height="60" fill="#efecfc"/></>}
    {type === 'frame' && <><rect x="15" y="8" width="150" height="88"/><path d="M15 27h32l9-9V8M15 60h150" strokeDasharray="4 3"/></>}
    {type === 'swimlane' && <><rect x="15" y="8" width="150" height="88"/><path d="M15 30h150M65 8v88M115 8v88"/></>}
    {type === 'decision' && <path d="m90 9 61 42-61 44-61-44Z" fill="#fff7e4"/>}
    {type === 'action' && <rect x="20" y="28" width="140" height="50" rx="17" fill="#efecfc"/>}
    {type === 'state' && <rect x="20" y="28" width="140" height="50" rx="13" fill="#efecfc"/>}
    {type === 'initial' && <circle cx="90" cy="51" r="20" fill="#4c3e61"/>}
    {type === 'final' && <><circle cx="90" cy="51" r="25"/><circle cx="90" cy="51" r="16" fill="#4c3e61"/></>}
  </g><g textAnchor="middle" fontSize="11" fill="#75618f">{type === 'class' && <><text x="90" y="28">Tên Class</text><text x="90" y="54">- thuộc tính: Type</text><text x="90" y="85">+ method(): Type</text></>}{type === 'lifeline' && <text x="90" y="28">:Object</text>}{type === 'frame' && <><text x="35" y="22">alt</text><text x="90" y="46">[yes]</text><text x="90" y="82">[no]</text></>}{type === 'swimlane' && <><text x="40" y="24">Host</text><text x="90" y="24">System</text><text x="140" y="24">Guest</text></>}{type === 'action' && <text x="90" y="58">Inspect room</text>}{type === 'state' && <text x="90" y="58">Requested</text>}</g></svg><span>{label}</span></div>;
}

export default function DrawioGuide({ kind, config, stage, onStage }) {
  const [checked, setChecked] = useState([]);
  const [message, setMessage] = useState('');
  const stageNav = useRef(null);
  useEffect(() => { stageNav.current?.scrollIntoView({ behavior: 'auto', block: 'start' }); }, [kind, stage]);
  const guide = drawioGuide(config, kind);
  const current = guide[stage] || guide.setup;
  const isQuestion = ['q1','q2','q3'].includes(stage);
  const stages = [['setup','Bắt đầu'], ['q1','Q1 · Class'], ['q2','Q2 · Sequence'], ['q3',`Q3 · ${config.third}`], ['export','Lưu & xuất bài']];
  const symbols = stage === 'q1' ? [['class','Class / Interface']] : stage === 'q2' ? [['lifeline','Lifeline'],['activation','Activation'],['frame','alt fragment']] : stage === 'q3' && config.third === 'State' ? [['state','State'],['initial','Initial'],['final','Final']] : stage === 'q3' ? [['swimlane','Swimlane'],['action','Action'],['decision','Decision / Merge'],['initial','Initial'],['final','Activity Final']] : [];
  const count = current.checks.filter((_, i) => checked.includes(`${kind}-${stage}-${i}`)).length;
  function toggle(i) { const key = `${kind}-${stage}-${i}`;setChecked(v => v.includes(key) ? v.filter(x => x !== key) : [...v, key]); }
  function download() { downloadDrawio(config, kind, ({q1:'class',q2:'sequence',q3:'third'})[stage] || 'all');setMessage('Đã tạo file .drawio. Mở file trong draw.io để làm theo hướng dẫn.'); }
  return <section className="dg-guide" aria-label="Hướng dẫn thao tác draw.io">
    <div className="dg-intro"><div><div className="eyebrow">CẦM TAY CHỈ VIỆC · DRAW.IO</div><h2>Cần hình gì? Bấm ở đâu? Làm sao biết đã xong?</h2><p>Đang áp dụng cho <b>{config.title}</b>. Có thể sửa mẫu có sẵn hoặc vẽ từ trang trắng; đọc phần Bắt đầu trước nếu mới dùng.</p></div><a className="btn secondary" href={`${import.meta.env.BASE_URL}guides/stayease-drawio-guide.md`} download>Tải hướng dẫn StayEase offline ↓</a></div>
    <nav ref={stageNav} className="dg-stages" aria-label="Các bước học draw.io">{stages.map(([key,title]) => <button key={key} className={stage === key ? 'active' : ''} aria-current={stage === key ? 'step' : undefined} onClick={() => {onStage(key);setMessage('');}}>{title}</button>)}</nav>
    <div className="dg-stage-title"><div><h2>{current.title}</h2><p>{current.goal}</p></div><button className="btn" onClick={download}>{isQuestion ? `Tải mẫu Q${stage.slice(1)}` : 'Tải cả bộ'} .drawio ↓</button></div>
    <article className="pe-card dg-kit"><h3>Chuẩn bị những gì cho phần này?</h3><div className="dg-table-scroll"><table><thead><tr><th>Thành phần</th><th>Cần dùng để hoàn thành</th></tr></thead><tbody>{current.inventory.map(([name,desc]) => <tr key={name}><th scope="row">{name}</th><td>{desc}</td></tr>)}</tbody></table></div></article>
    {symbols.length > 0 && <div className="dg-symbols" aria-label="Nhận diện các hình UML">{symbols.map(([type,label]) => <ShapeSketch key={type} type={type} label={label}/>)}</div>}
    <div className="dg-task-list">{current.tasks.map(task => <article className="pe-card dg-task" key={task.title}><h3>{task.title}</h3><ol>{task.actions.map(action => <li key={action}>{action}</li>)}</ol><div className="pe-result"><span>LÀM XONG SẼ CÓ</span><pre>{task.result}</pre></div><p className="dg-mistake"><b>Nếu bị vướng:</b> {task.mistake}</p></article>)}</div>
    {stage === 'q1' && <section className="dg-connector-section" aria-label="Bảng kiểu đường nối UML"><h3>Chọn đúng kiểu đường nối ở bảng Style</h3><p>Chọn connector trước. Start / Source là đầu bạn kéo đi, End / Target là đầu đến. Nếu kéo ngược, đổi đầu có biểu tượng tương ứng.</p><div className="dg-connectors">{connectorGuide.map(item => <article className="pe-card dg-connector" key={item.id}><ConnectorSketch item={item}/><div><h4>{item.title}</h4><p>Nét {item.line.toLowerCase()} · {item.ends}</p><p>{item.direction}</p><code>{kind === 'stayease' ? item.example : item.id === 'composition' ? 'Thoi đặt phía whole, theo quan hệ của đề đang chọn.' : item.example}</code><details><summary>Tùy chọn nâng cao: mã Style tương đương</summary><p>Chỉ dùng khi quen Edit Style; giữ các phần style khác của đường. Không cần nhập mã để hoàn thành bài.</p><pre>{item.style}</pre></details></div></article>)}</div></section>}
    <article className="pe-card dg-checks"><div className="dg-check-title"><h3>Khi nào phần này được xem là hoàn thành?</h3><span className="pe-badge">{count}/{current.checks.length} đã kiểm</span></div>{current.checks.map((item,i) => <label className="pe-check" key={item}><input type="checkbox" checked={checked.includes(`${kind}-${stage}-${i}`)} onChange={() => toggle(i)}/><span>{item}</span></label>)}<p>Đánh dấu sau khi kiểm tra diagram của bạn. Đây là tiến độ tự kiểm, không phải điểm chấm.</p></article>
    <div className="dg-next"><button className="btn secondary" onClick={() => onStage(stages[Math.max(0,stages.findIndex(([key]) => key === stage)-1)][0])}>← Phần trước</button>{stage !== 'export' && <button className="btn" onClick={() => onStage(stages[stages.findIndex(([key]) => key === stage)+1][0])}>Phần tiếp theo →</button>}</div>
    <div role="status" aria-live="polite">{message && <p className="pe-alert">{message}</p>}</div>
    <details className="dg-sources"><summary>Tài liệu draw.io để đối chiếu thao tác</summary><p>Hình minh họa trên trang mô phỏng ký hiệu UML, không phải ảnh chụp giao diện. Menu có thể đổi nhẹ theo bản Desktop/Web, ngôn ngữ hoặc theme.</p><div>{drawioSources.map(([label,url]) => <a href={url} key={url} target="_blank" rel="noreferrer">{label} ↗</a>)}</div></details>
  </section>;
}
