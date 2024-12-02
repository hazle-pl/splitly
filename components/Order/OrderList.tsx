import React, { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import CustomDropdown from '@/atoms/customDropdown';
import CustomInput from '@/atoms/CustomInput';
import RichText from '@/atoms/RichText';
import useTranslation from '@/lib/useTranslations';  // Importujemy translate

// Definicja interfejsu dla typu 'Order'
interface Order {
  _id: string;
  order_id: string;
  customer_email: string;
  createdAt: string;
  total_order_price: number;
  total_order_net_profit: number;
  order_quantity: number;
  displayFinancialStatus: string;
  products: {
    product_id: string;
    image: string;
    name: string;
    price: number;
    margin: number;
    net_profit: number;
    product_quantity: number;
    variant_id: string;
    variant_name: string;
    variant_price: number;
    variant_margin: number;
    variant_net_profit: number;
  }[];
}

const OrdersList: React.FC<{ shopName: string }> = ({ shopName }) => {
  const { translate } = useTranslation();  // Korzystamy z translate
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ordersPerPage = 10;
  const [searchOrderId, setSearchOrderId] = useState<string>('');
  const [searchEmail, setSearchEmail] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('newest');

  const sortOptions = [
    { value: 'newest', label: translate('orders', 'newest') },
    { value: 'oldest', label: translate('orders', 'oldest') },
    { value: 'highest', label: translate('orders', 'highest_total_price') },
    { value: 'lowest', label: translate('orders', 'lowest_total_price') },
  ];

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/getOrders?shopName=${shopName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.reverse());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [shopName]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

  const filteredOrders = orders
    ? orders.filter(order =>
        order.order_id.includes(searchOrderId) && order.customer_email.includes(searchEmail)
      )
    : [];

  const sortedOrders = filteredOrders.sort((a, b) => {
    switch (sortOrder) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'highest':
        return b.total_order_price - a.total_order_price;
      case 'lowest':
        return a.total_order_price - b.total_order_price;
      default:
        return 0;
    }
  });

  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const nextPage = () => {
    if (currentPage < Math.ceil(sortedOrders.length / ordersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="orders-list">
      {loading ? (
        <div className="skeleton">
          <div className="skeleton-row"></div>
          <div className="skeleton-row"></div>
          <div className="skeleton-row"></div>
        </div>
      ) : orders ? (
        <>
          <RichText>
            <h2>{translate('orders', 'order_list')}</h2>
          </RichText>
          <div className="search-box">
            <div className="search-filters">
              <CustomInput
                label={translate('orders', 'search_by_order_id')}
                name="order_id"
                value={searchOrderId}
                onChange={(e: { target: { value: React.SetStateAction<string> } }) => setSearchOrderId(e.target.value)}
                type="text"
              />
              <CustomInput
                label={translate('orders', 'search_by_email')}
                name="customer_email"
                value={searchEmail}
                onChange={(e: { target: { value: React.SetStateAction<string> } }) => setSearchEmail(e.target.value)}
                type="text"
              />
            </div>
            <div className="sort-filter">
              <CustomDropdown
                label={translate('orders', 'sort_order')}
                name="sortOrder"
                value={sortOrder}
                options={sortOptions}
                onChange={(value: string) => setSortOrder(value)}
              />
            </div>
          </div>

          <div className="orders-table">
            <div className="table-header">
              <div>{translate('orders', 'order_id')}</div>
              <div>{translate('orders', 'customer_email')}</div>
              <div>{translate('orders', 'date')}</div>
              <div>{translate('orders', 'status')}</div>
              <div>{translate('orders', 'quantity')}</div>
              <div>{translate('orders', 'total_price')}</div>
              <div>{translate('orders', 'total_net_profit')}</div>
            </div>
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <Accordion key={order._id}>
                  <AccordionSummary expandIcon={<i className="fa fa-chevron-down" />}>
                    <div className="order-row">
                      <div>{order.order_id}</div>
                      <div>{order.customer_email}</div>
                      <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                      <div><span className={`badge ${order.displayFinancialStatus}`}>{order.displayFinancialStatus || translate('orders', 'unknown')}</span></div>
                      <div>{order.order_quantity}</div>
                      <div>${order.total_order_price}</div>
                      <div>${order.total_order_net_profit}</div>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="products-list">
                      {order.products.map((product) => (
                        <div key={product.product_id} className="product-box">
                          <div className="product-image">
                            <img src={product.image} alt={product.name} />
                          </div>
                          <div className="product-details">
                            <div className="product-attribute">
                              <p><strong>{translate('orders', 'product_name')}</strong></p>
                              <p>{product.name}</p>
                            </div>
                            <div className="product-attribute">
                              <p><strong>{translate('orders', 'price')}</strong></p>
                              <p>${product.price}</p>
                            </div>
                            <div className="product-attribute">
                              <p><strong>{translate('orders', 'margin')}</strong></p>
                              <p>${product.margin}</p>
                            </div>
                            <div className="product-attribute">
                              <p><strong>{translate('orders', 'net_profit')}</strong></p>
                              <p>${product.net_profit}</p>
                            </div>
                            <div className="product-attribute">
                              <p><strong>{translate('orders', 'quantity')}</strong></p>
                              <p>{product.product_quantity}</p>
                            </div>
                            <div className="product-attribute">
                              <p><strong>{translate('orders', 'variant_name')}</strong></p>
                              <p>{product.variant_name}</p>
                            </div>
                            <div className="product-attribute">
                              <p><strong>{translate('orders', 'variant_price')}</strong></p>
                              <p>${product.variant_price}</p>
                            </div>
                            <div className="product-attribute">
                              <p><strong>{translate('orders', 'variant_margin')}</strong></p>
                              <p>${product.variant_margin}</p>
                            </div>
                            <div className="product-attribute">
                              <p><strong>{translate('orders', 'variant_net_profit')}</strong></p>
                              <p>${product.variant_net_profit}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <div>{translate('orders', 'no_orders')}</div>
            )}
          </div>

          <div className="pagination">
            <button onClick={prevPage} disabled={currentPage === 1}>{translate('orders', 'previous')}</button>
            <span>{currentPage}</span>
            <button onClick={nextPage} disabled={currentPage === Math.ceil(sortedOrders.length / ordersPerPage)}>{translate('orders', 'next')}</button>
          </div>
        </>
      ) : (
        <div>{translate('orders', 'no_orders_found')}</div>
      )}
    </div>
  );
};

export default OrdersList;
