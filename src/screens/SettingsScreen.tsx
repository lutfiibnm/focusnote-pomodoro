/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Volume2,
  Moon,
  Sun,
  Clock,
  Info,
  Play,
  Pause,
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { musicService } from '../services/musicService';

export const SettingsScreen: React.FC = () => {
  const [settings, setSettings] = useState(StorageService.getSettings());
  const [isTestPlaying, setIsTestPlaying] = useState(false);

  const handleUpdate = (updates: Partial<typeof settings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);

    if (updates.theme) {
      if (updates.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const toggleTestMusic = () => {
    if (isTestPlaying) {
      musicService.stop();
    } else {
      musicService.play();
    }

    setIsTestPlaying(!isTestPlaying);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black mb-2 flex items-center justify-center gap-3 text-slate-900 dark:text-white">
          <span>Pengaturan</span>
          <span aria-hidden="true">⚙️</span>
        </h1>

        <p className="font-medium text-slate-600 dark:text-slate-300">
          Sesuaikan aplikasi dengan gaya belajarmu.
        </p>
      </div>

      <div className="rounded-[2rem] p-8 shadow-brand border space-y-8 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white">
        <section>
          <h3 className="flex items-center font-bold mb-4 text-slate-900 dark:text-white">
            <Clock size={20} className="mr-2 text-blue-500" />
            Durasi Timer
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-300">
                Sesi Fokus (Menit)
              </label>

              <input
                type="number"
                min="1"
                max="60"
                className="w-full p-4 rounded-xl border-none focus:ring-2 focus:ring-blue-400 font-bold shadow-inner bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                value={settings.focusDuration}
                onChange={(e) =>
                  handleUpdate({
                    focusDuration: parseInt(e.target.value) || 1,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-300">
                Sesi Istirahat (Menit)
              </label>

              <input
                type="number"
                min="1"
                max="30"
                className="w-full p-4 rounded-xl border-none focus:ring-2 focus:ring-blue-400 font-bold shadow-inner bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                value={settings.breakDuration}
                onChange={(e) =>
                  handleUpdate({
                    breakDuration: parseInt(e.target.value) || 1,
                  })
                }
              />
            </div>
          </div>
        </section>

        <div className="h-px bg-slate-200 dark:bg-slate-700" />

        <section className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-500 dark:text-blue-300">
                <Volume2 size={20} />
              </div>

              <div>
                <p className="font-bold text-slate-900 dark:text-white">
                  Musik Istirahat
                </p>

                <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Putar musik otomatis saat istirahat
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.musicEnabled}
                onChange={(e) =>
                  handleUpdate({ musicEnabled: e.target.checked })
                }
              />

              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>

          {settings.musicEnabled && (
            <div className="flex items-center justify-between pl-14">
              <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-300">
                Cek Suara Musik
              </p>

              <button
                onClick={toggleTestMusic}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${
                  isTestPlaying
                    ? 'bg-orange-100 text-orange-600'
                    : 'bg-blue-50 text-blue-600'
                }`}
              >
                {isTestPlaying ? (
                  <>
                    <Pause size={14} /> Stop
                  </>
                ) : (
                  <>
                    <Play size={14} /> Test
                  </>
                )}
              </button>
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300">
                {settings.theme === 'light' ? (
                  <Sun size={20} />
                ) : (
                  <Moon size={20} />
                )}
              </div>

              <div>
                <p className="font-bold text-slate-900 dark:text-white">
                  Mode Kegelapan
                </p>

                <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Ubah ke tampilan gelap
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.theme === 'dark'}
                onChange={(e) =>
                  handleUpdate({
                    theme: e.target.checked ? 'dark' : 'light',
                  })
                }
              />

              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>
        </section>
      </div>

      <div className="mt-8 text-center px-4">
        <div className="text-sm font-bold flex flex-col items-center justify-center gap-2 mx-auto text-slate-500 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">
          <div className="flex items-center gap-2">
            <Info size={16} /> FocusNote Pomodoro v1.0.8
          </div>

          <div className="text-[10px] uppercase font-black tracking-[0.3em] opacity-60">
            by lutfiibnm
          </div>
        </div>
      </div>
    </div>
  );
};
