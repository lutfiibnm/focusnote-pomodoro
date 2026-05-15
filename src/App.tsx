/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HashRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import {
  Home,
  History,
  BarChart2,
  Settings as SettingsIcon,
  Info,
} from 'lucide-react';
import { HomeScreen } from './screens/HomeScreen';
import { PomodoroScreen } from './screens/PomodoroScreen';
import { NotesScreen } from './screens/NotesScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { StatsScreen } from './screens/StatsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { AboutScreen } from './screens/AboutScreen';
import { motion, AnimatePresence } from 'motion/react';
import { StorageService } from './services/storageService';

const App: React.FC = () => {
  React.useEffect(() => {
    const settings = StorageService.getSettings();

    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <Router>
      <div className="flex flex-col md:flex-row h-screen w-full bg-[#F0F4F8] dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 overflow-hidden">
        <nav className="w-full md:w-24 bg-white dark:bg-slate-900 border-t md:border-t-0 md:border-r border-slate-200 dark:border-slate-800 flex flex-row md:flex-col items-center justify-around md:justify-start py-4 md:py-8 md:space-y-10 z-50 order-2 md:order-1">
          <div className="hidden md:flex w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl items-center justify-center shadow-lg shadow-blue-200 dark:shadow-none mb-4 overflow-hidden border border-slate-100 dark:border-slate-700">
            <img
              src="./logo-final.png"
              alt="FocusNote Logo"
              className="w-12 h-12 object-contain rounded-xl"
            />
          </div>

          <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-8 md:flex-1">
            <NavItem to="/" icon={<Home size={24} />} label="Home" />
            <NavItem to="/history" icon={<History size={24} />} label="Riwayat" />
            <NavItem to="/stats" icon={<BarChart2 size={24} />} label="Statistik" />
            <NavItem to="/settings" icon={<SettingsIcon size={24} />} label="Setelan" />
            <NavItem to="/about" icon={<Info size={24} />} label="Tentang" />
          </div>

          <div className="hidden md:block mt-auto">
            <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 overflow-hidden border-2 border-white dark:border-slate-700 shadow-sm flex items-center justify-center">
              <img
                src="./logo.png"
                alt="FocusNote Small Logo"
                className="w-9 h-9 object-contain rounded-full"
              />
            </div>
          </div>
        </nav>

        <main className="flex-1 flex flex-col overflow-y-auto relative order-1 md:order-2">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<PageWrapper><HomeScreen /></PageWrapper>} />
              <Route path="/focus" element={<PageWrapper><PomodoroScreen /></PageWrapper>} />
              <Route path="/notes" element={<PageWrapper><NotesScreen /></PageWrapper>} />
              <Route path="/history" element={<PageWrapper><HistoryScreen /></PageWrapper>} />
              <Route path="/stats" element={<PageWrapper><StatsScreen /></PageWrapper>} />
              <Route path="/settings" element={<PageWrapper><SettingsScreen /></PageWrapper>} />
              <Route path="/about" element={<PageWrapper><AboutScreen /></PageWrapper>} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
};

const NavItem: React.FC<{
  to: string;
  icon: React.ReactNode;
  label: string;
}> = ({ to, icon, label }) => (
  <NavLink
    to={to}
    title={label}
    aria-label={label}
    className={({ isActive }) => `
      p-3 rounded-2xl transition-all duration-300 flex items-center justify-center
      ${
        isActive
          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 shadow-sm border border-blue-100 dark:border-blue-900'
          : 'text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-300'
      }
    `}
  >
    {icon}
  </NavLink>
);

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    className="min-h-full p-6 md:p-10"
  >
    {children}
  </motion.div>
);

export default App;
