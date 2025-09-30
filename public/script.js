const API_BASE = (window.API_BASE && typeof window.API_BASE === 'string') ? window.API_BASE : 'http://localhost:5555';

const bookList = document.getElementById('book-list');
const statusEl = document.getElementById('status');
const pageEl = document.getElementById('page');
const limitEl = document.getElementById('limit');
const sortByEl = document.getElementById('sortBy');
const sortOrderEl = document.getElementById('sortOrder');
const reloadBtn = document.getElementById('reload');

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
      card.innerHTML = `<div class="title">${title}</div><div class="meta">${author}${genre ? ' · ' + genre : ''}</div>`;
      bookList.appendChild(card);
    }

    statusEl.textContent = '';
  } catch (e) {
    statusEl.textContent = '';
    bookList.innerHTML = `<p class="muted">Error loading books: ${escapeHtml(e.message)}</p>`;
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
}

reloadBtn.addEventListener('click', fetchBooks);
fetchBooks();


