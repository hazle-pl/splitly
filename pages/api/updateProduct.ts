import { NextApiRequest, NextApiResponse } from 'next';
import { connectDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { productId, updatedProduct } = req.body;

  if (!productId || !updatedProduct) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  try {
    await connectDatabase();

    // Only update product-level fields (exclude variants)
    const result = await Product.updateOne(
      { 'product.product_id': productId },
      {
        $set: {
          'product.margin': updatedProduct.margin,
          'product.net_profit': updatedProduct.net_profit,
          'product.variants': updatedProduct.variants
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
