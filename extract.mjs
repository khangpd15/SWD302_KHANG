import fs from 'node:fs';
const lines=fs.readFileSync('../source-paragraphs.txt','utf8').replace(/^\uFEFF/,'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
let chapter, q;const questions=[],chapters=[];
for(const line of lines){
 let m;
 if(m=line.match(/^Chapter (\d+): (.+)/)){chapter={id:+m[1],title:m[2]};chapters.push(chapter);q=null;}
 else if(chapter&&(m=line.match(/^(\d+)\.\s+(.+)/))){q={id:questions.length+1,chapter:chapter.id,number:+m[1],text:m[2],options:[],answer:-1};questions.push(q);}
 else if(q&&(m=line.match(/^\(([a-d])\)\s*(.*)/))){if(m[2].includes('[Đáp án đúng]'))q.answer=q.options.length;q.options.push(m[2].replace(/\s*\[Đáp án đúng\]/,'').trim());}
 else if(q)throw Error('Unparsed: '+line);
}
if(questions.length!==198)throw Error('Source count '+questions.length);
const extra=[
 ['Which model primarily describes actors and their goals?',['Use case model','Deployment model','Relational schema','Source code model'],0,'Actors + goals → use case model.'],
 ['Which activity checks that integrated software increments work together?',['Requirements elicitation','Integration testing','Class naming','Database normalization'],1,'Các phần ghép lại có chạy cùng nhau? → integration testing.'],
 ['Which pair of models is developed during analysis modeling?',['Static and dynamic models','Source code and bytecode','Physical and network models','Test reports and release notes'],0,'Analysis → static + dynamic.'],
 ['What is the main purpose of incremental software construction?',['Implement the whole system in one step','Skip unit testing','Design, code, and unit test a subset of the system','Only draw deployment diagrams'],2,'Construction → design + code + unit test từng phần.']
];
for(const [text,options,answer,tip] of extra)questions.push({id:questions.length+1,chapter:5,number:7+questions.length-198,text,options,answer,tip,supplemental:true});
for(const q of questions)if(q.options.length!==4||q.answer<0)throw Error('Invalid '+q.id);
fs.writeFileSync('dist/questions.js','window.QUIZ_DATA = '+JSON.stringify({chapters,questions},null,2)+';\n');
console.log(questions.map(q=>`${q.chapter}.${q.number} ${q.text} → ${q.options[q.answer]}`).join('\n'));
