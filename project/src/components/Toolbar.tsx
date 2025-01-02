import React from 'react';
import {
  Pencil,
  Square,
  Circle,
  Type,
  Eraser,
  Download,
  Trash2,
} from 'lucide-react';
import { useWhiteboardStore } from '../store/useWhiteboardStore';
import { VoiceNote } from './VoiceNote';

interface ToolbarProps {
  onExport: () => void;
  onClear: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onExport,
  onClear,
}) => {
  const { tool, setTool, color, setColor, width, setWidth } = useWhiteboardStore();

  const tools = [
    { icon: <Pencil size={20} />, value: 'pencil' },
    { icon: <Square size={20} />, value: 'rectangle' },
    { icon: <Circle size={20} />, value: 'circle' },
    { icon: <Type size={20} />, value: 'text' },
    { icon: <Eraser size={20} />, value: 'eraser' },
  ];

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 flex items-center gap-2">
      {tools.map(({ icon, value }) => (
        <button
          key={value}
          className={`p-2 rounded-lg transition-colors ${
            tool === value ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
          }`}
          onClick={() => setTool(value as any)}
        >
          {icon}
        </button>
      ))}
      <div className="w-px h-6 bg-gray-200 mx-2" />
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="w-8 h-8 rounded cursor-pointer"
      />
      <input
        type="range"
        min="1"
        max="20"
        value={width}
        onChange={(e) => setWidth(Number(e.target.value))}
        className="w-24"
      />
      <div className="w-px h-6 bg-gray-200 mx-2" />
      <VoiceNote />
      <button
        onClick={onExport}
        className="p-2 rounded-lg hover:bg-gray-100"
      >
        <Download size={20} />
      </button>
      <button
        onClick={onClear}
        className="p-2 rounded-lg hover:bg-gray-100 text-red-500"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};