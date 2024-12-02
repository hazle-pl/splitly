import { useEffect, useState } from 'react';
import { useUser } from '@/context/userContext';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import useTranslation from '@/lib/useTranslations';

export default function Dashboard() {
  const { user } = useUser();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const { translate } = useTranslation();

  // Sprawdzanie ustawienia w localStorage i ustawianie trybu ciemnego na podstawie tego
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setIsDarkMode(savedMode === 'true');
    }
  }, []);

  // Zmieniamy tryb ciemny oraz zapisujemy w localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  // Funkcja zmieniająca tryb ciemny
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <DashboardLayout>
      <div className='component component1 col-4-lg col-6-md col-12-xs'>
        <button onClick={toggleDarkMode}>
          {isDarkMode 
            ? translate('settings', 'switch_to_light_mode') 
            : translate('settings', 'switch_to_dark_mode')}
        </button>
      </div>
    </DashboardLayout>
  );
}
