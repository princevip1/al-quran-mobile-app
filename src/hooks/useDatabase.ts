import { useCallback, useEffect, useState } from 'react';
import { databaseService } from '../services/databaseService';
import { Bookmark, DatabaseStats, Note, ReadingProgress } from '../types/database';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);

  const loadBookmarks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await databaseService.getAllBookmarks();
      setBookmarks(data);
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addBookmark = useCallback(async (surahNumber: number, ayahNumber: number, note?: string, color?: string) => {
    try {
      await databaseService.addBookmark({
        surahNumber,
        ayahNumber,
        note,
        color,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      await loadBookmarks();
      return true;
    } catch (error) {
      console.error('Failed to add bookmark:', error);
      return false;
    }
  }, [loadBookmarks]);

  const removeBookmark = useCallback(async (surahNumber: number, ayahNumber: number) => {
    try {
      await databaseService.deleteBookmark(surahNumber, ayahNumber);
      await loadBookmarks();
      return true;
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
      return false;
    }
  }, [loadBookmarks]);

  const updateBookmark = useCallback(async (id: number, updates: Partial<Bookmark>) => {
    try {
      await databaseService.updateBookmark(id, updates);
      await loadBookmarks();
      return true;
    } catch (error) {
      console.error('Failed to update bookmark:', error);
      return false;
    }
  }, [loadBookmarks]);

  const isBookmarked = useCallback(async (surahNumber: number, ayahNumber: number): Promise<boolean> => {
    try {
      return await databaseService.isBookmarked(surahNumber, ayahNumber);
    } catch (error) {
      console.error('Failed to check bookmark:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  return {
    bookmarks,
    loading,
    addBookmark,
    removeBookmark,
    updateBookmark,
    isBookmarked,
    refresh: loadBookmarks,
  };
}

export function useNotes(surahNumber?: number, ayahNumber?: number) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);

  const loadNotes = useCallback(async () => {
    setLoading(true);
    try {
      let data: Note[];
      if (surahNumber !== undefined && ayahNumber !== undefined) {
        data = await databaseService.getNotes(surahNumber, ayahNumber);
      } else {
        data = await databaseService.getAllNotes();
      }
      setNotes(data);
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setLoading(false);
    }
  }, [surahNumber, ayahNumber]);

  const addNote = useCallback(async (surah: number, ayah: number, content: string) => {
    try {
      await databaseService.addNote({
        surahNumber: surah,
        ayahNumber: ayah,
        content,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      await loadNotes();
      return true;
    } catch (error) {
      console.error('Failed to add note:', error);
      return false;
    }
  }, [loadNotes]);

  const updateNote = useCallback(async (id: number, content: string) => {
    try {
      await databaseService.updateNote(id, content);
      await loadNotes();
      return true;
    } catch (error) {
      console.error('Failed to update note:', error);
      return false;
    }
  }, [loadNotes]);

  const deleteNote = useCallback(async (id: number) => {
    try {
      await databaseService.deleteNote(id);
      await loadNotes();
      return true;
    } catch (error) {
      console.error('Failed to delete note:', error);
      return false;
    }
  }, [loadNotes]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  return {
    notes,
    loading,
    addNote,
    updateNote,
    deleteNote,
    refresh: loadNotes,
  };
}

export function useReadingProgress() {
  const [progress, setProgress] = useState<ReadingProgress[]>([]);
  const [lastRead, setLastRead] = useState<ReadingProgress | null>(null);
  const [loading, setLoading] = useState(false);

  const loadProgress = useCallback(async () => {
    setLoading(true);
    try {
      const [allProgress, last] = await Promise.all([
        databaseService.getAllProgress(),
        databaseService.getLastReadPosition(),
      ]);
      setProgress(allProgress);
      setLastRead(last);
    } catch (error) {
      console.error('Failed to load progress:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProgress = useCallback(async (surahNumber: number, ayahNumber: number, percentage: number) => {
    try {
      await databaseService.updateReadingProgress({
        surahNumber,
        ayahNumber,
        lastReadAt: Date.now(),
        completionPercentage: percentage,
      });
      await loadProgress();
      return true;
    } catch (error) {
      console.error('Failed to update progress:', error);
      return false;
    }
  }, [loadProgress]);

  const getProgress = useCallback(async (surahNumber: number): Promise<ReadingProgress | null> => {
    try {
      return await databaseService.getReadingProgress(surahNumber);
    } catch (error) {
      console.error('Failed to get progress:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  return {
    progress,
    lastRead,
    loading,
    updateProgress,
    getProgress,
    refresh: loadProgress,
  };
}

export function useStatistics() {
  const [stats, setStats] = useState<DatabaseStats>({
    totalBookmarks: 0,
    totalNotes: 0,
    totalReadingTime: 0,
    completedSurahs: 0,
    currentStreak: 0,
  });
  const [loading, setLoading] = useState(false);

  const loadStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await databaseService.getStatistics();
      setStats(data);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addReadingSession = useCallback(async (surahNumber: number, duration: number) => {
    try {
      const endTime = Date.now();
      const startTime = endTime - (duration * 1000);
      
      await databaseService.addReadingSession({
        surahNumber,
        startTime,
        endTime,
        duration,
      });
      await loadStats();
      return true;
    } catch (error) {
      console.error('Failed to add reading session:', error);
      return false;
    }
  }, [loadStats]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    loading,
    addReadingSession,
    refresh: loadStats,
  };
}
