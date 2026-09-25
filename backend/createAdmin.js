const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const bcrypt = require('bcryptjs');
const pool = require('./db');

async function run() {
  const email = process.argv[2];
  const password = process.argv[3];
  if (!email || !password) {
    console.log('Usage: node createAdmin.js <email> <password>');
    process.exit(1);
  }
  const hashed = await bcrypt.hash(password, 10);
  await pool.query(
    'INSERT INTO admins (email, password) VALUES (?, ?) ON DUPLICATE KEY UPDATE password = ?',
    [email, hashed, hashed]
  );
  console.log('Admin set:', email);
  process.exit(0);
}

run().catch(err => {
  if (err.code === 'ECONNREFUSED') {
    console.log('Could not reach MySQL. Start MySQL in XAMPP, then run this again.');
  } else if (err.code === 'ER_NO_SUCH_TABLE') {
    console.log('The admins table does not exist yet. Import backend/schema.sql in phpMyAdmin first.');
  } else {
    console.log('Failed to create admin:', err.message);
  }
  process.exit(1);
});
