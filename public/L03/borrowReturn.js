function isValidIsbn(isbn) {
  return /^(?:\d{10}|\d{13})$/u.test(isbn.replace(/-/gu, ''));
}

function isNonEmptyString(text) {
  return typeof text === 'string' && text.trim().length > 0;
}

function validateBorrowForm(name, isbn, action) {
  if (!isNonEmptyString(name) || name.length < 2) {
    return 'A név legalább 2 karakter hosszú legyen!';
  }
  if (!isValidIsbn(isbn)) {
    return 'Az ISBN 10 vagy 13 számjegyből kell álljon!';
  }
  if (action !== 'borrow' && action !== 'return') {
    return 'Hibás művelet típus!';
  }
  return null;
}

async function submitBorrowForm(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const name = formData.get('name')?.trim();
  const isbn = formData.get('isbn')?.trim();
  const action = formData.get('action');
  const messageEl = document.getElementById('message');

  const validationError = validateBorrowForm(name, isbn, action);

  if (validationError) {
    messageEl.textContent = validationError;
    messageEl.style.color = 'red';
    return;
  }

  try {
    const response = await fetch('/borrow-return', {
      method: 'POST',
      body: new URLSearchParams(formData),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const contentType = response.headers.get('Content-Type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error('Nem sikerült feldolgozni a választ (nem JSON).');
    }

    const result = await response.json();

    messageEl.textContent = result.message || 'Hiba történt!';
    messageEl.style.color = response.ok ? 'green' : 'red';
  } catch (err) {
    console.error('Hiba történt:', err);
    messageEl.textContent = err.message || 'Ismeretlen hiba történt!';
    messageEl.style.color = 'red';
  }
}

document.getElementById('borrowReturnForm').addEventListener('submit', submitBorrowForm);
