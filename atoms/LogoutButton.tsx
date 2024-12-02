import useTranslation from '@/lib/useTranslations';
import router from 'next/router';
import React from 'react';

const LogoutButton: React.FC = () => {

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const { translate } = useTranslation();

  return (
    <button className="primary" onClick={handleLogout}>
      {translate('menu', 'signOut')}
      <i className="fa-solid fa-arrow-right"/>
    </button>
  );
};

export default LogoutButton;
