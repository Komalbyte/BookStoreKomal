const API_BASE = (window.API_BASE && typeof window.API_BASE === 'string') ? window.API_BASE : 'http://localhost:5555';

const bookList = document.getElementById('book-list');
const statusEl = document.getElementById('status');
const pageEl = document.getElementById('page');
const limitEl = document.getElementById('limit');
const sortByEl = document.getElementById('sortBy');
const sortOrderEl = document.getElementById('sortOrder');
const reloadBtn = document.getElementById('reload');

// Form elements
const bookForm = document.getElementById('book-form');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const genreInput = document.getElementById('genre');
const publishedDateInput = document.getElementById('publishedDate');
const submitBtn = document.getElementById('submit-btn');

async function fetchBooks() {
  const page = Number(pageEl.value) || 1;
  const limit = Number(limitEl.value) || 10;
  const sortBy = sortByEl.value || 'createdAt';
  const sortOrder = sortOrderEl.value || 'desc';

  statusEl.textContent = 'Loading books...';
  bookList.innerHTML = '';

  try {
    const res = await fetch(`${API_BASE}/books?page=${page}&limit=${limit}&sortBy=${encodeURIComponent(sortBy)}&sortOrder=${encodeURIComponent(sortOrder)}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || `HTTP ${res.status}`);
    }
    const data = await res.json();
    const books = data?.data?.books || [];

    if (books.length === 0) {
      bookList.innerHTML = '<p class="muted">No books found.</p>';
      statusEl.textContent = '';
      return;
    }

    for (const b of books) {
      const card = document.createElement('div');
      card.className = 'book';
      const title = escapeHtml(b.title || 'Untitled');
      const author = escapeHtml(b.author || 'Unknown');
      const genre = escapeHtml(b.genre || '');
      const bookId = b._id;
      card.innerHTML = `
        <div class="title">${title}</div>
        <div class="meta">${author}${genre ? ' · ' + genre : ''}</div>
        <button class="delete-btn" data-id="${bookId}">Delete</button>
      `;
      bookList.appendChild(card);
    }

    // Attach delete event listeners to all delete buttons
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const bookId = this.getAttribute('data-id');
        deleteBook(bookId);
      });
    });

    statusEl.textContent = '';
  } catch (e) {
    statusEl.textContent = '';
    bookList.innerHTML = `<p class="muted">Error loading books: ${escapeHtml(e.message)}</p>`;
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
}

async function deleteBook(bookId) {
  if (!confirm('Are you sure you want to delete this book?')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}/books/${bookId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }
    
    alert('Book deleted successfully!');
    
    // Reload book list
    await fetchBooks();
    
  } catch (error) {
    alert(`Error deleting book: ${error.message}`);
  }
}

async function addBook(event) {
  event.preventDefault();
  
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const genre = genreInput.value.trim();
  const publishedDate = publishedDateInput.value;
  
  if (!title || !author || !genre || !publishedDate) {
    alert('Please fill in all fields');
    return;
  }
  
  submitBtn.disabled = true;
  submitBtn.textContent = 'Adding...';
  
  try {
    const response = await fetch(`${API_BASE}/books/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        author,
        genre,
        publishedDate
      })
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }
    
    const result = await response.json();
    alert('Book added successfully!');
    
    // Clear form
    titleInput.value = '';
    authorInput.value = '';
    genreInput.value = '';
    publishedDateInput.value = '';
    
    // Reload book list
    await fetchBooks();
    
  } catch (error) {
    alert(`Error adding book: ${error.message}`);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Add Book';
  }
}

// Event listeners
reloadBtn.addEventListener('click', fetchBooks);
bookForm.addEventListener('submit', addBook);

// Initial load
fetchBooks();


