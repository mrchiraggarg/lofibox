import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Timer, Settings, Moon, Sun, Coffee, Headphones } from 'lucide-react';
import MoodSelector from './components/MoodSelector';
import AmbientMixer from './components/AmbientMixer';
import PomodoroTimer from './components/PomodoroTimer';
import NowPlaying from './components/NowPlaying';
import SettingsPanel from './components/SettingsPanel';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { AppState, Theme, Mood } from './types';
import { audioTracks } from './data/audioTracks';

function App() {
  const [appState, setAppState] = useLocalStorage<AppState>('lofibox-state', {
    selectedMood: 'Focus',
    theme: 'warm',
    ambientSounds: {},
    pomodoroSettings: {
      workTime: 25,
      breakTime: 5,
      longBreakTime: 15,
      sessionsUntilLongBreak: 4,
    },
    volume: 0.7,
    soundCombinations: [],
  });

  const [currentView, setCurrentView] = useState<'mood' | 'mixer' | 'timer' | 'settings'>('mood');
  const audioPlayer = useAudioPlayer();

  const themes = {
    warm: {
      primary: 'from-orange-400 to-pink-400',
      secondary: 'from-amber-100 to-orange-100',
      accent: 'orange-500',
      background: 'from-orange-50 to-amber-50',
      text: 'gray-800',
      card: 'white/80',
    },
    cool: {
      primary: 'from-blue-400 to-cyan-400',
      secondary: 'from-blue-100 to-cyan-100',
      accent: 'blue-500',
      background: 'from-blue-50 to-cyan-50',
      text: 'gray-800',
      card: 'white/80',
    },
    forest: {
      primary: 'from-green-400 to-emerald-400',
      secondary: 'from-green-100 to-emerald-100',
      accent: 'green-500',
      background: 'from-green-50 to-emerald-50',
      text: 'gray-800',
      card: 'white/80',
    },
    night: {
      primary: 'from-purple-400 to-indigo-400',
      secondary: 'from-purple-900 to-indigo-900',
      accent: 'purple-400',
      background: 'from-gray-900 to-purple-900',
      text: 'gray-100',
      card: 'white/10',
    },
  };

  const currentTheme = themes[appState.theme];

  const updateAppState = (updates: Partial<AppState>) => {
    setAppState(prev => ({ ...prev, ...updates }));
  };

  const handleMoodChange = (mood: Mood) => {
    updateAppState({ selectedMood: mood });
    
    // Load a random track from the selected mood
    const moodTracks = audioTracks[mood];
    if (moodTracks && moodTracks.length > 0) {
      const randomTrack = moodTracks[Math.floor(Math.random() * moodTracks.length)];
      audioPlayer.loadTrack(randomTrack);
    }
  };

  const handleThemeChange = (theme: Theme) => {
    updateAppState({ theme });
  };

  // Sync volume with audio player
  useEffect(() => {
    audioPlayer.changeVolume(appState.volume);
  }, [appState.volume]);

  const navItems = [
    { id: 'mood', icon: Music, label: 'Mood' },
    { id: 'mixer', icon: Headphones, label: 'Mixer' },
    { id: 'timer', icon: Timer, label: 'Timer' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.background} transition-all duration-700`}>
      {/* Hidden audio element */}
      <audio ref={audioPlayer.audioRef} />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 py-6 pb-24"
      >
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-2xl bg-gradient-to-r ${currentTheme.primary} text-white shadow-lg`}
            >
              <Coffee className="w-6 h-6" />
            </motion.div>
            <div>
              <h1 className={`text-2xl font-bold ${currentTheme.text === 'gray-100' ? 'text-gray-100' : 'text-gray-800'}`}>
                LofiBox
              </h1>
              <p className={`text-sm ${currentTheme.text === 'gray-100' ? 'text-gray-300' : 'text-gray-600'}`}>
                Your mindful workspace
              </p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleThemeChange(appState.theme === 'night' ? 'warm' : 'night')}
            className={`p-3 rounded-full backdrop-blur-sm ${currentTheme.card} border border-white/20 shadow-lg`}
          >
            {appState.theme === 'night' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </motion.button>
        </motion.header>

        {/* Navigation */}
        <motion.nav
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-8"
        >
          <div className={`flex space-x-2 p-2 rounded-2xl backdrop-blur-sm ${currentTheme.card} border border-white/20 shadow-lg`}>
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentView(item.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all ${
                  currentView === item.id
                    ? `bg-gradient-to-r ${currentTheme.primary} text-white shadow-lg`
                    : `hover:bg-white/50 ${currentTheme.text === 'gray-100' ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-800'}`
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.nav>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            {currentView === 'mood' && (
              <MoodSelector
                selectedMood={appState.selectedMood}
                onMoodChange={handleMoodChange}
                theme={currentTheme}
              />
            )}
            {currentView === 'mixer' && (
              <AmbientMixer
                ambientSounds={appState.ambientSounds}
                onChange={(sounds) => updateAppState({ ambientSounds: sounds })}
                theme={currentTheme}
              />
            )}
            {currentView === 'timer' && (
              <PomodoroTimer
                settings={appState.pomodoroSettings}
                onSettingsChange={(settings) => updateAppState({ pomodoroSettings: settings })}
                theme={currentTheme}
              />
            )}
            {currentView === 'settings' && (
              <SettingsPanel
                appState={appState}
                onStateChange={updateAppState}
                onThemeChange={handleThemeChange}
                theme={currentTheme}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Now Playing Bar */}
      <AnimatePresence>
        {audioPlayer.currentTrack && (
          <NowPlaying
            audioPlayer={audioPlayer}
            theme={currentTheme}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;