# 📦 Push Olive. to GitHub

## Quick Guide for Publishing Your Project

### Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click the **"+"** icon (top right) → **"New repository"**
3. Fill in:
   - **Repository name**: `olive` (or `palestine-doodles`)
   - **Description**: `🫒 Olive. - Raise awareness for Palestine through art`
   - **Visibility**: Choose **Public** (recommended for open-source) or **Private**
   - **DO NOT** check "Initialize with README" (we already have files)
4. Click **"Create repository"**

### Step 2: Initialize Git in Your Project

Open your terminal in the project folder and run:

```bash
# Initialize git repository
git init

# Add all files to staging
git add .

# Create your first commit
git commit -m "🫒 Initial commit - Olive. Palestine awareness platform

Features:
- Professional drawing tools (brush, eraser, shapes, fill)
- Palestine symbol stamps (olive, dove, flag, key, watermelon)
- 6 languages (EN, AR, TR, ES, FR, DE)
- Gallery with likes and social sharing
- Search and filter functionality
- Undo/Redo with keyboard shortcuts
- Mobile responsive design"

# Set main as default branch
git branch -M main
```

### Step 3: Connect to GitHub

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

Example:
```bash
git remote add origin https://github.com/yourusername/olive.git
```

### Step 4: Push to GitHub

```bash
git push -u origin main
```

If you get an authentication error, you may need to:
- Use a Personal Access Token instead of password
- Or set up SSH keys

---

## 🔑 GitHub Authentication Options

### Option A: Personal Access Token (Easiest)

1. Go to GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **"Generate new token (classic)"**
3. Give it a name: `Olive Deployment`
4. Select scopes: **repo** (all permissions)
5. Click **"Generate token"**
6. **COPY THE TOKEN** (you won't see it again!)

When prompted for password during `git push`, use the token instead.

### Option B: SSH Keys (More Secure)

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy the public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH and GPG keys → New SSH key
```

Then change your remote URL:
```bash
git remote set-url origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
```

---

## ✅ Verify Your Push

After pushing, check:
1. Go to your GitHub repository URL
2. You should see all your files
3. README.md should display on the homepage

---

## 📝 Future Updates

After making changes:

```bash
# Check what changed
git status

# Add changes
git add .

# Commit with a message
git commit -m "Add new feature"

# Push to GitHub
git push origin main
```

---

## 🎉 Ready for Vercel!

Once your code is on GitHub, you can:
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Deploy with one click!

**Your GitHub repository will be the source of truth for all deployments.** 🚀

