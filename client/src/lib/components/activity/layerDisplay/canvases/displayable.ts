import type { TCoordinate } from "$lib/shared/contours/TContour";

export type TDisplayableInput =
  {
    width: number,
    height: number,
    color: string,
    size: number,
    path: TCoordinate[]
  }

export default function drawable(node: HTMLCanvasElement, params: TDisplayableInput) {
  const canvas = node as HTMLCanvasElement;

  // get canvas 2D context and set him correct size
  let context = canvas.getContext('2d');

  const connect = (from: TCoordinate, to: TCoordinate) => {
    context.beginPath(); // begin
    context.moveTo(from.x, from.y); // from
    context.lineTo(to.x, to.y); // to
    context.stroke(); // draw it!
  }

  function drawPath(settings: TDisplayableInput) {
    const { width, height, size, color, path } = settings;
    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext('2d');
    context.fillStyle = "#FFF";
    context.fillRect(0, 0, width, height); // something in the background

    if (!path) return;
    context.lineCap = 'round';
    context.lineWidth = size;
    context.strokeStyle = color;
    for (let index = 0; index < path.length - 1; index++) {
      connect(path[index], path[index + 1]);
    }
  }

  drawPath(params);

  return {
    update(newParams) {
      drawPath(newParams);
    },
    destroy() { },
  };
}
