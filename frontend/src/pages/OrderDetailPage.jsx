import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import './OrderDetailPage.css';

const STATUS_STEPS = ['Processing', 'Shipped', 'Delivered'];

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`).then((r) => setOrder(r.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner" />;
  if (!order) return <div className="container" style={{ padding: '2rem' }}>Order not found.</div>;

  const stepIdx = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="order-detail container">
      <h1>Order #{order._id.slice(-8).toUpperCase()}</h1>
      <p className="order-placed">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>

      {order.status !== 'Cancelled' && (
        <div className="order-tracker card">
          {STATUS_STEPS.map((s, i) => (
            <div key={s} className={`tracker-step ${i <= stepIdx ? 'done' : ''}`}>
              <div className="tracker-dot">{i < stepIdx ? '✓' : i + 1}</div>
              <span>{s}</span>
              {i < STATUS_STEPS.length - 1 && <div className={`tracker-line ${i < stepIdx ? 'done' : ''}`} />}
            </div>
          ))}
        </div>
      )}

      <div className="order-detail-layout">
        <div>
          <div className="card order-section">
            <h3>Items</h3>
            {order.items.map((item, i) => (
              <div key={i} className="order-item-row">
                <img src={item.image} alt={item.name} />
                <div>
                  <p>{item.name}</p>
                  <p className="item-meta">Qty: {item.qty} × ${item.price.toFixed(2)}</p>
                </div>
                <span>${(item.qty * item.price).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="card order-section">
            <h3>Shipping Address</h3>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>

        <div className="card order-section">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><span>${order.itemsPrice.toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice.toFixed(2)}`}</span></div>
          <div className="summary-row"><span>Tax</span><span>${order.taxPrice.toFixed(2)}</span></div>
          <hr />
          <div className="summary-row total"><span>Total</span><span>${order.totalPrice.toFixed(2)}</span></div>
          <div className="summary-row"><span>Payment</span><span>{order.paymentMethod}</span></div>
          <div className="summary-row">
            <span>Payment Status</span>
            <span className={`badge ${order.isPaid ? 'badge-success' : 'badge-warning'}`}>
              {order.isPaid ? 'Paid' : 'Pending'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
