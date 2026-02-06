---
category:
- '[[App Development]]'
- '[[Coding with AI]]'
tags:
- evergreen
- personal
- projects
created: '2026-01-28'
updated: '2026-01-28'
---
# Testing on iOS - Complete Guide

## Understanding Expo Projects

**Important:** Expo/React Native projects are NOT native Swift projects. You don't open them directly in Xcode. Instead, you have these options:

## Option 1: Expo Go App (Easiest - No Xcode Needed)

### Steps:
1. **Install Expo Go on your iPhone:**
   - App Store → Search "Expo Go" → Install

2. **Start development server:**
   ```bash
   cd /Users/richardyu/PARA/1_projects/focus-reps-app
   npm start
   ```

3. **Connect iPhone:**
   - Make sure iPhone and Mac are on same Wi-Fi
   - Open Camera app → Scan QR code from terminal
   - OR open Expo Go app → Scan QR Code
   - App loads instantly!

**Pros:** Fastest, no build needed, instant updates
**Cons:** Some native features limited

## Option 2: iOS Simulator (Mac Only - Uses Xcode)

### Steps:
1. **Start Expo and open iOS Simulator:**
   ```bash
   npm start
   # Then press 'i' in the terminal
   ```
   
   OR directly:
   ```bash
   npm run ios
   ```

2. **This will:**
   - Automatically open iOS Simulator (if Xcode is installed)
   - Build and install the app
   - Launch the app in simulator

**Pros:** No physical device needed, full iOS features
**Cons:** Requires Xcode, slower first build

## Option 3: Development Build (Full Native - Uses Xcode)

This creates a native iOS project that you CAN open in Xcode:

### Steps:
1. **Generate iOS project:**
   ```bash
   npx expo prebuild --platform ios
   ```
   This creates `ios/` folder with Xcode project

2. **Open in Xcode:**
   ```bash
   open ios/focus-reps-app.xcworkspace
   ```
   OR manually: Double-click `ios/focus-reps-app.xcworkspace`

3. **Build and run:**
   - Select your iPhone in Xcode device selector
   - Click Play button (▶️) or press Cmd+R
   - App installs on your iPhone

**Pros:** Full native features, can debug in Xcode
**Cons:** Requires Apple Developer account for device testing, more complex

## Option 4: Expo Development Build (Recommended for Testing)

This creates a development build that works like a real app:

### Steps:
1. **Create development build:**
   ```bash
   npx expo run:ios
   ```
   
   This will:
   - Generate iOS project
   - Build native code
   - Install on connected iPhone (via USB)
   - OR open iOS Simulator

2. **If you want to open in Xcode later:**
   ```bash
   npx expo prebuild
   open ios/focus-reps-app.xcworkspace
   ```

## Recommended Approach

**For quick testing:** Use Expo Go (Option 1)
**For simulator testing:** Use `npm run ios` (Option 2)
**For device testing:** Use `npx expo run:ios` (Option 4)

## Troubleshooting

### "Command not found: expo"
```bash
npm install -g expo-cli
# OR use npx (no install needed)
npx expo run:ios
```

### "No devices found"
- Connect iPhone via USB
- Trust computer on iPhone
- Check Xcode → Window → Devices and Simulators

### "Signing for ... requires a development team"
- Open Xcode project: `open ios/focus-reps-app.xcworkspace`
- Select project in sidebar
- Go to "Signing & Capabilities"
- Select your Apple ID team (free account works for development)

### Simulator won't open
- Make sure Xcode Command Line Tools installed:
  ```bash
  xcode-select --install
  ```

## Quick Commands Reference

```bash
# Start Expo (shows QR code)
npm start

# Start and open iOS Simulator
npm run ios

# Generate iOS project (for Xcode)
npx expo prebuild --platform ios

# Open in Xcode
open ios/focus-reps-app.xcworkspace

# Development build (installs on device)
npx expo run:ios
```

## Which Method Should I Use?

- **Just testing quickly?** → Expo Go (Option 1)
- **Testing on Mac?** → iOS Simulator (Option 2)
- **Need full native features?** → Development Build (Option 4)
- **Want to debug in Xcode?** → Prebuild + Xcode (Option 3)
