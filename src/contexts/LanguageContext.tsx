import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'bn' | 'te' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
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
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome back',
    'dashboard.active_crops': 'Active Crops',
    'dashboard.total_area': 'Total Area',
    'dashboard.active_sensors': 'Active Sensors',
    'dashboard.upcoming_tasks': 'Upcoming Tasks',
    'nav.dashboard': 'Dashboard',
    'nav.crops': 'My Crops',
    'nav.advisory': 'Advisory',
    'nav.weather': 'Weather',
    'nav.sensors': 'Sensors',
    'nav.fieldmap': 'Field Map',
    'nav.merchants': 'Merchants',
    'nav.polls': 'Polls',
    'nav.schemes': 'Gov Schemes',
    'common.select_language': 'Select Language',
    'common.continue': 'Continue',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.loading': 'Loading...',
    'common.signout': 'Sign Out',
    'common.profile': 'Profile',
    'hero.title': 'Smart Crop Advisory',
    'hero.subtitle': 'System',
    'hero.description': 'Revolutionize your farming with AI-powered recommendations, real-time monitoring, and expert guidance for optimal crop yields.',
    'hero.cta': 'Start Free Trial',
    'hero.demo': 'View Demo',
    'features.title': 'Everything You Need for',
    'features.highlight': 'Smart Farming',
    'features.description': 'Comprehensive tools and insights to help you make data-driven decisions',
    'ai.placeholder': 'Ask me about crops, weather, farming tips...',
    'ai.title': 'AI Farm Assistant',
    'ai.greeting': 'Namaste! 🙏 I\'m your AI farming assistant. Ask me anything about crops, weather, soil, or farming techniques!',
  },
  hi: {
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
    'dashboard.title': 'डैशबोर्ड',
    'dashboard.welcome': 'वापसी पर स्वागत है',
    'dashboard.active_crops': 'सक्रिय फसलें',
    'dashboard.total_area': 'कुल क्षेत्र',
    'dashboard.active_sensors': 'सक्रिय सेंसर',
    'dashboard.upcoming_tasks': 'आगामी कार्य',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.crops': 'मेरी फसलें',
    'nav.advisory': 'सलाह',
    'nav.weather': 'मौसम',
    'nav.sensors': 'सेंसर',
    'nav.fieldmap': 'खेत का नक्शा',
    'nav.merchants': 'व्यापारी',
    'nav.polls': 'मतदान',
    'nav.schemes': 'सरकारी योजनाएं',
    'common.select_language': 'भाषा चुनें',
    'common.continue': 'जारी रखें',
    'common.cancel': 'रद्द करें',
    'common.save': 'सेव करें',
    'common.loading': 'लोड हो रहा है...',
    'common.signout': 'साइन आउट',
    'common.profile': 'प्रोफाइल',
    'hero.title': 'स्मार्ट क्रॉप एडवाइजरी',
    'hero.subtitle': 'सिस्टम',
    'hero.description': 'AI-संचालित सिफारिशों, रियल-टाइम मॉनिटरिंग, और विशेषज्ञ मार्गदर्शन के साथ अपनी खेती में क्रांति लाएं।',
    'hero.cta': 'मुफ्त शुरू करें',
    'hero.demo': 'डेमो देखें',
    'features.title': 'स्मार्ट खेती के लिए',
    'features.highlight': 'सब कुछ',
    'features.description': 'डेटा-आधारित निर्णय लेने में मदद करने के लिए व्यापक उपकरण और अंतर्दृष्टि',
    'ai.placeholder': 'फसलों, मौसम, खेती की टिप्स के बारे में पूछें...',
    'ai.title': 'AI कृषि सहायक',
    'ai.greeting': 'नमस्ते! 🙏 मैं आपका AI कृषि सहायक हूं। फसलों, मौसम, मिट्टी, या खेती की तकनीकों के बारे में कुछ भी पूछें!',
  },
  bn: {
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
    'dashboard.title': 'ড্যাশবোর্ড',
    'dashboard.welcome': 'ফিরে আসার জন্য স্বাগতম',
    'dashboard.active_crops': 'সক্রিয় ফসল',
    'dashboard.total_area': 'মোট এলাকা',
    'dashboard.active_sensors': 'সক্রিয় সেন্সর',
    'dashboard.upcoming_tasks': 'আসন্ন কাজ',
    'nav.dashboard': 'ড্যাশবোর্ড',
    'nav.crops': 'আমার ফসল',
    'nav.advisory': 'পরামর্শ',
    'nav.weather': 'আবহাওয়া',
    'nav.sensors': 'সেন্সর',
    'nav.fieldmap': 'মাঠের মানচিত্র',
    'nav.merchants': 'ব্যবসায়ী',
    'nav.polls': 'ভোট',
    'nav.schemes': 'সরকারি প্রকল্প',
    'common.select_language': 'ভাষা নির্বাচন করুন',
    'common.continue': 'অব্যাহত',
    'common.cancel': 'বাতিল',
    'common.save': 'সেভ',
    'common.loading': 'লোড হচ্ছে...',
    'hero.title': 'স্মার্ট ক্রপ অ্যাডভাইজরি',
    'hero.subtitle': 'সিস্টেম',
    'hero.description': 'AI-চালিত সুপারিশ, রিয়েল-টাইম মনিটরিং, এবং বিশেষজ্ঞ নির্দেশনা দিয়ে আপনার চাষে বিপ্লব আনুন।',
    'hero.cta': 'বিনামূল্যে শুরু করুন',
    'hero.demo': 'ডেমো দেখুন',
    'features.title': 'স্মার্ট চাষের জন্য',
    'features.highlight': 'সবকিছু',
    'features.description': 'ডেটা-চালিত সিদ্ধান্ত নিতে সাহায্য করার জন্য ব্যাপক সরঞ্জাম এবং অন্তর্দৃষ্টি',
    'ai.placeholder': 'ফসল, আবহাওয়া, চাষের টিপস সম্পর্কে জিজ্ঞাসা করুন...',
    'ai.title': 'AI কৃষি সহায়ক',
    'ai.greeting': 'নমস্কার! 🙏 আমি আপনার AI কৃষি সহায়ক। ফসল, আবহাওয়া, মাটি, বা চাষ কৌশল সম্পর্কে যেকোনো প্রশ্ন করুন!',
  },
  te: {
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
    'dashboard.title': 'డ్యాష్‌బోర్డ్',
    'dashboard.welcome': 'తిరిగి రావడానికి స్వాగతం',
    'dashboard.active_crops': 'క్రియాశీల పంటలు',
    'dashboard.total_area': 'మొత్తం విస్తీర్ణం',
    'dashboard.active_sensors': 'క్రియాశీల సెన్సార్లు',
    'dashboard.upcoming_tasks': 'రాబోయే పనులు',
    'nav.dashboard': 'డ్యాష్‌బోర్డ్',
    'nav.crops': 'నా పంటలు',
    'nav.advisory': 'సలహా',
    'nav.weather': 'వాతావరణం',
    'nav.sensors': 'సెన్సార్లు',
    'nav.fieldmap': 'పొలం మ్యాప్',
    'nav.merchants': 'వ్యాపారులు',
    'nav.polls': 'పోల్స్',
    'nav.schemes': 'ప్రభుత్వ పథకాలు',
    'common.select_language': 'భాష ఎంచుకోండి',
    'common.continue': 'కొనసాగించు',
    'common.cancel': 'రద్దు చేయి',
    'common.save': 'సేవ్',
    'common.loading': 'లోడ్ అవుతోంది...',
    'hero.title': 'స్మార్ట్ క్రాప్ అడ్వైజరీ',
    'hero.subtitle': 'సిస్టమ్',
    'hero.description': 'AI-ఆధారిత సిఫార్సులు, రియల్-టైమ్ మానిటరింగ్, మరియు నిపుణుల మార్గదర్శకత్వంతో మీ వ్యవసాయంలో విప్లవం తీసుకురండి.',
    'hero.cta': 'ఉచితంగా ప్రారంభించండి',
    'hero.demo': 'డెమో చూడండి',
    'features.title': 'స్మార్ట్ వ్యవసాయానికి',
    'features.highlight': 'అంతా',
    'features.description': 'డేటా-ఆధారిత నిర్ణయాలు తీసుకోవడంలో సహాయపడే సమగ్ర సాధనాలు మరియు అంతర్దృష్టులు',
    'ai.placeholder': 'పంటలు, వాతావరణం, వ్యవసాయ చిట్కాల గురించి అడగండి...',
    'ai.title': 'AI వ్యవసాయ సహాయకుడు',
    'ai.greeting': 'నమస్కారం! 🙏 నేను మీ AI వ్యవసాయ సహాయకుడిని. పంటలు, వాతావరణం, నేల, లేదా వ్యవసాయ పద్ధతుల గురించి ఏదైనా అడగండి!',
  },
  ta: {
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
    'dashboard.title': 'டாஷ்போர்டு',
    'dashboard.welcome': 'மீண்டும் வரவேற்கிறோம்',
    'dashboard.active_crops': 'செயலில் உள்ள பயிர்கள்',
    'dashboard.total_area': 'மொத்த பரப்பு',
    'dashboard.active_sensors': 'செயலில் உள்ள சென்சார்கள்',
    'dashboard.upcoming_tasks': 'வரவிருக்கும் பணிகள்',
    'nav.dashboard': 'டாஷ்போர்டு',
    'nav.crops': 'எனது பயிர்கள்',
    'nav.advisory': 'ஆலோசனை',
    'nav.weather': 'வானிலை',
    'nav.sensors': 'சென்சார்கள்',
    'nav.fieldmap': 'வயல் வரைபடம்',
    'nav.merchants': 'வணிகர்கள்',
    'nav.polls': 'வாக்கெடுப்பு',
    'nav.schemes': 'அரசு திட்டங்கள்',
    'common.select_language': 'மொழி தேர்வு செய்க',
    'common.continue': 'தொடர்க',
    'common.cancel': 'ரத்து செய்',
    'common.save': 'சேமி',
    'common.loading': 'ஏற்றுகிறது...',
    'hero.title': 'ஸ்மார்ட் க்ராப் அட்வைசரி',
    'hero.subtitle': 'சிஸ்டம்',
    'hero.description': 'AI-இயக்கப்படும் பரிந்துரைகள், நிகழ்நேர கண்காணிப்பு, மற்றும் நிபுணர் வழிகாட்டுதலுடன் உங்கள் விவசாயத்தில் புரட்சி செய்யுங்கள்.',
    'hero.cta': 'இலவசமாக தொடங்குங்கள்',
    'hero.demo': 'டெமோ பாருங்கள்',
    'features.title': 'ஸ்மார்ட் விவசாயத்திற்கு',
    'features.highlight': 'எல்லாம்',
    'features.description': 'தரவு அடிப்படையிலான முடிவுகளை எடுக்க உதவும் விரிவான கருவிகள் மற்றும் நுண்ணறிவுகள்',
    'ai.placeholder': 'பயிர்கள், வானிலை, விவசாய குறிப்புகள் பற்றி கேளுங்கள்...',
    'ai.title': 'AI விவசாய உதவியாளர்',
    'ai.greeting': 'வணக்கம்! 🙏 நான் உங்கள் AI விவசாய உதவியாளர். பயிர்கள், வானிலை, மண், அல்லது விவசாய நுட்பங்கள் பற்றி எதையும் கேளுங்கள்!',
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
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app-language');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app-language', lang);
  };

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
