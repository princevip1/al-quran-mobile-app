# Quran Tafsir + Tilawat App (Bangla + English)

> **Goal:** Build a professional, privacy-first, offline-capable Android (and iOS optional) Quran app with:
> - Full Quran text (Arabic)
> - Tafsir (Bangla + English)
> - High-quality Tilawat (audio recitations) offline
> - No ads (donation / open-source friendly)
> - Scalable codebase (React Native)

This document is a **GitHub-agent-ready** prompt + full developer guide and workflow so you (or an automation/CI agent) can create, test, build, and release a professional app.

---

## Quick summary (one line)
Create a React Native app (bare or Expo) that ships a single compressed offline JSON containing Quran + Tafsir (merged by surah/ayah), packaged audio for tilawat (by surah), local SQLite index for search, privacy-first analytics (optional), and a CI/CD pipeline (GitHub Actions + Fastlane/EAS) to build and publish to Play Store.

---

# Table of Contents
1. Features & Scope
2. Data sources & licensing
3. Tech stack & third-party services
4. Repo layout (recommended)
5. Local dev setup (commands)
6. Data pipeline (how to build the full JSON + audio packaging)
7. App architecture & storage
8. UI/UX and Accessibility guidance
9. Audio (tilawat) handling
10. Offline & performance optimization
11. Privacy & Permissions
12. Payment / donation options (no ads)
13. Testing matrix & QA checklist
14. CI/CD and release pipeline (GitHub Actions + Fastlane/EAS)
15. Play Store listing & ASO (privacy-first)
16. Contribution & maintenance guidelines
17. GitHub Agent prompt (ready-to-run automation instructions)
18. Appendix: scripts, examples, sample JSON schema

---

## 1. Features & Scope
- Fully offline Quran text (Arabic) + translations (Bangla, English)
- Full Tafsir (Ibn Kathir / Tafheem) in both Bangla & English
- Tilawat (audio per surah) with offline playback and streaming fallback
- Surah / Ayah search (fast) using local SQLite or full-text index
- Bookmarks / Notes / Highlighting
- Dark/light theme & adjustable font size
- Multi-language UI (BN, EN) + RTL layout support
- No ads — donation button + optional in-app purchases for features (if desired)
- Lightweight initial download, lazy-load larger audio assets on demand


## 2. Data sources & licensing (IMPORTANT)
1. **Quran text (Arabic)**: Use open-source sources such as alquran.cloud, quran.com api dumps, or public GitHub repos with verified public domain data.
2. **Tafsir (Ibn Kathir English, Bangla Tafheem)**: Acquire from verified public domain or permissively licensed sources. Always check license files and include attribution inside the app (Settings > About > Data Sources).
3. **Tilawat audio**: Use recitations that are explicitly permitted for redistribution (public domain or CC licensed). If you plan to host large recitations, prefer known reciters with permission.

**Action:** keep a `DATA_LICENSES.md` in repo listing the source URL, license, and any required attribution per file.

---

## 3. Tech stack & third-party services
- **Framework:** React Native (TypeScript)
  - Option A: React Native CLI (bare) — recommended for full native control and smaller builds
  - Option B: Expo + EAS — faster iteration, easier builds via EAS but slightly larger binary
- **Storage & DB:** `react-native-sqlite-storage` or `WatermelonDB` / `realm` for offline index. Alternatively use `AsyncStorage` for small data and load JSON.
- **Audio:** `react-native-track-player` or `expo-av` (if using Expo)
- **Search:** SQLite FTS or Lunr.js (if memory acceptable)
- **I18n:** `react-native-localize` + `i18next` or `react-i18n` for translations
- **CI/CD:** GitHub Actions + Fastlane (for Play Store). If Expo, use EAS build + EAS submit.
- **Code Quality:** TypeScript, ESLint, Prettier, Husky (pre-commit hooks)
- **Testing:** Jest + React Native Testing Library + Detox (e2e)


## 4. Repo layout (recommended)
```
quran-app/
├─ .github/workflows/        # CI/CD pipelines
├─ android/
├─ ios/
├─ src/
│  ├─ assets/
│  │  ├─ audio/              # tilawat audio (small initial set)
│  │  └─ images/
│  ├─ components/
│  ├─ screens/
│  ├─ services/
│  │  ├─ db.ts
│  │  ├─ audio.ts
│  │  └─ search.ts
│  ├─ data/
│  │  └─ quran_tafsir.json  # Option 1 (merged file)
│  ├─ i18n/
│  ├─ navigation/
│  └─ App.tsx
├─ scripts/
│  ├─ build_json.js         # script to merge and build quran_tafsir.json
│  ├─ compress_audio.sh
│  └─ prepare_release.sh
├─ DATA_LICENSES.md
├─ README.md
└─ package.json
```


## 5. Local dev setup (commands)
**Prereq:** Node >= 16, Yarn or npm, Android Studio (for Android), Xcode (for iOS builds), Java JDK 11

```bash
# clone
git clone git@github.com:your-org/quran-app.git
cd quran-app

# install
yarn install

# start Metro
yarn start

# run android
yarn android

# run ios (mac only)
yarn ios
```

Husky hooks: `yarn lint` and `yarn test` before commit.


## 6. Data pipeline (build the `quran_tafsir.json` and package audio)
You will produce a single merged JSON per language (Option 1). The `scripts/build_json.js` will:
- Download or read local `quran_ar.json`, `tafsir_en.json`, `tafsir_bn.json`
- Merge them by surah/ayah into a `quran_tafsir_bn_en.json` file
- Create an index map `{ surahNumber: {startByte, endByte} }` (optional) for fast partial reads

### Example Node script pseudocode (detailed script included in appendix)
- Read three JSON files
- For each surah, for each ayah, compose object `{ayah_number, text_ar, translation_en, tafsir_en, translation_bn, tafsir_bn}`
- Write compressed JSON: `gzip` + `brotli` (create `quran_tafsir.json.br` and `.gz`) and copy into `src/assets/data/`

**Audio packaging strategy**
- Store only short recitations initially for the first 10 surahs in the APK for small size
- Host the rest as app-bundled downloads (user triggers `Download Surah`), storing in FileSystem (e.g., RNFS)
- Run `scripts/compress_audio.sh` to normalize bitrates (e.g., 64–96 kbps) and convert to `.aac` or `.opus` for smaller size.


## 7. App architecture & storage
- On startup: check local filesystem for `quran_tafsir.json.br`. If present, decompress in memory (or stream) and open SQLite FTS table to index.
- Use SQLite FTS for search: create table `ayah_fts(surah INTEGER, ayah INTEGER, text_ar TEXT, tafsir_bn TEXT, tafsir_en TEXT)` and populate on first launch (or prepopulate and ship as prebuilt DB file)
- Bookmarks: local table `bookmarks(user_id, surah, ayah, note, created_at)`
- Notes: store as simple JSON with timestamps and optional encryption (local) if user enables passcode


## 8. UI/UX & Accessibility
- RTL support for Arabic view; LTR for English/Bangla
- Respect user font scaling (use `Text` with `allowFontScaling={true}`)
- Provide adjustable font sizes & line spacing
- High-contrast mode & dark theme
- Large tappable areas for audio controls
- Screen reader labels (accessibilityLabel) for key components


## 9. Audio (Tilawat) handling
- Use `react-native-track-player` for background playback and proper media controls
- Store per-surah audio files: `/audio/surah_001.opus` etc.
- Provide controls: play/pause, speed (0.75x, 1x, 1.25x, 1.5x), repeat ayah, continuous play
- Download manager: queue user requested surahs and show progress


## 10. Offline & performance optimizations
- Compress JSON with Brotli and store compressed asset; decompress on first run and store in prebuilt SQLite DB (faster search)
- Ship prebuilt SQLite DB for initial set (e.g., first 30 surahs) to reduce app startup work
- Lazy load audio
- Use `FlatList` with `getItemLayout` for Surah list
- Bundle only necessary fonts and images


## 11. Privacy & Permissions
- Request only necessary permissions: `READ_EXTERNAL_STORAGE` (if needed to play user audio), `WRITE_EXTERNAL_STORAGE` for downloading audio on Android < Q
- Provide an in-app privacy policy
- Avoid analytics by default. If you add analytics, offer it as opt-in and use privacy-preserving tools (or self-hosted metrics)


## 12. Donation & Funding (no ads)
- Add a **Donate** screen with: PayPal link, Buy Me A Coffee, or in-app billing for a one-time donation (choose local-friendly options for target audience)
- Transparently show where funds go (server, audio licensing, development)


## 13. Testing matrix & QA checklist
- Unit tests for utils, build scripts
- Snapshot & component tests
- E2E tests for Surah browsing, search, audio playback (Detox)
- Manual QA checklist: RTL, voiceover, audio interruption, storage full scenario, update migration


## 14. CI/CD & Release pipeline (GitHub Actions + Fastlane/EAS)
**Goals:** build signed APK/AAB and automatically submit to Play Store internal test track.

### Example pipeline (GitHub Actions):
1. `pull_request` → run `yarn lint`, `yarn test`
2. `push` to `main` with tag `v*` → run build → create artifacts
3. Build job (Android): Use `setup-java`, `node`, `yarn`, `./gradlew bundleRelease`
4. Use `r8` and `proguard` optimizations
5. Fastlane lane `android beta` to upload AAB to Play Store internal track

**Sample Fastlane lane (Android)**
```ruby
lane :beta do
  gradle(task: 'bundle', build_type: 'Release')
  supply(track: 'internal', apk: './android/app/build/outputs/bundle/release/app-release.aab')
end
```

**Expo / EAS alternative:** Use `eas build --platform android --profile production` and `eas submit`.


## 15. Play Store listing & ASO (privacy-first)
- App name: `Quran Tafsir — Offline বাংলা & English` (keep concise)
- Short description: `Full Quran text, Tafsir (Bangla & English), and offline Tilawat.`
- Long description: explain privacy, offline capability, audio quality, and data source attribution
- Screenshots: Arabic pages, Tafsir pages, Audio player, Download manager
- Add `DATA_LICENSES.md` link in app description or about page


## 16. Contribution & maintenance
- Contribution guide with `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md`
- Use semantic commits and release tags. Keep `CHANGELOG.md` updated.
- Add `MAINTAINERS.md` with contact for dataset issues


## 17. GitHub Agent prompt (automation-ready)
Use this prompt for a GitHub Action or a human agent to initialize, build, and release the app. Replace values in `[]`.

```
You are a GitHub agent. Tasks:
1. Create repo `quran-app` with default branch `main`.
2. Add TypeScript React Native boilerplate (use react-native CLI or Expo depending on config variable `USE_EXPO`).
3. Add `src/data/quran_tafsir.json` placeholder and `scripts/build_json.js`.
4. Add CI workflow `.github/workflows/ci.yml` with lint/test and `.github/workflows/release.yml` to build & upload AAB via Fastlane.
5. Add `DATA_LICENSES.md` and include source URLs for Quran Arabic, Tafsir (EN), and Tafsir (BN).
6. Create a `release` tag `v0.1.0` and run the release workflow.

Environment variables needed:
- `PLAY_STORE_JSON_KEY` (base64 or secret file)
- `FASTLANE_USER` (optional)
- `USE_EXPO` = true|false
- `APP_ID` = com.example.quranapp

Return: artifact AAB and Play Store internal release URL.
```


## 18. Appendix: Scripts & Sample JSON Schema

### Minimal `quran_tafsir.json` schema (Option 1)
```json
{
  "meta": {
    "languages": ["bn", "en"],
    "version": "2025-11-01",
    "source_attribution": {
      "quran_ar": "alquran.cloud",
      "tafsir_en": "Ibn Kathir (public)",
      "tafsir_bn": "Tafheem (public)"
    }
  },
  "surahs": [
    {
      "number": 1,
      "name": "Al-Fatiha",
      "ayahs": [
        {
          "ayah_number": 1,
          "text_ar": "بِسْمِ اللَّهِ...",
          "translation_en": "In the name of Allah...",
          "tafsir_en": "Ibn Kathir explanation...",
          "translation_bn": "আল্লাহর নামে...",
          "tafsir_bn": "বাংলা তফসির..."
        }
      ]
    }
  ]
}
```

### Example `scripts/build_json.js` (high-level)
```js
// Node script: merge quran.json + tafsir_en.json + tafsir_bn.json
const fs = require('fs');
const quran = JSON.parse(fs.readFileSync('./data/quran_ar.json'));
const tafsirEn = JSON.parse(fs.readFileSync('./data/tafsir_en.json'));
const tafsirBn = JSON.parse(fs.readFileSync('./data/tafsir_bn.json'));
const out = { meta: {...}, surahs: [] };
quran.surahs.forEach((s) => {
  const item = { number: s.number, name: s.englishName, ayahs: [] };
  s.ayahs.forEach((a, idx) => {
    item.ayahs.push({
      ayah_number: a.numberInSurah,
      text_ar: a.text,
      translation_en: a.translation || tafsirEn[s.number].ayahs[idx].translation,
      tafsir_en: tafsirEn[s.number].ayahs[idx].text,
      translation_bn: tafsirBn[s.number].ayahs[idx].translation,
      tafsir_bn: tafsirBn[s.number].ayahs[idx].text
    });
  });
  out.surahs.push(item);
});
fs.writeFileSync('./src/assets/data/quran_tafsir.json', JSON.stringify(out));
```

---

# Final notes & next actions I can do for you
1. I can **generate the build script files** and the `ci.yml` and place them into this repo (if you give me repo access or allow me to create files here).
2. I can **create the `DATA_LICENSES.md`** with recommended source links.
3. I can **provide a compressed starter `quran_tafsir.json`** containing Surah 1–5+ tafsir as a sample for you to test locally.

Tell me which of the items above you want me to produce now and I'll generate the files (scripts, workflows, sample JSON) as ready-to-copy content.

