/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StudyMood = 'senang' | 'biasa' | 'capek' | 'sulit_fokus';

export interface StudyNote {
  id: string;
  date: string; // ISO string
  subject: string;
  target: string;
  completed: boolean;
  reflection: {
    learned: string;
    difficulties: string;
    achieved: string;
    nextPlan: string;
  };
  mood: StudyMood;
  sessionCount: number;
  totalMinutes: number;
}

export interface AppSettings {
  focusDuration: number; // in minutes
  breakDuration: number; // in minutes
  musicEnabled: boolean;
  theme: 'light' | 'dark';
}

export interface UserStats {
  totalSessions: number;
  totalMinutes: number;
  streak: number;
  lastStudyDate: string | null;
  badges: string[];
}

export const SUBJECTS = [
  'Matematika',
  'Bahasa Inggris',
  'Pemrograman',
  'Sejarah',
  'Lainnya'
];

export const MOODS = [
  { id: 'senang', label: 'Senang', icon: '😊' },
  { id: 'biasa', label: 'Biasa Saja', icon: '😐' },
  { id: 'capek', label: 'Capek', icon: '😫' },
  { id: 'sulit_fokus', label: 'Sulit Fokus', icon: '🧠' }
];

export const MOTIVATION_MESSAGES = [
  "Mantap, satu sesi beres.",
  "Istirahat dulu, otak juga butuh napas.",
  "Pelan-pelan asal konsisten.",
  "Fokus kecil tiap hari lebih bagus daripada niat gede tapi bolong terus.",
  "Jangan sok kuat, jeda bentar biar nggak mumet.",
  "Belajar dikit tapi rutin lebih menang daripada ngebut semalam."
];
