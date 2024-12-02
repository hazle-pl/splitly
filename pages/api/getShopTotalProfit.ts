import { NextApiRequest, NextApiResponse } from 'next';
import { connectDatabase } from "@/lib/mongodb";
import Order, { OrderProduct } from "@/models/Order";
import Product from "@/models/Product";
import { subDays, startOfDay } from 'date-fns'; // Added startOfDay to normalize the date

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectDatabase();

        const { shopName, days } = req.query;

        // Validate the shopName parameter
        if (!shopName || typeof shopName !== 'string') {
            return res.status(400).json({ message: 'Shop name is required and must be a string' });
        }

        // Handle the days parameter (string or string[])
        const validDays = ['1', '7', '30', '90', '180', '360', 'all'];
        const daysParam = Array.isArray(days) ? days[0] : days; // Handle array case

        if (!daysParam || !validDays.includes(daysParam)) {
            return res.status(400).json({ message: 'Invalid days parameter. Allowed values are 1, 7, 30, 90, 180, 360, or all.' });
        }

        // Define the date filter based on the days parameter
        let dateFilter = {};
        if (daysParam !== 'all') {
            const daysAgo = parseInt(daysParam, 10);
            const fromDate = startOfDay(subDays(new Date(), daysAgo)); // Normalize date to the start of the day

            // Ensure that `fromDate` is passed in the correct ISODate format for MongoDB
            dateFilter = { createdAt: { $gte: fromDate.toISOString() } };
        }

        // Fetch orders by shopName and date filter
        const orders = await Order.find({ shopName, ...dateFilter });

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for the given shop and date range.' });
        }

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
        const formattedProducts = products.flatMap(product =>
            product.product.variants.map((variant: { variant_id: any; name: any; price: any; margin: any; net_profit: any; }) => ({
                product_id: product.product.product_id,
                name: product.product.name,
                price: product.product.price,
                margin: product.product.margin,
                net_profit: product.product.net_profit,
                variant_id: variant.variant_id,
                variant_name: variant.name,
                variant_price: variant.price,
                variant_margin: variant.margin,
                variant_net_profit: variant.net_profit,
            }))
        );

        // Initialize total profit and revenue calculations
        let totalProfit = 0;
        let totalRevenue = 0;

        // Calculate total profit and total revenue for the current period
        for (const order of orders) {
            const discountPercentage = order.totalDiscountPercentage || 0; // Get the discount percentage from the order
            let totalOrderPrice = 0; // Initialize total order price for the current order
            let totalOrderNetProfit = 0; // Initialize total order net profit for the current order

            for (const orderProduct of order.products) {
                const product = formattedProducts.find(
                    (formattedProduct) =>
                        formattedProduct.product_id === orderProduct.product_id &&
                        formattedProduct.variant_id === orderProduct.variant_id // Ensure variant_id matches
                );

                if (product) {
                    // Choose variant_net_profit if variant_margin > 0, else use net_profit
                    const netProfit = product.variant_margin > 0 ? product.variant_net_profit : product.net_profit;

                    // Calculate total price and net profit for the order based on quantities
                    const effectivePrice = product.variant_price * orderProduct.product_quantity; // Price times quantity
                    const effectiveNetProfit = netProfit * orderProduct.product_quantity; // Net profit times quantity

                    // Update total order price and net profit for the current order
                    totalOrderPrice += effectivePrice;
                    totalOrderNetProfit += effectiveNetProfit;
                }
            }

            // Calculate discounts
            let totalOrderPriceDiscount = totalOrderPrice; // Default to totalOrderPrice
            let totalOrderNetProfitDiscount = totalOrderNetProfit; // Default to totalOrderNetProfit

            if (discountPercentage > 0) {
                totalOrderPriceDiscount -= totalOrderPrice * (discountPercentage / 100);
                totalOrderNetProfitDiscount -= totalOrderNetProfit * (discountPercentage / 100);
            }

            // Add to total profit and revenue
            totalProfit += totalOrderNetProfitDiscount; // Use discounted net profit
            totalRevenue += totalOrderPriceDiscount; // Use discounted total order price
        }

        // Calculate total profit for the previous period
        const previousDays = (daysParam === 'all') ? 'all' : String(parseInt(daysParam, 10) + 1);
        let previousDateFilter = {};
        if (previousDays !== 'all') {
            const previousDaysAgo = parseInt(previousDays, 10);
            const previousFromDate = startOfDay(subDays(new Date(), previousDaysAgo)); // Normalize to start of the day
            previousDateFilter = { createdAt: { $gte: previousFromDate.toISOString() } };
        }

        // Fetch orders for the previous period
        const previousOrders = await Order.find({ shopName, ...previousDateFilter });

        let previousTotalProfit = 0;

        for (const order of previousOrders) {
            const discountPercentage = order.totalDiscountPercentage || 0; // Get the discount percentage from the order
            let totalOrderPrice = 0; // Initialize total order price for the current order
            let totalOrderNetProfit = 0; // Initialize total order net profit for the current order

            for (const orderProduct of order.products) {
                const product = formattedProducts.find(
                    (formattedProduct) =>
                        formattedProduct.product_id === orderProduct.product_id &&
                        formattedProduct.variant_id === orderProduct.variant_id // Ensure variant_id matches
                );

                if (product) {
                    // Choose variant_net_profit if variant_margin > 0, else use net_profit
                    const netProfit = product.variant_margin > 0 ? product.variant_net_profit : product.net_profit;

                    // Calculate total price and net profit for the order based on quantities
                    const effectiveNetProfit = netProfit * orderProduct.product_quantity; // Net profit times quantity

                    // Update total order net profit for the current order
                    totalOrderNetProfit += effectiveNetProfit;
                }
            }

            // Calculate discounts for previous period
            if (discountPercentage > 0) {
                totalOrderNetProfit -= totalOrderNetProfit * (discountPercentage / 100);
            }

            // Add to previous total profit
            previousTotalProfit += totalOrderNetProfit; // Use discounted net profit
        }

        // Determine the comparison results
        let comparisonStatus = "no change"; // Default to "no change"
        let percentageChange = 0;

        if (previousTotalProfit !== 0) {
            if (totalProfit > previousTotalProfit) {
                comparisonStatus = "increased";
                percentageChange = ((totalProfit - previousTotalProfit) / previousTotalProfit) * 100;
            } else if (totalProfit < previousTotalProfit) {
                comparisonStatus = "decreased";
                percentageChange = ((previousTotalProfit - totalProfit) / previousTotalProfit) * 100;
            }
        } else if (totalProfit !== 0) {
            comparisonStatus = "increased"; // If previous profit is zero but current profit is non-zero, we consider it an increase.
            percentageChange = 100; // Arbitrarily set as 100% increase.
        }

        // Respond with the total profit, total revenue, and comparison results
        return res.status(200).json({
            total_profit: totalProfit,
            total_revenue: totalRevenue,
            comparison_status: comparisonStatus,
            percentage_change: percentageChange.toFixed(2) // Return percentage change as a string with 2 decimal points
        });
    } catch (error) {
        console.error('Error calculating total profit and revenue:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
