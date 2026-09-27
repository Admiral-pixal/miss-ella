const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

const app = express();

// UPDATED: This now explicitly allows your Vercel frontend application
app.use(cors({
  origin: 'https://miss-ella-w5j5.vercel.app',
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.send('Miss Ella API is running');
});

app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({ message: 'Database is unreachable. Is MySQL running?' });
  }
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
