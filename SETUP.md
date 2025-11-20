# Olive. - Complete Setup Guide 🫒

## 🎉 Features Included

### ✨ Drawing Tools
- 🖌️ **Brush** - Free-hand drawing
- 🧹 **Eraser** - Remove mistakes  
- 📏 **Line** - Straight lines
- ▭ **Rectangle** - Rectangles (outline or filled)
- ⭕ **Circle** - Circles (outline or filled)
- △ **Triangle** - Triangles (outline or filled)
- 🪣 **Paint Bucket** - Flood fill areas
- ↶/↷ **Undo/Redo** - Full history (Ctrl+Z / Ctrl+Y)
- 📥 **Download** - Save locally before sharing

### 🇵🇸 Palestine Symbols & Stamps
- 🫒 Olive Branch
- 🕊️ Peace Dove
- 🇵🇸 Palestinian Flag
- 🔑 Key (Right of Return)
- 🍉 Watermelon (Solidarity)
- ❤️ Heart, ✊ Fist, ⭐ Star

### 🌍 Multilingual Support (6 Languages!)
- 🇬🇧 English
- 🇵🇸 Arabic (RTL support)
- 🇹🇷 Turkish
- 🇪🇸 Spanish
- 🇫🇷 French
- 🇩🇪 German

### 🖼️ Gallery Features
- ❤️ **Like System** - Heart doodles you love
- 📱 **Social Sharing** - Twitter, Facebook, WhatsApp, Copy Link
- 🔍 **Search** - Find doodles by title/description
- 🔄 **Sort** - By recent or most liked
- 📊 **Live Stats** - Total doodles, voices, hearts

### 📚 Educational
- 🫒 **"Why Olive?" Section** - Explains the symbolism
- 🌱 Cultural significance of olive trees in Palestine

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase

#### A. Create Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project: `olive-palestine`
3. Wait ~2 minutes for setup

#### B. Create Storage Bucket
1. Navigate to **Storage** in sidebar
2. Click **"New bucket"**
3. Name: `doodles`
4. **Enable "Public bucket"** ✅
5. Click **"Create bucket"**

#### C. Set Up Database
Go to **SQL Editor** and run:

```sql
-- Create doodles table with likes support
CREATE TABLE doodles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  likes INTEGER DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE doodles ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read doodles
CREATE POLICY "Doodles are viewable by everyone"
  ON doodles FOR SELECT
  USING (true);

-- Allow anyone to create doodles
CREATE POLICY "Anyone can create doodles"
  ON doodles FOR INSERT
  WITH CHECK (true);

-- Allow anyone to update likes
CREATE POLICY "Anyone can update likes"
  ON doodles FOR UPDATE
  USING (true)
  WITH CHECK (true);
```

#### D. Set Storage Policies
```sql
-- Allow public uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('doodles', 'doodles', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow anyone to upload
CREATE POLICY "Anyone can upload doodles"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'doodles');

-- Allow anyone to view
CREATE POLICY "Anyone can view doodles"
ON storage.objects FOR SELECT
USING (bucket_id = 'doodles');
```

#### E. Get API Keys
1. Go to **Project Settings** → **API**
2. Copy:
   - **Project URL**
   - **anon public** key

#### F. Configure Environment
Create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run Development Server
```bash
npm run dev
```

Visit **http://localhost:3000** 🎉

---

## ⌨️ Keyboard Shortcuts

- **Ctrl+Z** - Undo
- **Ctrl+Y** or **Ctrl+Shift+Z** - Redo

---

## 🎨 How to Use

### Drawing
1. Select a tool from the left sidebar
2. Choose a color (Palestine-inspired palette!)
3. Adjust brush/shape size
4. Draw on the canvas
5. Use **Palestine stamps** for quick symbols

### Shapes
- Toggle **"Fill Shape"** for solid shapes vs outlines
- Click and drag to draw
- Preview shows before you release

### Stamps
- Click any Palestine symbol stamp
- Click on canvas to place it
- Size controlled by brush size slider

### Saving & Sharing
1. **Download** - Save to your device
2. **Save & Share** - Upload to gallery
3. Gallery: Like others' art, share on social media

---

## 🌟 Best Practices

### For Artists
- Use Palestine flag colors: Green (#00732F), Black, White, Red (#EE2A35)
- Add stamps for powerful symbolism
- Write meaningful titles and descriptions
- Engage with community by liking others' work

### For Deployment
- Set proper CORS on Supabase
- Enable image optimization
- Monitor storage usage (1GB free tier)
- Consider upgrading for viral campaigns

---

## 📊 Monitoring

### Free Tier Limits
- **Storage:** 1GB
- **Bandwidth:** 2GB/month
- **Database:** 500MB

### Optimization Tips
- Images auto-compressed to PNG at 80% quality
- Implement pagination if > 1000 doodles
- Cache gallery results
- Use CDN for static assets

---

## 🔐 Moderation (Optional)

To add moderation:

```sql
-- Add approved column
ALTER TABLE doodles ADD COLUMN approved BOOLEAN DEFAULT true;

-- Update policies
DROP POLICY "Doodles are viewable by everyone" ON doodles;
CREATE POLICY "Only approved doodles are viewable"
  ON doodles FOR SELECT
  USING (approved = true);
```

---

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

Add environment variables in Vercel dashboard.

### Other Platforms
- **Netlify:** Configure build command: `npm run build`
- **Railway:** Auto-detects Next.js
- **Cloudflare Pages:** Full support

---

## 🆘 Troubleshooting

### "Failed to upload"
- Check storage bucket is public
- Verify storage policies are set
- Check `.env.local` has correct keys

### "Likes not updating"
- Ensure UPDATE policy exists on doodles table
- Check browser console for errors

### "Arabic text showing incorrectly"
- Ensure RTL is enabled (automatic in our code)
- Check font supports Arabic characters

---

## 🤝 Contributing

This is an open solidarity project. Contributions welcome:
- Bug fixes
- New features (text tool, more stamps, etc.)
- Translations to more languages
- UI/UX improvements

---

## 📜 License

MIT - Use freely for awareness campaigns

---

## 💚 Built With Love For Palestine

**Olive.** - Because like the olive tree, resistance grows from the roots.

🇵🇸 Free Palestine 🇵🇸

