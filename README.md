# Palestine Doodles - Raise Awareness Through Art 🇵🇸

A web platform where people can create and share doodles to raise awareness for Palestine.

## Features

- 🎨 **Drawing Canvas** - Simple, intuitive canvas with color palette and brush controls
- 📸 **Gallery** - View all shared doodles from the community
- 💾 **Cloud Storage** - Doodles stored securely with Supabase
- 📱 **Responsive** - Works on desktop, tablet, and mobile
- 🚀 **Fast** - Built with Next.js 14 and optimized for performance

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database + Storage)
- **Deployment**: Ready for Vercel, Netlify, or any hosting platform

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Go to [supabase.com](https://supabase.com) and create a project
2. In your Supabase dashboard, go to **Storage**:
   - Create a new bucket called `doodles`
   - Make it **public** (Settings → Public bucket: ON)

3. Go to **SQL Editor** and run this command:

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

-- Allow anyone to insert doodles
create policy "Anyone can create doodles"
  on doodles for insert
  with check (true);
```

4. Copy `.env.example` to `.env.local` and add your Supabase credentials:
   - Get them from: **Project Settings → API**

```bash
cp .env.example .env.local
```

Then edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables (your Supabase keys)
4. Deploy!

## Project Structure

```
├── app/
│   ├── page.tsx           # Home page
│   ├── draw/page.tsx      # Drawing canvas page
│   ├── gallery/page.tsx   # Gallery page
│   └── layout.tsx         # Root layout
├── components/
│   └── DrawingCanvas.tsx  # Canvas component
├── lib/
│   └── supabase.ts        # Supabase client
└── public/                # Static assets
```

## Contributing

This is an awareness project - contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## License

MIT - Feel free to use this for any awareness campaigns

---

Made with ❤️ for Palestine 🇵🇸



---

Made by [Mehmet Dedeler](https://mehmetdedeler.com).