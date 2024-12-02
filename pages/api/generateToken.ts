import { NextApiRequest, NextApiResponse } from 'next';
import { connectDatabase } from '@/lib/mongodb';
import Shop from '@/models/Shop';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.redirect('/dashboard');
  }

  const { code, shop, state } = req.query;

  if (!code || !shop || !state) {
    return res.redirect('/dashboard');
  }

  try {
    await connectDatabase();

    const existingShop = await Shop.findOne({ shopName: shop, userName: state });
    if (existingShop) {
      return res.redirect('/dashboard?shopExist=true');
    }

    const query = new URLSearchParams({
      client_id: String(process.env.SHOPIFY_API_KEY),
      client_secret: String(process.env.SHOPIFY_API_SECRET),
      code: String(code),
    }).toString();

    const accessTokenUrl = `https://${shop}/admin/oauth/access_token`;

    const response = await fetch(accessTokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: query,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    const accessToken = result.access_token;

    const responseShopDomain = await fetch(`https://${shop}`, {
      method: 'GET',
      redirect: 'follow',
    });

    const shopDomain = new URL(responseShopDomain.url).hostname;

    const newShop = new Shop({ shopName: shop, shopDomain, userName: state, accessToken });
    await newShop.save();

    return res.redirect('/dashboard?addedShop=true');
  } catch (error) {
    console.error('Error obtaining access token:', error);
    return res.redirect('/dashboard');
  }
}
