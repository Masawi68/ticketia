-- comments-- 
/* add this to comments table */ ALTER TABLE comments ADD COLUMN ticket_id VARCHAR(20) REFERENCES tickets(id) ON DELETE CASCADE;

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,           -- Unique identifier for each comment
  comment TEXT NOT NULL,           -- The actual comment text
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp for when the comment was created
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- Timestamp for when the comment was last updated
);

ALTER TABLE comments
ADD CONSTRAINT fk_ticket
FOREIGN KEY (ticket_id)
REFERENCES tickets(id)
ON DELETE CASCADE;

--table for comments

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,           -- Unique identifier for each comment
  comment TEXT NOT NULL,           -- The actual comment text
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp for when the comment was created
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp for when the comment was last updated
  ticket_id VARCHAR(20) NOT NULL,  -- Reference to the associated ticket
  CONSTRAINT fk_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);



--tickets--
CREATE TABLE tickets (
    id VARCHAR(10) PRIMARY KEY,        -- Unique ticket ID (e.g., T-00001)
    title VARCHAR(255) NOT NULL,       -- Title of the ticket
    description TEXT NOT NULL,         -- Detailed description
    category VARCHAR(50) NOT NULL,     -- Category of the ticket
    assign VARCHAR(100),               -- Assigned user's name
    priority VARCHAR(50) NOT NULL,     -- Priority level (e.g., Low, Medium, High)
    requester VARCHAR(100) NOT NULL,   -- Requester's name
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp of ticket creation
    status VARCHAR(20)                 -- Status of the ticket (e.g., Open, Closed, In Progress)
);



--Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


