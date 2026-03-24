import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Stars from './Stars';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    await addToCart(product._id, 1);
    toast.success('Added to cart');
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <Link to={`/products/${product._id}`} className="product-card card">
      <div className="product-card-img">
        <img src={product.image} alt={product.name} loading="lazy" />
        {discount && <span className="discount-badge">-{discount}%</span>}
      </div>
      <div className="product-card-body">
        <p className="product-brand">{product.brand}</p>
        <h3 className="product-name">{product.name}</h3>
        <Stars rating={product.rating} numReviews={product.numReviews} />
        <div className="product-price-row">
          <span className="product-price">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="product-original">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
        {product.countInStock > 0 ? (
          <button className="btn btn-primary btn-block btn-sm" onClick={handleAddToCart}>
            Add to Cart
          </button>
        ) : (
          <span className="out-of-stock">Out of Stock</span>
        )}
      </div>
    </Link>
  );
}
