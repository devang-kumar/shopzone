import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import './Admin.css';

const EMPTY = { name: '', description: '', price: '', originalPrice: '', category: '', brand: '', image: '', countInStock: '', isFeatured: false };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const load = () => {
    api.get(`/products?page=${page}&limit=10`).then((r) => {
      setProducts(r.data.products);
      setPages(r.data.pages);
    });
  };

  useEffect(() => { load(); }, [page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/products/${editing}`, form);
        toast.success('Product updated');
      } else {
        await api.post('/products', form);
        toast.success('Product created');
      }
      setForm(EMPTY); setEditing(null); setShowForm(false); load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, description: p.description, price: p.price, originalPrice: p.originalPrice || '', category: p.category, brand: p.brand || '', image: p.image, countInStock: p.countInStock, isFeatured: p.isFeatured });
    setEditing(p._id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    toast.success('Deleted'); load();
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Products</h1>
        <button className="btn btn-primary" onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true); }}>+ Add Product</button>
      </div>

      {showForm && (
        <div className="card admin-form">
          <h3>{editing ? 'Edit Product' : 'New Product'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {[
                { label: 'Name', key: 'name' }, { label: 'Brand', key: 'brand' },
                { label: 'Category', key: 'category' }, { label: 'Image URL', key: 'image' },
                { label: 'Price', key: 'price', type: 'number' }, { label: 'Original Price', key: 'originalPrice', type: 'number' },
                { label: 'Stock', key: 'countInStock', type: 'number' },
              ].map(({ label, key, type = 'text' }) => (
                <div className="form-group" key={key}>
                  <label>{label}</label>
                  <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required={key !== 'originalPrice' && key !== 'brand'} />
                </div>
              ))}
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
            <label className="checkbox-label">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
              Featured Product
            </label>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button className="btn btn-primary" type="submit">{editing ? 'Update' : 'Create'}</button>
              <button className="btn btn-outline" type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: '1rem' }}>
        <table className="admin-table">
          <thead>
            <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td><img src={p.image} alt={p.name} style={{ width: 40, height: 40, objectFit: 'contain' }} /></td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>${p.price}</td>
                <td>{p.countInStock}</td>
                <td>
                  <button className="btn btn-outline btn-sm" onClick={() => handleEdit(p)}>Edit</button>
                  <button className="btn btn-danger btn-sm" style={{ marginLeft: '0.4rem' }} onClick={() => handleDelete(p._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pages > 1 && (
          <div className="pagination">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button key={p} className={p === page ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
