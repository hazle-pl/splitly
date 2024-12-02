import { useEffect, useState } from 'react';
import Product from './Product';
import useTranslation from '@/lib/useTranslations'; // Import funkcji tłumaczenia

interface ProductDocument {
  shopName: string;
  product: ProductType;
}

interface ProductType {
  product_id: number;
  name: string;
  price: number;
  margin: number;
  net_profit: number;
  variants: Variant[];
}

interface Variant {
  variant_id: number;
  name: string;
  price: number;
  margin: number;
  net_profit: number;
}

interface ProductListProps {
  shopName: string;
}

const ProductList: React.FC<ProductListProps> = ({ shopName }) => {
  const [products, setProducts] = useState<ProductDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const { translate } = useTranslation(); // Funkcja tłumaczenia

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/getProducts?shopName=${encodeURIComponent(shopName)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [shopName]);

  return (
    <div className='product-list col-12-lg col-12-md col-12-xs'>
      <table>
        <thead>
          <tr>
            <th>{translate('products', 'product_id')}</th>
            <th>{translate('products', 'name')}</th>
            <th>{translate('products', 'price')}</th>
            <th>{translate('products', 'cogs')}</th>
            <th>{translate('products', 'net_profit')}</th>
            <th>{translate('products', 'edit')}</th>
          </tr>
        </thead>
        <tbody>
          {products.map(({ product }) => (
            <Product key={product.product_id} product={product} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
