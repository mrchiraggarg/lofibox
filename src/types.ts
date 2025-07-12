export type Theme = 'warm' | 'cool' | 'forest' | 'night';

export type Mood = 'Focus' | 'Chill' | 'Sleep';

export interface AmbientSound {
  id: string;
  name: string;
  volume: number;
  enabled: boolean;
}

export interface PomodoroSettings {
  workTime: number;
  breakTime: number;
  longBreakTime: number;
  sessionsUntilLongBreak: number;
}

export interface SoundCombination {
  id: string;
  name: string;
  sounds: Record<string, number>;
}

export interface AppState {
  selectedMood: Mood;
  theme: Theme;
  ambientSounds: Record<string, number>;
  pomodoroSettings: PomodoroSettings;
  volume: number;
  soundCombinations: SoundCombination[];
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  card: string;
}