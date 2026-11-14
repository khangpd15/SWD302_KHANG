// Native editable UML shapes; styles extracted from the user's standard workbook.
import standard from './data/standard-drawio.json' with { type: 'json' };
export const xmlEscape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
const html = xmlEscape;
export function graph(title, width = 1600, height = 1800) {
  let serial = 0;
  const cells = ['<mxCell id="0"/><mxCell id="1" parent="0"/>'];
  const box = (value, x, y, w = 240, h = 100, style = '') => {
    const id = `n${++serial}`;
    cells.push(`<mxCell id="${id}" value="${xmlEscape(value)}" style="${xmlEscape(`rounded=0;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#333333;fontSize=14;spacing=8;${style}`)}" vertex="1" parent="1"><mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry"/></mxCell>`);
    return id;
  };
  const edge = (from, to, label = '', style = '', points = '') => {
    const id = `e${++serial}`;
    const ends = label.match(/^(\S+)\s{2,}(.+)$/);
    cells.push(`<mxCell id="${id}" value="${xmlEscape(html(ends ? '' : label))}" style="${xmlEscape(`edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;endArrow=open;endFill=0;fontSize=12;labelBackgroundColor=#ffffff;${style}`)}" edge="1" parent="1" source="${from}" target="${to}"><mxGeometry relative="1" as="geometry">${points}</mxGeometry></mxCell>`);
    if (ends) for (const [index, x] of [[1, -0.8], [2, 0.8]]) {
      cells.push(`<mxCell id="m${++serial}" value="${xmlEscape(html(ends[index]))}" style="edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;labelBackgroundColor=#ffffff;fontSize=12;" vertex="1" connectable="0" parent="${id}"><mxGeometry x="${x}" relative="1" as="geometry"><mxPoint x="0" y="-14" as="offset"/></mxGeometry></mxCell>`);
    }
    return id;
  };
  const line = (x1, y1, x2, y2, label = '', style = '') => {
    cells.push(`<mxCell id="l${++serial}" value="${xmlEscape(html(label))}" style="${xmlEscape(`html=1;endArrow=open;endFill=0;fontSize=12;labelBackgroundColor=#ffffff;${style}`)}" edge="1" parent="1"><mxGeometry relative="1" as="geometry"><mxPoint x="${x1}" y="${y1}" as="sourcePoint"/><mxPoint x="${x2}" y="${y2}" as="targetPoint"/></mxGeometry></mxCell>`);
  };
  const note = (text, x, y, w = 1400, h = 70) => box(html(text), x, y, w, h, 'fillColor=#fff8df;strokeColor=#d6b656;align=left;');
  const child = (parent, value, x, y, w, h, style) => {
    const id = `n${++serial}`;
    cells.push(`<mxCell id="${id}" value="${xmlEscape(value)}" style="${xmlEscape(style)}" vertex="1" parent="${parent}"><mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry"/></mxCell>`);
    return id;
  };
  const umlClass = (name, stereotype, fields, methods, x, y, w = 350) => {
    const h = 50 + (fields.length + methods.length) * 30 + 8;
    const parent = box(`${html(stereotype)}<br/><b>${html(name)}</b>`, x,y,w,h,standard.styles.classBox);
    fields.forEach((text,i) => child(parent,html(text),0,50+i*30,w,30,standard.styles.classRow+'fontSize=13;'));
    const split = 50+fields.length*30;
    child(parent,'',0,split,w,8,standard.styles.separator);
    methods.forEach((text,i) => child(parent,html(text),0,split+8+i*30,w,30,standard.styles.classRow+'fontSize=13;'));
    return parent;
  };
  const lifeline = (name,x,top,bottom,w=170) => box(html(name),x-w/2,top,w,bottom-top,standard.styles.lifeline+'size=70;fillColor=#ffffff;');
  const activation = (x,y,h) => box('',x-5,y,10,h,standard.styles.activation+'fillColor=#ffffff;');
  const frame = (guard,x,y,w,h) => {
    const id=box('alt',x,y,w,h,standard.styles.frame+'fillColor=none;align=left;verticalAlign=top;spacingTop=0;');
    box(html(guard),x+65,y+8,w-90,30,'text;strokeColor=none;fillColor=none;align=left;spacing=0;');
    return id;
  };
  box(`<b>${html(title)}</b>`, 30, 20, width - 60, 50, 'fillColor=#efecfc;strokeColor=none;fontSize=20;');
  return { box, edge, line, note, umlClass, lifeline, activation, frame, finish: () => `<mxGraphModel dx="1422" dy="900" grid="1" gridSize="10" page="1" pageScale="1" pageWidth="${width}" pageHeight="${height}"><root>${cells.join('')}</root></mxGraphModel>` };
}

