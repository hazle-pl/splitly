import React, { useState } from 'react';
import useTranslation from '@/lib/useTranslations';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FetchProductsButtonProps {
  shopName: string;
  accessToken: string;
}

const FetchProductsButton: React.FC<FetchProductsButtonProps> = ({ shopName, accessToken }) => {
  const [loading, setLoading] = useState(false);
  const { translate } = useTranslation();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/shopify/fetchProducts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shopName, accessToken }),
      });
      
      if (response.ok) {
        toast.success(translate('common', 'fetchSuccess'));
      } else {
        toast.error(translate('common', 'fetchError'));
      }
    } catch (error) {
      toast.error(translate('common', 'fetchError'));
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  return (
    <>
      <button className="refetch-btn" onClick={fetchProducts} disabled={loading}>
        {loading ? (
          <i className="fa-solid fa-arrows-rotate rotating-icon" />
        ) : (
          <i className="fa-solid fa-arrows-rotate" />
        )}
      </button>
    </>
  );
};

export default FetchProductsButton;
