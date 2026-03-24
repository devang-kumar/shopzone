import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import './ProductsPage.css';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const page = Number(searchParams.get('page')) || 1;
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  useEffect(() => {
    api.get('/products/categories').then((r) => setCategories(r.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 12 });
    if (keyword) params.set('keyword', keyword);
    if (category) params.set('category', category);
    if (sort) params.set('sort', sort);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);

    api.get(`/products?${params}`).then((r) => {
      setProducts(r.data.products);
      setTotal(r.data.total);
      setPages(r.data.pages);
    }).finally(() => setLoading(false));
  }, [keyword, category, sort, page, minPrice, maxPrice]);

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  return (
    <div className="products-page container">
      <aside className="filters">
        <h3>Filters</h3>

        <div className="filter-section">
          <h4>Category</h4>
          <label>
            <input type="radio" name="cat" checked={!category} onChange={() => setParam('category', '')} /> All
          </label>
          {categories.map((c) => (
            <label key={c}>
              <input type="radio" name="cat" checked={category === c} onChange={() => setParam('category', c)} /> {c}
            </label>
          ))}
        </div>

        <div className="filter-section">
          <h4>Price Range</h4>
          <div className="price-inputs">
            <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setParam('minPrice', e.target.value)} />
            <span>–</span>
            <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setParam('maxPrice', e.target.value)} />
          </div>
        </div>
      </aside>

      <main className="products-main">
        <div className="products-header">
          <p>{total} results {keyword && `for "${keyword}"`} {category && `in ${category}`}</p>
          <select value={sort} onChange={(e) => setParam('sort', e.target.value)}>
            <option value="">Sort: Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Avg. Customer Review</option>
          </select>
        </div>

        {loading ? <div className="spinner" /> : products.length === 0 ? (
          <div className="no-results">No products found.</div>
        ) : (
          <div className="products-grid">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}

        {pages > 1 && (
          <div className="pagination">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button key={p} className={p === page ? 'active' : ''} onClick={() => setParam('page', p)}>{p}</button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
