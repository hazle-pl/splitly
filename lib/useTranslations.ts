import { useEffect, useState } from 'react';

const useTranslation = () => {
  const [translations, setTranslations] = useState<any>({});
  const [locale, setLocale] = useState<string>('en');

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const storedLocale = localStorage.getItem('language') || 'en';
        setLocale(storedLocale);

        const response = await fetch('/translations.json');
        const data = await response.json();

        setTranslations(data[storedLocale] || data['en']);
      } catch (error) {
        console.error('Error fetching translations:', error);
        setTranslations({});
      }
    };

    fetchTranslations();
  }, []);

  const translate = (page: string, key: string) => {
    return translations[page]?.[key] || key;
  };

  return { translate };
};

export default useTranslation;
