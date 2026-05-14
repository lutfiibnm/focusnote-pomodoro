/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Info, BookOpen, Clock, Heart } from 'lucide-react';

export const AboutScreen: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-slate-900 mb-4">FocusNote Pomodoro</h1>
        <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-100">
          Versi 1.0.4
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 text-slate-600 leading-relaxed font-medium">
        <div className="space-y-6">
          <section className="bg-white p-8 rounded-[2rem] shadow-brand border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <BookOpen className="text-blue-500" /> Apa itu FocusNote?
            </h2>
            <p>
              FocusNote Pomodoro bukan sekadar timer biasa. Ia dirancang khusus untuk pelajar dan mahasiswa yang ingin membangun kebiasaan belajar yang berkelanjutan tanpa rasa lelah yang berlebihan (burnout).
            </p>
          </section>

          <section className="bg-white p-8 rounded-[2rem] shadow-brand border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="text-orange-500" /> Metode Pomodoro 15/5
            </h2>
            <p>
              Kami menggunakan interval fokus 15 menit. Mengapa 15 menit? Karena rentang perhatian paling tajam manusia seringkali optimal di durasi singkat namun intens. Setelah itu, musik lembut akan otomatis diputar untuk memberitahumu bahwa ini waktunya mengistirahatkan otak.
            </p>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-blue-600 p-8 rounded-[2rem] shadow-brand-lg text-white">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Info className="text-blue-100" /> Cara Menggunakan
            </h2>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span>Pilih mata pelajaran yang akan kamu pelajari.</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span>Tulis target spesifik (misal: "Baca chapter 1").</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span>Mulai timer dan fokus sampai waktu habis.</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                <span>Nikmati musik saat istirahat dan tulis refleksimu di akhir hari.</span>
              </li>
            </ul>
          </section>

          <div className="p-8 text-center bg-white rounded-[2rem] border border-slate-100 shadow-sm">
             <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={32} />
             </div>
             <p className="font-bold text-slate-900">Dibuat dengan cinta untuk para pelajar yang tidak pernah berhenti belajar.</p>
          </div>
        </div>
      </div>
      
      <div className="text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] py-8 border-t border-slate-200 dark:border-slate-800">
        FocusNote Pomodoro by LutfIIbnm &copy; 2026
      </div>
    </div>
  );
};
