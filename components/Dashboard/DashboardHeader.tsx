import React from 'react';
import LanguageSelector from '@/atoms/LanguageSelector';
import Breadcrumb from '@/components/Dashboard/Breadcrumb';
import LogoutButton from '@/atoms/LogoutButton';

const DashboardHeader: React.FC = () => {

  return (
    <header>
      <div className="box">
        <Breadcrumb/>
      </div>
      <div className="box">
        <LogoutButton/>
        <LanguageSelector/>
      </div>
    </header>
  );
};

export default DashboardHeader;
