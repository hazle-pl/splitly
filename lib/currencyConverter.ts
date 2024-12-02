const SHOP_CURRENCY_QUERY = `
  query {
    shop {
      currencyCode
    }
  }
`;

interface ShopifyShopResponse {
  data: {
    shop: {
      currencyCode: string;
    };
  }

}

export const fetchShopCurrency = async (shopName: string, accessToken: string): Promise<string> => {
  try {
    const response: Response = await fetch(`https://${shopName}/admin/api/2024-07/graphql.json`, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: SHOP_CURRENCY_QUERY }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch shop data: ${response.statusText}`);
    }

    const responseData: ShopifyShopResponse = await response.json();
    const currency = responseData.data.shop.currencyCode
    return currency;
  } catch (error) {
    console.error('Error fetching shop currency:', error);
    throw new Error('Failed to fetch shop currency');
  }
};

interface ExchangeRateResponse {
  rates: {
    [currency: string]: number;
  };
}

export const convertToUSD = async (currency: string): Promise<number> => {
  try {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as ExchangeRateResponse;
    const exchangeRate = data.rates['USD'];
    return exchangeRate;
  } catch (error) {
    console.error('Error converting currency:', error);
    throw new Error('Currency conversion failed');
  }
};
