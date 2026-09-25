import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminGetOrders,
  resolveImage
} from '../../api';
import { colors, fonts } from '../../theme';
import { PhotoIcon } from '../../icons';

const emptyForm = {
  name: '',
  category: 'male',
  subcategory: '',
  price: '',
  sizes: '',
  colors: '',
  description: '',
  availability: 'in_stock'
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  borderRadius: '8px',
  border: `1px solid ${colors.secondary}`,
  boxSizing: 'border-box'
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('admin_token');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('products');
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  useEffect(() => {
    if (!token) {
      navigate('/admin');
      return;
    }
    loadProducts();
    adminGetOrders(token).then(setOrders);
  }, []);

  function loadProducts() {
    getProducts().then(setProducts);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData();
    Object.keys(form).forEach(key => data.append(key, form[key]));
    if (imageFile) data.append('image', imageFile);
    if (editingId) {
      await adminUpdateProduct(token, editingId, data);
    } else {
      await adminCreateProduct(token, data);
    }
    setForm(emptyForm);
    setImageFile(null);
    setExistingImageUrl(null);
    setEditingId(null);
    loadProducts();
  }

  function handleEdit(product) {
    setForm({
      name: product.name,
      category: product.category,
      subcategory: product.subcategory || '',
      price: product.price,
      sizes: product.sizes || '',
      colors: product.colors || '',
      description: product.description || '',
      availability: product.availability
    });
    setEditingId(product.id);
    setImageFile(null);
    setExistingImageUrl(product.image_url || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setForm(emptyForm);
    setImageFile(null);
    setExistingImageUrl(null);
    setEditingId(null);
  }

  async function handleDelete(id) {
    await adminDeleteProduct(token, id);
    loadProducts();
  }

  function handleLogout() {
    localStorage.removeItem('admin_token');
    navigate('/admin');
  }

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ fontFamily: fonts.display, color: colors.text, margin: 0 }}>Miss Ella Admin</h2>
        <button
          onClick={handleLogout}
          style={{
            background: 'none',
            border: `1px solid ${colors.secondary}`,
            borderRadius: '8px',
            padding: '8px 16px',
            cursor: 'pointer',
            color: colors.text
          }}
        >
          Log Out
        </button>
      </div>

      <div style={{ display: 'flex', gap: '12px', margin: '24px 0' }}>
        <button
          onClick={() => setTab('products')}
          style={{
            padding: '10px 20px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: tab === 'products' ? colors.text : colors.accent,
            color: tab === 'products' ? colors.base : colors.text,
            cursor: 'pointer'
          }}
        >
          Products
        </button>
        <button
          onClick={() => setTab('orders')}
          style={{
            padding: '10px 20px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: tab === 'orders' ? colors.text : colors.accent,
            color: tab === 'orders' ? colors.base : colors.text,
            cursor: 'pointer'
          }}
        >
          Orders
        </button>
      </div>

      {tab === 'products' && (
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          <form
            onSubmit={handleSubmit}
            style={{
              flex: '1 1 300px',
              backgroundColor: colors.base,
              border: `1px solid ${colors.accent}`,
              borderRadius: '14px',
              padding: '24px',
              maxWidth: '360px'
            }}
          >
            <p style={{ fontWeight: 600, color: colors.text, marginTop: 0 }}>
              {editingId ? 'Edit Product' : 'Add Product'}
            </p>
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required style={inputStyle} />
            <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unisex">Unisex</option>
              <option value="accessories">Accessories</option>
            </select>
            <input
              name="subcategory"
              placeholder="Subcategory (e.g. Shirts)"
              value={form.subcategory}
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              name="price"
              type="number"
              step="0.01"
              placeholder="Price (GHS)"
              value={form.price}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              name="sizes"
              placeholder="Sizes (comma separated)"
              value={form.sizes}
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              name="colors"
              placeholder="Colors (comma separated)"
              value={form.colors}
              onChange={handleChange}
              style={inputStyle}
            />
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              style={{ ...inputStyle, minHeight: '70px' }}
            />
            <select name="availability" value={form.availability} onChange={handleChange} style={inputStyle}>
              <option value="in_stock">In Stock</option>
              <option value="made_to_order">Made to Order</option>
              <option value="sold_out">Sold Out</option>
            </select>
            <label
              htmlFor="product-image"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                borderRadius: '8px',
                border: `1.5px dashed ${colors.secondary}`,
                color: colors.text,
                cursor: 'pointer',
                textAlign: 'center',
                fontSize: '14px'
              }}
            >
              <PhotoIcon color={colors.secondary} size={18} />
              {imageFile ? imageFile.name : 'Upload photo from gallery'}
            </label>
            <input
              id="product-image"
              type="file"
              accept="image/*"
              onChange={e => setImageFile(e.target.files[0] || null)}
              style={{ display: 'none' }}
            />
            {(previewUrl || existingImageUrl) && (
              <img
                src={previewUrl || resolveImage(existingImageUrl)}
                alt="Selected product"
                style={{
                  width: '100%',
                  maxHeight: '160px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginTop: '10px',
                  marginBottom: '4px'
                }}
              />
            )}
            <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: colors.text,
                  color: colors.base,
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer'
                }}
              >
                {editingId ? 'Save Changes' : 'Add Product'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: 'transparent',
                    color: colors.text,
                    border: `1px solid ${colors.secondary}`,
                    borderRadius: '20px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div style={{ flex: '2 1 400px' }}>
            {products.map(p => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px',
                  borderBottom: `1px solid ${colors.accent}`,
                  flexWrap: 'wrap',
                  gap: '10px'
                }}
              >
                <div>
                  <p style={{ margin: 0, fontWeight: 600, color: colors.text }}>{p.name}</p>
                  <p style={{ margin: 0, color: colors.secondary, fontSize: '14px' }}>
                    {p.category} · GHS {p.price} · {p.availability.replace(/_/g, ' ')}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleEdit(p)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: `1px solid ${colors.secondary}`,
                      background: 'none',
                      cursor: 'pointer',
                      color: colors.text
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: colors.secondary,
                      color: colors.base,
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {products.length === 0 && <p style={{ color: colors.secondary }}>No products yet — add your first one.</p>}
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div>
          {orders.map(o => (
            <div key={o.id} style={{ padding: '14px', borderBottom: `1px solid ${colors.accent}` }}>
              <p style={{ margin: 0, fontWeight: 600, color: colors.text }}>
                {o.customer_name} · {o.customer_phone}
              </p>
              <p style={{ margin: '4px 0', color: colors.secondary, fontSize: '14px' }}>
                {new Date(o.created_at).toLocaleString()} · {o.delivery_type.replace(/_/g, ' ')} · GHS {o.total}
              </p>
              <ul style={{ margin: 0, paddingLeft: '18px', color: colors.text }}>
                {(Array.isArray(o.items) ? o.items : JSON.parse(o.items)).map((item, i) => (
                  <li key={i}>
                    {item.name} — {item.size || '—'} / {item.color || '—'} × {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {orders.length === 0 && <p style={{ color: colors.secondary }}>No orders yet.</p>}
        </div>
      )}
    </div>
  );
}
