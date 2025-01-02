import React, { useState } from 'react';
import { Mic } from 'lucide-react';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { useWhiteboardStore } from '../store/useWhiteboardStore';
import { findAvailablePosition } from '../utils/positioning';

export const VoiceNote: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const { addElement, elements } = useWhiteboardStore();

  const handleTranscript = (text: string) => {
    const position = findAvailablePosition(
      elements,
      window.innerWidth,
      window.innerHeight
    );

    addElement({
      id: Date.now().toString(),
      type: 'text',
      points: [position],
      color: '#000000',
      width: 16, // Increased text size
      text
    });
  };

  const { isListening, startListening } = useVoiceRecognition({
    onTranscript: handleTranscript,
    onError: (error) => {
      setError(error);
      setTimeout(() => setError(null), 3000);
    }
  });

  return (
    <>
      <button
        onClick={startListening}
        className={`p-2 rounded-lg transition-colors ${
          isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'hover:bg-gray-100'
        }`}
        title={isListening ? 'Recording...' : 'Add voice note'}
      >
        <Mic size={20} />
      </button>
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 text-red-600 px-4 py-2 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </>
  );
};