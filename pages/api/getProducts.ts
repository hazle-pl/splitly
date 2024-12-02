import { NextApiRequest, NextApiResponse } from 'next';
import { connectDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { shopName } = req.query;

  if (!shopName || typeof shopName !== 'string') {
    return res.status(400).json({ message: 'shopName is required and must be a string' });
  }

  try {
    await connectDatabase();

    const products = await Product.find({ shopName }).exec();

    return res.status(200).json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
