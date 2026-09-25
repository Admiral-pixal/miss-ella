import { colors, fonts } from '../theme';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: colors.text,
        color: colors.base,
        padding: '48px 24px',
        textAlign: 'center',
        marginTop: '60px'
      }}
    >
      <p style={{ fontFamily: fonts.display, fontSize: '20px', fontWeight: 600, margin: 0 }}>Miss Ella</p>
      <p style={{ opacity: 0.8, margin: '8px 0 20px' }}>Elevating campus style, one outfit at a time.</p>
      <p style={{ margin: '4px 0' }}>WhatsApp orders: +233 54 206 6487</p>
      <p style={{ margin: '4px 0', opacity: 0.8 }}>Alt contact: +233 27 505 2350</p>
    </footer>
  );
}
