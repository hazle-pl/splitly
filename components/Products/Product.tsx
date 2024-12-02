import React, { useState } from 'react';
import useTranslation from '@/lib/useTranslations';
import Variant from './Variant';

interface VariantType {
  variant_id: number;
  name: string;
  price: number;
  margin: number;
  net_profit: number;
}

interface ProductType {
  product_id: number;
  name: string;
  price: number;
  margin: number;
  net_profit: number;
  variants: VariantType[];
}

interface ProductProps {
  product: ProductType;
}

const Product: React.FC<ProductProps> = ({ product }) => {
  const [editableProduct, setEditableProduct] = useState<ProductType | null>(null);
  const [editableVariantId, setEditableVariantId] = useState<number | null>(null);
  const { translate } = useTranslation(); // Używamy tłumaczeń

  const formatNumber = (value: number | undefined): string => {
    return value !== undefined && !isNaN(value) ? value.toFixed(2) : 'N/A';
  };

  const handleProductMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    if (editableProduct) {
      setEditableProduct(prev => ({
        ...prev!,
        margin: value,
        net_profit: prev!.price - value
      }));
    }
  };

  const handleSaveProduct = async () => {
    if (editableProduct) {
      try {
        const response = await fetch('/api/updateProduct', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: editableProduct.product_id,
            updatedProduct: editableProduct
          })
        });

        const data = await response.json();
        if (response.ok) {
          console.log(data.message);
          setEditableProduct(null);
          setEditableVariantId(null);
        } else {
          console.error('Update failed:', data.message);
        }
      } catch (error) {
        console.error('Error updating product:', error);
      }
    }
  };

  const handleEditProductClick = () => {
    setEditableProduct(product);
    setEditableVariantId(null);
  };

  const handleEditVariantClick = (variantId: number) => {
    setEditableVariantId(variantId);
  };

  const handleVariantChange = (variantId: number, updatedVariant: VariantType) => {
    if (editableProduct) {
      const updatedVariants = editableProduct.variants.map(variant =>
        variant.variant_id === variantId ? updatedVariant : variant
      );
      setEditableProduct({ ...editableProduct, variants: updatedVariants });
    }
  };

  return (
    <>
      <tr>
        <td>{product.product_id}</td>
        <td>{product.name}</td>
        <td>{formatNumber(product.price)}</td>
        <td>
          {editableProduct?.product_id === product.product_id ? (
            <input
              type="number"
              value={editableProduct.margin}
              onChange={handleProductMarginChange}
            />
          ) : (
            formatNumber(product.margin)
          )}
        </td>
        <td>
          {editableProduct?.product_id === product.product_id ? (
            formatNumber(editableProduct.net_profit)
          ) : (
            formatNumber(product.net_profit)
          )}
        </td>
        <td>
          {editableProduct?.product_id === product.product_id ? (
            <button onClick={handleSaveProduct}>{translate('products', 'save_product')}</button>
          ) : (
            <button onClick={handleEditProductClick}>{translate('products', 'edit_product')}</button> 
          )}
        </td>
      </tr>

      {editableProduct?.product_id === product.product_id && (
        <tr>
          <td colSpan={11}>
            <table>
              <thead>
                <tr className="sticky-header">
                  <th>{translate('products', 'variant_id')}</th> {/* Tłumaczenie nagłówka */}
                  <th>{translate('products', 'variant_name')}</th> {/* Tłumaczenie nagłówka */}
                  <th>{translate('products', 'variant_price')}</th> {/* Tłumaczenie nagłówka */}
                  <th>{translate('products', 'variant_margin')}</th> {/* Tłumaczenie nagłówka */}
                  <th>{translate('products', 'variant_net_profit')}</th> {/* Tłumaczenie nagłówka */}
                  <th>{translate('products', 'edit')}</th> {/* Tłumaczenie nagłówka */}
                </tr>
              </thead>
              <tbody>
                {editableProduct.variants.map(variant => (
                  <Variant
                    key={variant.variant_id}
                    variant={variant}
                    editableVariantId={editableVariantId}
                    setEditableVariantId={setEditableVariantId}
                    onVariantChange={handleVariantChange}
                  />
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      )}
    </>
  );
};

export default Product;
