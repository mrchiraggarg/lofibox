import { useState, useRef, useEffect } from 'react';
import { ambientSounds } from '../data/audioTracks';

export const useAmbientPlayer = () => {
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const [activeSounds, setActiveSounds] = useState<Record<string, number>>({});

  useEffect(() => {
    // Initialize audio elements for each ambient sound
    Object.keys(ambientSounds).forEach(soundId => {
      if (!audioRefs.current[soundId]) {
        const audio = new Audio(ambientSounds[soundId]);
        audio.loop = true;
        audio.volume = 0;
        audioRefs.current[soundId] = audio;
      }
    });

    return () => {
      // Cleanup audio elements
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  const updateSoundVolume = (soundId: string, volume: number) => {
    const audio = audioRefs.current[soundId];
    if (!audio) return;

    const newActiveSounds = { ...activeSounds };

    if (volume > 0) {
      newActiveSounds[soundId] = volume;
      audio.volume = volume;
      
      if (audio.paused) {
        audio.play().catch(console.error);
      }
    } else {
      delete newActiveSounds[soundId];
      audio.pause();
      audio.currentTime = 0;
    }

    setActiveSounds(newActiveSounds);
  };

  const updateAllSounds = (sounds: Record<string, number>) => {
    Object.keys(ambientSounds).forEach(soundId => {
      const volume = sounds[soundId] || 0;
      updateSoundVolume(soundId, volume);
    });
  };

  const stopAllSounds = () => {
    Object.values(audioRefs.current).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    setActiveSounds({});
  };

  return {
    activeSounds,
    updateSoundVolume,
    updateAllSounds,
    stopAllSounds,
  };
};