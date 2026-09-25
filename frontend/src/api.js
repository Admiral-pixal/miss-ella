const RAW_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_URL = RAW_API_URL;
export const API_BASE = RAW_API_URL.replace(/\/api\/?$/, '');

export function resolveImage(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${API_BASE}${url}`;
}

export async function getProducts(category) {
  const url = category ? `${API_URL}/products?category=${category}` : `${API_URL}/products`;
  const res = await fetch(url);
  return res.json();
}

export async function getProduct(id) {
  const res = await fetch(`${API_URL}/products/${id}`);
  return res.json();
}

export async function createOrder(order) {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  });
  return res.json();
}

export async function adminLogin(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function adminGetOrders(token) {
  const res = await fetch(`${API_URL}/orders`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function adminCreateProduct(token, formData) {
  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  return res.json();
}

export async function adminUpdateProduct(token, id, formData) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  return res.json();
}

export async function adminDeleteProduct(token, id) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}
