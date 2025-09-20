import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'bn' | 'te' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Authentication
    'auth.welcome': 'Welcome to Smart Crop Advisory',
    'auth.signin_farmer': 'Sign in as Farmer',
    'auth.signin_merchant': 'Sign in as Merchant',
    'auth.signin_expert': 'Sign in as Expert',
    'auth.signin_admin': 'Sign in as Admin',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.signin': 'Sign In',
    'auth.signup': 'Create Account',
    'auth.fullname': 'Full Name',
    'auth.role': 'Role',
    'auth.phone': 'Phone Number',
    'auth.location': 'Location',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome back',
    'dashboard.active_crops': 'Active Crops',
    'dashboard.total_area': 'Total Area',
    'dashboard.active_sensors': 'Active Sensors',
    'dashboard.upcoming_tasks': 'Upcoming Tasks',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.crops': 'My Crops',
    'nav.advisory': 'Advisory',
    'nav.weather': 'Weather',
    'nav.sensors': 'Sensors',
    'nav.fieldmap': 'Field Map',
    'nav.merchants': 'Merchants',
    'nav.polls': 'Polls',
    'nav.schemes': 'Gov Schemes',
    
    // Common
    'common.select_language': 'Select Language',
    'common.continue': 'Continue',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.loading': 'Loading...',
  },
  hi: {
    // Authentication
    'auth.welcome': 'स्मार्ट क्रॉप एडवाइजरी में आपका स्वागत है',
    'auth.signin_farmer': 'किसान के रूप में साइन इन करें',
    'auth.signin_merchant': 'व्यापारी के रूप में साइन इन करें',
    'auth.signin_expert': 'विशेषज्ञ के रूप में साइन इन करें',
    'auth.signin_admin': 'प्रशासक के रूप में साइन इन करें',
    'auth.email': 'ईमेल',
    'auth.password': 'पासवर्ड',
    'auth.signin': 'साइन इन करें',
    'auth.signup': 'खाता बनाएं',
    'auth.fullname': 'पूरा नाम',
    'auth.role': 'भूमिका',
    'auth.phone': 'फोन नंबर',
    'auth.location': 'स्थान',
    
    // Dashboard
    'dashboard.title': 'डैशबोर्ड',
    'dashboard.welcome': 'वापसी पर स्वागत है',
    'dashboard.active_crops': 'सक्रिय फसलें',
    'dashboard.total_area': 'कुल क्षेत्र',
    'dashboard.active_sensors': 'सक्रिय सेंसर',
    'dashboard.upcoming_tasks': 'आगामी कार्य',
    
    // Navigation
    'nav.dashboard': 'डैशबोर्ड',
    'nav.crops': 'मेरी फसलें',
    'nav.advisory': 'सलाह',
    'nav.weather': 'मौसम',
    'nav.sensors': 'सेंसर',
    'nav.fieldmap': 'खेत का नक्शा',
    'nav.merchants': 'व्यापारी',
    'nav.polls': 'मतदान',
    'nav.schemes': 'सरकारी योजनाएं',
    
    // Common
    'common.select_language': 'भाषा चुनें',
    'common.continue': 'जारी रखें',
    'common.cancel': 'रद्द करें',
    'common.save': 'सेव करें',
    'common.loading': 'लोड हो रहा है...',
  },
  bn: {
    // Authentication
    'auth.welcome': 'স্মার্ট ক্রপ অ্যাডভাইজরিতে স্বাগতম',
    'auth.signin_farmer': 'কৃষক হিসেবে সাইন ইন করুন',
    'auth.signin_merchant': 'ব্যবসায়ী হিসেবে সাইন ইন করুন',
    'auth.signin_expert': 'বিশেষজ্ঞ হিসেবে সাইন ইন করুন',
    'auth.signin_admin': 'প্রশাসক হিসেবে সাইন ইন করুন',
    'auth.email': 'ইমেইল',
    'auth.password': 'পাসওয়ার্ড',
    'auth.signin': 'সাইন ইন',
    'auth.signup': 'অ্যাকাউন্ট তৈরি করুন',
    'auth.fullname': 'পূর্ণ নাম',
    'auth.role': 'ভূমিকা',
    'auth.phone': 'ফোন নম্বর',
    'auth.location': 'অবস্থান',
    
    // Dashboard
    'dashboard.title': 'ড্যাশবোর্ড',
    'dashboard.welcome': 'ফিরে আসার জন্য স্বাগতম',
    'dashboard.active_crops': 'সক্রিয় ফসল',
    'dashboard.total_area': 'মোট এলাকা',
    'dashboard.active_sensors': 'সক্রিয় সেন্সর',
    'dashboard.upcoming_tasks': 'আসন্ন কাজ',
    
    // Navigation
    'nav.dashboard': 'ড্যাশবোর্ড',
    'nav.crops': 'আমার ফসল',
    'nav.advisory': 'পরামর্শ',
    'nav.weather': 'আবহাওয়া',
    'nav.sensors': 'সেন্সর',
    'nav.fieldmap': 'মাঠের মানচিত্র',
    'nav.merchants': 'ব্যবসায়ী',
    'nav.polls': 'ভোট',
    'nav.schemes': 'সরকারি প্রকল্প',
    
    // Common
    'common.select_language': 'ভাষা নির্বাচন করুন',
    'common.continue': 'অব্যাহত',
    'common.cancel': 'বাতিল',
    'common.save': 'সেভ',
    'common.loading': 'লোড হচ্ছে...',
  },
  te: {
    // Authentication
    'auth.welcome': 'స్మార్ట్ క్రాప్ అడ్వైజరీకి స్వాగతం',
    'auth.signin_farmer': 'రైతుగా సైన్ ఇన్ చేయండి',
    'auth.signin_merchant': 'వ్యాపారిగా సైన్ ఇన్ చేయండి',
    'auth.signin_expert': 'నిపుణుడిగా సైన్ ఇన్ చేయండి',
    'auth.signin_admin': 'నిర్వాహకుడిగా సైన్ ఇన్ చేయండి',
    'auth.email': 'ఇమెయిల్',
    'auth.password': 'పాస్‌వర్డ్',
    'auth.signin': 'సైన్ ఇన్',
    'auth.signup': 'ఖాతా సృష్టించండి',
    'auth.fullname': 'పూర్తి పేరు',
    'auth.role': 'పాత్ర',
    'auth.phone': 'ఫోన్ నంబర్',
    'auth.location': 'స్థానం',
    
    // Dashboard
    'dashboard.title': 'డ్యాష్‌బోర్డ్',
    'dashboard.welcome': 'తిరిగి రావడానికి స్వాగతం',
    'dashboard.active_crops': 'క్రియాశీల పంటలు',
    'dashboard.total_area': 'మొత్తం విస్తీర్ణం',
    'dashboard.active_sensors': 'క్రియాశీల సెన్సార్లు',
    'dashboard.upcoming_tasks': 'రాబోయే పనులు',
    
    // Navigation
    'nav.dashboard': 'డ్యాష్‌బోర్డ్',
    'nav.crops': 'నా పంటలు',
    'nav.advisory': 'సలహా',
    'nav.weather': 'వాతావరణం',
    'nav.sensors': 'సెన్సార్లు',
    'nav.fieldmap': 'పొలం మ్యాప్',
    'nav.merchants': 'వ్యాపారులు',
    'nav.polls': 'పోల్స్',
    'nav.schemes': 'ప్రభుత్వ పథకాలు',
    
    // Common
    'common.select_language': 'భాష ఎంచుకోండి',
    'common.continue': 'కొనసాగించు',
    'common.cancel': 'రద్దు చేయి',
    'common.save': 'సేవ్',
    'common.loading': 'లోడ్ అవుతోంది...',
  },
  ta: {
    // Authentication
    'auth.welcome': 'ஸ்மார்ட் க்ராப் அட்வைசரிக்கு வரவேற்கிறோம்',
    'auth.signin_farmer': 'விவசாயியாக உள்நுழைக',
    'auth.signin_merchant': 'வணிகராக உள்நுழைக',
    'auth.signin_expert': 'நிபுணராக உள்நுழைக',
    'auth.signin_admin': 'நிர்வாகியாக உள்நுழைக',
    'auth.email': 'மின்னஞ்சல்',
    'auth.password': 'கடவுச்சொல்',
    'auth.signin': 'உள்நுழைக',
    'auth.signup': 'கணக்கு உருவாக்க',
    'auth.fullname': 'முழு பெயர்',
    'auth.role': 'பங்கு',
    'auth.phone': 'தொலைபேசி எண்',
    'auth.location': 'இடம்',
    
    // Dashboard
    'dashboard.title': 'டாஷ்போர்டு',
    'dashboard.welcome': 'மீண்டும் வரவேற்கிறோம்',
    'dashboard.active_crops': 'செயலில் உள்ள பயிர்கள்',
    'dashboard.total_area': 'மொத்த பரப்பு',
    'dashboard.active_sensors': 'செயலில் உள்ள சென்சார்கள்',
    'dashboard.upcoming_tasks': 'வரவிருக்கும் பணிகள்',
    
    // Navigation
    'nav.dashboard': 'டாஷ்போர்டு',
    'nav.crops': 'எனது பயிர்கள்',
    'nav.advisory': 'ஆலோசனை',
    'nav.weather': 'வானிலை',
    'nav.sensors': 'சென்சார்கள்',
    'nav.fieldmap': 'வயல் வரைபடம்',
    'nav.merchants': 'வணிகர்கள்',
    'nav.polls': 'வாக்கெடுப்பு',
    'nav.schemes': 'அரசு திட்டங்கள்',
    
    // Common
    'common.select_language': 'மொழி தேர்வு செய்க',
    'common.continue': 'தொடர்க',
    'common.cancel': 'ரத்து செய்',
    'common.save': 'சேமி',
    'common.loading': 'ஏற்றுகிறது...',
  },
};

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
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    const translation = translations[language];
    return (translation as any)[key] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};