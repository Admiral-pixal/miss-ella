const express = require('express');
const pool = require('../db');
const verifyToken = require('../auth');
const asyncHandler = require('../asyncHandler');

const router = express.Router();

router.post('/', asyncHandler(async (req, res) => {
  const { customer_name, customer_phone, delivery_type, items, total } = req.body;
  if (!customer_name || !customer_phone || !items || items.length === 0) {
    return res.status(400).json({ message: 'Missing order details' });
  }
  const [result] = await pool.query(
    'INSERT INTO orders (customer_name, customer_phone, delivery_type, items, total) VALUES (?, ?, ?, ?, ?)',
    [customer_name, customer_phone, delivery_type, JSON.stringify(items), total]
  );
  res.json({ id: result.insertId });
}));

router.get('/', verifyToken, asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
  res.json(rows);
}));

module.exports = router;
