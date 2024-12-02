import { Schema, model, models, Document } from 'mongoose';

// Define the interface for product information within an order
export interface OrderProduct {
  product_quantity: number;
  product_id: string;
  variant_id: string;
}

// Define the main interface for the Order document
export interface OrderDocument extends Document {
  shopName: string;
  order_id: string;
  customer_email: string;
  createdAt: string; // Assuming ISO date format; change to Date if necessary
  order_quantity: number;
  displayFinancialStatus: string;
  totalDiscountPercentage?: number; // Optional number
  products: OrderProduct[];
}

// Define the Mongoose schema for the Order model
const orderSchema = new Schema<OrderDocument>({
  shopName: { type: String, required: true },
  order_id: { type: String, required: true, unique: true },
  customer_email: { type: String, required: true },
  displayFinancialStatus: { type: String, required: true },
  createdAt: { type: String, required: true },
  order_quantity: { type: Number, required: true },
  totalDiscountPercentage: { type: Number, required: false },
  products: [
    {
      product_quantity: { type: Number, required: true },
      product_id: { type: String, required: true },
      variant_id: { type: String, required: true },
    },
  ],
});

// Export the Order model or retrieve it if already defined
const Order = models.Order || model<OrderDocument>('Order', orderSchema);

export default Order;
