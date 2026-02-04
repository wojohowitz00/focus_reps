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
# Testing Guide - Running on iPhone

## Quick Start

### Option 1: Expo Go App (Easiest - Recommended for Development)

1. **Install Expo Go on your iPhone:**
   - Open App Store on your iPhone
   - Search for "Expo Go"
   - Install the app

2. **Start the development server:**
   ```bash
   cd /Users/richardyu/PARA/1_projects/peak-mind-app
   npm start
   ```
   This will:
   - Start the Metro bundler
   - Show a QR code in the terminal
   - Open Expo DevTools in your browser

3. **Connect your iPhone:**
   - Make sure iPhone and laptop are on the **same Wi-Fi network**
   - Open Expo Go app on iPhone
   - Tap "Scan QR Code"
   - Scan the QR code from terminal or browser
   - App will load on your iPhone

### Option 2: Tunnel Mode (If Same Network Doesn't Work)

If you can't connect on the same network:

1. **Start with tunnel:**
   ```bash
   npm start -- --tunnel
   ```
   This uses Expo's tunnel service (slower but works across networks)

2. **Scan QR code** with Expo Go app

### Option 3: Development Build (For Production-like Testing)

For a more production-like experience:

1. **Install Expo CLI globally:**
   ```bash
   npm install -g expo-cli
   ```

2. **Create development build:**
   ```bash
   npx expo run:ios
   ```
   This will:
   - Build the app natively
   - Install on connected iPhone (via USB)
   - Or open iOS Simulator on Mac

## Step-by-Step Instructions

### Prerequisites

1. **Node.js installed** ✅ (already done)
2. **Expo Go app** (install from App Store)
3. **Same Wi-Fi network** for iPhone and laptop

### Running the App

1. **Navigate to project:**
   ```bash
   cd /Users/richardyu/PARA/1_projects/peak-mind-app
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

3. **You'll see:**
   ```
   › Metro waiting on exp://192.168.x.x:8081
   › Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
   
   › Press a │ open Android
   › Press i │ open iOS simulator
   › Press w │ open web
   
   › Press r │ reload app
   › Press m │ toggle menu
   › Press ? │ show all commands
   ```

4. **On iPhone:**
   - Open **Camera app** (iOS 11+)
   - Point at QR code
   - Tap notification to open in Expo Go
   - OR open Expo Go app and tap "Scan QR Code"

### Troubleshooting

#### "Unable to connect to Metro"
- **Check Wi-Fi:** Both devices must be on same network
- **Check firewall:** Allow Node.js/Expo through firewall
- **Try tunnel mode:** `npm start -- --tunnel`

#### "Network request failed"
- Restart Metro bundler: Press `r` in terminal or restart `npm start`
- Clear cache: `npm start -- --clear`

#### QR Code not scanning
- Make sure terminal/browser window is large enough
- Try opening Expo DevTools in browser (press `m` then `j`)
- Manually enter URL shown in terminal

#### App crashes on iPhone
- Check terminal for error messages
- Press `r` to reload
- Check that all dependencies are installed: `npm install`

### Testing Checklist

Once app loads on iPhone:

- [ ] Home screen displays correctly
- [ ] Navigation between tabs works
- [ ] Practice selection screen shows all 4 practices
- [ ] Practice session screen displays instructions
- [ ] Timer starts and counts down
- [ ] Timer phase transitions work
- [ ] Session saves after completion
- [ ] Journal entry screen appears after session
- [ ] Progress screen shows stats
- [ ] Journal entries display correctly
- [ ] Settings screen works
- [ ] Practice history shows sessions

### Development Tips

1. **Hot Reload:** Changes auto-reload (shake phone for dev menu)
2. **Dev Menu:** Shake iPhone or 3-finger tap to open dev menu
3. **Reload:** Press `r` in terminal or shake phone → Reload
4. **Debugging:** Use React Native Debugger or Chrome DevTools
5. **Logs:** Check terminal for console.log output

### Advanced: iOS Simulator (Mac Only)

If you want to test on Mac simulator:

```bash
npm start
# Then press 'i' in terminal
```

Or directly:
```bash
npm run ios
```

This opens iOS Simulator (requires Xcode).

## Next Steps After Testing

1. **Fix any bugs** found during testing
2. **Add error boundaries** for better error handling
3. **Test on Android** (if needed)
4. **Prepare for App Store** (when ready)

## Notes

- Expo Go has some limitations (can't use all native modules)
- For full native features, use `expo run:ios` (development build)
- Development builds require Apple Developer account ($99/year) for device testing
- Expo Go is free and perfect for development/testing
