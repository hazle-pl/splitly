import { AppProps } from 'next/app';
import { useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import '@/styles/main.scss';
import { ToastContainer } from 'react-toastify';
import { UserProvider } from '@/context/userContext';
import HandleShopifyShop from '@/components/ShopifyHandlers/HandleShopifyShop';

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    // Sprawdzanie preferencji trybu ciemnego w localStorage
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []); // Pusty array dependencies powoduje, że kod uruchomi się tylko raz po załadowaniu

  return (
    <>
      <UserProvider>
        <Component {...pageProps} />
        <ToastContainer />
      </UserProvider>
      <HandleShopifyShop />
    </>
  );
};

export default MyApp;
