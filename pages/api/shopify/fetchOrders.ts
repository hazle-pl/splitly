import { NextApiRequest, NextApiResponse } from 'next';
import { connectDatabase } from '@/lib/mongodb';
import Order from '@/models/Order';
import { OrderNode, OrdersResponse, OrderResponse } from '@/types/interfaces';

const query = `
  query MyQuery($cursor: String) {
    orders(first: 250, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        createdAt
        email
        displayFinancialStatus
        totalDiscountsSet {
          presentmentMoney {
            amount
            currencyCode
          }
        }
        lineItems(first: 100) {
          edges {
            node {
              quantity
              variant {
                id
                price
              }
              product {
                id
              }
              discountAllocations {
                allocatedAmountSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const fetchAllOrders = async (shopName: string, accessToken: string): Promise<OrderNode[]> => {
    let hasNextPage = true;
    let cursor: string | null = null;
    const allOrders: OrderNode[] = [];
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    try {
        while (hasNextPage) {
            const response = await fetch(`https://${shopName}/admin/api/2023-01/graphql.json`, {
                method: 'POST',
                headers: {
                    'X-Shopify-Access-Token': accessToken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    variables: { cursor },
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData: { data: OrdersResponse } = await response.json();
            const data = responseData.data;

            if (data && data.orders) {
                allOrders.push(...data.orders.nodes);
                hasNextPage = data.orders.pageInfo.hasNextPage;
                cursor = data.orders.pageInfo.endCursor;
            } else {
                console.error("Unexpected response format:", responseData);
                break;
            }

            await delay(500);
        }

        return allOrders;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};
const transformOrdersResponse = (response: OrderNode[], shopName: string): OrderResponse[] =>
    response.map((order) => {
        const totalDiscountAmount = parseFloat(order.totalDiscountsSet?.presentmentMoney.amount || '0');
        const totalOrderQuantity = order.lineItems.edges.reduce((total, edge) => total + edge.node.quantity, 0);

        const totalOrderPrice = order.lineItems.edges.reduce((total, edge) => {
            const price = parseFloat(edge.node.variant.price);
            return total + (price * edge.node.quantity);
        }, 0);

        const totalDiscountPercentage = totalOrderPrice > 0
            ? Math.round((totalDiscountAmount / totalOrderPrice) * 100)
            : 0;

        return {
            shopName,
            order_id: order.id.replace('gid://shopify/Order/', ''),
            customer_email: order.email,
            createdAt: order.createdAt,
            displayFinancialStatus: order.displayFinancialStatus,
            order_quantity: totalOrderQuantity,
            totalDiscountPercentage,
            products: order.lineItems.edges.map((edge) => ({
                product_quantity: edge.node.quantity,
                product_id: edge.node.product.id.replace('gid://shopify/Product/', ''),
                variant_id: edge.node.variant.id.replace('gid://shopify/ProductVariant/', ''),
            })),
        };
    });


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { shopName, accessToken } = req.body;

    if (!shopName || !accessToken) {
        return res.status(400).json({ message: 'shopName and accessToken are required' });
    }

    try {
        await connectDatabase();

        const orders = await fetchAllOrders(shopName, accessToken);
        const transformedOrders = transformOrdersResponse(orders, shopName);

        const newOrders = [];
        const addedOrderIds = [];

        for (const order of transformedOrders) {
            const existingOrder = await Order.findOne({ order_id: order.order_id });
            if (!existingOrder) {
                newOrders.push(order);
                addedOrderIds.push(order.order_id);
            }
        }

        let insertedCount = 0;
        if (newOrders.length > 0) {
            const result = await Order.insertMany(newOrders);
            insertedCount = result.length;
        }

        res.status(200).json({
            message: 'Orders successfully inserted into MongoDB',
            addedCount: insertedCount,
            addedOrderIds: addedOrderIds,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch and store orders' });
    }
};

export default handler;
