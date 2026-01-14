# Videos Folder

Place your video files here with the following names:

- `in_constant.mp4` - Video for IN_CONSTANT.mp4 icon
- `graftak.mp4` - Video for GRAFTAK.mp4 icon
- `sweat.mp4` - Video for SWEAT.mp4 icon

## Video Specifications

**Format:** MP4 (H.264) recommended for best browser compatibility

**Resolution:** Any resolution (will auto-fit to player window)

**File Size:**
- Keep under 100MB per file for GitHub Pages
- For larger files, consider:
  - Compressing with HandBrake or FFmpeg
  - Using Git LFS (Large File Storage)
  - Hosting externally (YouTube, Vimeo)

**Codec:** H.264/AVC recommended

**Frame Rate:** 24-60 fps

## Usage

When you double-click these icons on the desktop, their respective videos will play in a Win98-style media player window.

## Sample Videos

If you don't have videos yet, you can:
1. Use placeholder videos from [Pexels](https://www.pexels.com/videos/) or [Pixabay](https://pixabay.com/videos/)
2. Create short clips from your party footage
3. Add teaser content, DJ sets, or venue tours

## Compression Tips

To reduce file size for GitHub Pages:

```bash
# Using FFmpeg
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k output.mp4

# For even smaller files (lower quality)
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset fast -c:a aac -b:a 96k output.mp4
```

**CRF values:**
- 18-23: High quality (larger files)
- 23-28: Good quality (moderate size)
- 28-32: Acceptable quality (smaller files)
