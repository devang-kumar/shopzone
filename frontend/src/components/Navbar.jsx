import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?keyword=${search}`);
  };

  return (
    <nav className="navbar">
      <div className="navbar-top">
        <Link to="/" className="navbar-logo">ShopZone</Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
          />
          <button type="submit">🔍</button>
        </form>

        <div className="navbar-actions">
          {user ? (
            <div className="nav-dropdown">
              <button className="nav-btn" onClick={() => setMenuOpen(!menuOpen)}>
                👤 {user.name.split(' ')[0]}
              </button>
              {menuOpen && (
                <div className="dropdown-menu">
                  <Link to="/profile" onClick={() => setMenuOpen(false)}>My Profile</Link>
                  <Link to="/orders" onClick={() => setMenuOpen(false)}>My Orders</Link>
                  {user.isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin Panel</Link>}
                  <button onClick={() => { logout(); setMenuOpen(false); navigate('/'); }}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nav-btn">Sign In</Link>
          )}
          <Link to="/cart" className="nav-btn cart-btn">
            🛒 Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>

      <div className="navbar-categories">
        <Link to="/products">All Products</Link>
        <Link to="/products?category=Electronics">Electronics</Link>
        <Link to="/products?category=Clothing">Clothing</Link>
        <Link to="/products?category=Books">Books</Link>
        <Link to="/products?category=Home">Home & Garden</Link>
        <Link to="/products?category=Sports">Sports</Link>
        <Link to="/products?category=Toys">Toys</Link>
      </div>
    </nav>
  );
}
