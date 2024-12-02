import { useUser } from '@/context/userContext';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const HandleShopifyToken = () => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const shopName = localStorage.getItem('shopName');
    const { query } = router;

    if (query.addedShop === 'true' || query.shopExist === 'true') {
      localStorage.removeItem('shopName');
      const params = new URLSearchParams(window.location.search);
      params.delete('addedShop');
      params.delete('shopExist');
      router.replace({ pathname: router.pathname, query: params.toString() }, undefined, { shallow: true });
      return;
    }

    if (shopName && user?.shops) {
      const shopExists = user.shops.some(shop => shop.shopName === shopName);

      if (!shopExists) {
        const shopifyUrl = `https://${shopName}/admin/oauth/authorize?client_id=ccec348679dae1afa3f90c6e36973add&scope=read_orders,read_customers,read_products&redirect_uri=https://spyshark.vercel.app/api/generateToken&state=${user.username}`;
        router.push(shopifyUrl);
      }
    }
  }, [user, router.query]);

  return null;
};

export default HandleShopifyToken;
