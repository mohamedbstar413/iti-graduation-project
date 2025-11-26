// app.js
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const cors = require('cors');

// Middleware to parse JSON
app.use(express.json());
app.use(cors());
// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('✓ Connected to MySQL database');
    connection.release();
  })
  .catch(err => {
    console.error('✗ Database connection failed:', err.message);
  });

// GET all books
app.get('/books', async (req, res) => {
  try {
    const [books] = await pool.query('SELECT * FROM books');
    res.json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET single book by ID
app.get('/books/:id', async (req, res) => {
  try {
    const [books] = await pool.query(
      'SELECT * FROM books WHERE id = ?',
      [req.params.id]
    );
    
    if (books.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }
    
    res.json({
      success: true,
      data: books[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST new book
app.post('/books', async (req, res) => {
  try {
    const { title, author, isbn, published_year, genre } = req.body;
    
    // Validation
    if (!title || !author) {
      return res.status(400).json({
        success: false,
        error: 'Title and author are required'
      });
    }
    
    const [result] = await pool.query(
      'INSERT INTO books (title, author, isbn, published_year, genre) VALUES (?, ?, ?, ?, ?)',
      [title, author, isbn, published_year, genre]
    );
    
    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        title,
        author,
        isbn,
        published_year,
        genre
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
