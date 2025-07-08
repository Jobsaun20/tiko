import React, { createContext, useContext, useState, useEffect } from 'react';
import { es } from '@/locales/es';
import { en } from '@/locales/en';
import { de } from '@/locales/de';
import { fr } from '@/locales/fr';
import { it } from '@/locales/it';

// --- Define aquí todos los tipos, incluyendo achievements en los archivos de idioma ---
export type Language = 'es' | 'en' | 'de' | 'fr' | 'it';

type Translations = typeof es;

const translations: Record<Language, Translations> = {
  es,
  en,
  de,
  fr,
  it,
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
    // Obtener idioma guardado
    const saved = typeof window !== "undefined" ? localStorage.getItem('app-language') : null;
    if (saved && ['es', 'en', 'de', 'fr', 'it'].includes(saved)) {
      return saved as Language;
    }
    // Detectar idioma del navegador
    const browserLang = typeof navigator !== "undefined" ? navigator.language.split('-')[0] : '';
    if (['es', 'en', 'de', 'fr', 'it'].includes(browserLang)) {
      return browserLang as Language;
    }
    // Por defecto español
    return 'es';
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem('app-language', language);
    }
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
