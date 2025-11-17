# Al-Quran & Tafsir 📖

A beautiful, privacy-first, offline-capable Quran application with complete Tafsir in Bangla and English.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~54.0-000020.svg)](https://expo.dev/)

## ✨ Features

- 📖 **Complete Quran**: Full Arabic text with verified sources
- 🌍 **Translations**: English and Bangla translations
- 📝 **Tafsir**: Detailed explanations from Ibn Kathir and Tafheem-ul-Quran
- 🎵 **Audio Recitations**: High-quality Tilawat with offline support
- 🔍 **Smart Search**: Fast search across Arabic text, translations, and Tafsir
- 📌 **Bookmarks & Notes**: Save your favorite verses with personal notes
- 🌙 **Dark Mode**: Beautiful themes for comfortable reading
- 🌐 **Bilingual UI**: Full interface in English and Bangla
- 📱 **Offline First**: Access everything without internet
- 🚫 **No Ads**: Completely ad-free experience
- 🔒 **Privacy Focused**: No tracking, no analytics by default

## 🎨 Screenshots

_Coming soon..._

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16
- npm or yarn
- Expo CLI
- Android Studio (for Android) or Xcode (for iOS)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/al-quran-and-tafsir.git
cd al-quran-and-tafsir
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Run on your device:
```bash
# For Android
npm run android

# For iOS (macOS only)
npm run ios

# For web
npm run web
```

## 📁 Project Structure

```
al-quran-and-tafsir/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── home.tsx       # Home dashboard
│   │   ├── quran.tsx      # Surah list
│   │   ├── bookmarks.tsx  # Bookmarks
│   │   ├── audio.tsx      # Audio player
│   │   └── settings.tsx   # Settings
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Welcome screen
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Text.tsx
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   ├── constants/         # Theme and constants
│   │   └── theme.ts
│   ├── data/             # Quran data
│   │   └── quran_tafsir.json
│   ├── hooks/            # Custom hooks
│   │   └── useTheme.ts
│   ├── i18n/             # Internationalization
│   │   ├── en.ts
│   │   ├── bn.ts
│   │   └── index.ts
│   ├── services/         # Business logic
│   └── types/            # TypeScript types
│       └── index.ts
├── scripts/              # Build scripts
│   └── build_json.js
├── assets/              # Images, fonts, etc.
├── DATA_LICENSES.md     # Data source licenses
└── README.md
```

## 🛠 Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router
- **State Management**: React Hooks
- **Storage**: AsyncStorage, SQLite (planned)
- **Audio**: Expo AV
- **Styling**: StyleSheet with custom theme system
- **Internationalization**: i18next

## 📦 Build & Release

### Build for Production

```bash
# Build for Android
eas build --platform android --profile production

# Build for iOS
eas build --platform ios --profile production
```

### Prepare Release

```bash
# Generate Quran data
npm run build:data

# Run linting
npm run lint
```

## 🌍 Data Sources

All data sources are properly licensed and attributed. See [DATA_LICENSES.md](DATA_LICENSES.md) for details:

- **Quran Text**: Tanzil Project
- **English Translation**: Sahih International
- **Bangla Translation**: Muhiuddin Khan
- **English Tafsir**: Ibn Kathir
- **Bangla Tafsir**: Tafheem-ul-Quran
- **Audio**: Various reciters with CC licenses

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all the scholars and organizations who have made Quranic data freely available
- The React Native and Expo communities
- All contributors and supporters of this project

## 📧 Contact

- **Email**: support@alquranapp.com
- **GitHub**: [@yourusername](https://github.com/yourusername)

---

Made with ❤️ for the Muslim community

May Allah accept this humble effort and make it beneficial for all.