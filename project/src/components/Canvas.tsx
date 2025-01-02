import React, { useRef, useEffect, useState } from 'react';
import { useWhiteboardStore } from '../store/useWhiteboardStore';
import { Point } from '../types/whiteboard';
import { drawShape } from '../utils/drawing';

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const { elements, tool, color, width, addElement } = useWhiteboardStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    elements.forEach((element) => {
      if (element.type === 'text' && element.text) {
        ctx.font = '16px system-ui, sans-serif';
        ctx.fillStyle = element.color;
        ctx.fillText(element.text, element.points[0].x, element.points[0].y);
      } else {
        const start = element.points[0];
        const end = element.points[element.points.length - 1];

        if (['rectangle', 'circle', 'eraser'].includes(element.type)) {
          drawShape(ctx, element.type, start, end, element.color, element.width);
        } else {
          ctx.beginPath();
          ctx.strokeStyle = element.color;
          ctx.lineWidth = element.width;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';

          element.points.forEach((point, index) => {
            if (index === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          });
          ctx.stroke();
        }
      }
    });
  }, [elements]);

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    const point = { x: e.clientX, y: e.clientY };
    setCurrentPoints([point]);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;

    const newPoint = { x: e.clientX, y: e.clientY };
    setCurrentPoints((prev) => [...prev, newPoint]);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const startPoint = currentPoints[0];

    if (['rectangle', 'circle'].includes(tool)) {
      // For shapes, clear and redraw everything
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      elements.forEach((element) => {
        const start = element.points[0];
        const end = element.points[element.points.length - 1];
        drawShape(ctx, element.type, start, end, element.color, element.width);
      });
      drawShape(ctx, tool, startPoint, newPoint, color, width);
    } else {
      // For freehand drawing and eraser
      ctx.beginPath();
      ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
      ctx.lineWidth = tool === 'eraser' ? width * 2 : width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      if (currentPoints.length > 1) {
        const prevPoint = currentPoints[currentPoints.length - 2];
        ctx.moveTo(prevPoint.x, prevPoint.y);
        ctx.lineTo(newPoint.x, newPoint.y);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    if (!isDrawing || currentPoints.length === 0) return;
    setIsDrawing(false);

    addElement({
      type: tool,
      points: currentPoints,
      color: tool === 'eraser' ? '#FFFFFF' : color,
      width: tool === 'eraser' ? width * 2 : width
    });

    setCurrentPoints([]);
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 bg-white"
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
    />
  );
};