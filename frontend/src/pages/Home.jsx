import { Link } from 'react-router-dom';
import { colors, fonts } from '../theme';

const categories = [
  { key: 'male', label: 'Men' },
  { key: 'female', label: 'Women' },
  { key: 'unisex', label: 'Unisex' },
  { key: 'accessories', label: 'Accessories' }
];

export default function Home() {
  return (
    <div>
      <div style={{ padding: '110px 24px', textAlign: 'center', backgroundColor: colors.accent }}>
        <h1 style={{ fontFamily: fonts.display, fontSize: '46px', color: colors.text, margin: 0 }}>Miss Ella</h1>
        <p style={{ fontSize: '18px', color: colors.text, opacity: 0.75, marginTop: '14px' }}>
          Elevating campus style, one outfit at a time.
        </p>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          padding: '40px'
        }}
      >
        {categories.map(c => (
          <Link key={c.key} to={`/catalog/${c.key}`} style={{ textDecoration: 'none' }}>
            <div
              style={{
                backgroundColor: colors.base,
                border: `1px solid ${colors.accent}`,
                borderRadius: '14px',
                padding: '48px 20px',
                textAlign: 'center',
                color: colors.text,
                fontWeight: 600,
                fontSize: '18px'
              }}
            >
              {c.label}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
