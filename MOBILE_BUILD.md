# StyleAI — Mobile Build Guide

## Prerequisites

| Tool | Required for | Install |
|------|-------------|---------|
| Node.js 18+ | Both | nodejs.org |
| pnpm | Both | `npm i -g pnpm` |
| Android Studio (with SDK 34+) | Android | developer.android.com/studio |
| Xcode 15+ | iOS | Mac App Store |
| Apple Developer account ($99/yr) | iOS App Store | developer.apple.com |
| Google Play Developer account ($25 one-time) | Play Store | play.google.com/console |

---

## 1. Clone & install

```bash
git clone <your-repo>
cd <project>
pnpm install
```

---

## 2. Add native platforms (first time only)

```bash
npx cap add android
npx cap add ios
```

This creates `android/` and `ios/` folders at the project root.

---

## 3. Build the web app and sync to native

```bash
pnpm run cap:build
# equivalent to: vite build && npx cap sync
```

Run this every time you change the web code before opening the native IDE.

---

## Android — Google Play

### Generate a signed AAB (recommended over APK for Play Store)

1. Open Android Studio:
   ```bash
   pnpm run cap:android
   # or: npx cap open android
   ```

2. In Android Studio → **Build → Generate Signed Bundle / APK**

3. Choose **Android App Bundle (.aab)** → Next

4. Create a new keystore (keep it safe — you can never change it):
   - Key store path: `styleai-release.jks`
   - Alias: `styleai`
   - Fill in password and certificate details

5. Select **release** build variant → Finish

6. The signed `.aab` is output to:
   ```
   android/app/release/app-release.aab
   ```

### Upload to Google Play

1. Go to [Google Play Console](https://play.google.com/console)
2. Create app → fill in store listing details
3. **Production → Releases → Create release**
4. Upload `app-release.aab`
5. Fill in release notes → Review → Roll out

---

## iOS — Apple App Store

> **Requires a Mac with Xcode 15+**

### Configure signing

1. Open Xcode:
   ```bash
   pnpm run cap:ios
   # or: npx cap open ios
   ```

2. In Xcode → select the `App` target → **Signing & Capabilities**
   - Team: select your Apple Developer team
   - Bundle Identifier: `com.styleai.app` (must match `capacitor.config.ts`)
   - Xcode will auto-manage provisioning profiles

### Set app metadata in `ios/App/App/Info.plist`

Key entries to verify/update:
```xml
<key>CFBundleDisplayName</key>
<string>StyleAI</string>
<key>CFBundleIdentifier</key>
<string>com.styleai.app</string>
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
<key>NSCameraUsageDescription</key>
<string>StyleAI needs camera access to take your photo for outfit generation.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>StyleAI needs photo library access to upload your photo.</string>
```

### Archive and upload

1. In Xcode → select **Any iOS Device (arm64)** as the destination
2. **Product → Archive**
3. When the Organizer opens → **Distribute App → App Store Connect → Upload**
4. Follow the wizard to validate and upload

### Submit on App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. My Apps → + → New App
3. Fill in name, bundle ID (`com.styleai.app`), SKU
4. Under **TestFlight** you can test internally first
5. Under **App Store → 1.0 Prepare for Submission** → fill store listing
6. Select the uploaded build → Submit for Review

---

## App icon & splash screen

Place your assets before syncing:

```
android/app/src/main/res/
  mipmap-hdpi/ic_launcher.png       (72×72)
  mipmap-xhdpi/ic_launcher.png      (96×96)
  mipmap-xxhdpi/ic_launcher.png     (144×144)
  mipmap-xxxhdpi/ic_launcher.png    (192×192)

ios/App/App/Assets.xcassets/AppIcon.appiconset/
  (Xcode will show required sizes — 1024×1024 is mandatory for store submission)
```

Or use a tool like [capacitor-assets](https://github.com/ionic-team/capacitor-assets):
```bash
npx @capacitor/assets generate --assetPath assets/icon.png --assetPath assets/splash.png
```

---

## Common issues

| Error | Fix |
|-------|-----|
| White screen on device | Run `pnpm run cap:build` to sync latest web build |
| `cap` command not found | Run `npx cap` or add `./node_modules/.bin` to PATH |
| iOS signing error | Ensure your Apple Developer account is active and team is selected in Xcode |
| Android build tools missing | Open Android Studio → SDK Manager → install Build Tools 34.0.0 |
