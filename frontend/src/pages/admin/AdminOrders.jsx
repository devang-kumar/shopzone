import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import './Admin.css';

const STATUSES = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders').then((r) => setOrders(r.data));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/orders/${id}/status`, { status });
      setOrders(orders.map((o) => (o._id === id ? data : o)));
      toast.success('Status updated');
    } catch {
      toast.error('Error updating status');
    }
  };

  return (
    <div className="admin-page">
      <h1>Orders</h1>
      <div className="card" style={{ padding: '1rem' }}>
        <table className="admin-table">
          <thead>
            <tr><th>ID</th><th>Customer</th><th>Total</th><th>Paid</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td><Link to={`/orders/${o._id}`}>#{o._id.slice(-6).toUpperCase()}</Link></td>
                <td>{o.user?.name}</td>
                <td>${o.totalPrice.toFixed(2)}</td>
                <td>{o.isPaid ? <span className="badge badge-success">Paid</span> : <span className="badge badge-warning">Pending</span>}</td>
                <td>
                  <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)} className="status-select">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
