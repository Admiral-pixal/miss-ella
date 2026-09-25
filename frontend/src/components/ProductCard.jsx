import { Link } from 'react-router-dom';
import { colors } from '../theme';
import { resolveImage } from '../api';

export default function ProductCard({ product }) {
  const image = resolveImage(product.image_url);
  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: colors.text }}>
      <div
        style={{
          backgroundColor: colors.white,
          border: `1px solid ${colors.accent}`,
          borderRadius: '14px',
          overflow: 'hidden'
        }}
      >
        <div style={{ width: '100%', aspectRatio: '3 / 4', backgroundColor: colors.accent, overflow: 'hidden' }}>
          {image && (
            <img src={image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
        </div>
        <div style={{ padding: '14px' }}>
          <p style={{ margin: 0, fontWeight: 600 }}>{product.name}</p>
          <p style={{ margin: '6px 0 0', color: colors.secondary }}>GHS {product.price}</p>
          {product.availability === 'sold_out' && (
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: colors.secondary }}>Sold out</p>
          )}
          {product.availability === 'made_to_order' && (
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: colors.secondary }}>Made to order</p>
          )}
        </div>
      </div>
    </Link>
  );
}
