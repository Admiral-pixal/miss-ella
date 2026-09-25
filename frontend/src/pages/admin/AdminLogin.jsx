import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../api';
import { colors, fonts } from '../../theme';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const data = await adminLogin(email, password);
    if (data.token) {
      localStorage.setItem('admin_token', data.token);
      navigate('/admin/dashboard');
    } else {
      setError(data.message || 'Login failed');
    }
  }

  return (
    <div style={{ padding: '90px 24px', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ fontFamily: fonts.display, color: colors.text, textAlign: 'center', margin: 0 }}>Admin Login</h2>
      <form onSubmit={handleSubmit} style={{ marginTop: '30px' }}>
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
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
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: `1px solid ${colors.secondary}`,
            marginBottom: '12px',
            boxSizing: 'border-box'
          }}
        />
        {error && <p style={{ color: '#B3423E' }}>{error}</p>}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: colors.text,
            color: colors.base,
            border: 'none',
            borderRadius: '24px',
            cursor: 'pointer',
            fontSize: '15px'
          }}
        >
          Log In
        </button>
      </form>
    </div>
  );
}
