import { Point, DrawingElement } from '../types/whiteboard';

export const drawShape = (
  ctx: CanvasRenderingContext2D,
  type: DrawingElement['type'],
  start: Point,
  end: Point,
  color: string,
  width: number
) => {
  ctx.beginPath();
  
  if (type === 'eraser') {
    // Use destination-out composite operation to create transparent areas
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = 'rgba(0,0,0,1)';
    ctx.lineWidth = width * 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';
  } else {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    
    if (type === 'rectangle') {
      const width = end.x - start.x;
      const height = end.y - start.y;
      ctx.strokeRect(start.x, start.y, width, height);
    } else if (type === 'circle') {
      const radius = Math.sqrt(
        Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
      );
      ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }
};