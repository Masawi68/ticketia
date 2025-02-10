

--table for comments
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,           
  comment TEXT NOT NULL,           
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
  ticket_id VARCHAR(20) NOT NULL,  
  CONSTRAINT fk_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);


--tickets--
CREATE TABLE tickets (
    id VARCHAR(10) PRIMARY KEY,      
    title VARCHAR(255) NOT NULL,       
    description TEXT NOT NULL,         
    category VARCHAR(50) NOT NULL,     
    assign VARCHAR(100),               
    priority VARCHAR(50) NOT NULL,     
    requester VARCHAR(100) NOT NULL,   
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    status VARCHAR(20)                
);


--Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


