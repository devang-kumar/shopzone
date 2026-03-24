import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

const CATEGORIES = [
  { name: 'Electronics', icon: '💻', color: '#dbeafe' },
  { name: 'Clothing', icon: '👕', color: '#fce7f3' },
  { name: 'Books', icon: '📚', color: '#d1fae5' },
  { name: 'Home', icon: '🏠', color: '#fef3c7' },
  { name: 'Sports', icon: '⚽', color: '#ede9fe' },
  { name: 'Toys', icon: '🧸', color: '#fee2e2' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/products/featured'),
      api.get('/products?limit=8&sort=newest'),
    ]).then(([f, n]) => {
      setFeatured(f.data);
      setNewArrivals(n.data.products);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="homepage">
      {/* Hero Banner */}
      <div className="hero">
        <div className="hero-content">
          <h1>Welcome to ShopZone</h1>
          <p>Millions of products. Unbeatable prices. Fast delivery.</p>
          <Link to="/products" className="btn btn-primary btn-lg">Shop Now</Link>
        </div>
      </div>

      <div className="container">
        {/* Categories */}
        <section className="section">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {CATEGORIES.map((c) => (
              <Link key={c.name} to={`/products?category=${c.name}`} className="category-card" style={{ background: c.color }}>
                <span className="category-icon">{c.icon}</span>
                <span>{c.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured */}
        {featured.length > 0 && (
          <section className="section">
            <div className="section-header">
              <h2 className="section-title">Featured Products</h2>
              <Link to="/products" className="see-all">See all →</Link>
            </div>
            {loading ? <div className="spinner" /> : (
              <div className="products-grid">
                {featured.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            )}
          </section>
        )}

        {/* New Arrivals */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">New Arrivals</h2>
            <Link to="/products" className="see-all">See all →</Link>
          </div>
          {loading ? <div className="spinner" /> : (
            <div className="products-grid">
              {newArrivals.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </section>

        {/* Promo Banner */}
        <div className="promo-banner">
          <div>
            <h3>Free Shipping on Orders Over $50</h3>
            <p>Use code FREESHIP at checkout</p>
          </div>
          <Link to="/products" className="btn btn-secondary">Shop Now</Link>
        </div>
      </div>
    </div>
  );
}
