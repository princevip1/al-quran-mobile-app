import * as SQLite from 'expo-sqlite';
import { Bookmark, DatabaseStats, Note, ReadingProgress, ReadingSession } from '../types/database';

const DB_NAME = 'alquran.db';

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.db = await SQLite.openDatabaseAsync(DB_NAME);
      await this.createTables();
      await this.runMigrations();
      this.isInitialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Bookmarks table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        surahNumber INTEGER NOT NULL,
        ayahNumber INTEGER NOT NULL,
        note TEXT,
        color TEXT DEFAULT '#C1986A',
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL,
        UNIQUE(surahNumber, ayahNumber)
      );
    `);

    // Notes table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        surahNumber INTEGER NOT NULL,
        ayahNumber INTEGER NOT NULL,
        content TEXT NOT NULL,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
      );
    `);

    // Reading progress table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS reading_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        surahNumber INTEGER NOT NULL UNIQUE,
        ayahNumber INTEGER NOT NULL,
        lastReadAt INTEGER NOT NULL,
        completionPercentage REAL DEFAULT 0
      );
    `);

    // Reading sessions table (for statistics)
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS reading_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        surahNumber INTEGER NOT NULL,
        startTime INTEGER NOT NULL,
        endTime INTEGER NOT NULL,
        duration INTEGER NOT NULL
      );
    `);

    // Create indexes for better query performance
    await this.db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_bookmarks_surah ON bookmarks(surahNumber);
      CREATE INDEX IF NOT EXISTS idx_notes_surah ON notes(surahNumber);
      CREATE INDEX IF NOT EXISTS idx_progress_surah ON reading_progress(surahNumber);
      CREATE INDEX IF NOT EXISTS idx_sessions_surah ON reading_sessions(surahNumber);
    `);
  }

  private async runMigrations(): Promise<void> {
    // Future migrations will be added here
    // Version tracking can be implemented using a separate migrations table
  }

  // ========== BOOKMARKS ==========

  async addBookmark(bookmark: Omit<Bookmark, 'id'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.runAsync(
      `INSERT OR REPLACE INTO bookmarks (surahNumber, ayahNumber, note, color, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        bookmark.surahNumber,
        bookmark.ayahNumber,
        bookmark.note || null,
        bookmark.color || '#C1986A',
        bookmark.createdAt,
        bookmark.updatedAt,
      ]
    );

    return result.lastInsertRowId;
  }

  async getBookmark(surahNumber: number, ayahNumber: number): Promise<Bookmark | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync<Bookmark>(
      'SELECT * FROM bookmarks WHERE surahNumber = ? AND ayahNumber = ?',
      [surahNumber, ayahNumber]
    );

    return result || null;
  }

  async getAllBookmarks(): Promise<Bookmark[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync<Bookmark>(
      'SELECT * FROM bookmarks ORDER BY createdAt DESC'
    );

    return result;
  }

  async getBookmarksBySurah(surahNumber: number): Promise<Bookmark[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync<Bookmark>(
      'SELECT * FROM bookmarks WHERE surahNumber = ? ORDER BY ayahNumber ASC',
      [surahNumber]
    );

    return result;
  }

  async updateBookmark(id: number, updates: Partial<Bookmark>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const fields: string[] = [];
    const values: any[] = [];

    if (updates.note !== undefined) {
      fields.push('note = ?');
      values.push(updates.note);
    }
    if (updates.color !== undefined) {
      fields.push('color = ?');
      values.push(updates.color);
    }
    
    fields.push('updatedAt = ?');
    values.push(Date.now());
    values.push(id);

    await this.db.runAsync(
      `UPDATE bookmarks SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }

  async deleteBookmark(surahNumber: number, ayahNumber: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      'DELETE FROM bookmarks WHERE surahNumber = ? AND ayahNumber = ?',
      [surahNumber, ayahNumber]
    );
  }

  async isBookmarked(surahNumber: number, ayahNumber: number): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM bookmarks WHERE surahNumber = ? AND ayahNumber = ?',
      [surahNumber, ayahNumber]
    );

    return (result?.count || 0) > 0;
  }

  // ========== NOTES ==========

  async addNote(note: Omit<Note, 'id'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.runAsync(
      `INSERT INTO notes (surahNumber, ayahNumber, content, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?)`,
      [note.surahNumber, note.ayahNumber, note.content, note.createdAt, note.updatedAt]
    );

    return result.lastInsertRowId;
  }

  async getNotes(surahNumber: number, ayahNumber: number): Promise<Note[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync<Note>(
      'SELECT * FROM notes WHERE surahNumber = ? AND ayahNumber = ? ORDER BY createdAt DESC',
      [surahNumber, ayahNumber]
    );

    return result;
  }

  async getAllNotes(): Promise<Note[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync<Note>(
      'SELECT * FROM notes ORDER BY createdAt DESC'
    );

    return result;
  }

  async updateNote(id: number, content: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      'UPDATE notes SET content = ?, updatedAt = ? WHERE id = ?',
      [content, Date.now(), id]
    );
  }

  async deleteNote(id: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync('DELETE FROM notes WHERE id = ?', [id]);
  }

  // ========== READING PROGRESS ==========

  async updateReadingProgress(progress: Omit<ReadingProgress, 'id'>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      `INSERT OR REPLACE INTO reading_progress (surahNumber, ayahNumber, lastReadAt, completionPercentage)
       VALUES (?, ?, ?, ?)`,
      [progress.surahNumber, progress.ayahNumber, progress.lastReadAt, progress.completionPercentage]
    );
  }

  async getReadingProgress(surahNumber: number): Promise<ReadingProgress | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync<ReadingProgress>(
      'SELECT * FROM reading_progress WHERE surahNumber = ?',
      [surahNumber]
    );

    return result || null;
  }

  async getLastReadPosition(): Promise<ReadingProgress | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync<ReadingProgress>(
      'SELECT * FROM reading_progress ORDER BY lastReadAt DESC LIMIT 1'
    );

    return result || null;
  }

  async getAllProgress(): Promise<ReadingProgress[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync<ReadingProgress>(
      'SELECT * FROM reading_progress ORDER BY lastReadAt DESC'
    );

    return result;
  }

  // ========== READING SESSIONS ==========

  async addReadingSession(session: Omit<ReadingSession, 'id'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.runAsync(
      `INSERT INTO reading_sessions (surahNumber, startTime, endTime, duration)
       VALUES (?, ?, ?, ?)`,
      [session.surahNumber, session.startTime, session.endTime, session.duration]
    );

    return result.lastInsertRowId;
  }

  async getReadingSessions(surahNumber?: number, limit?: number): Promise<ReadingSession[]> {
    if (!this.db) throw new Error('Database not initialized');

    let query = 'SELECT * FROM reading_sessions';
    const params: any[] = [];

    if (surahNumber !== undefined) {
      query += ' WHERE surahNumber = ?';
      params.push(surahNumber);
    }

    query += ' ORDER BY endTime DESC';

    if (limit) {
      query += ' LIMIT ?';
      params.push(limit);
    }

    const result = await this.db.getAllAsync<ReadingSession>(query, params);
    return result;
  }

  // ========== STATISTICS ==========

  async getStatistics(): Promise<DatabaseStats> {
    if (!this.db) throw new Error('Database not initialized');

    const bookmarkCount = await this.db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM bookmarks'
    );

    const noteCount = await this.db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM notes'
    );

    const totalTime = await this.db.getFirstAsync<{ total: number }>(
      'SELECT COALESCE(SUM(duration), 0) as total FROM reading_sessions'
    );

    const completedSurahs = await this.db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM reading_progress WHERE completionPercentage >= 100'
    );

    // Calculate streak (days with reading sessions)
    const streak = await this.calculateStreak();

    return {
      totalBookmarks: bookmarkCount?.count || 0,
      totalNotes: noteCount?.count || 0,
      totalReadingTime: totalTime?.total || 0,
      completedSurahs: completedSurahs?.count || 0,
      currentStreak: streak,
    };
  }

  private async calculateStreak(): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const sessions = await this.db.getAllAsync<{ endTime: number }>(
      'SELECT DISTINCT DATE(endTime/1000, "unixepoch") as day FROM reading_sessions ORDER BY day DESC LIMIT 365'
    );

    if (sessions.length === 0) return 0;

    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if there's activity today or yesterday
    const lastSession = new Date(sessions[0].endTime);
    lastSession.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today.getTime() - lastSession.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff > 1) return 0; // Streak broken

    // Count consecutive days
    for (let i = 1; i < sessions.length; i++) {
      const current = new Date(sessions[i - 1].endTime);
      const previous = new Date(sessions[i].endTime);
      current.setHours(0, 0, 0, 0);
      previous.setHours(0, 0, 0, 0);

      const diff = Math.floor((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diff === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  // ========== UTILITY ==========

  async clearAllData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.execAsync(`
      DELETE FROM bookmarks;
      DELETE FROM notes;
      DELETE FROM reading_progress;
      DELETE FROM reading_sessions;
    `);
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
      this.isInitialized = false;
    }
  }
}

// Singleton instance
export const databaseService = new DatabaseService();
