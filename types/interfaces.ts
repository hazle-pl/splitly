export interface MoneySet {
    presentmentMoney: {
        amount: string;
    };
}

export interface DiscountAllocation {
    allocatedAmountSet: MoneySet;
}

export interface LineItemNode {
    quantity: number;
    variant: {
        id: string;
        price: string;  // Add the price property here
    };
    product: {
        id: string;
    };
    discountAllocations: DiscountAllocation[];
}

export interface OrderNode {
    id: string;
    createdAt: string;
    email: string;
    displayFinancialStatus: string;
    totalDiscountsSet?: MoneySet; // Optional total discount
    lineItems: {
        edges: {
            node: LineItemNode;
        }[];
    };
}

export interface OrdersResponse {
    orders: {
        pageInfo: {
            hasNextPage: boolean;
            endCursor: string | null;
        };
        nodes: OrderNode[];
    };
}

export interface ProductInfo {
    product_quantity: number;
    product_id: string;
    variant_id: string;
}

export interface OrderResponse {
    shopName: string;
    order_id: string;
    customer_email: string;
    createdAt: string;
    order_quantity: number;
    totalDiscountPercentage: number; // Total discount for the order as percentage
    products: ProductInfo[];
}