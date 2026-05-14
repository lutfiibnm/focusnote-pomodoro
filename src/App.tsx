/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HashRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Home, History, BarChart2, Settings as SettingsIcon, Info } from 'lucide-react';
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
      <div className="flex flex-col md:flex-row h-screen w-full bg-[#F0F4F8] font-sans text-slate-800 overflow-hidden">
        {/* Navigation Sidebar / Bottom Bar */}
        <nav className="w-full md:w-24 bg-white border-t md:border-t-0 md:border-r border-slate-200 flex flex-row md:flex-col items-center justify-around md:justify-start py-4 md:py-8 md:space-y-10 z-50 order-2 md:order-1">
          <div className="hidden md:flex w-12 h-12 bg-blue-500 rounded-xl items-center justify-center shadow-lg shadow-blue-200 mb-4">
             <div className="w-7 h-7 text-white font-black flex items-center justify-center">F</div>
          </div>
          
          <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-8 md:flex-1">
            <NavItem to="/" icon={<Home size={24} />} label="Home" />
            <NavItem to="/history" icon={<History size={24} />} label="Riwayat" />
            <NavItem to="/stats" icon={<BarChart2 size={24} />} label="Statistik" />
            <NavItem to="/settings" icon={<SettingsIcon size={24} />} label="Setelan" />
            <NavItem to="/about" icon={<Info size={24} />} label="Tentang" />
          </div>

          <div className="hidden md:block mt-auto">
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
              <div className="w-full h-full bg-gradient-to-br from-blue-300 to-indigo-400"></div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
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

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => (
  <NavLink
    to={to}
    title={label}
    className={({ isActive }) => `
      p-3 rounded-2xl transition-all duration-300 flex items-center justify-center
      ${isActive 
        ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100' 
        : 'text-slate-400 hover:text-blue-500'}
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
