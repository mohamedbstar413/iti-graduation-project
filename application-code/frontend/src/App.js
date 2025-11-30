import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Search, X } from 'lucide-react';

const API_URL =  "/api";

export default function BooksApp() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    published_year: '',
    genre: ''
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/books`);
      const data = await response.json();
      if (data.success) {
        setBooks(data.data);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      alert('Failed to fetch books. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.author) {
      alert('Title and Author are required');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      
      if (data.success) {
        setBooks([...books, data.data]);
        setFormData({ title: '', author: '', isbn: '', published_year: '', genre: '' });
        setShowForm(false);
        alert('Book added successfully!');
      }
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Failed to add book');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const filteredBooks = books.filter(book =>
    book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.genre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.headerLeft}>
              <BookOpen style={styles.icon} />
              <h1 style={styles.title}>Books Library</h1>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              style={styles.addButton}
            >
              {showForm ? <X size={20} /> : <Plus size={20} />}
              <span style={styles.buttonText}>{showForm ? 'Cancel' : 'Add Book'}</span>
            </button>
          </div>
        </div>

        {/* Add Book Form */}
        {showForm && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Add New Book</h2>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Author *</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>ISBN</label>
                <input
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Published Year</label>
                <input
                  type="number"
                  name="published_year"
                  value={formData.published_year}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              
              <div style={{...styles.formGroup, gridColumn: '1 / -1'}}>
                <label style={styles.label}>Genre</label>
                <input
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              
              <div style={{gridColumn: '1 / -1'}}>
                <button
                  onClick={handleSubmit}
                  style={styles.submitButton}
                >
                  Add Book
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div style={styles.searchCard}>
          <div style={styles.searchContainer}>
            <Search style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search books by title, author, or genre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>

        {/* Books List */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            All Books ({filteredBooks.length})
          </h2>
          
          {loading ? (
            <div style={styles.emptyState}>Loading books...</div>
          ) : filteredBooks.length === 0 ? (
            <div style={styles.emptyState}>
              {searchTerm ? 'No books found matching your search.' : 'No books in the library yet. Add one!'}
            </div>
          ) : (
            <div style={styles.booksGrid}>
              {filteredBooks.map((book) => (
                <div key={book.id} style={styles.bookCard}>
                  <h3 style={styles.bookTitle}>{book.title}</h3>
                  <p style={styles.bookDetail}>
                    <strong>Author:</strong> {book.author}
                  </p>
                  {book.isbn && (
                    <p style={styles.bookDetail}>
                      <strong>ISBN:</strong> {book.isbn}
                    </p>
                  )}
                  {book.published_year && (
                    <p style={styles.bookDetail}>
                      <strong>Year:</strong> {book.published_year}
                    </p>
                  )}
                  {book.genre && (
                    <span style={styles.badge}>{book.genre}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    padding: '24px',
    marginBottom: '24px',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  icon: {
    width: '32px',
    height: '32px',
    color: '#667eea',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1a202c',
    margin: 0,
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  buttonText: {
    marginLeft: '4px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    padding: '24px',
    marginBottom: '24px',
  },
  cardTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: '16px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#4a5568',
    marginBottom: '4px',
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #cbd5e0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  searchCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    padding: '16px',
    marginBottom: '24px',
  },
  searchContainer: {
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#a0aec0',
    width: '20px',
    height: '20px',
  },
  searchInput: {
    width: '100%',
    padding: '10px 12px 10px 40px',
    border: '1px solid #cbd5e0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#718096',
  },
  booksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
  bookCard: {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '16px',
    transition: 'box-shadow 0.2s',
    cursor: 'pointer',
  },
  bookTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: '8px',
  },
  bookDetail: {
    fontSize: '14px',
    color: '#4a5568',
    marginBottom: '4px',
  },
  badge: {
    display: 'inline-block',
    marginTop: '8px',
    backgroundColor: '#e6e6fa',
    color: '#5a67d8',
    fontSize: '12px',
    padding: '4px 8px',
    borderRadius: '4px',
  },
};