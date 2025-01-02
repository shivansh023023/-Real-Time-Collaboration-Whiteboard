export type Point = {
  x: number;
  y: number;
};

export type DrawingElement = {
  id: string;
  type: 'pencil' | 'line' | 'rectangle' | 'circle' | 'text' | 'eraser';
  points: Point[];
  color: string;
  width: number;
  text?: string;
};