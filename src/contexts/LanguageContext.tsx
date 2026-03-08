import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, languageOptions, isRTL, getScriptFontFamily } from '@/i18n/languages';
import { translations } from '@/i18n/translations';

export type { Language };
export { languageOptions, isRTL };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
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
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app-language');
    return languageOptions.some((option) => option.code === saved) ? (saved as Language) : 'en';
  });

  // Apply RTL and font family when language changes
  useEffect(() => {
    const html = document.documentElement;
    const rtl = isRTL(language);
    
    // Set direction
    html.dir = rtl ? 'rtl' : 'ltr';
    html.lang = language;
    
    // Set font family for the script
    document.body.style.fontFamily = getScriptFontFamily(language);
    
    // Add/remove RTL class for additional styling
    if (rtl) {
      html.classList.add('rtl');
    } else {
      html.classList.remove('rtl');
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app-language', lang);
  };

  const t = (key: string): string => {
    const translation = translations[language];
    return translation[key] || translations['en'][key] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    isRTL: isRTL(language)
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
