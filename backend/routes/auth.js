const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const asyncHandler = require('../asyncHandler');

const router = express.Router();

router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }
  const [rows] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);
  if (rows.length === 0) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const admin = rows[0];
  const match = await bcrypt.compare(password, admin.password);
  if (!match) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
}));

module.exports = router;
