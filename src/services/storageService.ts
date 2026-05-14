/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StudyNote, AppSettings, UserStats } from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'focusnote_settings',
  STATS: 'focusnote_stats',
  HISTORY: 'focusnote_history',
};

const DEFAULT_SETTINGS: AppSettings = {
  focusDuration: 15,
  breakDuration: 5,
  musicEnabled: true,
  theme: 'light',
};

const DEFAULT_STATS: UserStats = {
  totalSessions: 0,
  totalMinutes: 0,
  streak: 0,
  lastStudyDate: null,
  badges: [],
};

export const StorageService = {
  getSettings: (): AppSettings => {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  },
  saveSettings: (settings: AppSettings) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },
  
  getStats: (): UserStats => {
    const data = localStorage.getItem(STORAGE_KEYS.STATS);
    const stats: UserStats = data ? JSON.parse(data) : DEFAULT_STATS;
    
    // Validate streak: if last study date was more than 1 day ago, streak is broken
    if (stats.lastStudyDate) {
      const lastDate = new Date(stats.lastStudyDate);
      const today = new Date();
      
      // Zero out time part for date comparison
      lastDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      
      const diffTime = Math.abs(today.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 1) {
        stats.streak = 0;
        StorageService.saveStats(stats);
      }
    }
    
    return stats;
  },
  saveStats: (stats: UserStats) => {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  },

  getHistory: (): StudyNote[] => {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  },
  saveNote: (note: StudyNote) => {
    const history = StorageService.getHistory();
    history.push(note);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  },
  deleteNote: (id: string) => {
    const history = StorageService.getHistory().filter(n => n.id !== id);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  },

  resetData: () => {
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.STATS);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  }
};
