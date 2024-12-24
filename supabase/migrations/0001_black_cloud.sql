/*
  # Create Messages Table for Chat Application

  1. New Tables
    - `messages`
      - `id` (bigint, primary key)
      - `content` (text, message content)
      - `user_id` (uuid, references auth.users)
      - `user_email` (text, user's email)
      - `created_at` (timestamp with timezone)

  2. Security
    - Enable RLS on messages table
    - Add policies for:
      - Anyone can read messages
      - Authenticated users can insert their own messages
*/

CREATE TABLE IF NOT EXISTS messages (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  content text NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  user_email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read messages
CREATE POLICY "Anyone can read messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert their own messages
CREATE POLICY "Users can insert their own messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);