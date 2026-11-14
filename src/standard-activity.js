import { graph, xmlEscape as h } from './pe-graph.js';
import standard from './data/standard-drawio.json' with { type: 'json' };

export function standardActivity(c,kind){
  const stay=kind==='stayease',lib=kind==='library';
  const g=graph(`${c.system} · Q3 ${c.returnCase} · Activity Level 2 – Design`,1700,2380);
  const lane=(name,x)=>g.box(h(name),x,110,520,2050,standard.styles.lane+'startSize=45;fontStyle=1;fillColor=none;');
  lane(stay?'System / CheckoutService':`System / ${c.record}Service`,40);lane(c.staff,560);lane(stay?`Guest (${c.actor})`:c.actor,1080);
  const action=(text,x,y,w=300)=>g.box(h(text),x,y,w,70,standard.styles.action+'rounded=1;');
  const decision=(text,x,y)=>g.box(h(text),x,y,120,100,standard.styles.decision);
  const initial=g.box('',1320,190,26,26,'ellipse;shape=startState;fillColor=#000000;strokeColor=#000000;');
  const request=action(stay?'Request checkout':`Return ${c.resource}`,1180,255);
  const inspect=action(`Inspect ${c.resource}${lib?' condition + due date':''}`,670,365);
  const report=action('Enter inspection result',670,475);
  const evaluate=action('Evaluate report',150,585);
  const fee=decision(lib?'Late OR damaged?':stay?'Damage found?':'Additional fee?',240,705);
  const charge=action(lib?'Calculate Fine':stay?'Calculate Damage Fee':'Calculate additional fee',65,875,225);
  const zero=action(lib?'Fine = 0':'Additional fee = 0',320,875,210);
  const merge=g.box('',285,1010,30,30,'rhombus;');
  const invoice=action(stay?'Generate Final Invoice = remaining balance + Damage Fee':lib?'Calculate final Fine':'Generate final amount',130,1100,340);
  const ask=action(lib?'Request Fine payment (only if Fine > 0)':'Request settlement',670,1220);
  const pay=action(lib?'Pay Fine':'Process final payment',1180,1330);
  const check=action('Confirm payment status',150,1450);
  const paid=decision('Payment confirmed?',240,1570);
  const update=action(stay?`${c.record}.status = Completed\n${c.resource}.status = Cleaning`:lib?`${c.record}.status = Closed\n${c.resource}.status = Available (if undamaged)`:`${c.record}.status = Completed\n${c.resource}.status = Available / Maintenance (inspection)`,115,1780,370);
  const persist=action(`Persist ${c.record} + ${c.resource}`,150,1900);
  const end=g.box('',282,2030,36,36,'ellipse;shape=endState;fillColor=#000000;strokeColor=#000000;');
  const flow=(a,b,label='',style='')=>g.edge(a,b,label,`endArrow=open;exitX=0.5;exitY=1;entryX=0.5;entryY=0;${style}`);
  flow(initial,request);flow(request,inspect,'','exitX=0;exitY=0.5;entryX=1;entryY=0.5;');flow(inspect,report);flow(report,evaluate,'','exitX=0;exitY=0.5;entryX=1;entryY=0.5;');flow(evaluate,fee);
  flow(fee,charge,'[yes]','exitX=0;exitY=0.5;');flow(fee,zero,'[no]','exitX=1;exitY=0.5;');flow(charge,merge);flow(zero,merge);flow(merge,invoice);
  if(lib){
    const due=decision('Fine > 0?',240,1210);
    g.edge(invoice,due,'','endArrow=open;');
    g.edge(due,ask,'[yes]','endArrow=open;exitX=1;exitY=0.5;entryX=0;entryY=0.5;');
    g.edge(due,update,'[no]','endArrow=open;exitX=0;exitY=0.5;entryX=0;entryY=0.5;');
  }else flow(invoice,ask,'','exitX=1;exitY=0.5;entryX=0;entryY=0.5;');
  flow(ask,pay,'','exitX=1;exitY=0.5;entryX=0;entryY=0.5;');flow(pay,check,'','exitX=0;exitY=0.5;entryX=1;entryY=0.5;');flow(check,paid);flow(paid,update,'[yes]');
  g.edge(paid,pay,'[no] wait / retry (assumption)','endArrow=open;exitX=1;exitY=0.5;entryX=1;entryY=0.5;');
  flow(update,persist);flow(persist,end);
  g.note(`A1 Lanes: System/service | ${c.staff} | ${stay?'Guest ('+c.actor+')':c.actor}. A2 Điều kiện phí: ${lib?'late OR damaged':stay?'damage found':'additional fee'}. A3 Chỉ hoàn tất sau thanh toán cần thiết. ${stay?'Remaining balance đã trừ Deposit; không thu cọc lần hai. Room phải Cleaning.':lib?'Không có Fine thì bỏ qua thanh toán. Bản sách hỏng không mặc định Available; ghi giả định xử lý.':'Car hỏng chuyển Maintenance theo giả định, không mặc định Available.'} Mẫu gốc có luồng đăng nhập riêng: không đưa luồng đó vào bài này. Decision dùng merge hình thoi, không dùng join cho hai phương án loại trừ nhau.`,40,2200,1560,130);
  return g.finish();
}
