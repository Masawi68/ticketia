import express from 'express';
import cors from 'cors';
import pkg from 'pg'; 
const { Pool } = pkg; 
import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const app = express();
const port = process.env.PORT || 3000;
const secretKey = process.env.JWT_SECRET || 'your-secret-key'; 
const SECRET_KEY = "your_jwt_secret"; 
const connectionString = process.env.DB_URL;

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
}); 

pool.connect();

app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
  res.send("API Working");
});


app.post('/comments', async (req, res) => {
  const { comment, ticket_id } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO comments (comment, ticket_id) VALUES ($1, $2) RETURNING *',
      [comment, ticket_id || null] 
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});


app.get('/comments', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, comment 
       FROM comments 
       WHERE ticket_id IS NULL`
    );
    res.json(result.rows); 
  } catch (error) {
    console.error('Error retrieving comments:', error);
    res.status(500).send('Error retrieving comments');
  }
});


app.put('/comments/:id', async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  if (!comment) {
    return res.status(400).json({ error: 'Comment field cannot be empty.' });
  }

  try {
    const result = await pool.query(
      'UPDATE comments SET comment = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [comment, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});
  

app.delete('/comments/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
  
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid comment id' });
    }
  
    try {
      const result = await pool.query(
        'DELETE FROM comments WHERE id = $1 RETURNING *',
        [id]
      );
  
      if (result.rows.length > 0) {
        res.status(200).json({ message: 'Comment deleted successfully' });
      } else {
        res.status(404).json({ error: 'Comment not found' });
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({ error: 'Failed to delete comment' });
    }
});

app.post('/tickets', async (req, res) => {
  const { title, description, category, assign, priority, requester, comments, status } = req.body;

  try {
    const result = await pool.query('SELECT id FROM tickets ORDER BY id DESC LIMIT 1');
    let nextId;
    if (result.rows.length > 0) {
      const lastId = result.rows[0].id;
      const numericPart = parseInt(lastId.split('-')[1], 10);
      nextId = `T-${String(numericPart + 1).padStart(5, '0')}`;
    } else {
      nextId = 'T-00001';
    }

    const ticketInsertResult = await pool.query(
      `INSERT INTO tickets (id, title, description, category, assign, priority, requester, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [nextId, title, description, category, assign, priority, requester, 'New']
    );

    if (comments && comments.length > 0) {
      const updateCommentQueries = comments.map((comment) =>
        pool.query('UPDATE comments SET ticket_id = $1 WHERE id = $2', [nextId, comment.id])
      );
      await Promise.all(updateCommentQueries);
    }

    res.status(201).json(ticketInsertResult.rows[0]);
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

app.get('/tickets', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tickets ORDER BY created_at DESC');
    res.json(result.rows); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving tickets');
  }
});



app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      console.error('User not found for email:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.error('Invalid password for email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ token, message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/tickets/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('BEGIN');

    await pool.query('DELETE FROM comments WHERE ticket_id = $1', [id]);

    const result = await pool.query('DELETE FROM tickets WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length > 0) {
     
      await pool.query('COMMIT');
      res.status(200).json({ message: 'Ticket and associated comments deleted successfully' });
    } else {
      await pool.query('ROLLBACK');
      res.status(404).json({ error: 'Ticket not found' });
    }
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error deleting ticket:', error);
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
});

 app.get('/tickets/:ticketId', async (req, res) => {
  const { ticketId } = req.params;
  try {
    const ticketResult = await pool.query('SELECT * FROM tickets WHERE id = $1', [ticketId]);
    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json(ticketResult.rows[0]);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
});
 

app.put('/tickets/:ticketId', async (req, res) => {
  const { ticketId } = req.params;
  const { title, description, category, assign, priority, requester, status } = req.body;

  try {
    const ticketResult = await pool.query('SELECT * FROM tickets WHERE id = $1', [ticketId]);

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    const updateResult = await pool.query(
      `UPDATE tickets SET title = $1, description = $2, category = $3, assign = $4, priority = $5, requester = $6, status = $7
       WHERE id = $8 RETURNING *`,
      [title, description, category, assign, priority, requester, status, ticketId]
    );

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ error: 'Ticket update failed' });
    }

    res.status(200).json(updateResult.rows[0]);
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ error: 'Failed to update ticket' });
  }
}); 


 app.get('/comments/:ticketId', async (req, res) => {
  const { ticketId } = req.params;
  try {
    const commentsResult = await pool.query('SELECT * FROM comments WHERE ticket_id = $1', [ticketId]);
    res.json(commentsResult.rows);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
}); 

  
app.listen(port, () => console.log(`Server started on PORT: ${port}`));

