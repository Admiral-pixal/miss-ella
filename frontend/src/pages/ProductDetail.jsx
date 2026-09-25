import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, resolveImage } from '../api';
import { useCart } from '../CartContext';
import { colors, fonts } from '../theme';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    getProduct(id).then(setProduct);
  }, [id]);

  if (!product) return <p style={{ padding: '40px', color: colors.secondary }}>Loading...</p>;

  const sizes = product.sizes ? product.sizes.split(',').map(s => s.trim()) : [];
  const colorOptions = product.colors ? product.colors.split(',').map(c => c.trim()) : [];
  const image = resolveImage(product.image_url);
  const soldOut = product.availability === 'sold_out';

  function handleAdd() {
    addItem(product, size, color, quantity);
    navigate('/checkout');
  }

  return (
    <div style={{ padding: '40px', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 320px', aspectRatio: '3 / 4', backgroundColor: colors.accent, borderRadius: '14px', overflow: 'hidden' }}>
        {image && <img src={image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      </div>
      <div style={{ flex: '1 1 320px' }}>
        <h2 style={{ fontFamily: fonts.display, color: colors.text, margin: 0 }}>{product.name}</h2>
        <p style={{ color: colors.secondary, fontSize: '20px', marginTop: '10px' }}>GHS {product.price}</p>
        {product.description && <p style={{ color: colors.text, opacity: 0.8 }}>{product.description}</p>}
        {product.availability === 'made_to_order' && (
          <p style={{ color: colors.secondary, fontSize: '14px' }}>Made to order</p>
        )}
        {soldOut && <p style={{ color: colors.secondary, fontSize: '14px' }}>Currently sold out</p>}

        {sizes.length > 0 && (
          <div style={{ marginTop: '18px' }}>
            <p style={{ margin: '0 0 8px', fontWeight: 600, color: colors.text }}>Size</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {sizes.map(s => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: `1px solid ${colors.secondary}`,
                    backgroundColor: size === s ? colors.text : colors.base,
                    color: size === s ? colors.base : colors.text,
                    cursor: 'pointer'
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {colorOptions.length > 0 && (
          <div style={{ marginTop: '18px' }}>
            <p style={{ margin: '0 0 8px', fontWeight: 600, color: colors.text }}>Color</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {colorOptions.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: `1px solid ${colors.secondary}`,
                    backgroundColor: color === c ? colors.text : colors.base,
                    color: color === c ? colors.base : colors.text,
                    cursor: 'pointer'
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: '18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <p style={{ margin: 0, fontWeight: 600, color: colors.text }}>Qty</p>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={e => setQuantity(Number(e.target.value))}
            style={{ width: '64px', padding: '8px', borderRadius: '8px', border: `1px solid ${colors.secondary}` }}
          />
        </div>

        <button
          onClick={handleAdd}
          disabled={soldOut}
          style={{
            marginTop: '26px',
            padding: '14px 32px',
            backgroundColor: soldOut ? colors.secondary : colors.text,
            color: colors.base,
            border: 'none',
            borderRadius: '24px',
            fontSize: '16px',
            cursor: soldOut ? 'not-allowed' : 'pointer'
          }}
        >
          {soldOut ? 'Sold Out' : 'Add to Order'}
        </button>
      </div>
    </div>
  );
}
