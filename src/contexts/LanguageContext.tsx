import React, { createContext, useContext, useState, useEffect } from 'react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

interface LanguageContextType {
  currentLanguage: Language;
  supportedLanguages: Language[];
  changeLanguage: (languageCode: string) => void;
  translate: (key: string, fallback?: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const supportedLanguages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', flag: '🇸🇮' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti', flag: '🇪🇪' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', flag: '🇱🇻' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', flag: '🇱🇹' },
  { code: 'mt', name: 'Maltese', nativeName: 'Malti', flag: '🇲🇹' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'tl', name: 'Filipino', nativeName: 'Filipino', flag: '🇵🇭' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', rtl: true },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', rtl: true },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', rtl: true },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳' }
];

// Translations object (in real app, this would be loaded from external files)
const translations: Record<string, Record<string, string>> = {
  en: {
    'app.title': 'MindCare',
    'app.subtitle': 'AI Mental Health Assistant',
    'dashboard.title': 'Dashboard',
    'mood.title': 'Mood Tracker',
    'art.title': 'Art Therapy',
    'chat.title': 'TicTac Chat',
    'companion.title': 'AI Companion',
    'profile.title': 'Profile',
    'subscription.title': 'Subscription',
    'voice.listening': 'Listening...',
    'voice.speak': 'Speak to me',
    'mood.how_feeling': 'How are you feeling today?',
    'crisis.support': 'Crisis Support',
    'emergency.help': 'Emergency Help Available'
  },
  hi: {
    'app.title': 'मानसिक स्वास्थ्य सहायक',
    'app.subtitle': 'AI मानसिक स्वास्थ्य सहायक',
    'dashboard.title': 'डैशबोर्ड',
    'mood.title': 'मूड ट्रैकर',
    'art.title': 'कला चिकित्सा',
    'chat.title': 'टिकटैक चैट',
    'companion.title': 'AI साथी',
    'profile.title': 'प्रोफ़ाइल',
    'subscription.title': 'सदस्यता',
    'voice.listening': 'सुन रहा हूँ...',
    'voice.speak': 'मुझसे बात करें',
    'mood.how_feeling': 'आज आप कैसा महसूस कर रहे हैं?',
    'crisis.support': 'संकट सहायता',
    'emergency.help': 'आपातकालीन सहायता उपलब्ध'
  },
  es: {
    'app.title': 'CuidadoMental',
    'app.subtitle': 'Asistente de Salud Mental IA',
    'dashboard.title': 'Panel',
    'mood.title': 'Seguimiento del Estado de Ánimo',
    'art.title': 'Terapia de Arte',
    'chat.title': 'Chat TicTac',
    'companion.title': 'Compañero IA',
    'profile.title': 'Perfil',
    'subscription.title': 'Suscripción',
    'voice.listening': 'Escuchando...',
    'voice.speak': 'Háblame',
    'mood.how_feeling': '¿Cómo te sientes hoy?',
    'crisis.support': 'Apoyo en Crisis',
    'emergency.help': 'Ayuda de Emergencia Disponible'
  }
  // Add more languages as needed
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(supportedLanguages[0]);

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('preferred_language');
    if (savedLanguage) {
      const language = supportedLanguages.find(lang => lang.code === savedLanguage);
      if (language) {
        setCurrentLanguage(language);
      }
    } else {
      // Auto-detect browser language
      const browserLang = navigator.language.split('-')[0];
      const detectedLanguage = supportedLanguages.find(lang => lang.code === browserLang);
      if (detectedLanguage) {
        setCurrentLanguage(detectedLanguage);
      }
    }
  }, []);

  const changeLanguage = (languageCode: string) => {
    const language = supportedLanguages.find(lang => lang.code === languageCode);
    if (language) {
      setCurrentLanguage(language);
      localStorage.setItem('preferred_language', languageCode);
      
      // Update document direction for RTL languages
      document.documentElement.dir = language.rtl ? 'rtl' : 'ltr';
      document.documentElement.lang = languageCode;
    }
  };

  const translate = (key: string, fallback?: string): string => {
    const languageTranslations = translations[currentLanguage.code] || translations.en;
    return languageTranslations[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      supportedLanguages,
      changeLanguage,
      translate,
      isRTL: currentLanguage.rtl || false
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}