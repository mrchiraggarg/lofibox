import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Heart, SkipBack, SkipForward } from 'lucide-react';
import { ThemeColors } from '../types';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

interface NowPlayingProps {
  audioPlayer: ReturnType<typeof useAudioPlayer>;
  theme: ThemeColors;
}

const NowPlaying: React.FC<NowPlayingProps> = ({ audioPlayer, theme }) => {
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    currentTrack,
    togglePlayPause,
    seek,
    changeVolume,
    formatTime,
  } = audioPlayer;

  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    seek(newTime);
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40"
    >
      <div className={`backdrop-blur-lg ${theme.card} border-t border-white/20 shadow-2xl`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Track Info */}
            <div className="flex items-center space-x-4 flex-1">
              <motion.div
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 10, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
                className={`w-12 h-12 rounded-full bg-gradient-to-r ${theme.primary} flex items-center justify-center shadow-lg`}
              >
                <div className="w-8 h-8 bg-black/20 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                </div>
              </motion.div>
              
              <div className="flex-1 min-w-0">
                <div className={`font-medium ${theme.text === 'gray-100' ? 'text-gray-100' : 'text-gray-800'} truncate`}>
                  {currentTrack.title}
                </div>
                <div className={`text-sm ${theme.text === 'gray-100' ? 'text-gray-400' : 'text-gray-500'}`}>
                  LofiBox Collection
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-full ${theme.text === 'gray-100' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`}
              >
                <SkipBack className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={togglePlayPause}
                className={`p-3 rounded-full bg-gradient-to-r ${theme.primary} text-white shadow-lg`}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-full ${theme.text === 'gray-100' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`}
              >
                <SkipForward className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Volume Control */}
            <div className="hidden md:flex items-center space-x-3 flex-1 justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-full ${theme.text === 'gray-100' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`}
              >
                <Heart className="w-4 h-4" />
              </motion.button>

              <button
                onClick={() => changeVolume(volume > 0 ? 0 : 0.7)}
                className={`p-2 rounded-full ${theme.text === 'gray-100' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`}
              >
                {volume > 0 ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </button>

              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => changeVolume(parseFloat(e.target.value))}
                  className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className={`text-xs ${theme.text === 'gray-100' ? 'text-gray-400' : 'text-gray-500'} min-w-8`}>
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div 
              className="w-full bg-gray-200 rounded-full h-1 cursor-pointer"
              onClick={handleProgressClick}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
                className={`h-1 rounded-full bg-gradient-to-r ${theme.primary}`}
              />
            </div>
          </div>

          {/* Visualizer */}
          <div className="flex items-center justify-center mt-3 space-x-1">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ height: 2 }}
                animate={{ 
                  height: isPlaying ? [2, Math.random() * 16 + 4, 2] : 2,
                  backgroundColor: isPlaying ? [
                    theme.primary.includes('blue') ? '#3B82F6' : theme.primary.includes('green') ? '#10B981' : '#F59E0B',
                    theme.primary.includes('blue') ? '#06B6D4' : theme.primary.includes('green') ? '#059669' : '#F97316',
                    theme.primary.includes('blue') ? '#3B82F6' : theme.primary.includes('green') ? '#10B981' : '#F59E0B'
                  ] : '#E5E7EB'
                }}
                transition={{
                  duration: 0.5 + Math.random() * 0.5,
                  repeat: isPlaying ? Infinity : 0,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
                className="w-1 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NowPlaying;