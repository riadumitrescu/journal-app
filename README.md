# Your Inner Library - A Mindful Journaling Experience

A beautiful space for your daily reflections, emotions, and personal growth.

## Features

- 📝 Daily journal entries with rich text editing
- 🎨 Mood tracking with color visualization
- 📚 Custom albums to organize your entries
- 📊 Visual year-in-review of your journaling journey
- 🔒 Secure authentication and private entries

## Tech Stack

- Next.js 14 (App Router)
- Supabase (Database & Storage)
- Clerk (Authentication)
- TailwindCSS (Styling)
- TypeScript
- Vercel (Deployment)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Clerk account and project

### Environment Variables

The following environment variables are required for deployment:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/journal
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/journal
```

### Local Development

1. Clone the repository:
```bash
   git clone https://github.com/your-username/journal-app.git
cd journal-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with the environment variables listed above.

4. Run the development server:
```bash
npm run dev
   ```

### Database Setup

1. Create a new Supabase project
2. Run the following migration in the SQL editor:

```sql
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
```

## Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add all environment variables in the Vercel project settings
4. Deploy!

## License

This project is licensed under the MIT License - see the LICENSE file for details. 