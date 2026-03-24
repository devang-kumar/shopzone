import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from 'react-toastify';
import './CheckoutPage.css';

const STEPS = ['Shipping', 'Payment', 'Review'];

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);

  const [shipping, setShipping] = useState({
    street: '', city: '', state: '', zip: '', country: 'US',
  });
  const [paymentMethod, setPaymentMethod] = useState('Card');

  const shippingCost = cartTotal > 50 ? 0 : 5.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shippingCost + tax;

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const items = cart.items.map(({ product, qty }) => ({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty,
      }));
      const { data } = await api.post('/orders', {
        items, shippingAddress: shipping, paymentMethod,
        itemsPrice: cartTotal, shippingPrice: shippingCost, taxPrice: tax, totalPrice: total,
      });
      await clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error placing order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="checkout-page container">
      <div className="checkout-steps">
        {STEPS.map((s, i) => (
          <div key={s} className={`step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
            <span className="step-num">{i < step ? '✓' : i + 1}</span>
            <span>{s}</span>
          </div>
        ))}
      </div>

      <div className="checkout-layout">
        <div className="checkout-form card">
          {step === 0 && (
            <div>
              <h2>Shipping Address</h2>
              {['street', 'city', 'state', 'zip', 'country'].map((f) => (
                <div className="form-group" key={f}>
                  <label>{f.charAt(0).toUpperCase() + f.slice(1)}</label>
                  <input value={shipping[f]} onChange={(e) => setShipping({ ...shipping, [f]: e.target.value })} required />
                </div>
              ))}
              <button className="btn btn-primary btn-lg" onClick={() => setStep(1)}
                disabled={!shipping.street || !shipping.city || !shipping.zip}>
                Continue to Payment
              </button>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2>Payment Method</h2>
              {['Card', 'PayPal', 'Cash on Delivery'].map((m) => (
                <label key={m} className="payment-option">
                  <input type="radio" name="payment" value={m} checked={paymentMethod === m} onChange={() => setPaymentMethod(m)} />
                  {m}
                </label>
              ))}
              <div className="checkout-btns">
                <button className="btn btn-outline" onClick={() => setStep(0)}>Back</button>
                <button className="btn btn-primary btn-lg" onClick={() => setStep(2)}>Review Order</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2>Review Order</h2>
              <div className="review-items">
                {cart.items.map(({ product, qty }) => product && (
                  <div key={product._id} className="review-item">
                    <img src={product.image} alt={product.name} />
                    <span>{product.name} × {qty}</span>
                    <span>${(product.price * qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="review-address">
                <strong>Ship to:</strong> {shipping.street}, {shipping.city}, {shipping.state} {shipping.zip}, {shipping.country}
              </div>
              <div className="review-address"><strong>Payment:</strong> {paymentMethod}</div>
              <div className="checkout-btns">
                <button className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
                <button className="btn btn-primary btn-lg" onClick={handlePlaceOrder} disabled={placing}>
                  {placing ? 'Placing...' : 'Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="order-summary card">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span></div>
          <div className="summary-row"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
          <hr />
          <div className="summary-row total"><span>Total</span><span>${total.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  );
}
