// Utility drawing functions for Digital Artist
// Centralizes canvas operations for maintainability

export type ShapeTool =
  | 'rectangle'
  | 'circle'
  | 'triangle'
  | 'line'
  | 'star'
  | 'heart'
  | 'diamond'
  | 'arrow';

export function sprayPaint(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) {
  ctx.fillStyle = color;
  const dots = Math.max(20, Math.floor(size * 1.5));
  for (let i = 0; i < dots; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * (size / 2);
    const offsetX = Math.cos(angle) * radius;
    const offsetY = Math.sin(angle) * radius;
    ctx.globalAlpha = 0.6 + Math.random() * 0.4;
    ctx.fillRect(x + offsetX, y + offsetY, 1.5, 1.5);
  }
  ctx.globalAlpha = 1;
}

export function blurArea(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  const half = size / 2;
  try {
    const imageData = ctx.getImageData(x - half, y - half, size, size);
    const data = imageData.data;
    const w = imageData.width;
    const h = imageData.height;

    // Simple box blur
    for (let iy = 1; iy < h - 1; iy++) {
      for (let ix = 1; ix < w - 1; ix++) {
        const i = (iy * w + ix) * 4;
        let r = 0, g = 0, b = 0, a = 0;
        for (let oy = -1; oy <= 1; oy++) {
          for (let ox = -1; ox <= 1; ox++) {
            const j = ((iy + oy) * w + (ix + ox)) * 4;
            r += data[j]; g += data[j+1]; b += data[j+2]; a += data[j+3];
          }
        }
        data[i] = r / 9; data[i+1] = g / 9; data[i+2] = b / 9; data[i+3] = a / 9;
      }
    }
    ctx.putImageData(imageData, x - half, y - half);
  } catch {}
}

export function fillAt(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string
) {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const data = imageData.data;
  const target = getPixel(data, x, y, ctx.canvas.width);
  const replacement = hexToRgba(color);
  if (sameColor(target, replacement)) return;
  floodFill(data, x, y, target, replacement, ctx.canvas.width, ctx.canvas.height);
  ctx.putImageData(imageData, 0, 0);
}

function getPixel(data: Uint8ClampedArray, x: number, y: number, width: number) {
  const i = (y * width + x) * 4;
  return [data[i], data[i+1], data[i+2], data[i+3]];
}

function sameColor(a: number[], b: number[]) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

function hexToRgba(hex: string): number[] {
  const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return res ? [parseInt(res[1], 16), parseInt(res[2], 16), parseInt(res[3], 16), 255] : [0, 0, 0, 255];
}

function floodFill(
  data: Uint8ClampedArray,
  x: number,
  y: number,
  target: number[],
  replacement: number[],
  width: number,
  height: number
) {
  const stack: Array<[number, number]> = [[x, y]];
  while (stack.length) {
    const [cx, cy] = stack.pop()!;
    if (cx < 0 || cy < 0 || cx >= width || cy >= height) continue;
    const i = (cy * width + cx) * 4;
    const curr = [data[i], data[i+1], data[i+2], data[i+3]];
    if (!sameColor(curr, target)) continue;
    data[i] = replacement[0];
    data[i+1] = replacement[1];
    data[i+2] = replacement[2];
    data[i+3] = replacement[3];
    stack.push([cx+1, cy]);
    stack.push([cx-1, cy]);
    stack.push([cx, cy+1]);
    stack.push([cx, cy-1]);
  }
}

export function drawGrid(ctx: CanvasRenderingContext2D, gridSize: number = 20) {
  ctx.save();
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 1;
  for (let x = 0; x <= ctx.canvas.width; x += gridSize) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ctx.canvas.height); ctx.stroke();
  }
  for (let y = 0; y <= ctx.canvas.height; y += gridSize) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(ctx.canvas.width, y); ctx.stroke();
  }
  ctx.restore();
}

export function drawShape(
  ctx: CanvasRenderingContext2D,
  tool: ShapeTool,
  start: { x: number; y: number },
  end: { x: number; y: number },
  color: string,
  size: number
) {
  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = Math.max(1, size);

  const x = Math.min(start.x, end.x);
  const y = Math.min(start.y, end.y);
  const w = Math.abs(end.x - start.x);
  const h = Math.abs(end.y - start.y);
  const cx = (start.x + end.x) / 2;
  const cy = (start.y + end.y) / 2;

  const begin = () => { ctx.beginPath(); };
  const endStroke = () => { ctx.stroke(); };

  switch (tool) {
    case 'rectangle':
      begin(); ctx.rect(x, y, w, h); endStroke(); break;
    case 'circle':
      begin(); ctx.ellipse(cx, cy, w / 2, h / 2, 0, 0, Math.PI * 2); endStroke(); break;
    case 'triangle':
      begin();
      ctx.moveTo(cx, y);
      ctx.lineTo(x, y + h);
      ctx.lineTo(x + w, y + h);
      ctx.closePath();
      endStroke();
      break;
    case 'line':
      begin(); ctx.moveTo(start.x, start.y); ctx.lineTo(end.x, end.y); endStroke(); break;
    case 'diamond':
      begin();
      ctx.moveTo(cx, y);
      ctx.lineTo(x, cy);
      ctx.lineTo(cx, y + h);
      ctx.lineTo(x + w, cy);
      ctx.closePath();
      endStroke();
      break;
    case 'arrow': {
      // simple line with arrow head
      begin();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      endStroke();
      const angle = Math.atan2(end.y - start.y, end.x - start.x);
      const headLen = Math.max(10, size * 2);
      begin();
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(end.x - headLen * Math.cos(angle - Math.PI / 6), end.y - headLen * Math.sin(angle - Math.PI / 6));
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(end.x - headLen * Math.cos(angle + Math.PI / 6), end.y - headLen * Math.sin(angle + Math.PI / 6));
      endStroke();
      break; }
    case 'star': {
      const spikes = 5;
      const outerR = Math.max(w, h) / 2;
      const innerR = outerR / 2.5;
      begin();
      for (let i = 0; i < spikes * 2; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const a = (i * Math.PI) / spikes - Math.PI / 2;
        const sx = cx + Math.cos(a) * r;
        const sy = cy + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.closePath();
      endStroke();
      break; }
    case 'heart': {
      // approximate heart using beziers
      begin();
      const topCurveHeight = h * 0.3;
      ctx.moveTo(cx, y + h);
      ctx.bezierCurveTo(cx - w / 2, y + h - topCurveHeight, x, y + h / 2, cx, y + h / 3);
      ctx.bezierCurveTo(x + w, y + h / 2, cx + w / 2, y + h - topCurveHeight, cx, y + h);
      endStroke();
      break; }
  }
  ctx.restore();
}
