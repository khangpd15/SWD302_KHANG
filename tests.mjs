import assert from 'node:assert/strict';
import fs from 'node:fs';
import { generate, score } from './src/engine.js';
import { load, persist, validSession } from './src/storage.js';
const {questions,chapters}=JSON.parse(fs.readFileSync('src/data/questions.json','utf8'));
const tips=JSON.parse(fs.readFileSync('src/data/tips.json','utf8'));
assert.equal(questions.length,202);assert.equal(chapters.length,20);
assert.equal(questions.filter(q=>q.supplemental).length,4);
assert.equal(new Set(questions.map(q=>q.id)).size,202);
for(const q of questions){assert.equal(q.options.length,4);assert.ok(q.answer>=0&&q.answer<4);assert.ok(q.tip||tips[q.chapter]?.[q.number-1],`Missing tip ${q.chapter}.${q.number}`)}
for(let round=0;round<100;round++){
 const sets=generate(questions);assert.equal(sets.length,20);assert.equal(new Set(sets.map(s=>s.code)).size,20);
 const covered=new Set();const unique=new Set();
 for(const s of sets){assert.equal(s.ids.length,60);assert.equal(new Set(s.ids).size,60);assert.equal(new Set(s.ids.map(id=>questions.find(q=>q.id===id).chapter)).size,20);s.ids.forEach(id=>covered.add(id));unique.add([...s.ids].sort((a,b)=>a-b).join(','))}
 assert.equal(covered.size,202);assert.equal(unique.size,20);
}
const ids=questions.slice(0,60).map(q=>q.id),answers=Object.fromEntries(questions.slice(0,60).map(q=>[q.id,q.answer]));
assert.equal(score(ids,answers,questions).correct,60);
answers[ids[0]]=(answers[ids[0]]+1)%4;delete answers[ids[1]];
const r=score(ids,answers,questions);assert.equal(r.correct,58);assert.equal(r.wrong,1);assert.equal(r.blank,1);assert.equal(r.answered,59);
console.log('PASS: 202 questions, 198 source + 4 supplemental, 202 tips. 100 generations: 20 unique exams × 60 distinct questions, all 20 chapters per exam, full bank coverage. Scoring and blanks verified.');
const stored=new Map();
globalThis.localStorage={getItem:key=>stored.get(key)??null,setItem:(key,value)=>stored.set(key,value)};
const session={id:'test-session',ids,kind:'exam',code:'01',answers:{[ids[0]]:2},flags:[ids[0]],index:0,startedAt:Date.now(),deadline:null};
const questionMap=new Map(questions.map(q=>[q.id,q]));
assert.ok(validSession(session,questionMap));
assert.ok(!validSession({...session,index:60},questionMap));
assert.ok(!validSession({...session,answers:{1:9}},questionMap));
assert.ok(!validSession({...session,ids:[999]},questionMap));
assert.ok(persist('session',session));
assert.deepEqual(load('session',null,s=>validSession(s,questionMap)),session);
stored.set('swd-study-v1-session','invalid-json');
assert.equal(load('session',null),null);
globalThis.localStorage.setItem=()=>{throw Error('Storage denied')};
assert.equal(persist('session',session),false);
globalThis.localStorage.setItem=(key,value)=>stored.set(key,value);
console.log('PASS: legacy storage keys, session restoration, corrupt data fallback, denied storage.');

// Render actual React pages through Vite's module loader (no browser globals in source modules).
const {createServer}=await import('vite');
const {renderToString}=await import('react-dom/server');
const {createElement}=await import('react');
const vite=await createServer({server:{middlewareMode:true},appType:'custom',optimizeDeps:{noDiscovery:true,include:[]}});
globalThis.window={location:{hash:'#home'}};
try {
 const {default:App}=await vite.ssrLoadModule('/src/App.jsx');
 const {default:Walkthrough, Highlight}=await vite.ssrLoadModule('/src/PeWalkthrough.jsx');
 const {default:DrawioGuide}=await vite.ssrLoadModule('/src/DrawioGuide.jsx');
 const {cases}=await vite.ssrLoadModule('/src/pe-data.js');
 for (const kind of ['stayease','medicare']) for (const stage of ['setup','q1','q2','q3','export']) {
  const html=renderToString(createElement(DrawioGuide,{kind,config:cases[kind],stage,onStage:()=>{}}));
  assert.ok(html.includes('Cần dùng để hoàn thành') && html.includes('Khi nào phần này được xem là hoàn thành?'));
  if (['q1','q2','q3'].includes(stage)) assert.ok(html.includes('Hướng dẫn phân tích và điền nội dung') && html.includes('Phần B · Thao tác trên draw.io'));
  if (stage==='q3') assert.ok(html.includes(kind==='stayease' ? 'Room=Cleaning' : 'Ít nhất 6 transitions có event.'));
 }
 for (const kind of ['stayease', 'autogo', 'library', 'medicare']) {
  const lesson=renderToString(createElement(Walkthrough,{kind,onCustomize:()=>{}}));
  assert.ok(lesson.includes('Làm trong draw.io') && lesson.includes('<mark>') && lesson.includes('Dễ sai ở chỗ:'));
  assert.ok(lesson.includes('Đọc toàn bộ nguyên văn câu') && lesson.includes('.drawio'));
 }
 assert.equal(renderToString(createElement(Highlight,{text:'Repository<T> + User',terms:['Repository<T>','+']})), '<mark>Repository&lt;T&gt;</mark> <mark>+</mark> User');
 for(const [route,expected] of [['home','Sẵn sàng chinh phục SWD301?'],['exams','20 mã đề. 20 lần vững hơn.'],['pe','Thi PE. Đọc đề, bắt ý, dựng hình.'],['bank','Ngân hàng 202 câu hỏi.'],['tips','Bắt từ khóa. Nắm ý chính.'],['saved','Những câu bạn muốn nhớ.'],['history','Mỗi lần luyện, một chút tiến bộ.']]){
  window.location.hash='#'+route;
  const html=renderToString(createElement(App));assert.ok(html.includes(expected),`React page ${route}`);
 }
 stored.set('swd-study-v1-session',JSON.stringify(session));window.location.hash='#quiz';
 const quiz=renderToString(createElement(App));assert.ok(quiz.includes('Mã đề 01'));assert.ok(quiz.includes(questions[0].text));assert.ok(!quiz.includes('feedback'));
 const entry={...session,...score(ids,session.answers,questions),endedAt:Date.now()};
 stored.set('swd-study-v1-history',JSON.stringify([entry]));window.location.hash='#result';
 assert.ok(renderToString(createElement(App)).includes('Kết quả mã đề 01'));
 console.log('PASS: React server render for all 9 routes, restored quiz and history, exam hides feedback.');
}finally{await vite.close();delete globalThis.window;delete globalThis.localStorage;}
