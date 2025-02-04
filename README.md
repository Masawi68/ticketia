How to use the app.
**.env**
Setup the .env as per your database.

**Database**
- create -> users data base using the following schema

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

- use the following code to create users in the database.

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

createUser('admin@example.com', 'securepasswod1')
  .catch(console.error)
  .finally(() => pool.end());


- create -> comments Table 

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,           -- Unique identifier for each comment
  comment TEXT NOT NULL,           -- The actual comment text
  ticket_id INTEGER NOT NULL,      -- Reference to the associated ticket
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp for when the comment was created
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp for when the comment was last updated
  CONSTRAINT fk_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);

- create -> tickets Table 
CREATE TABLE tickets (
    id VARCHAR(10) PRIMARY KEY,        -- Unique ticket ID (e.g., T-00001)
    title VARCHAR(255) NOT NULL,       -- Title of the ticket
    description TEXT NOT NULL,         -- Detailed description
    category VARCHAR(50) NOT NULL,     -- Category of the ticket
    assign VARCHAR(100),               -- Assigned user's name
    priority VARCHAR(50) NOT NULL,     -- Priority level (e.g., Low, Medium, High)
    requester VARCHAR(100) NOT NULL,   -- Requester's name
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp of ticket creation
);

**in the frontend folder**
- run -> npm run dev

**In the backend folder**
- run -> npm run server

