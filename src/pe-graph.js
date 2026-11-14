// Uncompressed diagrams.net XML: editable shapes, relationships and labels.
export const xmlEscape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
const html = xmlEscape;
export function graph(title, width = 1600, height = 1800) {
  let serial = 0;
  const cells = ['<mxCell id="0"/><mxCell id="1" parent="0"/>'];
  const box = (value, x, y, w = 240, h = 100, style = '') => {
    const id = `n${++serial}`;
    cells.push(`<mxCell id="${id}" value="${xmlEscape(value)}" style="${xmlEscape(`rounded=0;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#6551ce;fontSize=14;spacing=10;${style}`)}" vertex="1" parent="1"><mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry"/></mxCell>`);
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
  box(`<b>${html(title)}</b>`, 30, 20, width - 60, 50, 'fillColor=#efecfc;strokeColor=none;fontSize=20;');
  return { box, edge, line, note, finish: () => `<mxGraphModel dx="1422" dy="900" grid="1" gridSize="10" page="1" pageScale="1" pageWidth="${width}" pageHeight="${height}"><root>${cells.join('')}</root></mxGraphModel>` };
}

