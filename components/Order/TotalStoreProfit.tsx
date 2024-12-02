import RichText from '@/atoms/RichText';
import useTranslation from '@/lib/useTranslations';
import React, { useEffect, useState } from 'react';

interface TotalStoreProfitProps {
  shopName: string;
  days: string;
  grid: string;
}

const TotalStoreProfit: React.FC<TotalStoreProfitProps> = ({ shopName, days, grid }) => {
  const [revenue, setRevenue] = useState<number | null>(null);
  const [profit, setProfit] = useState<number | null>(null);
  const [percentage, setPercentage] = useState<number>(0);
  const [status, setStatus] = useState<string>();
  const { translate } = useTranslation();

  const fetchRevenue = async () => {
    const response = await fetch(`/api/getShopTotalProfit?shopName=${shopName}&days=${days}`);
    const data = await response.json();
    setRevenue(data.total_revenue);
    setProfit(data.total_profit);
    setPercentage(data.percentage_change);
    setStatus(data.comparison_status);
  };

  useEffect(() => {
    fetchRevenue();
  }, [shopName, days]);

  const iconClass = status === 'decreased' ? 'fa-solid fa-arrow-down' : 'fa-solid fa-arrow-up';

  return (
    <div className={`revenue-box ${grid}`}>
      {revenue !== null && profit !== null ? (
        <>
          <RichText>
            <p className="title">{translate('orders', days)}</p>
            <p className="revenue">${revenue ? revenue.toFixed(2) : `0`}</p>
            <p className="profit">${profit ? profit.toFixed(2) : `0`}</p>
          </RichText>

          {days !== 'all' && percentage != 0 && percentage &&  (
            <div className="prev-period">
              <span className={status}><i className={iconClass} /> {percentage}%</span>
            </div>
          )}
        </>
      ) : (
        null
      )}
    </div>
  );
};

export default TotalStoreProfit;
