import { Point } from '../types/whiteboard';

const TEXT_PADDING = 20;
const LINE_HEIGHT = 30;
const TOOLBAR_HEIGHT = 80;
const STARTING_X = 20;
const STARTING_Y = TOOLBAR_HEIGHT + 20;

export const findAvailablePosition = (
  elements: Array<{ points: Point[]; text?: string }>,
  viewportWidth: number,
  _viewportHeight: number
): Point => {
  // Filter only text elements and sort them by Y position
  const textElements = elements
    .filter(el => el.text)
    .sort((a, b) => a.points[0].y - b.points[0].y);
  
  if (textElements.length === 0) {
    return { x: STARTING_X, y: STARTING_Y };
  }

  // Find the last element's position
  const lastElement = textElements[textElements.length - 1];
  const lastY = lastElement.points[0].y;
  
  // Get all elements in the last line
  const elementsInLastLine = textElements.filter(
    el => el.points[0].y === lastY
  );

  // Calculate the width of the last line
  const lastLineWidth = elementsInLastLine.reduce((width, element) => {
    const textWidth = (element.text?.length || 0) * 10; // Approximate width per character
    return Math.max(width, element.points[0].x + textWidth);
  }, 0);

  // Check if we need to start a new line
  if (lastLineWidth + 300 > viewportWidth - STARTING_X) {
    return {
      x: STARTING_X,
      y: lastY + LINE_HEIGHT
    };
  }

  // Add to the current line
  return {
    x: lastLineWidth + TEXT_PADDING,
    y: lastY
  };
};