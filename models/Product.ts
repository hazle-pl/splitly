import { Document, Schema, model, models } from 'mongoose';

// Interface for each variant of the product
export interface Variant {
  variant_id: string;
  name: string;
  price: number;
  margin: number;
  net_profit: number;
}

// Interface for the ProductDocument, defining the structure of the product data stored in MongoDB
export interface ProductDocument extends Document {
  shopName: string;
  product: {
    product_id: string;
    name: string;
    price: number;
    margin: number;
    net_profit: number;
    product_quantity: number;
    variants: Variant[];
    image: string; // The single image URL
  };
}

// Schema for each product variant
const VariantSchema = new Schema({
  variant_id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  margin: { type: Number, default: 0 },
  net_profit: { type: Number, default: 0 },
});

// Schema for the product itself
const ProductSchema = new Schema({
  shopName: { type: String, required: true },
  product: {
    product_id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    margin: { type: Number, default: 0 },
    net_profit: { type: Number, default: 0 },
    product_quantity: { type: Number, default: 0 },
    variants: [VariantSchema],
    image: { type: String, required: false }, // Single image URL, required
  },
});

// Check if the model already exists before defining it, to prevent overwrite issues
const Product = models.Product || model<ProductDocument>('Product', ProductSchema);

export default Product;

// Define the interfaces for GraphQL response and transformed data
export interface ImageNode {
  src: string; // URL of the image
}

export interface VariantNode {
  id: string;
  title: string;
  price: string;
}

export interface ProductNode {
  id: string;
  title: string;
  vendor: string;
  productType: string;
  images: {
    edges: { node: ImageNode }[]; // Array with a single image node for the product
  };
  variants: {
    edges: { node: VariantNode }[];
  };
}

export interface ProductsResponse {
  products: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    edges: { node: ProductNode }[];
  };
}

export interface VariantResponse {
  variant_id: string;
  name: string;
  price: number;
  margin: number;
  net_profit: number;
}

export interface ProductResponse {
  shopName: string;
  product: {
    product_id: string;
    name: string;
    price: number;
    margin: number;
    net_profit: number;
    variants: VariantResponse[];
    image: string; // Image URL in the response
  };
}
