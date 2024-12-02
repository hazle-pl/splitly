import { useEffect } from 'react';
import { useRouter } from 'next/router';

const HandleShopifyShop = () => {
  const router = useRouter();

  useEffect(() => {
    const { shop } = router.query;

    if (shop) {
      localStorage.setItem('shopName', shop as string);
      
    }
  }, [router.query]);

  return null;
};

export default HandleShopifyShop;
