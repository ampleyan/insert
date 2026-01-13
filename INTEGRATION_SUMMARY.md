# Win98 Integration Summary

## ✅ What Was Done

The Win98 party promo desktop has been successfully integrated into your INSERT repository!

### Files Added
```
insert/
└── win98/                     # NEW: Complete Win98 project
    ├── index.html             # Main Win98 desktop interface
    ├── assets/                # Icons (constant, graftak, sweat, trash, logo)
    ├── sounds/                # Sound effects (click, trash, etc.)
    ├── videos/                # Video files (in_constant, graftak, sweat)
    ├── docs/                  # Documentation
    ├── README.md              # Win98 documentation
    ├── INTEGRATION.md         # Integration guide
    ├── QUICK_DEPLOY.md        # Quick deployment steps
    ├── link-example.html      # HTML examples for main site
    ├── DEPLOY.md              # Detailed deployment guide
    ├── deploy.sh              # Deployment script
    ├── .gitignore             # Git ignore rules
    └── example.jpg            # Reference screenshot
```

### Location
```
C:\Users\ample\Documents\workspace\projects\insert\win98\
```

---

## 🚀 Next Steps (Deploy to GitHub Pages)

### Step 1: Review Content
Before deploying, customize:

1. **Videos** - Add your MP4 files to `win98/videos/`:
   - `in_constant.mp4`
   - `graftak.mp4`
   - `sweat.mp4`

2. **Party Info** - Edit `win98/index.html`:
   - Notebook content (lines 644-656)
   - Blue Screen message (lines 640-646)

3. **Branding** - Replace `win98/assets/insert_logo.png` with your logo

### Step 2: Deploy
```bash
cd C:\Users\ample\Documents\workspace\projects\insert

# Add win98 files
git add win98/

# Commit
git commit -m "Add Win98 party promo interface"

# Push to GitHub
git push origin main
```

### Step 3: Access
Wait 2-5 minutes, then visit:
```
https://ampleyan.github.io/insert/win98/
```

---

## 🔗 Link from Main Site

Add a link to Win98 promo in your main site. Examples in:
```
win98/link-example.html
```

Quick example:
```html
<a href="win98/">🎉 Party Promo</a>
```

---

## 📚 Documentation

All documentation is in the `win98/` folder:

1. **QUICK_DEPLOY.md** - Fast deployment guide
2. **INTEGRATION.md** - Detailed integration info
3. **README.md** - Win98 features & usage
4. **DEPLOY.md** - GitHub Pages setup
5. **link-example.html** - HTML snippets for main site

---

## ✨ Features Available

The Win98 interface includes:
- ✅ Boot sequence with loading animation
- ✅ Interactive desktop (drag icons, delete to trash)
- ✅ Video players with Win98-style controls
- ✅ Screensaver (activates after 30s idle)
- ✅ Fake error message popups (party-themed)
- ✅ Blue Screen of Death with party info
- ✅ Sound effects (click, trash)
- ✅ Retro cursor trail
- ✅ Instagram format presets (Stories, Reels, Posts)
- ✅ Settings panel (icon scale, volume, format)

---

## 🧪 Test Locally

Before deploying:
```bash
cd C:\Users\ample\Documents\workspace\projects\insert
python -m http.server 8000

# Visit: http://localhost:8000/win98/
```

Test checklist:
- [ ] Icons appear correctly
- [ ] Videos play on double-click
- [ ] Drag & drop works
- [ ] Sound effects play
- [ ] Settings panel opens
- [ ] Format selector works
- [ ] No console errors (F12)

---

## 🎥 Recording Setup

For creating party promo videos:

1. Open Settings (taskbar button)
2. Select Instagram format:
   - **Stories/Reels**: 9:16 (1080x1920)
   - **Square Post**: 1:1 (1080x1080)
   - **Portrait Post**: 4:5 (1080x1350)
3. Use OBS Studio or screen recorder
4. Record the format container area
5. Export as MP4 for Instagram

---

## 🔄 Future Updates

To update Win98 content:
```bash
# Edit files in win98/ folder
git add win98/
git commit -m "Update party videos"
git push
```

Site updates automatically in 2-5 minutes!

---

## 📞 Quick Reference

**Repository:**
```
https://github.com/ampleyan/insert
```

**Deployed URLs:**
```
Main:   https://ampleyan.github.io/insert/
Win98:  https://ampleyan.github.io/insert/win98/
```

**Local Path:**
```
C:\Users\ample\Documents\workspace\projects\insert\win98\
```

**Git Commands:**
```bash
git status              # Check changes
git add win98/          # Stage win98 changes
git commit -m "msg"     # Commit with message
git push                # Deploy to GitHub Pages
```

---

## ✅ Ready to Deploy!

Everything is set up. Just run:
```bash
git add win98/
git commit -m "Add Win98 party promo interface"
git push
```

Then visit: **https://ampleyan.github.io/insert/win98/**

🎉 That's it! Your Win98 party promo is ready to go live!

---

**Questions?** Check `win98/README.md` or `win98/INTEGRATION.md`
