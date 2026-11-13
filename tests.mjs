import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const context=vm.createContext({window:{}});
for(const file of ['questions.js','tips.js','engine.js'])vm.runInContext(fs.readFileSync('dist/'+file,'utf8'),context);
const {questions,chapters}=context.window.QUIZ_DATA,{generate,score}=context.window.QuizEngine;
assert.equal(questions.length,202);assert.equal(chapters.length,20);
assert.equal(questions.filter(q=>q.supplemental).length,4);
assert.equal(new Set(questions.map(q=>q.id)).size,202);
for(const q of questions){assert.equal(q.options.length,4);assert.ok(q.answer>=0&&q.answer<4);assert.ok(q.tip||context.window.TIPS[q.chapter]?.[q.number-1],`Missing tip ${q.chapter}.${q.number}`)}
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
