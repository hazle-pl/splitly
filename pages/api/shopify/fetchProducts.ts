import { NextApiRequest, NextApiResponse } from 'next';
import { connectDatabase } from '@/lib/mongodb';
import Product, { ProductNode, ProductsResponse, ProductResponse } from '@/models/Product';
import { fetchShopCurrency, convertToUSD } from '@/lib/currencyConverter';

const query = `
  query GetProducts($cursor: String) {
    products(first: 250, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          title
          vendor
          productType
          images(first: 1) {
            edges {
              node {
                src
              }
            }
          }
          variants(first: 100) {
            edges {
              node {
                id
                title
                price
              }
            }
          }
        }
      }
    }
  }
`;

const fetchAllProducts = async (shopName: string, accessToken: string): Promise<ProductNode[]> => {
  let hasNextPage = true;
  let cursor: string | null = null;
  const allProducts: ProductNode[] = [];
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  try {
    while (hasNextPage) {
      const response: Response = await fetch(`https://${shopName}/admin/api/2024-07/graphql.json`, {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { cursor },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData: { data: ProductsResponse } = await response.json();
      const data = responseData.data;

      allProducts.push(...data.products.edges.map(edge => edge.node));

      hasNextPage = data.products.pageInfo.hasNextPage;
      cursor = data.products.pageInfo.endCursor;

      await delay(500);
    }

    return allProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

const transformProductsResponse = async (
    products: ProductNode[],
    shopName: string,
    exchangeRate: number
): Promise<ProductResponse[]> => {
  return Promise.all(
      products.map(async (product) => {
        const convertedVariants = await Promise.all(
            product.variants.edges.map(async (edge) => {
              const priceUSD = parseFloat(edge.node.price) * exchangeRate;
              return {
                variant_id: edge.node.id.replace('gid://shopify/ProductVariant/', ''),
                name: edge.node.title,
                price: parseFloat(priceUSD.toFixed(2)),
                margin: 0,
                net_profit: 0,
              };
            })
        );

        const priceUSD = parseFloat(product.variants.edges[0]?.node.price || '0') * exchangeRate;
        const imageUrl = product.images.edges[0]?.node.src || '';

        return {
          shopName,
          product: {
            product_id: product.id.replace('gid://shopify/Product/', ''),
            name: product.title,
            price: parseFloat(priceUSD.toFixed(2)),
            margin: 0,
            net_profit: parseFloat(priceUSD.toFixed(2)),
            variants: convertedVariants,
            image: imageUrl,
          },
        };
      })
  );
};

const saveProductsToDatabase = async (products: ProductResponse[]) => {
  const savePromises = products.map(async (product) => {
    const existingProduct = await Product.findOne({ shopName: product.shopName, 'product.product_id': product.product.product_id });

    if (!existingProduct) {
      await Product.create(product);
    }
  });

  await Promise.all(savePromises);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { shopName, accessToken } = req.body;

  if (!shopName || !accessToken) {
    return res.status(400).json({ message: 'shopName and accessToken are required' });
  }

  try {
    await connectDatabase();

    const shopCurrency = await fetchShopCurrency(shopName, accessToken);
    const exchangeRate = await convertToUSD(shopCurrency);

    const products = await fetchAllProducts(shopName, accessToken);
    console.log(`Fetched ${products.length} products from Shopify`);

    const transformedProducts = await transformProductsResponse(products, shopName, exchangeRate);

    await saveProductsToDatabase(transformedProducts);

    return res.status(200).json({ message: 'Products fetched and saved successfully' });
  } catch (error) {
    console.error('Error fetching or saving products:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
