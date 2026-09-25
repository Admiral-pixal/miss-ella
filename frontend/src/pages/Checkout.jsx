import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import { createOrder } from '../api';
import { colors, fonts } from '../theme';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '233542066487';

export default function Checkout() {
  const { items, removeItem, clearCart, total } = useCart();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState('campus');
  const [submitting, setSubmitting] = useState(false);

  function buildMessage() {
    const lines = [`New order from ${name} (${phone})`, ''];
    items.forEach(item => {
      lines.push(
        `- ${item.name} | Size: ${item.size || 'N/A'} | Color: ${item.color || 'N/A'} | Qty: ${item.quantity} | GHS ${item.price * item.quantity}`
      );
    });
    lines.push('');
    lines.push(`Delivery: ${deliveryType === 'campus' ? 'On-Campus/Hostel (Free)' : 'Off-Campus (fee via rider)'}`);
    lines.push(`Total: GHS ${total}`);
    return lines.join('\n');
  }

  async function handleSubmit() {
    if (!name || !phone || items.length === 0) return;
    setSubmitting(true);
    await createOrder({
      customer_name: name,
      customer_phone: phone,
      delivery_type: deliveryType,
      items,
      total
    });
    const message = encodeURIComponent(buildMessage());
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    clearCart();
    setSubmitting(false);
    navigate('/');
  }

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ fontFamily: fonts.display, color: colors.text, margin: 0 }}>Your Order</h2>
      {items.length === 0 && <p style={{ color: colors.secondary, marginTop: '16px' }}>No items selected yet.</p>}
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '14px 0',
            borderBottom: `1px solid ${colors.accent}`
          }}
        >
          <div>
            <p style={{ margin: 0, color: colors.text, fontWeight: 600 }}>{item.name}</p>
            <p style={{ margin: 0, color: colors.secondary, fontSize: '14px' }}>
              {item.size || '—'} · {item.color || '—'} · Qty {item.quantity}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <p style={{ margin: 0, color: colors.text }}>GHS {item.price * item.quantity}</p>
            <button
              onClick={() => removeItem(i)}
              style={{ background: 'none', border: 'none', color: colors.secondary, cursor: 'pointer' }}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      {items.length > 0 && (
        <>
          <p style={{ textAlign: 'right', fontWeight: 700, color: colors.text, marginTop: '18px' }}>
            Total: GHS {total}
          </p>
          <div style={{ marginTop: '26px' }}>
            <input
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: `1px solid ${colors.secondary}`,
                marginBottom: '12px',
                boxSizing: 'border-box'
              }}
            />
            <input
              placeholder="Your phone number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: `1px solid ${colors.secondary}`,
                marginBottom: '16px',
                boxSizing: 'border-box'
              }}
            />
            <div style={{ display: 'flex', gap: '20px', marginBottom: '22px', flexWrap: 'wrap' }}>
              <label style={{ color: colors.text, display: 'flex', gap: '6px', alignItems: 'center' }}>
                <input type="radio" checked={deliveryType === 'campus'} onChange={() => setDeliveryType('campus')} />
                On-Campus/Hostel (Free)
              </label>
              <label style={{ color: colors.text, display: 'flex', gap: '6px', alignItems: 'center' }}>
                <input type="radio" checked={deliveryType === 'off_campus'} onChange={() => setDeliveryType('off_campus')} />
                Off-Campus (fee via rider)
              </label>
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting || !name || !phone}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: colors.text,
                color: colors.base,
                border: 'none',
                borderRadius: '24px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              {submitting ? 'Sending...' : 'Order via WhatsApp'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
