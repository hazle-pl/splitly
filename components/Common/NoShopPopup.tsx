import React from 'react';
import Link from 'next/link';
import useTranslation from '@/lib/useTranslations';
import RichText from '@/atoms/RichText';
import LogoutButton from '@/atoms/LogoutButton';

const NoShopPopup: React.FC = () => {
  const { translate } = useTranslation();

  return (
    <div className="no-shop-popup">
        <RichText>
            <p>{translate('common', 'noShopDescription')}</p>
            <div className="buttons">
                <Link className="button contrast" href="https://shopify.com">{translate('common', 'goToShopify')}</Link>
                <LogoutButton/>
            </div>
        </RichText>
    </div>
  );
};

export default NoShopPopup;
