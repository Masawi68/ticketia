# Project Name
Ticketia

## Overview 
Ticketia is a ticketing system for IT organizations that helps them track and manage support tickets more efficiently. The project was initiated to streamline the process of managing IT requests, ensuring that issues are logged, sorted, and resolved in an orderly fashion. Ticketia improves response times, collaboration, and responsibility across IT teams by providing a systematic ticket tracking system.

## Features
1. Ticket Management – Create, update, and track IT support tickets.
2. Status Tracking – Assign ticket statuses: New, In Progress, On Hold, Completed.
3. Categorization – Classify tickets based on issue type for better organization.
4. User Assignment – Assign tickets to specific users or teams.
5. Comments & Updates – Add, edit, and delete comments for real-time communication.
6. Time Tracking – Record the creation time and expected completion time for each ticket.
7. Search & Filters – Easily search and filter tickets based on status, category, or user.
8. Notifications – Send alerts for ticket updates, assignments, and status changes.
9. Dashboard & Analytics – View ticket trends, resolution times, and team performance.
10. Role-Based Access Control – Define user roles and permissions for security.


## Project Structure

```
Ticketia/
│-- backend/   # Node.js backend
│-- frontend/  # React frontend (Vite)
│-- .env       # Environment variables (not included in Git)
│-- README.md  # Project documentation
```

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [PostgreSQL](https://www.postgresql.org/)

##  Getting Started

### 1️ Clone the Repository

```sh
git clone https://github.com/Masawi68/ticketia.git
cd Ticketia
```

### 2️ Set Up Environment Variables

Create a **.env** file in the **backend/** folder and add your database credentials:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=ticketia_db
```

### 3️  Install Dependencies

Navigate to both frontend and backend folders and install dependencies:

```sh
# Backend setup
cd backend
npm install

# Frontend setup
cd ../frontend
npm install
```

### 4️ Set Up the Database

Start PostgreSQL and create the required tables.

#### Create Users Table:
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Create Tickets Table:
```sql
CREATE TABLE tickets (
    id VARCHAR(10) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    assign VARCHAR(100),
    priority VARCHAR(50) NOT NULL,
    requester VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Create Comments Table:
```sql
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    comment TEXT NOT NULL,
    ticket_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);
```

### 5️ Run the Project

Start the **backend** server:
```sh
cd backend
npm run server
```

Start the **frontend**:
```sh
cd frontend
npm run dev
```

### 6️ Create a User (Example Script)

You can use the following script to insert a user into the database:

```javascript
import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';
import bcrypt from 'bcrypt';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function createUser(email, plainTextPassword) {
  const hashedPassword = await bcrypt.hash(plainTextPassword, 10);
  await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [email, hashedPassword]);
  console.log('User created successfully');
}

createUser('admin@example.com', 'securepassword1')
  .catch(console.error)
  .finally(() => pool.end());
```

## Next Steps
- Implement authentication & authorization.

---
Happy coding! 

## Dependencies
### Frontend
#### React & UI

- react
- react-dom
- react-router-dom
- @fortawesome/fontawesome-svg-core
- @fortawesome/free-brands-svg-icons
- @fortawesome/free-regular-svg-icons
- @fortawesome/free-solid-svg-icons
- @fortawesome/react-fontawesome

#### Development & Build Tools

- vite
- @vitejs/plugin-react
- tailwindcss
- postcss
- autoprefixer

#### Linting & Code Quality

- eslint
- eslint-plugin-react
- eslint-plugin-react-hooks
- eslint-plugin-react-refresh
- @eslint/js
- globals

### Backend
#### Server & Middleware

- express
- body-parser
- cors
- helmet
- morgan

#### Authentication & Security

- bcrypt
- jsonwebtoken
- express-validator
- dotenv

#### Database

- pg

#### Development Tools

- nodemon
- eslint

