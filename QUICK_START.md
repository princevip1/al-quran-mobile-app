# Quick Start Guide - Al-Quran & Tafsir App

## 🚀 Development Commands

```bash
# Start development server
npm start

# Run on Android device/emulator
npm run android

# Run on iOS simulator (macOS only)
npm run ios

# Open in web browser
npm run web

# Build Quran data
npm run build:data

# Lint code
npm run lint
```

## 📱 Testing the App

### On Physical Device
1. Install Expo Go from App Store/Play Store
2. Run `npm start`
3. Scan QR code with Expo Go

### On Emulator
1. Start Android Studio or Xcode
2. Launch emulator/simulator
3. Run `npm run android` or `npm run ios`

## 🎨 Customizing the App

### Change Theme Colors
Edit `src/constants/theme.ts`:
```typescript
export const Colors = {
  light: {
    primary: '#1B4965',    // Your color here
    secondary: '#62B6CB',  // Your color here
    // ... more colors
  }
}
```

### Add New Translation Language
1. Create `src/i18n/your-lang.ts`
2. Add to `src/i18n/index.ts`
3. Use in app with i18next

### Add More Components
Create in `src/components/YourComponent.tsx`:
```typescript
import React from 'react';
import { useTheme } from '../hooks/useTheme';

export const YourComponent = () => {
  const { theme } = useTheme();
  return <View>...</View>;
};
```

## 📂 Key Files

- `app/_layout.tsx` - Root layout with providers
- `app/(tabs)/_layout.tsx` - Tab navigation config
- `src/constants/theme.ts` - Theme system
- `src/types/index.ts` - TypeScript types
- `src/data/quran_tafsir.json` - Quran data
- `src/i18n/` - Translations

## 🐛 Common Issues

### Port Already in Use
```bash
# Kill process on port 8081
npx react-native-kill-packager
# or
lsof -ti:8081 | xargs kill
```

### Clear Cache
```bash
npx expo start -c
```

### Reset Project
```bash
npm run reset-project
```

## 📦 Adding New Dependencies

Always use Expo-compatible packages:
```bash
npx expo install package-name
```

## 🔧 Environment Variables

Create `.env` file:
```
API_URL=your-api-url
```

## 📝 Next Features to Implement

1. **Ayah Reading Screen** - Detailed verse view
2. **Audio Player** - Full playback functionality  
3. **Database** - SQLite integration
4. **Bookmarks** - CRUD operations
5. **Search** - Full-text search
6. **Complete Data** - All 114 Surahs

## 🎯 App Structure Quick Reference

```
app/               → Screens (Expo Router)
  (tabs)/         → Tab screens
src/
  components/     → Reusable UI components
  constants/      → Theme, colors, sizes
  data/          → Quran JSON data
  hooks/         → Custom hooks
  i18n/          → Translations
  services/      → Business logic
  types/         → TypeScript definitions
```

## 📚 Useful Resources

- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Expo Router](https://expo.github.io/router/)
- [React Navigation](https://reactnavigation.org/)

## 💡 Pro Tips

1. Use TypeScript for everything
2. Keep components small and focused
3. Use the theme system consistently
4. Test on both platforms regularly
5. Keep translations updated
6. Commit often with clear messages

---

Happy coding! 🎉
