import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Save, Shuffle, Play, Pause } from 'lucide-react';
import { ThemeColors } from '../types';
import { useAmbientPlayer } from '../hooks/useAmbientPlayer';

interface AmbientMixerProps {
  ambientSounds: Record<string, number>;
  onChange: (sounds: Record<string, number>) => void;
  theme: ThemeColors;
}

const AmbientMixer: React.FC<AmbientMixerProps> = ({ ambientSounds, onChange, theme }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [savedCombinations, setSavedCombinations] = useState<Array<{ name: string; sounds: Record<string, number> }>>([]);
  const ambientPlayer = useAmbientPlayer();

  const soundLibrary = [
    { id: 'rain', name: 'Rain', emoji: '🌧️', color: 'from-blue-400 to-cyan-400' },
    { id: 'cafe', name: 'Café', emoji: '☕', color: 'from-amber-400 to-orange-400' },
    { id: 'forest', name: 'Forest', emoji: '🌲', color: 'from-green-400 to-emerald-400' },
    { id: 'waves', name: 'Waves', emoji: '🌊', color: 'from-cyan-400 to-blue-400' },
    { id: 'fireplace', name: 'Fireplace', emoji: '🔥', color: 'from-red-400 to-orange-400' },
    { id: 'fan', name: 'Fan', emoji: '💨', color: 'from-gray-400 to-slate-400' },
    { id: 'birds', name: 'Birds', emoji: '🐦', color: 'from-yellow-400 to-amber-400' },
    { id: 'whitenoise', name: 'White Noise', emoji: '📻', color: 'from-purple-400 to-indigo-400' },
  ];

  useEffect(() => {
    ambientPlayer.updateAllSounds(ambientSounds);
  }, [ambientSounds]);

  const handleVolumeChange = (soundId: string, volume: number) => {
    const newSounds = { ...ambientSounds, [soundId]: volume };
    onChange(newSounds);
    ambientPlayer.updateSoundVolume(soundId, volume);
  };

  const toggleSound = (soundId: string) => {
    const currentVolume = ambientSounds[soundId] || 0;
    handleVolumeChange(soundId, currentVolume > 0 ? 0 : 0.5);
  };

  const togglePlayAll = () => {
    if (isPlaying) {
      ambientPlayer.stopAllSounds();
    } else {
      ambientPlayer.updateAllSounds(ambientSounds);
    }
    setIsPlaying(!isPlaying);
  };

  const saveCombination = () => {
    const activeSounds = Object.entries(ambientSounds).filter(([_, volume]) => volume > 0);
    if (activeSounds.length === 0) return;

    const name = `Mix ${savedCombinations.length + 1}`;
    const newCombination = { name, sounds: { ...ambientSounds } };
    setSavedCombinations([...savedCombinations, newCombination]);
  };

  const loadCombination = (combination: { name: string; sounds: Record<string, number> }) => {
    onChange(combination.sounds);
  };

  const randomizeMix = () => {
    const newSounds: Record<string, number> = {};
    const numberOfSounds = Math.floor(Math.random() * 4) + 2; // 2-5 sounds
    const shuffledSounds = [...soundLibrary].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < numberOfSounds; i++) {
      const sound = shuffledSounds[i];
      newSounds[sound.id] = Math.random() * 0.8 + 0.2; // 0.2-1.0 volume
    }
    
    onChange(newSounds);
  };

  const activeCount = Object.values(ambientSounds).filter(volume => volume > 0).length;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h2 className={`text-3xl font-bold ${theme.text === 'gray-100' ? 'text-gray-100' : 'text-gray-800'}`}>
          Ambient Mixer
        </h2>
        <p className={`text-lg ${theme.text === 'gray-100' ? 'text-gray-300' : 'text-gray-600'}`}>
          Create your perfect soundscape
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center space-x-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={togglePlayAll}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl backdrop-blur-sm ${theme.card} border border-white/20 shadow-lg`}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">
            {isPlaying ? 'Pause' : 'Play'} ({activeCount})
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={randomizeMix}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl backdrop-blur-sm ${theme.card} border border-white/20 shadow-lg`}
        >
          <Shuffle className="w-4 h-4" />
          <span className="text-sm font-medium">Random</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={saveCombination}
          disabled={activeCount === 0}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl backdrop-blur-sm ${theme.card} border border-white/20 shadow-lg disabled:opacity-50`}
        >
          <Save className="w-4 h-4" />
          <span className="text-sm font-medium">Save</span>
        </motion.button>
      </motion.div>

      {/* Sound Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {soundLibrary.map((sound, index) => {
          const volume = ambientSounds[sound.id] || 0;
          const isActive = volume > 0;

          return (
            <motion.div
              key={sound.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-2xl backdrop-blur-sm border border-white/20 shadow-lg transition-all ${
                isActive
                  ? `bg-gradient-to-br ${sound.color} text-white shadow-xl`
                  : theme.card
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{sound.emoji}</span>
                    <span className={`font-medium ${
                      isActive ? 'text-white' : theme.text === 'gray-100' ? 'text-gray-100' : 'text-gray-800'
                    }`}>
                      {sound.name}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleSound(sound.id)}
                    className={`p-2 rounded-full transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : theme.text === 'gray-100' 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {isActive ? (
                      <Volume2 className="w-4 h-4" />
                    ) : (
                      <VolumeX className="w-4 h-4" />
                    )}
                  </motion.button>
                </div>

                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2"
                  >
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => handleVolumeChange(sound.id, parseFloat(e.target.value))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs opacity-75">
                      <span>0%</span>
                      <span>{Math.round(volume * 100)}%</span>
                      <span>100%</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Saved Combinations */}
      {savedCombinations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h3 className={`text-xl font-bold ${theme.text === 'gray-100' ? 'text-gray-100' : 'text-gray-800'}`}>
            Saved Combinations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedCombinations.map((combination, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => loadCombination(combination)}
                className={`p-4 rounded-xl backdrop-blur-sm ${theme.card} border border-white/20 shadow-lg text-left space-y-2`}
              >
                <div className={`font-medium ${theme.text === 'gray-100' ? 'text-gray-100' : 'text-gray-800'}`}>
                  {combination.name}
                </div>
                <div className="flex space-x-1">
                  {Object.entries(combination.sounds)
                    .filter(([_, volume]) => volume > 0)
                    .map(([soundId, _]) => {
                      const sound = soundLibrary.find(s => s.id === soundId);
                      return sound ? (
                        <span key={soundId} className="text-sm">
                          {sound.emoji}
                        </span>
                      ) : null;
                    })}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AmbientMixer;