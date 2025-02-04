import pkg from 'pg'; // Import the entire 'pg' module
const { Pool } = pkg;
import 'dotenv/config';
import bcrypt from 'bcrypt';

// PostgreSQL Client Setup
const pool = new Pool({
  host: process.env.DB_HOST, // localhost
  port: process.env.DB_PORT, // 5432
  user: process.env.DB_USER, // postgres
  password: process.env.DB_PASSWORD, // Your password here
  database: process.env.DB_NAME, // Your database name here
});

async function createUser(email, plainTextPassword) {
  const hashedPassword = await bcrypt.hash(plainTextPassword, 10);
  await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);
  console.log('User created successfully');
}

/* createUser('admin@example.com', 'securepasswod1')
  .catch(console.error)
  .finally(() => pool.end()); */

/* createUser('rita@example.com', '123pass')
  .catch(console.error)
  .finally(() => pool.end());

createUser('klue@example.com', 'pass123')
  .catch(console.error)
  .finally(() => pool.end()); */

createUser('masawi@gmail.com', 'pass456')
.catch(console.error)
.finally(() => pool.end());
