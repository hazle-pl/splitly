import React from 'react';
import Link from 'next/link';
import useTranslation from '@/lib/useTranslations';
import ContainerContent from './ContentWrapper';
import LanguageSelector from '@/atoms/LanguageSelector';

const Header: React.FC = () => {
  const { translate } = useTranslation();

  return (
    <header>
      <ContainerContent>
        <Link href="/" className="logo">spyshark<span>_</span></Link>
        <div className="header-content">
        <Link className="button transparent" href="/login">{translate('menu', 'signIn')}</Link>
        <Link className="button contrast" href="/register">{translate('menu', 'signUp')}</Link>
        <LanguageSelector/>
        </div>
      </ContainerContent>
    </header>
  );
};

export default Header;
