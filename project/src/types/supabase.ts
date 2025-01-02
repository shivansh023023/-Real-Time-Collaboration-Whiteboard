export interface Database {
  public: {
    Tables: {
      whiteboard_elements: {
        Row: {
          id: string;
          type: string;
          points: { x: number; y: number }[];
          color: string;
          width: number;
          text?: string;
          created_at: string;
          session_id: string;
        };
        Insert: {
          id?: string;
          type: string;
          points: { x: number; y: number }[];
          color: string;
          width: number;
          text?: string;
          session_id: string;
        };
        Update: {
          id?: string;
          type?: string;
          points?: { x: number; y: number }[];
          color?: string;
          width?: number;
          text?: string;
          session_id?: string;
        };
      };
    };
  };
}