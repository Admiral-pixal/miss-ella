const express = require('express');
const multer = require('multer');
const path = require('path');
const pool = require('../db');
const verifyToken = require('../auth');
const asyncHandler = require('../asyncHandler');

const router = express.Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'uploads'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.get('/', asyncHandler(async (req, res) => {
  const { category } = req.query;
  let query = 'SELECT * FROM products ORDER BY created_at DESC';
  let params = [];
  if (category) {
    query = 'SELECT * FROM products WHERE category = ? ORDER BY created_at DESC';
    params = [category];
  }
  const [rows] = await pool.query(query, params);
  res.json(rows);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ message: 'Not found' });
  res.json(rows[0]);
}));

router.post('/', verifyToken, upload.single('image'), asyncHandler(async (req, res) => {
  const { name, category, subcategory, price, sizes, colors, description, availability } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;
  const [result] = await pool.query(
    'INSERT INTO products (name, category, subcategory, price, sizes, colors, description, image_url, availability) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, category, subcategory, price, sizes, colors, description, image_url, availability || 'in_stock']
  );
  res.json({ id: result.insertId });
}));

router.put('/:id', verifyToken, upload.single('image'), asyncHandler(async (req, res) => {
  const { name, category, subcategory, price, sizes, colors, description, availability } = req.body;
  const fields = [name, category, subcategory, price, sizes, colors, description, availability];
  let query = 'UPDATE products SET name=?, category=?, subcategory=?, price=?, sizes=?, colors=?, description=?, availability=?';
  if (req.file) {
    query += ', image_url=?';
    fields.push(`/uploads/${req.file.filename}`);
  }
  query += ' WHERE id=?';
  fields.push(req.params.id);
  await pool.query(query, fields);
  res.json({ success: true });
}));

router.delete('/:id', verifyToken, asyncHandler(async (req, res) => {
  await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
  res.json({ success: true });
}));

module.exports = router;
