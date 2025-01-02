import { useState, useCallback } from 'react';

interface UseVoiceRecognitionProps {
  onTranscript: (text: string) => void;
  onError?: (error: string) => void;
}

export const useVoiceRecognition = ({ onTranscript, onError }: UseVoiceRecognitionProps) => {
  const [isListening, setIsListening] = useState(false);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      onError?.('Speech recognition is not supported in your browser');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      onError?.(event.error);
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };

    recognition.start();
  }, [onTranscript, onError]);

  return {
    isListening,
    startListening
  };
};