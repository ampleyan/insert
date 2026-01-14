# Deployment Guide - GitHub Pages

Quick guide to deploy your Win98 Desktop to GitHub Pages.

## Prerequisites

- GitHub account
- Git installed on your computer
- Your video files ready (under 100MB each)

## Step-by-Step Deployment

### 1. Prepare Your Repository

```bash
# Navigate to project folder
cd /path/to/win98

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Windows 98 party promo interface"
```

### 2. Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the **+** icon → **New repository**
3. Name it: `win98` (or your preferred name)
4. **Don't** initialize with README (we already have one)
5. Click **Create repository**

### 3. Push to GitHub

```bash
# Add remote (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/win98.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 4. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll to **Pages** section (in left sidebar)
4. Under **Source**:
   - Branch: select `main`
   - Folder: select `/ (root)`
5. Click **Save**

### 5. Access Your Site

Your site will be live at:
```
https://YOUR-USERNAME.github.io/win98
```

**Note:** Initial deployment may take 2-5 minutes.

## Video File Considerations

### File Size Limits

GitHub has a 100MB per-file limit. For videos:

**Option 1: Compress Videos** (Recommended)
```bash
# Install FFmpeg (if not installed)
# macOS: brew install ffmpeg
# Windows: choco install ffmpeg
# Linux: sudo apt install ffmpeg

# Compress video
ffmpeg -i large-video.mp4 -c:v libx264 -crf 28 -preset fast -c:a aac -b:a 96k compressed-video.mp4
```

**Option 2: Use Git LFS** (for files 100MB-2GB)
```bash
# Install Git LFS
git lfs install

# Track video files
git lfs track "videos/*.mp4"
git add .gitattributes

# Commit and push
git add videos/
git commit -m "Add videos with Git LFS"
git push
```

**Option 3: External Hosting**
- Upload videos to YouTube, Vimeo, or Cloudinary
- Update video source URLs in `index.html`
- Much faster page loads for visitors

### Current Video Files

Check your video sizes:
```bash
ls -lh videos/
```

If any file is over 90MB, compress it before deploying.

## Updating Your Site

After making changes:

```bash
# Add changes
git add .

# Commit with message
git commit -m "Update party information"

# Push to GitHub
git push

# Site updates automatically in 1-2 minutes
```

## Common Issues

### Issue: Videos not loading on GitHub Pages

**Solution:**
1. Check file paths are correct (case-sensitive on Linux servers)
2. Verify video files are committed to repository
3. Check browser console for errors (F12)

### Issue: Page not updating after push

**Solution:**
1. Clear browser cache (Ctrl+Shift+R)
2. Wait 2-5 minutes for GitHub Pages to rebuild
3. Check GitHub Actions tab for build status

### Issue: "This site can't be reached"

**Solution:**
1. Verify GitHub Pages is enabled in Settings
2. Check repository is public (or have GitHub Pro for private)
3. Wait a few minutes for DNS propagation

### Issue: Videos over 100MB

**Solution:**
1. Compress using FFmpeg (see above)
2. Use Git LFS (see above)
3. Host externally and link

## Custom Domain (Optional)

To use your own domain:

1. Add `CNAME` file to repository root:
```bash
echo "your-domain.com" > CNAME
git add CNAME
git commit -m "Add custom domain"
git push
```

2. Configure DNS with your domain provider:
   - Add A records pointing to GitHub IPs:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153
   - Or add CNAME record: `YOUR-USERNAME.github.io`

3. Enable HTTPS in repository Settings → Pages

## Testing Locally

Before deploying, test locally:

```bash
# Option 1: Python (if installed)
python -m http.server 8000

# Option 2: Node.js (if installed)
npx http-server

# Then open: http://localhost:8000
```

## Optimization Tips

### For Best Performance

1. **Compress images:**
```bash
# Install ImageMagick
# macOS: brew install imagemagick

# Compress PNG
convert input.png -quality 85 output.png

# Or use online tools: TinyPNG, Squoosh
```

2. **Optimize videos:**
   - Use H.264 codec
   - 720p is sufficient for most cases
   - Consider lower bitrate for faster loading

3. **Minify HTML** (optional):
   - Use online tools or build scripts
   - Reduces page load time

## Analytics (Optional)

Add Google Analytics to track visitors:

1. Get tracking ID from [Google Analytics](https://analytics.google.com)
2. Add before `</head>` in `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## Troubleshooting Commands

```bash
# Check git status
git status

# View commit history
git log --oneline

# Check remote URL
git remote -v

# Force update GitHub Pages
git commit --allow-empty -m "Trigger rebuild"
git push

# Check file sizes
du -sh videos/*
```

## Support

For issues:
1. Check [GitHub Pages documentation](https://docs.github.com/pages)
2. Review browser console errors (F12)
3. Open issue on GitHub repository
4. Check [GitHub Status](https://www.githubstatus.com/)

---

**Quick Reference:**
```bash
# Make changes → Add → Commit → Push
git add .
git commit -m "Your changes"
git push

# Your site updates automatically!
```

**Live URL:** `https://YOUR-USERNAME.github.io/win98`

Happy deploying! 🚀💾
