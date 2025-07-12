import { AudioTrack } from '../hooks/useAudioPlayer';

// Using publicly accessible lofi tracks and ambient sounds
export const audioTracks: Record<string, AudioTrack[]> = {
  Focus: [
    {
      id: 'focus-1',
      title: 'Deep Focus',
      url: 'https://www.bensound.com/bensound-music/bensound-slowmotion.mp3',
      duration: 180,
    },
    {
      id: 'focus-2',
      title: 'Concentration Flow',
      url: 'https://www.bensound.com/bensound-music/bensound-memories.mp3',
      duration: 240,
    },
  ],
  Chill: [
    {
      id: 'chill-1',
      title: 'Lazy Afternoon',
      url: 'https://www.bensound.com/bensound-music/bensound-sunny.mp3',
      duration: 200,
    },
    {
      id: 'chill-2',
      title: 'Sunset Vibes',
      url: 'https://www.bensound.com/bensound-music/bensound-relaxing.mp3',
      duration: 220,
    },
  ],
  Sleep: [
    {
      id: 'sleep-1',
      title: 'Peaceful Dreams',
      url: 'https://www.bensound.com/bensound-music/bensound-dreams.mp3',
      duration: 300,
    },
    {
      id: 'sleep-2',
      title: 'Night Rain',
      url: 'https://www.bensound.com/bensound-music/bensound-pianomoment.mp3',
      duration: 280,
    },
  ],
};

// Ambient sound URLs with actual ambient audio files
export const ambientSounds: Record<string, string> = {
  rain: 'https://www.soundjay.com/misc/sounds/rain-01.wav',
  cafe: 'https://www.soundjay.com/misc/sounds/coffee-shop-ambience.wav',
  forest: 'https://www.soundjay.com/nature/sounds/forest-birds.wav',
  waves: 'https://www.soundjay.com/nature/sounds/ocean-waves.wav',
  fireplace: 'https://www.soundjay.com/misc/sounds/fireplace-crackling.wav',
  fan: 'https://www.soundjay.com/misc/sounds/fan-noise.wav',
  birds: 'https://www.soundjay.com/nature/sounds/birds-chirping.wav',
  whitenoise: 'https://www.soundjay.com/misc/sounds/white-noise.wav',
};