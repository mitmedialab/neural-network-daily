import type { TCoordinate } from "$lib/shared/contours/TContour";

export type TEdge = { from: TCoordinate, to: TCoordinate }
export type TDrawableInput = {
  width: number,
  height: number,
  size: number,
  color: string,
  onDraw: (edge: TEdge) => void
};

export default function drawable(canvas: HTMLCanvasElement, params: TDrawableInput) {
  const init = (settings: TDrawableInput) => {
    canvas.width = settings.width;
    canvas.height = settings.height;
    const { size, color } = settings;
    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.lineWidth = size;
    context.strokeStyle = color;
    return context;
  }

  let context = init(params);
  const { onDraw } = params;

  // last known position
  var current: TCoordinate = { x: 0, y: 0 };

  const toPosition = (e: MouseEvent): TCoordinate => {
    var rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  };

  const updatePosition = (e: MouseEvent) => (current = toPosition(e));

  canvas.addEventListener('mousedown', updatePosition);
  canvas.addEventListener('mouseenter', updatePosition);

  const connect = (from: TCoordinate, to: TCoordinate) => {
    context.beginPath(); // begin
    context.moveTo(from.x, from.y); // from
    context.lineTo(to.x, to.y); // to
    context.stroke(); // draw it!
  }

  canvas.addEventListener('mousemove', (e: MouseEvent) => {
    // mouse left button must be pressed
    if (e.buttons !== 1) return;

    const previous = current;
    current = toPosition(e);
    connect(previous, current);
    onDraw({ from: previous, to: current })
  });

  return {
    update(params: TDrawableInput) {
      context = init(params);
    },
    destroy() { },
  };
}