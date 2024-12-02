import { Schema, model, models } from 'mongoose';

const ShopSchema = new Schema({
  shopName: { type: String, required: true },
  shopDomain: { type: String, required: false },
  accessToken: { type: String, required: true },
  userName: { type: String, required: true },
}, { timestamps: true });

const Shop = models.Shop || model('Shop', ShopSchema);

export default Shop;
