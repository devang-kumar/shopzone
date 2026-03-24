import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import './Admin.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, products: 0, users: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/orders'),
      api.get('/products?limit=1'),
      api.get('/users'),
    ]).then(([orders, products, users]) => {
      const revenue = orders.data.reduce((a, o) => a + (o.isPaid ? o.totalPrice : 0), 0);
      setStats({ orders: orders.data.length, products: products.data.total, users: users.data.length, revenue });
      setRecentOrders(orders.data.slice(0, 5));
    });
  }, []);

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <div className="stats-grid">
        {[
          { label: 'Total Orders', value: stats.orders, icon: '📦', color: '#dbeafe' },
          { label: 'Total Products', value: stats.products, icon: '🛍️', color: '#d1fae5' },
          { label: 'Total Users', value: stats.users, icon: '👥', color: '#fce7f3' },
          { label: 'Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: '💰', color: '#fef3c7' },
        ].map((s) => (
          <div key={s.label} className="stat-card card" style={{ background: s.color }}>
            <span className="stat-icon">{s.icon}</span>
            <div>
              <p className="stat-value">{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-nav-cards">
        <Link to="/admin/products" className="admin-nav-card card">📦 Manage Products</Link>
        <Link to="/admin/orders" className="admin-nav-card card">🧾 Manage Orders</Link>
        <Link to="/admin/users" className="admin-nav-card card">👥 Manage Users</Link>
      </div>

      <div className="card" style={{ padding: '1.25rem', marginTop: '1.5rem' }}>
        <h3>Recent Orders</h3>
        <table className="admin-table">
          <thead>
            <tr><th>ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody>
            {recentOrders.map((o) => (
              <tr key={o._id}>
                <td><Link to={`/orders/${o._id}`}>#{o._id.slice(-6).toUpperCase()}</Link></td>
                <td>{o.user?.name}</td>
                <td>${o.totalPrice.toFixed(2)}</td>
                <td><span className="badge badge-info">{o.status}</span></td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
