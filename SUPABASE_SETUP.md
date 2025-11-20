# Supabase Setup Guide 🚀

Follow these steps to set up your Supabase backend for the Palestine Doodles project.

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click **"New Project"**
4. Fill in:
   - **Name**: palestine-doodles (or any name you like)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click **"Create new project"** and wait ~2 minutes

## Step 2: Create Storage Bucket

1. In your Supabase dashboard, go to **Storage** (left sidebar)
2. Click **"Create a new bucket"**
3. Name it: `doodles`
4. Make it **Public** (toggle "Public bucket" ON)
5. Click **"Create bucket"**

## Step 3: Set Storage Policies

1. Click on your `doodles` bucket
2. Go to **Policies** tab
3. Click **"New Policy"**
4. Choose **"Allow all operations"** for now (or customize)
5. Save the policy

## Step 4: Create Database Table

1. Go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Paste this SQL and click **"Run"**:

```sql
-- Create doodles table
create table doodles (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  image_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  likes integer default 0
);

-- Enable Row Level Security
alter table doodles enable row level security;

-- Allow anyone to read doodles
create policy "Doodles are viewable by everyone"
  on doodles for select
  using (true);

-- Allow anyone to create doodles
create policy "Anyone can create doodles"
  on doodles for insert
  with check (true);

-- Optional: Allow likes updates (for future feature)
create policy "Anyone can update likes"
  on doodles for update
  using (true)
  with check (true);
```

## Step 5: Get Your API Keys

1. Go to **Project Settings** (gear icon, bottom left)
2. Click **API** in the left menu
3. You'll see:
   - **Project URL** - Copy this
   - **anon public** key - Copy this (click to reveal)

## Step 6: Add Keys to Your Project

1. In your project folder, find the file `.env.example`
2. Copy it and rename to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. Open `.env.local` and paste your keys:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 7: Update Next.js Config (Optional)

1. Open `next.config.js`
2. Replace `YOUR_SUPABASE_PROJECT_ID` with your actual project ID
3. (It's in your Supabase URL: `https://[PROJECT_ID].supabase.co`)

## Step 8: Test It!

Run your development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Try:
1. Creating a doodle
2. Viewing the gallery

## Troubleshooting

### "Failed to upload doodle"
- Check that the `doodles` bucket exists and is public
- Check storage policies are set correctly
- Check your `.env.local` file has correct keys

### "Error fetching doodles"
- Check that the `doodles` table exists
- Check RLS policies are set up
- Check your database connection

### "Cannot read properties of undefined"
- Make sure `.env.local` exists and has both keys
- Restart your dev server after adding `.env.local`

## Optional: Add Image Optimization

In Supabase dashboard:
1. Go to **Storage** → **Policies**
2. Enable transformation features (Pro plan)

Or use Cloudinary for free image optimization!

## Security Notes

- ✅ Row Level Security (RLS) is enabled
- ✅ Only public read/write operations allowed
- ✅ No authentication required (for awareness campaign)
- ⚠️ Consider adding moderation in the future
- ⚠️ Monitor storage usage on free tier (1GB limit)

## Need Help?

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- Check the main README.md file

---

Good luck with your awareness campaign! 🇵🇸

