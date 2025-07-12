import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Settings, Coffee, CheckCircle, Timer as TimerIcon } from 'lucide-react';
import { PomodoroSettings, ThemeColors } from '../types';

interface PomodoroTimerProps {
  settings: PomodoroSettings;
  onSettingsChange: (settings: PomodoroSettings) => void;
  theme: ThemeColors;
}

type SessionType = 'work' | 'break' | 'longBreak';

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ settings, onSettingsChange, theme }) => {
  const [timeLeft, setTimeLeft] = useState(settings.workTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState<SessionType>('work');
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [tempSettings, setTempSettings] = useState(settings);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const handleSessionComplete = () => {
    setIsActive(false);
    
    if (sessionType === 'work') {
      const newCompletedSessions = completedSessions + 1;
      setCompletedSessions(newCompletedSessions);
      
      if (newCompletedSessions % settings.sessionsUntilLongBreak === 0) {
        setSessionType('longBreak');
        setTimeLeft(settings.longBreakTime * 60);
      } else {
        setSessionType('break');
        setTimeLeft(settings.breakTime * 60);
      }
    } else {
      setSessionType('work');
      setTimeLeft(settings.workTime * 60);
    }
    
    // Play notification sound (browser notification)
    if (Notification.permission === 'granted') {
      new Notification('Pomodoro Session Complete!', {
        body: sessionType === 'work' ? 'Time for a break!' : 'Time to focus!',
        icon: '/favicon.ico'
      });
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
    
    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setSessionType('work');
    setTimeLeft(settings.workTime * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = () => {
    const totalTime = sessionType === 'work' 
      ? settings.workTime * 60 
      : sessionType === 'break' 
        ? settings.breakTime * 60 
        : settings.longBreakTime * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const handleSettingsSubmit = () => {
    onSettingsChange(tempSettings);
    setShowSettings(false);
    resetTimer();
  };

  const sessionConfig = {
    work: {
      title: 'Focus Time',
      subtitle: 'Stay focused and productive',
      icon: Coffee,
      color: 'from-blue-500 to-cyan-500',
    },
    break: {
      title: 'Short Break',
      subtitle: 'Take a breather',
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500',
    },
    longBreak: {
      title: 'Long Break',
      subtitle: 'Well deserved rest',
      icon: CheckCircle,
      color: 'from-purple-500 to-indigo-500',
    },
  };

  const currentSession = sessionConfig[sessionType];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h2 className={`text-3xl font-bold ${theme.text === 'gray-100' ? 'text-gray-100' : 'text-gray-800'}`}>
          Pomodoro Timer
        </h2>
        <p className={`text-lg ${theme.text === 'gray-100' ? 'text-gray-300' : 'text-gray-600'}`}>
          Focus with the Pomodoro Technique
        </p>
      </motion.div>

      {/* Timer Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center"
      >
        <div className={`relative p-8 rounded-3xl backdrop-blur-sm ${theme.card} border border-white/20 shadow-2xl`}>
          <div className="flex flex-col items-center space-y-6">
            {/* Session Type */}
            <div className={`flex items-center space-x-3 px-4 py-2 rounded-xl bg-gradient-to-r ${currentSession.color} text-white shadow-lg`}>
              <currentSession.icon className="w-5 h-5" />
              <div className="text-center">
                <div className="font-semibold text-sm">{currentSession.title}</div>
                <div className="text-xs opacity-90">{currentSession.subtitle}</div>
              </div>
            </div>

            {/* Circular Progress */}
            <div className="relative">
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke={theme.text === 'gray-100' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                  strokeWidth="8"
                />
                <motion.circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke={`url(#gradient-${sessionType})`}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 90}`}
                  strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress() / 100)}`}
                  initial={{ strokeDashoffset: `${2 * Math.PI * 90}` }}
                  animate={{ strokeDashoffset: `${2 * Math.PI * 90 * (1 - progress() / 100)}` }}
                  transition={{ duration: 0.5 }}
                />
                <defs>
                  <linearGradient id={`gradient-${sessionType}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={sessionType === 'work' ? '#3B82F6' : sessionType === 'break' ? '#10B981' : '#8B5CF6'} />
                    <stop offset="100%" stopColor={sessionType === 'work' ? '#06B6D4' : sessionType === 'break' ? '#059669' : '#7C3AED'} />
                  </linearGradient>
                </defs>
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`text-4xl font-bold ${theme.text === 'gray-100' ? 'text-gray-100' : 'text-gray-800'}`}>
                  {formatTime(timeLeft)}
                </div>
                <div className={`text-sm ${theme.text === 'gray-100' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {isActive ? 'Running' : 'Paused'}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTimer}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r ${currentSession.color} text-white shadow-lg font-medium`}
              >
                {isActive ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
                <span>{isActive ? 'Pause' : 'Start'}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetTimer}
                className={`p-3 rounded-xl backdrop-blur-sm ${theme.card} border border-white/20 shadow-lg`}
              >
                <RotateCcw className={`w-5 h-5 ${theme.text === 'gray-100' ? 'text-gray-300' : 'text-gray-600'}`} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSettings(true)}
                className={`p-3 rounded-xl backdrop-blur-sm ${theme.card} border border-white/20 shadow-lg`}
              >
                <Settings className={`w-5 h-5 ${theme.text === 'gray-100' ? 'text-gray-300' : 'text-gray-600'}`} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className={`p-4 rounded-2xl backdrop-blur-sm ${theme.card} border border-white/20 shadow-lg text-center`}>
          <div className={`text-2xl font-bold ${theme.text === 'gray-100' ? 'text-gray-100' : 'text-gray-800'}`}>
            {completedSessions}
          </div>
          <div className={`text-sm ${theme.text === 'gray-100' ? 'text-gray-400' : 'text-gray-500'}`}>
            Completed Sessions
          </div>
        </div>
        
        <div className={`p-4 rounded-2xl backdrop-blur-sm ${theme.card} border border-white/20 shadow-lg text-center`}>
          <div className={`text-2xl font-bold ${theme.text === 'gray-100' ? 'text-gray-100' : 'text-gray-800'}`}>
            {Math.floor(completedSessions / settings.sessionsUntilLongBreak)}
          </div>
          <div className={`text-sm ${theme.text === 'gray-100' ? 'text-gray-400' : 'text-gray-500'}`}>
            Long Breaks
          </div>
        </div>
        
        <div className={`p-4 rounded-2xl backdrop-blur-sm ${theme.card} border border-white/20 shadow-lg text-center`}>
          <div className={`text-2xl font-bold ${theme.text === 'gray-100' ? 'text-gray-100' : 'text-gray-800'}`}>
            {Math.round((completedSessions * settings.workTime) / 60 * 10) / 10}h
          </div>
          <div className={`text-sm ${theme.text === 'gray-100' ? 'text-gray-400' : 'text-gray-500'}`}>
            Focus Time
          </div>
        </div>
      </motion.div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-md p-6 rounded-3xl backdrop-blur-sm ${theme.card} border border-white/20 shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className={`text-xl font-bold ${theme.text === 'gray-100' ? 'text-gray-100' : 'text-gray-800'}`}>
                    Timer Settings
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme.text === 'gray-100' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Work Time (minutes)
                    </label>
                    <input
                      type="number"
                      value={tempSettings.workTime}
                      onChange={(e) => setTempSettings({...tempSettings, workTime: parseInt(e.target.value)})}
                      className={`w-full p-3 rounded-xl border border-white/20 backdrop-blur-sm ${theme.card} ${theme.text === 'gray-100' ? 'text-gray-100' : 'text-gray-800'}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme.text === 'gray-100' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Break Time (minutes)
                    </label>
                    <input
                      type="number"
                      value={tempSettings.breakTime}
                      onChange={(e) => setTempSettings({...tempSettings, breakTime: parseInt(e.target.value)})}
                      className={`w-full p-3 rounded-xl border border-white/20 backdrop-blur-sm ${theme.card} ${theme.text === 'gray-100' ? 'text-gray-100' : 'text-gray-800'}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme.text === 'gray-100' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Long Break Time (minutes)
                    </label>
                    <input
                      type="number"
                      value={tempSettings.longBreakTime}
                      onChange={(e) => setTempSettings({...tempSettings, longBreakTime: parseInt(e.target.value)})}
                      className={`w-full p-3 rounded-xl border border-white/20 backdrop-blur-sm ${theme.card} ${theme.text === 'gray-100' ? 'text-gray-100' : 'text-gray-800'}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme.text === 'gray-100' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Sessions until Long Break
                    </label>
                    <input
                      type="number"
                      value={tempSettings.sessionsUntilLongBreak}
                      onChange={(e) => setTempSettings({...tempSettings, sessionsUntilLongBreak: parseInt(e.target.value)})}
                      className={`w-full p-3 rounded-xl border border-white/20 backdrop-blur-sm ${theme.card} ${theme.text === 'gray-100' ? 'text-gray-100' : 'text-gray-800'}`}
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowSettings(false)}
                    className={`flex-1 py-3 rounded-xl backdrop-blur-sm ${theme.card} border border-white/20 shadow-lg font-medium`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSettingsSubmit}
                    className={`flex-1 py-3 rounded-xl bg-gradient-to-r ${theme.primary} text-white shadow-lg font-medium`}
                  >
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PomodoroTimer;