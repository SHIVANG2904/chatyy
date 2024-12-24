/*
  # Enhanced Chat Features

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, unique)
      - `avatar_url` (text)
      - `status` (text)
      - `last_seen` (timestamptz)
  
  2. Changes to Messages
    - Add `recipient_id` for direct messages
    - Add indexes for better query performance
  
  3. Security
    - Enable RLS on profiles
    - Add policies for profile management
    - Update message policies for DMs
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
  username text UNIQUE NOT NULL,
  avatar_url text,
  status text DEFAULT 'offline',
  last_seen timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Add recipient_id to messages for DMs
ALTER TABLE messages ADD COLUMN recipient_id uuid REFERENCES auth.users;
CREATE INDEX messages_recipient_id_idx ON messages(recipient_id);
CREATE INDEX messages_user_id_idx ON messages(user_id);
CREATE INDEX messages_created_at_idx ON messages(created_at);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Update messages policies for DMs
DROP POLICY IF EXISTS "Anyone can read messages" ON messages;
CREATE POLICY "Users can read their messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    recipient_id = auth.uid() OR 
    recipient_id IS NULL
  );

-- Function to update last_seen
CREATE OR REPLACE FUNCTION update_last_seen()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET last_seen = now(),
      status = 'online'
  WHERE id = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update last_seen on message insert
CREATE TRIGGER update_last_seen_on_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_last_seen();