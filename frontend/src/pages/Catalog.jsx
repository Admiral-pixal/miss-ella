import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProducts } from '../api';
import ProductCard from '../components/ProductCard';
import { colors, fonts } from '../theme';

const labels = {
  male: 'Men',
  female: 'Women',
  unisex: 'Unisex',
  accessories: 'Accessories'
};

export default function Catalog() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProducts(category).then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, [category]);

  return (
    <div style={{ padding: '40px' }}>
      <h2 style={{ fontFamily: fonts.display, color: colors.text, margin: 0 }}>{labels[category] || category}</h2>
      {loading && <p style={{ color: colors.secondary, marginTop: '16px' }}>Loading...</p>}
      {!loading && products.length === 0 && (
        <p style={{ color: colors.secondary, marginTop: '16px' }}>No items yet, check back soon.</p>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '20px',
          marginTop: '24px'
        }}
      >
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
