import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Stars from '../components/Stars';
import { toast } from 'react-toastify';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then((r) => setProduct(r.data)).finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) return navigate('/login');
    await addToCart(product._id, qty);
    toast.success('Added to cart');
  };

  const handleBuyNow = async () => {
    if (!user) return navigate('/login');
    await addToCart(product._id, qty);
    navigate('/cart');
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/products/${id}/reviews`, { ...review, name: user.name });
      toast.success('Review submitted');
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
      setReview({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="spinner" />;
  if (!product) return <div className="container" style={{ padding: '2rem' }}>Product not found.</div>;

  const images = [product.image, ...(product.images || [])];

  return (
    <div className="product-detail container">
      <div className="product-detail-top">
        {/* Images */}
        <div className="product-images">
          <div className="thumbnails">
            {images.map((img, i) => (
              <img key={i} src={img} alt="" className={activeImg === i ? 'active' : ''} onClick={() => setActiveImg(i)} />
            ))}
          </div>
          <div className="main-image">
            <img src={images[activeImg]} alt={product.name} />
          </div>
        </div>

        {/* Info */}
        <div className="product-info">
          <p className="product-brand-label">{product.brand}</p>
          <h1>{product.name}</h1>
          <Stars rating={product.rating} numReviews={product.numReviews} />
          <hr />
          <div className="price-section">
            <span className="big-price">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="was-price">Was: ${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <p className="description">{product.description}</p>
          <div className={`stock-status ${product.countInStock > 0 ? 'in-stock' : 'oos'}`}>
            {product.countInStock > 0 ? `In Stock (${product.countInStock} left)` : 'Out of Stock'}
          </div>

          {product.countInStock > 0 && (
            <div className="add-to-cart-section">
              <div className="qty-selector">
                <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(Math.min(product.countInStock, qty + 1))}>+</button>
              </div>
              <button className="btn btn-primary btn-lg" onClick={handleAddToCart}>Add to Cart</button>
              <button className="btn btn-secondary btn-lg" onClick={handleBuyNow}>Buy Now</button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="reviews-section">
        <h2>Customer Reviews</h2>
        {product.reviews.length === 0 && <p style={{ color: '#6b7280' }}>No reviews yet.</p>}
        <div className="reviews-list">
          {product.reviews.map((r) => (
            <div key={r._id} className="review-card card">
              <div className="review-header">
                <strong>{r.name}</strong>
                <Stars rating={r.rating} />
                <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
              <p>{r.comment}</p>
            </div>
          ))}
        </div>

        {user && (
          <form className="review-form card" onSubmit={handleReview}>
            <h3>Write a Review</h3>
            <div className="form-group">
              <label>Rating</label>
              <select value={review.rating} onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Stars</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Comment</label>
              <textarea rows={3} value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} required />
            </div>
            <button className="btn btn-primary" disabled={submitting}>Submit Review</button>
          </form>
        )}
      </div>
    </div>
  );
}
