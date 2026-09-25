import { Link } from 'react-router-dom';
import { colors, fonts } from '../theme';
import { useCart } from '../CartContext';
import { LockIcon } from '../icons';

export default function Navbar() {
  const { items } = useCart();
  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        backgroundColor: colors.base,
        borderBottom: `1px solid ${colors.accent}`,
        flexWrap: 'wrap',
        gap: '16px'
      }}
    >
      <Link
        to="/"
        style={{
          fontFamily: fonts.display,
          fontSize: '26px',
          fontWeight: 600,
          color: colors.text,
          textDecoration: 'none'
        }}
      >
        Miss Ella
      </Link>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
        <Link to="/catalog/male" style={{ color: colors.text, textDecoration: 'none' }}>Men</Link>
        <Link to="/catalog/female" style={{ color: colors.text, textDecoration: 'none' }}>Women</Link>
        <Link to="/catalog/unisex" style={{ color: colors.text, textDecoration: 'none' }}>Unisex</Link>
        <Link to="/catalog/accessories" style={{ color: colors.text, textDecoration: 'none' }}>Accessories</Link>
        <Link
          to="/checkout"
          style={{
            color: colors.text,
            textDecoration: 'none',
            backgroundColor: colors.accent,
            padding: '8px 18px',
            borderRadius: '20px'
          }}
        >
          Order ({items.length})
        </Link>
        <Link
          to="/admin"
          title="Admin"
          style={{ display: 'flex', alignItems: 'center', color: colors.secondary, textDecoration: 'none', padding: '4px' }}
        >
          <LockIcon color={colors.secondary} />
        </Link>
      </div>
    </nav>
  );
}
