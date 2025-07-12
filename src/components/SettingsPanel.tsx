import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Palette, 
  Volume2, 
  Bell, 
  Download, 
  Upload, 
  Trash2, 
  Sun, 
  Moon, 
  Coffee, 
  Leaf,
  Save,
  RotateCcw,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';
import { AppState, Theme, ThemeColors } from '../types';

interface SettingsPanelProps {
  appState: AppState;
  onStateChange: (updates: Partial<AppState>) => void;
  onThemeChange: (theme: Theme) => void;
  theme: ThemeColors;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  appState, 
  onStateChange, 
  onThemeChange,
  theme 
}) => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportData, setExportData] = useState('');

  const themes = [
    { id: 'warm' as Theme, name: 'Warm', icon: Sun, color: 'from-orange-400 to-pink-400' },
    { id: 'cool' as Theme, name: 'Cool', icon: Coffee, color: 'from-blue-400 to-cyan-400' },
    { id: 'forest' as Theme, name: 'Forest', icon: Leaf, color: 'from-green-400 to-emerald-400' },
    { id: 'night' as Theme, name: 'Night', icon: Moon, color: 'from-purple-400 to-indigo-400' },
  ];

  const handleExportSettings = () => {
    const data = JSON.stringify(appState, null, 2);
    setExportData(data);
    setShowExportModal(true);
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          onStateChange(importedSettings);
        } catch (error) {
          alert('Invalid settings file');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings?')) {
      onStateChange({
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
    }
  };

  const downloadExportData = () => {
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lofibox-settings.json';
    a.click();
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h2 className={`text-3xl font-bold ${theme.text === 'gray-100' ? 'text-gray-100' : 'text-gray-800'}`}>
          Settings
        </h2>
        <p className={`text-lg ${theme.text === 'gray-100' ? 'text-gray-300' : 'text-gray-600'}`}>
          Customize your LofiBox experience
        </p>
      </motion.div>

      <div className="grid gap-6">
        {/* Theme Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-2xl backdrop-blur-sm ${theme.card} border border-white/20 shadow-lg`}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${theme.primary} text-white`}>
              <Palette className="w-5 h-5" />
            </div>
            <h3 className={`text-xl font-bold ${theme.text === 'gray-100' ? 'text-gray-100' : 'text-gray-800'}`}>
              Theme
            </h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {themes.map((themeOption) => (
              <motion.button
                key={themeOption.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onThemeChange(themeOption.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  appState.theme === themeOption.id
                    ? `bg-gradient-to-br ${themeOption.color} text-white border-white/30 shadow-lg`
                    : `backdrop-blur-sm ${theme.card} border-white/20 hover:border-white/30`
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <themeOption.icon className={`w-6 h-6 ${
                    appState.theme === themeOption.id
                      ? 'text-white'
                      : theme.text === 'gray-100' ? 'text-gray-300' : 'text-gray-600'
                  }`} />
                  <span className={`text-sm font-medium ${
                    appState.theme === themeOption.id
                      ? 'text-white'
                      : theme.text === 'gray-100' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {themeOption.name}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Audio Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-2xl backdrop-blur-sm ${theme.card} border border-white/20 shadow-lg`}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${theme.primary} text-white`}>
              <Volume2 className="w-5 h-5" />
            </div>
            <h3 className={`text-xl font-bold ${theme.text === 'gray-100' ? 'text-gray-100' : 'text-gray-800'}`}>
              Audio
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme.text === 'gray-100' ? 'text-gray-300' : 'text-gray-700'}`}>
                Master Volume
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={appState.volume}
                  onChange={(e) => onStateChange({ volume: parseFloat(e.target.value) })}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className={`text-sm ${theme.text === 'gray-100' ? 'text-gray-400' : 'text-gray-500'} min-w-12`}>
                  {Math.round(appState.volume * 100)}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-6 rounded-2xl backdrop-blur-sm ${theme.card} border border-white/20 shadow-lg`}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${theme.primary} text-white`}>
              <Bell className="w-5 h-5" />
            </div>
            <h3 className={`text-xl font-bold ${theme.text === 'gray-100' ? 'text-gray-100' : 'text-gray-800'}`}>
              Notifications
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`${theme.text === 'gray-100' ? 'text-gray-300' : 'text-gray-700'}`}>
                Browser Notifications
              </span>
              <button
                onClick={() => Notification.requestPermission()}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  Notification.permission === 'granted'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                {Notification.permission === 'granted' ? 'Enabled' : 'Enable'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`p-6 rounded-2xl backdrop-blur-sm ${theme.card} border border-white/20 shadow-lg`}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${theme.primary} text-white`}>
              <Save className="w-5 h-5" />
            </div>
            <h3 className={`text-xl font-bold ${theme.text === 'gray-100' ? 'text-gray-100' : 'text-gray-800'}`}>
              Data Management
            </h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExportSettings}
                className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg backdrop-blur-sm ${theme.card} border border-white/20 shadow-lg hover:shadow-xl transition-shadow`}
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export Settings</span>
              </motion.button>

              <motion.label
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg backdrop-blur-sm ${theme.card} border border-white/20 shadow-lg hover:shadow-xl transition-shadow cursor-pointer`}
              >
                <Upload className="w-4 h-4" />
                <span className="text-sm font-medium">Import Settings</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportSettings}
                  className="hidden"
                />
              </motion.label>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleResetSettings}
                className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors`}
              >
                <RotateCcw className="w-4 h-4" />
                <span className="text-sm font-medium">Reset All</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`p-6 rounded-2xl backdrop-blur-sm ${theme.card} border border-white/20 shadow-lg`}
        >
          <div className="text-center space-y-2">
            <div className={`text-2xl font-bold ${theme.text === 'gray-100' ? 'text-gray-100' : 'text-gray-800'}`}>
              LofiBox
            </div>
            <div className={`text-sm ${theme.text === 'gray-100' ? 'text-gray-400' : 'text-gray-500'}`}>
              Version 1.0.0
            </div>
            <div className={`text-sm ${theme.text === 'gray-100' ? 'text-gray-400' : 'text-gray-500'}`}>
              Your mindful workspace for focus and relaxation
            </div>
          </div>
        </motion.div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowExportModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`w-full max-w-2xl p-6 rounded-3xl backdrop-blur-sm ${theme.card} border border-white/20 shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <h3 className={`text-xl font-bold ${theme.text === 'gray-100' ? 'text-gray-100' : 'text-gray-800'}`}>
                Export Settings
              </h3>
              
              <textarea
                value={exportData}
                readOnly
                className={`w-full h-64 p-4 rounded-xl border border-white/20 backdrop-blur-sm ${theme.card} ${theme.text === 'gray-100' ? 'text-gray-100' : 'text-gray-800'} font-mono text-sm`}
              />
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowExportModal(false)}
                  className={`flex-1 py-3 rounded-xl backdrop-blur-sm ${theme.card} border border-white/20 shadow-lg font-medium`}
                >
                  Close
                </button>
                <button
                  onClick={downloadExportData}
                  className={`flex-1 py-3 rounded-xl bg-gradient-to-r ${theme.primary} text-white shadow-lg font-medium`}
                >
                  Download
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default SettingsPanel;