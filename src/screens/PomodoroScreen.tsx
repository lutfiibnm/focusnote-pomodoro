/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { TimerCircle } from '../components/TimerCircle';
import { CustomButton } from '../components/CustomButton';
import { formatTime } from '../lib/utils';
import { StorageService } from '../services/storageService';
import { musicService } from '../services/musicService';
import { MOTIVATION_MESSAGES } from '../types';
import confetti from 'canvas-confetti';

export const PomodoroScreen: React.FC = () => {
  const navigate = useNavigate();
  const settings = StorageService.getSettings();
  
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [timeLeft, setTimeLeft] = useState(settings.focusDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [motivation, setMotivation] = useState("");
  const [currentSubject, setCurrentSubject] = useState(localStorage.getItem('currentSubject') || 'Lainnya');
  const [currentTarget, setCurrentTarget] = useState(localStorage.getItem('currentTarget') || 'Belajar');
  const [isMuted, setIsMuted] = useState(!settings.musicEnabled);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    musicService.toggleMute(isMuted);
  }, [isMuted]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsActive(false);
    
    if (mode === 'focus') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setSessionCount(prev => prev + 1);
      setMode('break');
      setTimeLeft(settings.breakDuration * 60);
      setMotivation(MOTIVATION_MESSAGES[Math.floor(Math.random() * MOTIVATION_MESSAGES.length)]);
      if (settings.musicEnabled) musicService.play();
      
      // Update stats lightly
      const stats = StorageService.getStats();
      stats.totalSessions += 1;
      stats.totalMinutes += settings.focusDuration;
      StorageService.saveStats(stats);
      
      // Request notification if permission granted
      if (Notification.permission === "granted") {
        new Notification("FocusNote Pomodoro", {
          body: "Waktu belajar selesai, saatnya istirahat sebentar.",
          icon: "/favicon.ico"
        });
      }
    } else {
      handleRestart();
    }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const handleRestart = () => {
    musicService.stop();
    setMode('focus');
    setTimeLeft(settings.focusDuration * 60);
    setIsActive(true);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? settings.focusDuration * 60 : settings.breakDuration * 60);
    musicService.stop();
  };

  const handleEndDay = () => {
    musicService.stop();
    const currentSessionData = {
      subject: currentSubject,
      target: currentTarget,
      sessionCount: sessionCount,
      totalMinutes: sessionCount * settings.focusDuration
    };
    sessionStorage.setItem('currentSessionDraft', JSON.stringify(currentSessionData));
    navigate('/notes');
  };

  const totalTime = mode === 'focus' ? settings.focusDuration * 60 : settings.breakDuration * 60;
  const percentage = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-80px)] flex flex-col">
      <header className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {mode === 'focus' ? 'Sesi Fokus' : 'Waktu Istirahat'}
          </h2>
          <p className="text-slate-500 font-medium tracking-tight">
            {mode === 'focus' ? `🎯 ${currentSubject}` : `✨ ${motivation}`}
          </p>
        </div>
        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur px-6 py-3 rounded-2xl border border-white dark:border-slate-800 shadow-sm flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full ${mode === 'focus' ? 'bg-green-500 animate-pulse' : 'bg-blue-400'}`}></span>
          <p className="text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">{mode === 'focus' ? 'Belajar Aktif' : 'Mode Santai'}</p>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center -mt-12">
        <TimerCircle 
          percentage={percentage} 
          timeLeft={formatTime(timeLeft)} 
          className="hover:scale-[1.02] transition-transform duration-500"
        />

        <div className="mt-12 flex items-center gap-6">
          <CustomButton
            variant="primary"
            size="lg"
            className="w-20 h-20 rounded-full overflow-hidden p-0"
            onClick={toggleTimer}
          >
            {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
          </CustomButton>
          
          <button
            onClick={handleReset}
            className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 transition shadow-sm"
            title="Reset Timer"
          >
            <RotateCcw size={24} />
          </button>
        </div>
      </div>

      <footer className="mt-auto grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-slate-200">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl shadow-inner">🎯</div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sesi Selesai</p>
            <p className="text-2xl font-black text-slate-900">{sessionCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl shadow-inner">⏱️</div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Fokus</p>
            <p className="text-2xl font-black text-slate-900">{sessionCount * settings.focusDuration} <span className="text-sm font-bold text-slate-400">Min</span></p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 flex items-center justify-center rounded-3xl transition-all shadow-sm ${
              isMuted ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-blue-50 text-blue-500 border border-blue-100'
            }`}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={24} />}
          </button>
          
          {mode === 'break' ? (
             <CustomButton variant="primary" className="flex-1 rounded-3xl" onClick={handleRestart}>
               Sesi Baru
             </CustomButton>
          ) : (
             <CustomButton variant="outline" className="flex-1 rounded-3xl" onClick={() => navigate('/')}>
               Ganti Pelajaran
             </CustomButton>
          )}
          
          <CustomButton variant="danger" className="flex-1 rounded-3xl" onClick={handleEndDay}>
            Akhiri
          </CustomButton>
        </div>
      </footer>
    </div>
  );
};
