import { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromToken } from '@/lib/auth';
import { connectDatabase } from '@/lib/mongodb';
import Shop from '@/models/Shop';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  try {
    const user = await getUserFromToken(token);

    if (!user) {
      return res.redirect('/');
    }

    await connectDatabase();

    const shops = await Shop.find({ userName: user.username }).exec();

    return res.status(200).json({
      username: user.username,
      plan: user.plan,
      shops: shops.map(shop => ({
        shopName: shop.shopName,
        shopDomain: shop.shopDomain,
        accessToken: shop.accessToken,
      })),
    });
  } catch (error) {
    console.error('Error fetching user or shops:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
