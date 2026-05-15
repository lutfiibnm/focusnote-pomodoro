/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  Pause,
  RotateCcw,
  Coffee,
  CheckCircle2,
  BookOpen,
  Target,
  Music,
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { musicService } from '../services/musicService';

type TimerPhase = 'idle' | 'focus' | 'break';

type TimerStatus = 'running' | 'paused';

type StoredTimer = {
  phase: Exclude<TimerPhase, 'idle'>;
  status: TimerStatus;
  startedAt: number;
  endsAt: number;
  durationSeconds: number;
  remainingSeconds?: number;
  subject?: string;
  target?: string;
};

const TIMER_STORAGE_KEY = 'focusnote_active_timer_v2';
const SUBJECT_STORAGE_KEY = 'focusnote_current_subject';
const TARGET_STORAGE_KEY = 'focusnote_current_target';

const getDurationSeconds = (value: unknown, fallbackMinutes: number) => {
  const minutes = Number(value);

  if (!Number.isFinite(minutes) || minutes <= 0) {
    return fallbackMinutes * 60;
  }

  return Math.max(1, Math.round(minutes * 60));
};

const getRemainingSeconds = (endsAt: number) => {
  return Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
};

const formatTime = (seconds: number) => {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const saveTimer = (timer: StoredTimer) => {
  localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(timer));
};

const readTimer = (): StoredTimer | null => {
  const raw = localStorage.getItem(TIMER_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredTimer;
  } catch {
    localStorage.removeItem(TIMER_STORAGE_KEY);
    return null;
  }
};

const clearTimer = () => {
  localStorage.removeItem(TIMER_STORAGE_KEY);
};

export const PomodoroScreen: React.FC = () => {
  const navigate = useNavigate();

  const [settings] = useState(() => StorageService.getSettings());

  const focusDurationSeconds = useMemo(
    () => getDurationSeconds(settings.focusDuration, 15),
    [settings.focusDuration],
  );

  const breakDurationSeconds = useMemo(
    () => getDurationSeconds(settings.breakDuration, 5),
    [settings.breakDuration],
  );

  const [phase, setPhase] = useState<TimerPhase>('idle');
  const [isRunning, setIsRunning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(focusDurationSeconds);
  const [activeDurationSeconds, setActiveDurationSeconds] = useState(focusDurationSeconds);

  const [subject, setSubject] = useState(() => {
    return localStorage.getItem(SUBJECT_STORAGE_KEY) || 'Matematika';
  });

  const [target, setTarget] = useState(() => {
    return localStorage.getItem(TARGET_STORAGE_KEY) || '';
  });

  const safePlayMusic = useCallback(() => {
    if (!settings.musicEnabled) {
      return;
    }

    try {
      musicService.play();
    } catch (error) {
      console.error('Gagal memutar musik:', error);
    }
  }, [settings.musicEnabled]);

  const safeStopMusic = useCallback(() => {
    try {
      musicService.stop();
    } catch (error) {
      console.error('Gagal menghentikan musik:', error);
    }
  }, []);

  const applyTimerToState = useCallback(
    (timer: StoredTimer) => {
      setPhase(timer.phase);
      setActiveDurationSeconds(timer.durationSeconds);

      if (timer.subject) {
        setSubject(timer.subject);
      }

      if (timer.target) {
        setTarget(timer.target);
      }

      if (timer.status === 'paused') {
        const pausedRemaining = Math.max(0, timer.remainingSeconds ?? 0);
        setRemainingSeconds(pausedRemaining);
        setIsRunning(false);
        return;
      }

      const remaining = getRemainingSeconds(timer.endsAt);
      setRemainingSeconds(remaining);
      setIsRunning(remaining > 0);
    },
    [],
  );

  const moveToBreak = useCallback(
    (focusEndsAt: number, oldTimer?: StoredTimer) => {
      const breakEndsAt = focusEndsAt + breakDurationSeconds * 1000;
      const remaining = getRemainingSeconds(breakEndsAt);

      const breakTimer: StoredTimer = {
        phase: 'break',
        status: remaining > 0 ? 'running' : 'paused',
        startedAt: focusEndsAt,
        endsAt: breakEndsAt,
        durationSeconds: breakDurationSeconds,
        remainingSeconds: remaining,
        subject: oldTimer?.subject || subject,
        target: oldTimer?.target || target,
      };

      saveTimer(breakTimer);

      setPhase('break');
      setActiveDurationSeconds(breakDurationSeconds);
      setRemainingSeconds(remaining);
      setIsRunning(remaining > 0);

      safePlayMusic();
    },
    [breakDurationSeconds, safePlayMusic, subject, target],
  );

  const syncTimer = useCallback(() => {
    const timer = readTimer();

    if (!timer) {
      return;
    }

    if (timer.status === 'paused') {
      applyTimerToState(timer);

      if (timer.phase === 'break') {
        safePlayMusic();
      }

      return;
    }

    const remaining = getRemainingSeconds(timer.endsAt);

    if (remaining > 0) {
      setPhase(timer.phase);
      setActiveDurationSeconds(timer.durationSeconds);
      setRemainingSeconds(remaining);
      setIsRunning(true);

      if (timer.subject) {
        setSubject(timer.subject);
      }

      if (timer.target) {
        setTarget(timer.target);
      }

      return;
    }

    if (timer.phase === 'focus') {
      moveToBreak(timer.endsAt, timer);
      return;
    }

    if (timer.phase === 'break') {
      const expiredBreakTimer: StoredTimer = {
        ...timer,
        status: 'paused',
        remainingSeconds: 0,
      };

      saveTimer(expiredBreakTimer);

      setPhase('break');
      setActiveDurationSeconds(timer.durationSeconds);
      setRemainingSeconds(0);
      setIsRunning(false);

      safePlayMusic();
    }
  }, [applyTimerToState, moveToBreak, safePlayMusic]);

  useEffect(() => {
    localStorage.setItem(SUBJECT_STORAGE_KEY, subject);
  }, [subject]);

  useEffect(() => {
    localStorage.setItem(TARGET_STORAGE_KEY, target);
  }, [target]);

  useEffect(() => {
    const timer = readTimer();

    if (timer) {
      syncTimer();
      return;
    }

    setPhase('idle');
    setIsRunning(false);
    setRemainingSeconds(focusDurationSeconds);
    setActiveDurationSeconds(focusDurationSeconds);
  }, [focusDurationSeconds, syncTimer]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      syncTimer();
    }, 1000);

    const handleVisibilityChange = () => {
      syncTimer();
    };

    window.addEventListener('focus', syncTimer);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', syncTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [syncTimer]);

  const startFocusSession = () => {
    safeStopMusic();

    const now = Date.now();

    const focusTimer: StoredTimer = {
      phase: 'focus',
      status: 'running',
      startedAt: now,
      endsAt: now + focusDurationSeconds * 1000,
      durationSeconds: focusDurationSeconds,
      subject,
      target,
    };

    saveTimer(focusTimer);

    setPhase('focus');
    setIsRunning(true);
    setRemainingSeconds(focusDurationSeconds);
    setActiveDurationSeconds(focusDurationSeconds);
  };

  const pauseTimer = () => {
    const timer = readTimer();

    if (!timer || timer.status !== 'running') {
      return;
    }

    const remaining = getRemainingSeconds(timer.endsAt);

    const pausedTimer: StoredTimer = {
      ...timer,
      status: 'paused',
      remainingSeconds: remaining,
    };

    saveTimer(pausedTimer);
    setRemainingSeconds(remaining);
    setIsRunning(false);
  };

  const resumeTimer = () => {
    const timer = readTimer();

    if (!timer || timer.status !== 'paused') {
      return;
    }

    const remaining = Math.max(0, timer.remainingSeconds ?? 0);

    if (remaining <= 0 && timer.phase === 'focus') {
      moveToBreak(Date.now(), timer);
      return;
    }

    const now = Date.now();

    const resumedTimer: StoredTimer = {
      ...timer,
      status: 'running',
      startedAt: now,
      endsAt: now + remaining * 1000,
      remainingSeconds: undefined,
    };

    saveTimer(resumedTimer);

    setPhase(resumedTimer.phase);
    setActiveDurationSeconds(resumedTimer.durationSeconds);
    setRemainingSeconds(remaining);
    setIsRunning(true);

    if (resumedTimer.phase === 'focus') {
      safeStopMusic();
    }

    if (resumedTimer.phase === 'break') {
      safePlayMusic();
    }
  };

  const resetTimer = () => {
    clearTimer();
    safeStopMusic();

    setPhase('idle');
    setIsRunning(false);
    setRemainingSeconds(focusDurationSeconds);
    setActiveDurationSeconds(focusDurationSeconds);
  };

  const startAgain = () => {
    startFocusSession();
  };

  const finishToday = () => {
    clearTimer();
    safeStopMusic();

    setPhase('idle');
    setIsRunning(false);
    setRemainingSeconds(focusDurationSeconds);
    setActiveDurationSeconds(focusDurationSeconds);

    navigate('/notes');
  };

  const forcePlayMusic = () => {
    safePlayMusic();
  };

  const progress = useMemo(() => {
    if (activeDurationSeconds <= 0) {
      return 0;
    }

    return Math.max(
      0,
      Math.min(100, ((activeDurationSeconds - remainingSeconds) / activeDurationSeconds) * 100),
    );
  }, [activeDurationSeconds, remainingSeconds]);

  const statusLabel = useMemo(() => {
    if (phase === 'idle') {
      return 'Siap Fokus';
    }

    if (phase === 'focus') {
      return isRunning ? 'Sedang Fokus' : 'Fokus Dijeda';
    }

    if (phase === 'break') {
      if (remainingSeconds <= 0) {
        return 'Waktu Istirahat';
      }

      return isRunning ? 'Istirahat Berjalan' : 'Istirahat Dijeda';
    }

    return 'Pomodoro';
  }, [phase, isRunning, remainingSeconds]);

  const helperText = useMemo(() => {
    if (phase === 'idle') {
      return 'Tekan mulai, timer akan tetap dihitung pakai jam asli walaupun aplikasi ditutup lalu dibuka lagi.';
    }

    if (phase === 'focus') {
      return 'Timer ini tidak dikurangi manual per detik. Aplikasi menghitung sisa waktu dari jam perangkat, jadi tidak reset saat dibuka ulang.';
    }

    return 'Musik istirahat akan menyala saat sesi fokus selesai. Kalau browser memblokir autoplay, tekan tombol Putar Musik.';
  }, [phase]);

  return (
    <div className="max-w-5xl mx-auto w-full py-6 md:py-10 text-slate-900 dark:text-slate-100">
      <div className="mb-8">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-blue-500 mb-2">
          FocusNote Pomodoro
        </p>

        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white">
          {statusLabel}
        </h1>

        <p className="mt-3 text-slate-600 dark:text-slate-300 font-medium max-w-2xl">
          {helperText}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <section className="rounded-[2rem] p-6 md:p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-brand">
          <div className="flex flex-col items-center justify-center text-center">
            <div
              className="relative w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center mb-8"
              style={{
                background: `conic-gradient(#2563eb ${progress}%, ${
                  phase === 'break' ? '#f97316' : '#e2e8f0'
                } ${progress}%)`,
              }}
            >
              <div className="w-[88%] h-[88%] rounded-full bg-white dark:bg-slate-950 flex flex-col items-center justify-center shadow-inner">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 mb-3">
                  {phase === 'break' ? 'Istirahat' : 'Fokus'}
                </p>

                <div className="text-6xl md:text-7xl font-black tabular-nums text-slate-900 dark:text-white">
                  {formatTime(remainingSeconds)}
                </div>

                <p className="mt-3 text-sm font-bold text-slate-500 dark:text-slate-400">
                  {subject || 'Tanpa Mata Kuliah'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {phase === 'idle' && (
                <button
                  onClick={startFocusSession}
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-200 dark:shadow-none transition-all"
                >
                  <Play size={20} />
                  Mulai Fokus
                </button>
              )}

              {phase !== 'idle' && isRunning && (
                <button
                  onClick={pauseTimer}
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-black transition-all"
                >
                  <Pause size={20} />
                  Pause
                </button>
              )}

              {phase !== 'idle' && !isRunning && phase !== 'break' && (
                <button
                  onClick={resumeTimer}
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-200 dark:shadow-none transition-all"
                >
                  <Play size={20} />
                  Lanjutkan
                </button>
              )}

              {phase === 'break' && (
                <>
                  <button
                    onClick={startAgain}
                    className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-200 dark:shadow-none transition-all"
                  >
                    <Play size={20} />
                    Mulai Lagi
                  </button>

                  <button
                    onClick={forcePlayMusic}
                    className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-orange-100 hover:bg-orange-200 text-orange-700 font-black transition-all"
                  >
                    <Music size={20} />
                    Putar Musik
                  </button>

                  <button
                    onClick={finishToday}
                    className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-black transition-all"
                  >
                    <CheckCircle2 size={20} />
                    Akhiri Hari Ini
                  </button>
                </>
              )}

              {phase !== 'idle' && (
                <button
                  onClick={resetTimer}
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-black transition-all"
                >
                  <RotateCcw size={20} />
                  Reset
                </button>
              )}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-[2rem] p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-brand">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-500">
                <BookOpen size={20} />
              </div>

              <div>
                <h2 className="font-black text-slate-900 dark:text-white">
                  Mata Kuliah
                </h2>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Isi pelajaran yang sedang kamu fokuskan.
                </p>
              </div>
            </div>

            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Contoh: Matematika"
              className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold border-none focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div className="rounded-[2rem] p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-brand">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/50 text-orange-500">
                <Target size={20} />
              </div>

              <div>
                <h2 className="font-black text-slate-900 dark:text-white">
                  Target Sesi Ini
                </h2>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Target ini ikut tersimpan saat timer berjalan.
                </p>
              </div>
            </div>

            <textarea
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="Contoh: Review materi array dan kerjakan 3 soal."
              className="w-full min-h-32 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold border-none focus:ring-2 focus:ring-blue-400 outline-none resize-none"
            />
          </div>

          <div className="rounded-[2rem] p-6 bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none">
            <div className="flex items-center gap-3 mb-3">
              <Coffee size={22} />
              <h2 className="font-black">Catatan Penting</h2>
            </div>

            <p className="text-sm font-semibold leading-relaxed text-blue-50">
              Kalau aplikasi cuma diminimize, timer dan musik biasanya masih bisa lanjut.
              Kalau browser/app ditutup total, web tidak bisa memaksa musik tetap bunyi.
              Tapi timer tetap tidak reset karena dihitung dari jam perangkat.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};
