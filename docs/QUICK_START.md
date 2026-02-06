---
category:
- '[[App Development]]'
- '[[Coding with AI]]'
tags:
- personal
- projects
created: '2026-01-28'
updated: '2026-01-28'
---
# Quick Start - Testing on iPhone

## 🚀 Fastest Way to Test

### Step 1: Install Expo Go on iPhone
- Open App Store → Search "Expo Go" → Install

### Step 2: Start the App
```bash
cd /Users/richardyu/PARA/1_projects/focus-reps-app
npm start
```

### Step 3: Connect iPhone
1. Make sure iPhone and laptop are on **same Wi-Fi network**
2. Open **Camera app** on iPhone (iOS 11+)
3. Point camera at QR code shown in terminal
4. Tap notification to open in Expo Go
5. App loads on your iPhone! 🎉

## Alternative: Use Expo Go App Directly
1. Open Expo Go app on iPhone
2. Tap "Scan QR Code"
3. Scan QR code from terminal

## If Same Network Doesn't Work
Use tunnel mode:
```bash
npm start -- --tunnel
```
Then scan QR code (slower but works across networks)

## Troubleshooting

**Can't connect?**
- Check both devices on same Wi-Fi
- Try tunnel mode: `npm start -- --tunnel`
- Check firewall allows Node.js

**App crashes?**
- Press `r` in terminal to reload
- Or shake iPhone → Reload

**Need to clear cache?**
```bash
npm start -- --clear
```

## Testing Checklist
- [ ] App loads on iPhone
- [ ] Navigation works
- [ ] Timer functions correctly
- [ ] Sessions save
- [ ] Progress updates
- [ ] Journal entries work

## Development Tips
- **Hot Reload:** Changes auto-update (shake phone for dev menu)
- **Reload:** Press `r` in terminal
- **Logs:** Check terminal for console output
- **Dev Menu:** Shake iPhone or 3-finger tap
