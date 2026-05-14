/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, CheckCircle2 } from 'lucide-react';
import { MOODS, StudyMood, StudyNote } from '../types';
import { CustomButton } from '../components/CustomButton';
import { StorageService } from '../services/storageService';
import { format } from 'date-fns';

export const NotesScreen: React.FC = () => {
  const navigate = useNavigate();
  const sessionData = JSON.parse(sessionStorage.getItem('currentSessionDraft') || '{}');
  
  const [learned, setLearned] = useState("");
  const [difficulties, setDifficulties] = useState("");
  const [achieved, setAchieved] = useState("");
  const [nextPlan, setNextPlan] = useState("");
  const [selectedMood, setSelectedMood] = useState<StudyMood>('biasa');
  const [isCompleted, setIsCompleted] = useState(true);

  const handleSave = () => {
    const newNote: StudyNote = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      subject: sessionData.subject || 'Lainnya',
      target: sessionData.target || 'Belajar',
      completed: isCompleted,
      reflection: {
        learned,
        difficulties,
        achieved,
        nextPlan,
      },
      mood: selectedMood,
      sessionCount: sessionData.sessionCount || 0,
      totalMinutes: sessionData.totalMinutes || 0,
    };

    StorageService.saveNote(newNote);
    
    // Update Streak logic
    const stats = StorageService.getStats();
    const today = format(new Date(), 'yyyy-MM-dd');
    
    if (stats.lastStudyDate !== today) {
        // If there's a study date and it was yesterday, increment.
        // Otherwise (first time or reset), it becomes 1.
        stats.streak += 1;
        stats.lastStudyDate = today;
    }
    
    StorageService.saveStats(stats);
    
    sessionStorage.removeItem('currentSessionDraft');
    navigate('/history');
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-2">Refleksi Belajar 📝</h1>
        <p className="text-slate-500 font-medium">Catat apa yang telah kamu selesaikan hari ini.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-brand border border-slate-100 dark:border-slate-800 space-y-6">
        <div className="grid grid-cols-2 gap-4">
           <div className="p-5 bg-blue-50 dark:bg-blue-900/30 rounded-2xl border border-blue-100 dark:border-blue-900/40 shadow-sm">
              <p className="text-[10px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-[0.2em] mb-1">Mata Kuliah</p>
              <p className="font-black text-blue-900 dark:text-blue-100">{sessionData.subject}</p>
           </div>
           <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-inner">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Total Waktu</p>
              <p className="font-black text-slate-800 dark:text-slate-200">{sessionData.totalMinutes} Menit</p>
           </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Hari ini belajar apa saja?</label>
            <textarea
              className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-blue-400 min-h-[100px] text-sm font-medium text-slate-700 dark:text-slate-200 shadow-inner"
              placeholder="Tulis ringkasan materimu..."
              value={learned}
              onChange={(e) => setLearned(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Apa yang masih sulit dipahami?</label>
            <textarea
              className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-blue-400 min-h-[100px] text-sm font-medium text-slate-700 dark:text-slate-200 shadow-inner"
              placeholder="Tulis tantanganmu hari ini..."
              value={difficulties}
              onChange={(e) => setDifficulties(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Rencana belajar berikutnya?</label>
            <input
              type="text"
              className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-blue-400 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-inner"
              placeholder="Misal: Lanjut bab 2..."
              value={nextPlan}
              onChange={(e) => setNextPlan(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-4 block">Mood belajarmu hari ini:</label>
          <div className="grid grid-cols-4 gap-3">
            {MOODS.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id as StudyMood)}
                className={`flex flex-col items-center p-4 rounded-2xl transition-all border-2 ${
                  selectedMood === mood.id 
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 shadow-brand' 
                  : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-400 dark:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <span className="text-3xl mb-2">{mood.icon}</span>
                <span className={`text-[10px] font-black uppercase tracking-tight ${selectedMood === mood.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div 
          onClick={() => setIsCompleted(!isCompleted)}
          className={`group flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all border-2 ${
            isCompleted 
            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' 
            : 'bg-slate-50 dark:bg-slate-800 border-transparent grayscale opacity-60'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isCompleted ? 'bg-blue-500' : 'bg-slate-300'}`}>
               <CheckCircle2 size={16} className="text-white" />
            </div>
            <p className={`text-sm font-black uppercase tracking-wide transition-colors ${isCompleted ? 'text-blue-700 dark:text-blue-300' : 'text-slate-500'}`}>
              Semua Target Tercapai
            </p>
          </div>
        </div>

        <CustomButton 
          className="w-full rounded-full py-6" 
          size="lg" 
          onClick={handleSave}
          icon={<Save size={20} />}
        >
          Simpan Catatan & Selesai
        </CustomButton>
      </div>
    </div>
  );
};
