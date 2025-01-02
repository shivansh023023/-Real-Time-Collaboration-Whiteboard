import React, { useEffect, useCallback } from 'react';
import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { useWhiteboardStore } from './store/useWhiteboardStore';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

function App() {
  const { clear, initializeRealtime } = useWhiteboardStore();

  useEffect(() => {
    initializeRealtime();
  }, [initializeRealtime]);

  const handleExport = useCallback(async () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    // Export as PNG
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = canvas.toDataURL();
    link.click();

    // Export as PDF
    const pdf = new jsPDF();
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0);
    pdf.save('whiteboard.pdf');
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <Canvas />
      <Toolbar
        onExport={handleExport}
        onClear={clear}
      />
    </div>
  );
}

export default App;