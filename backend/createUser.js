import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';
import bcrypt from 'bcrypt';

const connectionString = process.env.DB_URL;

  const pool = new Pool({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
  }
}); 

async function createUser(email, plainTextPassword) {
  const hashedPassword = await bcrypt.hash(plainTextPassword, 10);
  await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);
  console.log('User created successfully');
}

createUser('admin@example.com', 'pass123')
  .catch(console.error)
  .finally(() => pool.end());


