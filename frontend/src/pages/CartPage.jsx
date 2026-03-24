import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CartPage.css';

export default function CartPage() {
  const { cart, updateQty, removeFromCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = cartTotal > 50 ? 0 : 5.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  if (cart.items.length === 0) {
    return (
      <div className="empty-cart container">
        <div className="empty-cart-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <h1>Shopping Cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.items.map(({ product, qty }) => product && (
            <div key={product._id} className="cart-item card">
              <img src={product.image} alt={product.name} />
              <div className="cart-item-info">
                <Link to={`/products/${product._id}`}>{product.name}</Link>
                <p className="cart-item-price">${product.price.toFixed(2)}</p>
                {product.countInStock > 0
                  ? <span className="badge badge-success">In Stock</span>
                  : <span className="badge badge-danger">Out of Stock</span>}
              </div>
              <div className="cart-item-controls">
                <div className="qty-selector">
                  <button onClick={() => updateQty(product._id, qty - 1)}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => updateQty(product._id, qty + 1)}>+</button>
                </div>
                <p className="item-subtotal">${(product.price * qty).toFixed(2)}</p>
                <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(product._id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary card">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
          <div className="summary-row"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
          <hr />
          <div className="summary-row total"><span>Total</span><span>${total.toFixed(2)}</span></div>
          {shipping > 0 && <p className="free-ship-note">Add ${(50 - cartTotal).toFixed(2)} more for free shipping</p>}
          <button
            className="btn btn-primary btn-block btn-lg"
            onClick={() => user ? navigate('/checkout') : navigate('/login')}
          >
            Proceed to Checkout
          </button>
          <Link to="/products" className="btn btn-outline btn-block" style={{ marginTop: '0.5rem' }}>Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
