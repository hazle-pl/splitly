import { NextApiRequest, NextApiResponse } from 'next';
import { connectDatabase } from "@/lib/mongodb";
import Order, { OrderProduct } from "@/models/Order"; // Import Order and OrderProduct
import Product from "@/models/Product"; // No need for Variant import

// Define the interface for formatted products
interface FormattedProduct {
    product_id: string;
    name: string;
    image: string; // Product-level margin
    price: number; // Product-level price
    margin: number; // Product-level margin
    net_profit: number; // Product-level net profit
    product_quantity: number;
    variant_id: string; // Variant-level ID
    variant_name: string; // Variant-level name
    variant_price: number; // Variant-level price
    variant_margin: number; // Variant-level margin
    variant_net_profit: number; // Variant-level net profit
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectDatabase();

        const { shopName } = req.query;

        // Validate the shopName parameter
        if (!shopName || typeof shopName !== 'string') {
            return res.status(400).json({ message: 'Shop name is required and must be a string' });
        }

        // Fetch orders by shopName
        const orders = await Order.find({ shopName });

        // Create Sets to collect unique product IDs from the orders
        const productIds = new Set<string>();

        // Iterate through orders to collect product IDs
        for (const order of orders) {
            if (order.products) {
                order.products.forEach((product: OrderProduct) => {
                    productIds.add(product.product_id);
                });
            }
        }

        // Fetch products that match the collected product IDs
        const products = await Product.find({
            shopName,
            'product.product_id': { $in: Array.from(productIds) }
        });

        // Map products to a structured format including product-level details
        const formattedProducts: FormattedProduct[] = products.flatMap(product =>
            product.product.variants.map((variant: { variant_id: any; name: any; price: any; margin: any; net_profit: any; product_quantity: any; image: any }) => ({
                product_id: product.product.product_id,
                name: product.product.name,
                image: product.product.image,
                price: product.product.price,
                margin: product.product.margin,
                net_profit: product.product.net_profit,
                variant_id: variant.variant_id,
                product_quantity: product.product.product_quantity,
                variant_name: variant.name,
                variant_price: variant.price,
                variant_margin: variant.margin,
                variant_net_profit: variant.net_profit,

            }))
        );

        // Combine orders and their corresponding variants, calculating totals
        const response = orders.map(order => {
            const productMap: Record<string, FormattedProduct> = {};
            let totalOrderPrice = 0;
            let totalOrderNetProfit = 0;

            // Populate the product map with formatted products
            order.products.forEach((orderProduct: OrderProduct) => {
                const product = formattedProducts.find(
                    (formattedProduct) =>
                        formattedProduct.product_id === orderProduct.product_id &&
                        formattedProduct.variant_id === orderProduct.variant_id // Ensure variant_id matches
                );

                if (product) {
                    const netProfit = product.variant_margin > 0 ? product.variant_net_profit : product.net_profit;

                    // Calculate total price and net profit for the order based on quantities
                    totalOrderPrice += product.variant_price * orderProduct.product_quantity; // Price times quantity
                    totalOrderNetProfit += netProfit * orderProduct.product_quantity; // Net profit times quantity

                    // Initialize the product in the map if not already present
                    if (!productMap[orderProduct.product_id]) {
                        productMap[orderProduct.product_id] = {
                            ...product, // Include all product details
                            // Remove variants property since it's not needed
                        };
                    }
                }
            });

            // Calculate discounts
            const discountPercentage = order.totalDiscountPercentage || 0;

            let totalOrderPriceDiscount = totalOrderPrice; // Default to totalOrderPrice
            let totalOrderNetProfitDiscount = totalOrderNetProfit; // Default to totalOrderNetProfit

            if (discountPercentage > 0) {
                totalOrderPriceDiscount = totalOrderPrice - (totalOrderPrice * (discountPercentage / 100));
                totalOrderNetProfitDiscount = totalOrderNetProfit - (totalOrderNetProfit * (discountPercentage / 100));
            }

            return {
                ...order.toObject(),
                total_order_price: parseFloat(totalOrderPriceDiscount.toFixed(2)),
                total_order_net_profit: parseFloat(totalOrderNetProfitDiscount.toFixed(2)),
                products: Object.values(productMap),
            };
        });

        // Respond with the combined data
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching orders and products:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
