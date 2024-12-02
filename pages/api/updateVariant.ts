import { NextApiRequest, NextApiResponse } from 'next';
import { connectDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { productId, variant } = req.body;

  if (!productId || !variant) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  try {
    await connectDatabase();

    const result = await Product.updateOne(
      { 'product.product_id': productId, 'product.variants.variant_id': variant.variant_id },
      {
        $set: {
          'product.variants.$.margin': variant.margin,
          'product.variants.$.net_profit': variant.net_profit,
          'product.variants.$.price': variant.price,
          'product.variants.$.name': variant.name,
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Product or Variant not found' });
    }

    return res.status(200).json({ message: 'Variant updated successfully' });
  } catch (error) {
    console.error('Error updating variant:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
