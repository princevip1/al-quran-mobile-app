// Core data types for the Quran app

export interface Ayah {
  ayahNumber: number;
  textArabic: string;
  translationEnglish: string;
  translationBangla: string;
  tafsirEnglish: string;
  tafsirBangla: string;
  juz: number;
  manzil: number;
  ruku: number;
  sajda?: boolean;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  banglaName: string;
  englishNameTranslation: string;
  banglaNameTranslation: string;
  revelationType: 'Meccan' | 'Medinan';
  numberOfAyahs: number;
  ayahs: Ayah[];
}

export interface Bookmark {
  id: string;
  surahNumber: number;
  ayahNumber: number;
  note?: string;
  color?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Note {
  id: string;
  surahNumber: number;
  ayahNumber: number;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface AudioTrack {
  id: string;
  surahNumber: number;
  reciter: string;
  url: string;
  isDownloaded: boolean;
  localPath?: string;
  duration: number;
  size: number;
}

export interface ReadingProgress {
  surahNumber: number;
  ayahNumber: number;
  lastReadAt: number;
  progress: number; // percentage
}

export interface UserSettings {
  language: 'en' | 'bn';
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large' | 'extraLarge';
  showTranslation: boolean;
  showTafsir: boolean;
  arabicFontSize: number;
  translationFontSize: number;
  audioSpeed: number;
  autoPlayNext: boolean;
  repeatMode: 'none' | 'one' | 'all';
  notificationsEnabled: boolean;
}

export interface SearchResult {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  textArabic: string;
  translation: string;
  tafsir?: string;
  matchedText: string;
}

export interface DownloadProgress {
  surahNumber: number;
  progress: number;
  status: 'pending' | 'downloading' | 'completed' | 'error';
  error?: string;
}

export interface QuranMeta {
  version: string;
  languages: string[];
  sourceAttribution: {
    quranAr: string;
    tafsirEn: string;
    tafsirBn: string;
    audio: string;
  };
}

export interface QuranData {
  meta: QuranMeta;
  surahs: Surah[];
}
