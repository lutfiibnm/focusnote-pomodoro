/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Clock, BookMarked, Trophy } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { format } from 'date-fns';

export const StatsScreen: React.FC = () => {
  const stats = StorageService.getStats();
  const history = StorageService.getHistory();

  // Prepare data for chart (Last 7 sessions) - Memoized for stability
  const chartData = React.useMemo(() => {
    return history.slice(-7).map(note => ({
      name: format(new Date(note.date), 'd/MM'),
      minutes: note.totalMinutes,
      subject: note.subject
    }));
  }, [history]);

  const BADGES = [
    { title: "Pemanasan", desc: "Selesaikan 1 sesi pertama", icon: "🌱", condition: stats.totalSessions >= 1 },
    { title: "Fokus Mantap", desc: "3 sesi dalam sehari", icon: "🔥", condition: history.some(h => h.sessionCount >= 3) },
    { title: "Belajar Konsisten", desc: "7 hari streak", icon: "🌟", condition: stats.streak >= 7 },
    { title: "Mesin Belajar", desc: "30 hari streak", icon: "⚡", condition: stats.streak >= 30 },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-2">Statistik Belajar 📊</h1>
        <p className="text-slate-500 font-medium">Melihat progres perjalanan belajarmu.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Sesi" value={stats.totalSessions} icon={<TrendingUp className="text-blue-500" />} />
        <StatCard title="Total Menit" value={stats.totalMinutes} icon={<Clock className="text-green-500" />} />
        <StatCard title="Streak" value={`${stats.streak} Hari`} icon={<Trophy className="text-yellow-500" />} />
        <StatCard title="Catatan" value={history.length} icon={<BookMarked className="text-purple-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-brand">
          <div className="mb-6">
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 italic">Aktivitas Terakhir</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Melihat riwayat menit belajar per sesi</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} fontWeight="bold" tick={{ fill: '#94a3b8' }} />
                <Tooltip 
                  isAnimationActive={false}
                  cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', padding: '16px' }}
                />
                <Bar dataKey="minutes" radius={[8, 8, 0, 0]} isAnimationActive={false}>
                  {chartData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#60a5fa'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-brand">
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-6">Badge Motivasi</h3>
          <div className="space-y-4">
            {BADGES.map((badge, idx) => (
              <div 
                key={idx} 
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  badge.condition 
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/40 shadow-sm' 
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 opacity-40 grayscale'
                }`}
              >
                <div className="text-3xl bg-white dark:bg-slate-900 w-12 h-12 flex items-center justify-center rounded-xl shadow-inner-lg">
                   {badge.icon}
                </div>
                <div>
                  <p className="font-black text-xs text-slate-800 dark:text-slate-100 uppercase tracking-wide">{badge.title}</p>
                  <p className="text-[10px] text-slate-400 font-bold leading-tight">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-brand flex items-center gap-4">
    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl shadow-inner">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  </div>
);
