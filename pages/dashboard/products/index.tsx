import { useUser } from '@/context/userContext';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import React from 'react';
import FetchProductsButton from '@/components/Products/fetchProductButton';
import ProductList from '@/components/Products/ProductList';
import RichText from '@/atoms/RichText';
import useTranslation from '@/lib/useTranslations';

export default function Dashboard() {
  const { user } = useUser();
  const [value, setValue] = React.useState('0');
  const { translate } = useTranslation();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    localStorage.setItem('selectedTab', newValue);
  };

  React.useEffect(() => {
    const savedTab = localStorage.getItem('selectedTab');
    if (savedTab) {
      setValue(savedTab);
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="component col-12-lg col-12-md col-12-xs">
        <TabContext value={value}>
          <TabList onChange={handleChange}>
            {user?.shops?.map((shop, index) => (
              <Tab key={shop.shopName} label={shop.shopDomain} value={String(index)} />
            ))}
          </TabList>
          {user?.shops?.map((shop, index) => (
            <TabPanel key={shop.shopName} value={String(index)}>
              <RichText grid="col-11-lg col-11-md col-11-xs">
                  <h1>{translate('products', 'my-products')}</h1>
                </RichText>
                <div className='component right col-1-lg col-1-md col-1-xs'>
                  <FetchProductsButton shopName={shop.shopName} accessToken={shop.accessToken} />
                </div>
                <div className="component col-12-lg col-12-md col-12-xs">
                  <ProductList shopName={shop.shopName} />
                </div>
            </TabPanel>
          ))}
        </TabContext>
      </div>
    </DashboardLayout>
  );
}