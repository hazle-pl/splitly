import { useEffect } from 'react';

const CheckLanguage: React.FC = () => {
  useEffect(() => {
    const storedLocale = localStorage.getItem('language');
    
    if (!storedLocale) {
      const userLocale = navigator.language || 'en';
      const [language, region] = userLocale.split('-');
      const countryCode = region ? region.toLowerCase() : language.toLowerCase();
      const supportedLocales = ['en', 'fr', 'de', 'es', 'pl'];
      const localeToUse = supportedLocales.includes(countryCode) ? countryCode : 'en';
      
      localStorage.setItem('language', localeToUse);
    }
  }, []);

  return null;
};

export default CheckLanguage;
