import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, Moon, Play, Volume2 } from 'lucide-react';
import { Mood, ThemeColors } from '../types';

interface MoodSelectorProps {
  selectedMood: Mood;
  onMoodChange: (mood: Mood) => void;
  theme: ThemeColors;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onMoodChange, theme }) => {
  const moods = [
    {
      id: 'Focus' as Mood,
      name: 'Focus',
      description: 'Deep work and concentration',
      icon: Brain,
      color: 'from-blue-400 to-cyan-400',
      sounds: ['Rain', 'White Noise', 'Café'],
    },
    {
      id: 'Chill' as Mood,
      name: 'Chill',
      description: 'Relaxation and creativity',
      icon: Heart,
      color: 'from-green-400 to-emerald-400',
      sounds: ['Forest', 'Waves', 'Fan'],
    },
    {
      id: 'Sleep' as Mood,
      name: 'Sleep',
      description: 'Rest and recovery',
      icon: Moon,
      color: 'from-purple-400 to-indigo-400',
      sounds: ['Rain', 'Fireplace', 'Waves'],
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h2 className={`text-3xl font-bold ${theme.text === 'gray-100' ? 'text-gray-100' : 'text-gray-800'}`}>
          What's your mood?
        </h2>
        <p className={`text-lg ${theme.text === 'gray-100' ? 'text-gray-300' : 'text-gray-600'}`}>
          Choose your perfect soundscape for the moment
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {moods.map((mood, index) => (
          <motion.div
            key={mood.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onMoodChange(mood.id)}
            className={`relative p-6 rounded-3xl cursor-pointer transition-all backdrop-blur-sm border border-white/20 shadow-lg ${
              selectedMood === mood.id
                ? `bg-gradient-to-br ${mood.color} text-white shadow-xl`
                : `${theme.card} hover:shadow-xl`
            }`}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className={`p-4 rounded-2xl ${
                selectedMood === mood.id
                  ? 'bg-white/20'
                  : `bg-gradient-to-r ${mood.color}`
              }`}>
                <mood.icon className={`w-8 h-8 ${
                  selectedMood === mood.id ? 'text-white' : 'text-white'
                }`} />
              </div>
              
              <div className="text-center space-y-2">
                <h3 className={`text-xl font-bold ${
                  selectedMood === mood.id
                    ? 'text-white'
                    : theme.text === 'gray-100' ? 'text-gray-100' : 'text-gray-800'
                }`}>
                  {mood.name}
                </h3>
                <p className={`text-sm ${
                  selectedMood === mood.id
                    ? 'text-white/80'
                    : theme.text === 'gray-100' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {mood.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {mood.sounds.map((sound) => (
                  <span
                    key={sound}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedMood === mood.id
                        ? 'bg-white/20 text-white'
                        : theme.text === 'gray-100' 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {sound}
                  </span>
                ))}
              </div>

              {selectedMood === mood.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center space-x-2 mt-4"
                >
                  <div className="flex items-center space-x-1">
                    <Volume2 className="w-4 h-4 text-white" />
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 4 }}
                          animate={{ height: [4, 12, 4] }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                          className="w-1 bg-white/60 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-white/80">Playing</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;