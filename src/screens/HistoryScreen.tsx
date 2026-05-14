/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { History, Trash2, ChevronRight, FileText, Download } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { StudyNote } from '../types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { CustomButton } from '../components/CustomButton';

export const HistoryScreen: React.FC = () => {
  const [history, setHistory] = useState<StudyNote[]>(StorageService.getHistory().reverse());
  const [selectedNote, setSelectedNote] = useState<StudyNote | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (deletingId === id) {
      StorageService.deleteNote(id);
      setHistory(prev => prev.filter(n => n.id !== id));
      if (selectedNote?.id === id) setSelectedNote(null);
      setDeletingId(null);
    } else {
      setDeletingId(id);
      // Reset if not clicked again in 3 seconds
      setTimeout(() => setDeletingId(prev => prev === id ? null : prev), 3000);
    }
  };

  const exportToTxt = (note: StudyNote) => {
    const content = `
FOCUSNOTE POMODORO - CATATAN BELAJAR
------------------------------------
Tanggal: ${format(new Date(note.date), 'EEEE, d MMMM yyyy', { locale: id })}
Mata Pelajaran: ${note.subject}
Target Awal: ${note.target}
Selesai: ${note.completed ? 'Ya' : 'Tidak'}

REFLEKSI:
1. Yang dipelajari: ${note.reflection.learned || '-'}
2. Kesulitan: ${note.reflection.difficulties || '-'}
3. Target tercapai: ${note.reflection.achieved || '-'}
4. Rencana selanjutnya: ${note.reflection.nextPlan || '-'}

STATISTIK SESI:
- Total Sesi: ${note.sessionCount}
- Total Durasi: ${note.totalMinutes} Menit
- Mood: ${note.mood}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FocusNote_${format(new Date(note.date), 'yyyy-MM-dd')}_${note.subject}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 flex flex-col md:flex-row gap-6">
      {/* List */}
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <History className="text-blue-500" /> Riwayat Belajar
          </h1>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-800 shadow-sm">{history.length} Catatan</span>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Belum ada riwayat belajar.</p>
          </div>
        ) : (
          history.map((note) => (
            <div
              key={note.id}
              onClick={() => setSelectedNote(note)}
              className={`p-6 rounded-[2rem] cursor-pointer transition-all border ${
                selectedNote?.id === note.id 
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/40 shadow-brand' 
                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-brand shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">
                    {format(new Date(note.date), 'd MMM yyyy')}
                  </p>
                  <h3 className="font-black text-slate-800 dark:text-slate-100">{note.subject}</h3>
                </div>
                <button 
                  onClick={(e) => handleDelete(note.id, e)}
                  className={`p-2 rounded-xl transition-all flex items-center gap-1 text-[10px] font-black uppercase ${
                    deletingId === note.id 
                    ? 'bg-red-500 text-white shadow-lg' 
                    : 'text-slate-300 hover:text-red-500 dark:hover:text-red-400'
                  }`}
                >
                  {deletingId === note.id ? <span>Hapus?</span> : <Trash2 size={16} />}
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-4 font-medium italic opacity-80">{note.target}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="text-[9px] font-black bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700 shadow-inner">
                    {note.sessionCount} SESI
                  </span>
                  <span className="text-[9px] font-black bg-blue-100 dark:bg-blue-900/40 px-3 py-1 rounded-full text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60">
                    {note.totalMinutes} MENIT
                  </span>
                </div>
                <ChevronRight size={16} className={`transition-transform duration-300 ${selectedNote?.id === note.id ? 'translate-x-1 text-blue-500' : 'text-slate-300'}`} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail */}
      <div className="flex-1">
        {selectedNote ? (
          <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-brand-lg">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Detail Sesi</h2>
                <CustomButton 
                  variant="outline" 
                  size="sm" 
                  onClick={() => exportToTxt(selectedNote)}
                  className="rounded-full px-4"
                  icon={<Download size={14} />}
                >
                  TXT
                </CustomButton>
             </div>

             <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Mata Kuliah</label>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-inner">
                    <p className="font-black text-lg text-slate-800 dark:text-white">{selectedNote.subject}</p>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Hasil Belajar</label>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-inner leading-relaxed">
                    {selectedNote.reflection.learned || 'Tidak ada catatan.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-inner">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Mood</label>
                      <p className="font-black text-xs text-slate-700 dark:text-slate-200">{selectedNote.mood.replace('_', ' ').toUpperCase()}</p>
                   </div>
                   <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-inner">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Status Target</label>
                      <p className="font-black text-xs text-slate-700 dark:text-slate-200">{selectedNote.completed ? '✅ TERCAPAI' : '❌ BELUM'}</p>
                   </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Rencana Berikutnya</label>
                  <p className="text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/40 italic text-sm shadow-sm">
                    "{selectedNote.reflection.nextPlan || '-'}"
                  </p>
                </div>
             </div>
          </div>
        ) : (
          <div className="sticky top-24 h-[400px] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 transition-colors">
             <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-brand-lg">
                <FileText size={32} className="opacity-20 translate-y-px" />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-center max-w-[140px] leading-relaxed">Pilih salah satu catatan untuk melihat detail lengkapnya.</p>
          </div>
        )}
      </div>
    </div>
  );
};
