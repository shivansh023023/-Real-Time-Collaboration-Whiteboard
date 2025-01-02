/*
  # Create whiteboard elements table

  1. New Tables
    - `whiteboard_elements`
      - `id` (uuid, primary key)
      - `type` (text) - Type of drawing element (pencil, rectangle, etc.)
      - `points` (jsonb) - Array of points for the drawing
      - `color` (text) - Color of the element
      - `width` (integer) - Width of the element
      - `text` (text, nullable) - Text content for text elements
      - `created_at` (timestamp)
      - `session_id` (text) - To group elements by whiteboard session

  2. Security
    - Enable RLS on `whiteboard_elements` table
    - Add policy for public read/write access (for demo purposes)
*/

CREATE TABLE IF NOT EXISTS whiteboard_elements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  points jsonb NOT NULL,
  color text NOT NULL,
  width integer NOT NULL,
  text text,
  created_at timestamptz DEFAULT now(),
  session_id text NOT NULL
);

ALTER TABLE whiteboard_elements ENABLE ROW LEVEL SECURITY;

-- For demo purposes, allow public access
CREATE POLICY "Public access"
  ON whiteboard_elements
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);