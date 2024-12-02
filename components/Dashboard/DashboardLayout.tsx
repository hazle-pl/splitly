import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardHeader from './DashboardHeader';
import DashboardMenu from './DashboardMenu';
import { useUser } from '@/context/userContext';
import HandleShopifyToken from '../ShopifyHandlers/HandleShopifyToken';

interface LayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  const { user, loading } = useUser();
  const [showOverlay, setShowOverlay] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/');
      } else {
        const timer = setTimeout(() => setShowOverlay(false), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [loading, user, router]);

  return (
    <div className="dashboard">
      <DashboardMenu />
      <main>
        <DashboardHeader />
        <div className="dashboard-content">{children}</div>
      </main>
      <HandleShopifyToken />

      {showOverlay && (
        <div className="overlay">
          <div className="white-bg" />
          <div className="overlay-animation" />
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
