import { createContext } from 'react';
import type { Language } from './language';

export type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
};

export const LanguageContext = createContext<LanguageContextValue | null>(null);
