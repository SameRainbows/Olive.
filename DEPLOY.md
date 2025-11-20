# 🚀 Deploy Olive. to Vercel

## ✅ Pre-Deployment Checklist

- [x] All features implemented
- [x] Supabase configured
- [x] Environment variables ready
- [x] .gitignore configured
- [x] Build tested locally

---

## 📦 Step-by-Step Deployment

### 1. Test Build Locally (Optional)
```bash
npm run build
npm start
```
Visit http://localhost:3000 to verify production build works.

---

### 2. Push to GitHub

If you haven't already:

```bash
git init
git add .
git commit -m "🫒 Initial commit - Olive. Palestine awareness platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/olive.git
git push -u origin main
```

---

### 3. Deploy to Vercel

#### Option A: Via Vercel Website (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. **Import your GitHub repository**
4. Vercel auto-detects Next.js - click **"Deploy"**
5. **WAIT!** Before deploying, add environment variables:

#### Add Environment Variables:
Click **"Environment Variables"** and add:

```
NEXT_PUBLIC_SUPABASE_URL = https://ireilqznxzqxylablwca.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyZWlscXpueHpxeHlsYWJsd2NhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NTc3ODAsImV4cCI6MjA3OTIzMzc4MH0.6ER44oP0RMgw0Iu6wBoMLWPkUpjZolPa11MBeKcdOgQ
```

Make sure to select **"Production", "Preview", and "Development"** for all environments.

6. Click **"Deploy"** 🎉

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts, then deploy to production:
vercel --prod
```

When prompted for environment variables, add the Supabase credentials above.

---

### 4. Configure Custom Domain (Optional)

1. In Vercel dashboard → **Settings** → **Domains**
2. Add your custom domain (e.g., `olive.art`)
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

---

### 5. Update Supabase Settings

After deployment, update your Supabase project:

1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add your Vercel URL to **Site URL**: `https://your-project.vercel.app`
3. Add to **Redirect URLs**: `https://your-project.vercel.app/**`

---

## 🔧 Post-Deployment Configuration

### Update next.config.js with Your Domain

After deployment, if using custom domain or Vercel domain, ensure image domains are configured:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'ireilqznxzqxylablwca.supabase.co',
      'your-custom-domain.com' // Add if using custom domain
    ],
  },
}

module.exports = nextConfig
```

---

## ⚡ Performance Optimizations (Optional)

### Enable Vercel Analytics
```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react'

// In your layout:
<body>
  {children}
  <Analytics />
</body>
```

### Enable Vercel Speed Insights
```bash
npm install @vercel/speed-insights
```

---

## 📊 Monitoring

### Vercel Dashboard
- **Deployments**: View all deployments and rollback if needed
- **Analytics**: See visitor stats (if enabled)
- **Logs**: Check runtime logs for errors
- **Speed Insights**: Monitor performance

### Supabase Dashboard
- **Database**: Monitor doodle uploads
- **Storage**: Check storage usage
- **Logs**: See all API requests

---

## 🔄 Continuous Deployment

Vercel automatically redeploys on every push to `main`:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel auto-deploys! 🚀
```

---

## 🌍 Share Your Site!

Once deployed, share on:
- 🐦 Twitter/X
- 📘 Facebook  
- 💬 WhatsApp
- 📧 Email lists
- 🎨 Art communities
- 🇵🇸 Palestine solidarity groups

### Sample Share Message:
```
🫒 Introducing Olive. - A platform to raise awareness for Palestine through art! 

✨ Draw doodles
🇵🇸 Use Palestine symbols
❤️ Share with the world
🌍 Available in 6 languages

Join the movement: [YOUR-URL]

#FreePalestine #ArtForJustice #Olive
```

---

## 🆘 Troubleshooting

### Build Fails
- Check all imports are correct
- Ensure all dependencies in package.json
- Run `npm run build` locally first

### Environment Variables Not Working
- Verify they're added in Vercel dashboard
- Must start with `NEXT_PUBLIC_` for client-side
- Redeploy after adding variables

### Images Not Loading
- Check Supabase storage is public
- Verify image domains in next.config.js
- Check CORS settings in Supabase

### Slow Performance
- Enable Edge Functions in Vercel
- Use Image Optimization
- Implement caching strategies
- Consider CDN for assets

---

## 🎉 You're Live!

Your Vercel URL will be: `https://olive-[random].vercel.app`

You can customize the project name in Vercel settings.

---

## 💚 Next Steps

1. ✅ Test all features on production
2. ✅ Share with friends and communities
3. ✅ Monitor analytics and engagement
4. ✅ Gather feedback
5. ✅ Iterate and improve

**May your platform amplify voices for Palestine! 🇵🇸🫒**

---

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs

**Free Palestine! 🇵🇸**

