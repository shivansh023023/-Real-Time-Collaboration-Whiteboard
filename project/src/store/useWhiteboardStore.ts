import { create } from 'zustand';
import { DrawingElement } from '../types/whiteboard';
import { supabase } from '../lib/supabase';
import { nanoid } from 'nanoid';

interface WhiteboardState {
  elements: DrawingElement[];
  tool: DrawingElement['type'];
  color: string;
  width: number;
  sessionId: string;
  addElement: (element: Omit<DrawingElement, 'id'>) => void;
  setTool: (tool: DrawingElement['type']) => void;
  setColor: (color: string) => void;
  setWidth: (width: number) => void;
  clear: () => void;
  initializeRealtime: () => void;
}

export const useWhiteboardStore = create<WhiteboardState>((set, get) => ({
  elements: [],
  tool: 'pencil',
  color: '#000000',
  width: 2,
  sessionId: nanoid(),

  addElement: async (element) => {
    const { data, error } = await supabase
      .from('whiteboard_elements')
      .insert({
        type: element.type,
        points: element.points,
        color: element.color,
        width: element.width,
        text: element.text,
        session_id: get().sessionId
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to add element:', error);
      return;
    }

    // Add locally with the UUID from Supabase
    set((state) => ({
      elements: [...state.elements, data as DrawingElement]
    }));
  },

  setTool: (tool) => set({ tool }),
  setColor: (color) => set({ color }),
  setWidth: (width) => set({ width }),
  
  clear: async () => {
    set({ elements: [] });
    await supabase
      .from('whiteboard_elements')
      .delete()
      .eq('session_id', get().sessionId);
  },

  initializeRealtime: () => {
    // Load initial elements
    supabase
      .from('whiteboard_elements')
      .select('*')
      .eq('session_id', get().sessionId)
      .then(({ data }) => {
        if (data) {
          set({ elements: data as DrawingElement[] });
        }
      });

    // Subscribe to real-time changes
    supabase
      .channel('whiteboard_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'whiteboard_elements',
          filter: `session_id=eq.${get().sessionId}`
        },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              set((state) => ({
                elements: [...state.elements, payload.new as DrawingElement]
              }));
              break;
            case 'DELETE':
              set({ elements: [] });
              break;
          }
        }
      )
      .subscribe();
  }
}));