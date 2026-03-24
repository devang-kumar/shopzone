import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import './OrdersPage.css';

const STATUS_COLORS = {
  Processing: 'badge-warning',
  Shipped: 'badge-info',
  Delivered: 'badge-success',
  Cancelled: 'badge-danger',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/mine').then((r) => setOrders(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  return (
    <div className="orders-page container">
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card card">
              <div className="order-header">
                <div>
                  <p className="order-id">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`badge ${STATUS_COLORS[order.status]}`}>{order.status}</span>
              </div>
              <div className="order-items-preview">
                {order.items.slice(0, 3).map((item, i) => (
                  <img key={i} src={item.image} alt={item.name} title={item.name} />
                ))}
                {order.items.length > 3 && <span>+{order.items.length - 3} more</span>}
              </div>
              <div className="order-footer">
                <span className="order-total">${order.totalPrice.toFixed(2)}</span>
                <Link to={`/orders/${order._id}`} className="btn btn-outline btn-sm">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
