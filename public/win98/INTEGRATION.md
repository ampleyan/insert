# Win98 Desktop - INSERT Project Integration

This Win98 party promo interface is integrated as a subdirectory in the main INSERT project.

## Access URLs

**Local Development:**
```
http://localhost:[PORT]/win98/
```

**GitHub Pages (Production):**
```
https://ampleyan.github.io/insert/win98/
```

## Project Structure

```
insert/
├── index.html              # Main INSERT project
├── win98/                  # Win98 party promo subdirectory
│   ├── index.html         # Win98 desktop interface
│   ├── assets/            # Icons and images
│   ├── sounds/            # Sound effects
│   ├── videos/            # Party promo videos
│   ├── README.md          # Win98 documentation
│   └── ...
└── ...
```

## Integration Notes

### Relative Paths
All resource paths in the Win98 project are relative, so they work correctly in the subdirectory:
- `assets/` → Icons and images
- `sounds/` → Audio files
- `videos/` → Video files

No path updates needed! ✅

### GitHub Pages Deployment

When you deploy the INSERT project to GitHub Pages, the Win98 interface will automatically be available at `/win98/`.

**Deployment command:**
```bash
cd C:\Users\ample\Documents\workspace\projects\insert

# Add win98 changes
git add win98/

# Commit
git commit -m "Add Win98 party promo interface"

# Push to GitHub
git push origin main
```

GitHub Pages will build and serve both:
- Main site: `https://ampleyan.github.io/insert/`
- Win98 promo: `https://ampleyan.github.io/insert/win98/`

### Local Testing

Test locally before deploying:

**Option 1: Python**
```bash
cd C:\Users\ample\Documents\workspace\projects\insert
python -m http.server 8000

# Visit: http://localhost:8000/win98/
```

**Option 2: Node.js (if installed)**
```bash
cd C:\Users\ample\Documents\workspace\projects\insert
npx http-server

# Visit: http://localhost:8080/win98/
```

**Option 3: VS Code Live Server**
- Right-click on `win98/index.html`
- Select "Open with Live Server"

## Linking to Win98 from Main Site

Add a link in your main INSERT site to the Win98 promo:

```html
<!-- In your main index.html or navigation -->
<a href="/insert/win98/">Party Promo</a>

<!-- Or for local development -->
<a href="win98/">Party Promo</a>
```

### Example Navigation Button

```html
<div class="navigation">
  <a href="/" class="nav-link">Home</a>
  <a href="/insert/win98/" class="nav-link">Win98 Promo</a>
</div>
```

## Customization

### Update Party Info

Edit `win98/index.html`:
1. **Notebook content** - Lines 644-656
2. **Blue Screen (BSOD)** - Lines 640-646
3. **Error messages** - Lines 1300-1305

### Update Videos

Place your MP4 files in `win98/videos/`:
- `in_constant.mp4`
- `graftak.mp4`
- `sweat.mp4`

### Update Assets

Replace images in `win98/assets/`:
- `constant.png` - Icon image
- `graftak.png` - Icon image
- `sweat.png` - Icon image
- `insert_logo.png` - Desktop background logo

## Features

All Win98 features work in the subdirectory:
- ✅ Boot sequence with loading animation
- ✅ Interactive desktop (drag icons, trash)
- ✅ Video players with Win98 UI
- ✅ Screensaver (30s idle)
- ✅ Fake error popups
- ✅ Blue Screen of Death (BSOD)
- ✅ Sound effects
- ✅ Cursor trail
- ✅ Instagram format presets
- ✅ Settings panel

## Git Workflow

### Initial Setup (Already Done)
```bash
# Win98 files copied to insert/win98/
git add win98/
git commit -m "Add Win98 party promo interface"
git push
```

### Making Changes
```bash
# Make changes to win98 files
cd win98/

# Stage changes
git add .

# Commit
git commit -m "Update party information"

# Push
git push
```

### Updating from Original Win98 Project
If you make changes in the original `/projects/win98` directory:

```bash
# Copy updated files (from win98 directory)
cp index.html /mnt/c/Users/ample/Documents/workspace/projects/insert/win98/
cp -r assets /mnt/c/Users/ample/Documents/workspace/projects/insert/win98/
# etc.

# Or copy everything
cd /mnt/d/WORKSPACE/INSERT/projects/win98
cp -r assets sounds videos docs index.html README.md /mnt/c/Users/ample/Documents/workspace/projects/insert/win98/
```

## Troubleshooting

### Win98 not loading on GitHub Pages

**Check:**
1. Files are committed: `git status`
2. GitHub Pages is enabled in repo Settings
3. URL is correct: `/insert/win98/` not `/win98/`
4. Wait 2-5 minutes for deployment

### Videos not playing

**Check:**
1. Files exist in `win98/videos/`
2. Files are under 100MB (GitHub limit)
3. Correct filenames: `in_constant.mp4`, `graftak.mp4`, `sweat.mp4`
4. Browser console for errors (F12)

### Paths not working

**Fix:**
All paths in `index.html` should be relative:
- ✅ `assets/logo.png`
- ✅ `videos/video.mp4`
- ❌ `/assets/logo.png`
- ❌ `C:/Users/.../assets/logo.png`

## Support

For issues:
- Win98 specific: See `win98/README.md`
- INSERT project: Main project documentation
- GitHub Pages: [GitHub Docs](https://docs.github.com/pages)

---

**Quick Links:**
- Main Project: `https://ampleyan.github.io/insert/`
- Win98 Promo: `https://ampleyan.github.io/insert/win98/`
- Repository: `https://github.com/ampleyan/insert`
