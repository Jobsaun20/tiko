
import React, { createContext, useContext, useState, useEffect } from 'react';
import { es } from '@/locales/es';
import { en } from '@/locales/en';
import { de } from '@/locales/de';
import { fr } from '@/locales/fr';
import { it } from '@/locales/it';

export type Language = 'es' | 'en' | 'de' | 'fr' | 'it';

type Translations = typeof es;

const translations: Record<Language, Translations> = {
  es,
  en,
  de,
  fr,
  it
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get saved language from localStorage
    const saved = localStorage.getItem('app-language');
    if (saved && ['es', 'en', 'de', 'fr', 'it'].includes(saved)) {
      return saved as Language;
    }
    
    // Detect browser language
    const browserLang = navigator.language.split('-')[0];
    if (['es', 'en', 'de', 'fr', 'it'].includes(browserLang)) {
      return browserLang as Language;
    }
    
    // Default to Spanish
    return 'es';
  });

  useEffect(() => {
    localStorage.setItem('app-language', language);
  }, [language]);

  const value = {
    language,
    setLanguage,
    t: translations[language]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
