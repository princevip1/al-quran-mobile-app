// Database types for bookmarks, notes, and reading progress

export interface Bookmark {
  id?: number;
  surahNumber: number;
  ayahNumber: number;
  note?: string;
  color?: string;
  createdAt: number;
  updatedAt: number;
}

export interface ReadingProgress {
  id?: number;
  surahNumber: number;
  ayahNumber: number;
  lastReadAt: number;
  completionPercentage: number;
}

export interface Note {
  id?: number;
  surahNumber: number;
  ayahNumber: number;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface ReadingSession {
  id?: number;
  surahNumber: number;
  startTime: number;
  endTime: number;
  duration: number; // in seconds
}

export interface DatabaseStats {
  totalBookmarks: number;
  totalNotes: number;
  totalReadingTime: number; // in seconds
  completedSurahs: number;
  currentStreak: number; // days
}
