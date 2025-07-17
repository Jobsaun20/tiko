import React, { createContext, useContext, useState, useEffect } from "react";
import { es } from "@/locales/es";
import { en } from "@/locales/en";
import { de } from "@/locales/de";
import { fr } from "@/locales/fr";
import { it } from "@/locales/it";

export type Language = "es" | "en" | "de" | "fr" | "it";
type Translations = typeof es;

const AVAILABLE_LANGUAGES: Language[] = ["es", "en", "de", "fr", "it"];

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
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const getInitialLanguage = (): Language => {
    if (typeof window !== "undefined") {
      // 1. Check saved language
      const saved = localStorage.getItem("app-language");
      if (saved && AVAILABLE_LANGUAGES.includes(saved as Language)) {
        return saved as Language;
      }
      // 2. Detect browser language
      const browserLang = navigator.language.split("-")[0];
      if (AVAILABLE_LANGUAGES.includes(browserLang as Language)) {
        return browserLang as Language;
      }
    }
    return "en"; // Default fallback
  };

  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("app-language", language);
    }
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
