import React from 'react';
import useTranslation from '@/lib/useTranslations';

interface VariantProps {
  variant: {
    variant_id: number;
    name: string;
    price: number;
    margin: number;
    net_profit: number;
  };
  editableVariantId: number | null;
  setEditableVariantId: (variantId: number | null) => void;
  onVariantChange: (variantId: number, updatedVariant: VariantProps['variant']) => void;
}

const Variant: React.FC<VariantProps> = ({ variant, editableVariantId, setEditableVariantId, onVariantChange }) => {
  const { translate } = useTranslation(); // Używamy tłumaczeń

  const formatNumber = (value: number | undefined): string => {
    return value !== undefined ? value.toFixed(2) : 'N/A';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = parseFloat(e.target.value) || 0;
    onVariantChange(variant.variant_id, {
      ...variant,
      [field]: value,
      net_profit: field === 'margin' ? variant.price - value : variant.net_profit,
    });
  };

  const handleSaveVariant = () => {
    setEditableVariantId(null);
  };

  const handleEditVariantClick = () => {
    setEditableVariantId(variant.variant_id);
  };

  return (
    <tr>
      <td>{variant.variant_id}</td>
      <td>{variant.name}</td>
      <td>{formatNumber(variant.price)}</td>
      <td>
        {editableVariantId === variant.variant_id ? (
          <input
            type="number"
            value={variant.margin}
            onChange={(e) => handleInputChange(e, 'margin')}
          />
        ) : (
          formatNumber(variant.margin)
        )}
      </td>
      <td>{formatNumber(variant.net_profit)}</td>
      <td>
        {editableVariantId === variant.variant_id ? (
          <button onClick={handleSaveVariant}>{translate('products', 'save_variant')}</button>
        ) : (
          <button onClick={handleEditVariantClick}>{translate('products', 'edit_variant')}</button>
        )}
      </td>
    </tr>
  );
};

export default Variant;
