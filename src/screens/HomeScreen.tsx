/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Target, ArrowRight, Clock } from 'lucide-react';
import { SUBJECTS } from '../types';
import { CustomButton } from '../components/CustomButton';
import { StorageService } from '../services/storageService';
import { musicService } from '../services/musicService';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [customSubject, setCustomSubject] = useState("");
  const [studyTarget, setStudyTarget] = useState("");
  const stats = StorageService.getStats();

  const handleStart = () => {
    // Unlock audio context for later use (autoplay fix)
    musicService.unlock();
    
    const finalSubject = selectedSubject === 'Lainnya' ? customSubject : selectedSubject;
    localStorage.setItem('currentSubject', finalSubject || 'Umum');
    localStorage.setItem('currentTarget', studyTarget || 'Belajar Mandiri');
    navigate('/focus');
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">Halo, Pelajar!</h1>
          <p className="text-slate-500 font-medium">Siap untuk sesi fokus hari ini?</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white dark:bg-slate-900 px-5 py-3 rounded-2xl shadow-brand border border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <span className="text-xl">🔥</span>
            <div className="flex flex-col">
              <span className="text-orange-600 dark:text-orange-400 font-black leading-tight">{stats.streak} Hari</span>
              <span className="text-[10px] text-slate-400 font-black uppercase">Streak</span>
            </div>
          </div>
          <div className="flex -space-x-3">
             <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center text-xs shadow-sm shadow-blue-100">🏆</div>
             <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/40 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center text-xs shadow-sm shadow-orange-100">🚀</div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Selection Area */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-brand border border-slate-100 dark:border-slate-800">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Pilih atau Isi Mata Kuliah</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Nama Matkul</label>
                <input
                  type="text"
                  placeholder="Contoh: Algoritma, Psikologi..."
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none focus:ring-2 focus:ring-blue-400 font-bold text-slate-700 dark:text-slate-200 shadow-inner"
                  value={selectedSubject === 'Lainnya' ? customSubject : selectedSubject}
                  onChange={(e) => {
                    setSelectedSubject('Lainnya');
                    setCustomSubject(e.target.value);
                  }}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Input area */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <section className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-brand border border-slate-100 dark:border-slate-800 flex-1">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Target Sesi Ini</h3>
             <textarea
               placeholder="Apa goal-mu di sesi 15 menit ini? Contoh: 'Review materi array dan kerjakan 3 latihan soal'..."
               className="w-full h-40 p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border-none focus:ring-2 focus:ring-blue-400 text-lg font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 resize-none shadow-inner"
               value={studyTarget}
               onChange={(e) => setStudyTarget(e.target.value)}
             />
             
             <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                   <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400 shadow-sm"><Clock size={24} /></div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Durasi Fokus</p>
                      <p className="text-xl font-black text-slate-900 dark:text-white">15 Menit</p>
                   </div>
                </div>
                
                <CustomButton 
                  size="lg" 
                  className="w-full sm:w-auto rounded-full px-8 py-6"
                  onClick={handleStart}
                  icon={<ArrowRight size={20} />}
                >
                  Mulai Sesi Fokus
                </CustomButton>
             </div>
          </section>

          <footer className="bg-blue-600 dark:bg-blue-700 p-8 rounded-[2.5rem] shadow-brand-lg text-white relative overflow-hidden">
             <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h4 className="text-blue-100 text-xs font-black uppercase tracking-widest mb-1 opacity-60">Tahukah Kamu?</h4>
                  <p className="text-lg font-bold max-w-sm leading-relaxed">"Belajar konsisten 15 menit setiap hari lebih efektif daripada begadang semalam."</p>
                </div>
                <div className="hidden sm:block text-5xl opacity-40 transform -rotate-12 transform-gpu hover:rotate-0 transition-transform cursor-pointer">💡</div>
             </div>
             {/* Decorative element */}
             <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          </footer>
        </div>
      </div>
    </div>
  );
};
