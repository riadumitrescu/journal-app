-- Create albums table
CREATE TABLE IF NOT EXISTS albums (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#8B5E3C',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create album_entries junction table
CREATE TABLE IF NOT EXISTS album_entries (
  album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
  entry_id UUID REFERENCES entries(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (album_id, entry_id)
);

-- Add RLS policies
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE album_entries ENABLE ROW LEVEL SECURITY;

-- Albums policies
CREATE POLICY "Users can view their own albums"
  ON albums FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own albums"
  ON albums FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own albums"
  ON albums FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own albums"
  ON albums FOR DELETE
  USING (auth.uid() = user_id);

-- Album entries policies
CREATE POLICY "Users can view their album entries"
  ON album_entries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM albums
      WHERE albums.id = album_entries.album_id
      AND albums.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add entries to their albums"
  ON album_entries FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM albums
      WHERE albums.id = album_entries.album_id
      AND albums.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove entries from their albums"
  ON album_entries FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM albums
      WHERE albums.id = album_entries.album_id
      AND albums.user_id = auth.uid()
    )
  ); 