const getOffset = (el: HTMLElement): { left: number, top: number, width: number, height: number } => {
  const rect: DOMRect = el.getBoundingClientRect();
  return {
    left: rect.left + window.pageXOffset,
    top: rect.top + window.pageYOffset,
    width: rect.width || el.offsetWidth,
    height: rect.height || el.offsetHeight
  };
}

export const getConnectionStyle = (div1: HTMLDivElement, div2: HTMLDivElement, thickness: number): string => {
  const off1 = getOffset(div1);
  const off2 = getOffset(div2);

  const x1 = off1.left + off1.width / 2;
  const y1 = off1.top + off1.height / 2;

  const x2 = off2.left + off2.width / 2;
  const y2 = off2.top + off1.height / 2;

  const color1 = window.getComputedStyle(div1).backgroundColor;
  const color2 = window.getComputedStyle(div2).backgroundColor;

  const length = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));

  const cx = ((x1 + x2) / 2) - (length / 2);
  const cy = ((y1 + y2) / 2) - (thickness / 2);

  const angle = Math.atan2((y1 - y2), (x1 - x2)) * (180 / Math.PI);

  return `padding: 0px;
  margin: 0px;
  height: ${thickness}px;
  line-height:1px; 
  position:absolute; 
  left: ${cx}px; 
  top: ${cy}px; 
  width: ${length}px; 
  z-index: -1;
  -moz-transform:rotate(${angle}deg); 
  -webkit-transform:rotate(${angle}deg); 
  -o-transform:rotate(${angle}deg); 
  -ms-transform:rotate(${angle}deg); 
  transform:rotate(${angle}deg);
  background-image: linear-gradient(to left, ${color1}, ${color1}, ${color2});`;
}