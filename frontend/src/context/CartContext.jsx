import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchCart();
    else setCart({ items: [] });
  }, [user]);

  const fetchCart = async () => {
    try {
      const { data } = await api.get('/cart');
      setCart(data);
    } catch {}
  };

  const addToCart = async (productId, qty = 1) => {
    setLoading(true);
    try {
      const { data } = await api.post('/cart', { productId, qty });
      setCart(data);
    } finally {
      setLoading(false);
    }
  };

  const updateQty = async (productId, qty) => {
    if (qty < 1) return removeFromCart(productId);
    const { data } = await api.post('/cart', { productId, qty });
    setCart(data);
  };

  const removeFromCart = async (productId) => {
    const { data } = await api.delete(`/cart/${productId}`);
    setCart(data);
  };

  const clearCart = async () => {
    await api.delete('/cart');
    setCart({ items: [] });
  };

  const cartCount = cart.items.reduce((a, i) => a + i.qty, 0);
  const cartTotal = cart.items.reduce((a, i) => a + (i.product?.price || 0) * i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, removeFromCart, clearCart, cartCount, cartTotal, loading }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
