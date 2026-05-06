
export type Language = 'en' | 'zh' | 'fr' | 'ko' | 'ja' | 'de' | 'it';

export const LANGUAGES: Record<Language, { name: string; native: string; flag: string }> = {
  en: { name: 'English', native: 'English', flag: '🇺🇸' },
  zh: { name: 'Chinese', native: '中文', flag: '🇨🇳' },
  fr: { name: 'French', native: 'Français', flag: '🇫🇷' },
  ko: { name: 'Korean', native: '한국어', flag: '🇰🇷' },
  ja: { name: 'Japanese', native: '日本語', flag: '🇯🇵' },
  de: { name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  it: { name: 'Italian', native: 'Italiano', flag: '🇮🇹' },
};

export type Duration = '1-week' | '2-weeks' | '1-month' | '3-months';

export type Level = 'beginner' | 'intermediate' | 'advanced';

export type Goal = 'ordering-food' | 'transportation' | 'shopping' | 'emergency' | 'socializing';

export interface UserPreferences {
  targetLanguage: Language;
  sourceLanguage: Language;
  duration: Duration;
  level: Level;
  goal: Goal;
  hasOnboarded: boolean;
}

export interface LessonContent {
  title: string;
  phrases: Array<{
    original: string;
    translation: string;
    pronunciation: string;
    explanation: string;
  }>;
}

export interface DayPlan {
  day: number;
  completed: boolean;
  title: string;
}
