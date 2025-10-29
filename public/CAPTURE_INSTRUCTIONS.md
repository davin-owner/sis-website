# Landing Page Visual Assets - Capture Instructions

This guide explains how to capture and add screenshots/GIFs for the landing page.

## What You Need to Capture

### Screenshots (PNG format)
1. **Dashboard** - `public/screenshots/dashboard.png`
2. **Pipeline** - `public/screenshots/pipeline.png`

### GIFs (for animations)
1. **Create Client** - `public/gifs/create-client.gif`
2. **Drag & Drop** - `public/gifs/drag-drop.gif`

---

## How to Capture Screenshots (macOS)

### 1. Dashboard Screenshot
1. Navigate to http://localhost:3000/dashboard in your browser
2. Make sure you're logged in and can see the dashboard
3. Press `Cmd + Shift + 4` to activate screenshot tool
4. Press `Spacebar` to switch to window capture mode (or drag to select area)
5. Click on the browser window to capture
6. Find the screenshot on your desktop (screenshot-YYYY-MM-DD.png)
7. Rename it to `dashboard.png`
8. Move it to `public/screenshots/dashboard.png`

### 2. Pipeline Screenshot
1. Navigate to http://localhost:3000/content/pipeline
2. Make sure you have some demo clients visible in different stages
3. Follow same steps as above
4. Save as `public/screenshots/pipeline.png`

**Tips for good screenshots:**
- Make browser window a good size (not too small, not full screen)
- Use Dark mode for better visual appeal
- Make sure there are some sample clients visible
- Clean up browser tabs/bookmarks bar for cleaner look

---

## How to Capture GIFs

### Option 1: Using QuickTime Player (Built-in)
1. Open QuickTime Player
2. File → New Screen Recording
3. Record your screen while performing the action
4. Save as `.mov` file
5. Convert to GIF using online tool like: https://cloudconvert.com/mov-to-gif

### Option 2: Using Kap (Recommended - Free)
1. Download Kap from https://getkap.co/
2. Open Kap
3. Select the area to record
4. Click record button
5. Perform the action (create client or drag-drop)
6. Stop recording
7. Export as GIF

### 1. Create Client GIF (`public/gifs/create-client.gif`)
**What to show:**
1. Start on the pipeline page
2. Click "Create Client" button
3. Fill out the form quickly (name, email, deposit status)
4. Click "Create"
5. Show the new client appearing instantly in the Leads column

**Duration:** 3-5 seconds max

### 2. Drag & Drop GIF (`public/gifs/drag-drop.gif`)
**What to show:**
1. Start with a client card visible in the Leads column
2. Click and hold the drag handle (grip lines icon)
3. Drag the card to "Consultation" or "Deposit Paid" column
4. Drop it and show it appearing in the new column

**Duration:** 2-4 seconds max

**Tips for GIFs:**
- Keep them SHORT (under 5 seconds)
- Show only the essential action
- Use smooth, deliberate movements
- Export at reasonable quality (not too large, aim for under 5MB)

---

## Adding the Assets to the Landing Page

Once you have all 4 files in place:

```
public/
├── screenshots/
│   ├── dashboard.png
│   └── pipeline.png
└── gifs/
    ├── create-client.gif
    └── drag-drop.gif
```

### Update the Landing Page Code

Open `app/page.tsx` and uncomment the `src` props:

**Before:**
```tsx
<FeatureImage
  // src="/screenshots/pipeline.png" // Uncomment when screenshot is ready
  alt="Pipeline view showing client stages"
  ...
/>
```

**After:**
```tsx
<FeatureImage
  src="/screenshots/pipeline.png"
  alt="Pipeline view showing client stages"
  ...
/>
```

Do this for all 4 FeatureImage components:
- Line ~108: `/screenshots/pipeline.png`
- Line ~127: `/gifs/create-client.gif`
- Line ~146: `/gifs/drag-drop.gif`
- Line ~165: `/screenshots/dashboard.png`

---

## Optimization (Optional)

### Compress Images
- Use https://tinypng.com/ for PNG screenshots
- Use https://ezgif.com/optimize for GIF compression

### Recommended Sizes
- Screenshots: 1920x1080 or 1440x900 (will scale down automatically)
- GIFs: 800-1200px wide, file size under 3MB each

---

## Verify Everything Works

1. Save all files in correct locations
2. Uncomment all `src` props in `app/page.tsx`
3. Visit http://localhost:3000/ (make sure you're logged out!)
4. Scroll through the landing page
5. Verify all 4 images/GIFs are displaying correctly

---

## Troubleshooting

**Images not showing?**
- Check file paths are exactly: `public/screenshots/...` or `public/gifs/...`
- Make sure filenames match exactly (case-sensitive!)
- Restart dev server: `npm run dev`

**GIFs too large?**
- Use compression tools mentioned above
- Reduce dimensions to 800-1000px wide
- Reduce frame rate to 15-20 FPS
- Trim unnecessary frames at start/end
