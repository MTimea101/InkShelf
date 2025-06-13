const isbnInput = document.querySelector('input[name="isbn"]');
const titleInput = document.querySelector('input[name="title"]');
const authorInput = document.querySelector('input[name="author"]');
const yearInput = document.querySelector('input[name="year"]');
const summaryInput = document.querySelector('textarea[name="summary"]');
const copiesInput = document.querySelector('input[name="copies"]');
const coverInput = document.querySelector('input[name="cover"]');
const form = document.getElementById('addBookForm');
const messageEl = document.getElementById('message');

function checkEmptyFields() {
  return (
    !isbnInput.value.trim() ||
    !titleInput.value.trim() ||
    !authorInput.value.trim() ||
    !yearInput.value.trim() ||
    !summaryInput.value.trim() ||
    !copiesInput.value.trim() ||
    !coverInput.files[0]
  );
}

function showMessage(text, color) {
  messageEl.textContent = text;
  messageEl.style.color = color;
}

function isValidISBN(isbn) {
  const cleaned = isbn.replace(/-/gu, '');
  return /^(?:\d{10}|\d{13})$/u.test(cleaned);
}

function isValidYear(year) {
  const yearValue = parseInt(year, 10);
  return !isNaN(yearValue) && yearValue > 0;
}

function isValidCopies(copies) {
  const copiesValue = parseInt(copies, 10);
  return !isNaN(copiesValue) && copiesValue >= 0;
}

function isValidSummary(summary) {
  return summary.trim().length >= 10;
}

function validateForm() {
  if (checkEmptyFields()) {
    return 'Minden mezőt ki kell tölteni!';
  }

  if (!isValidISBN(isbnInput.value)) {
    return 'Az ISBN 10 vagy 13 számjegyből kell álljon!';
  }

  if (!isValidYear(yearInput.value)) {
    return 'Az évnek pozitív számnak kell lennie!';
  }

  if (!isValidCopies(copiesInput.value)) {
    return 'A példányszámnak nemnegatív számnak kell lennie!';
  }

  if (!isValidSummary(summaryInput.value)) {
    return 'Az összefoglaló legalább 10 karakter hosszú legyen!';
  }

  return null;
}

async function submitForm(event) {
  event.preventDefault();

  const error = validateForm();
  if (error) {
    showMessage(error, 'red');
    return;
  }

  const formData = new FormData(form);

  try {
    const response = await fetch('/add-book', {
      method: 'POST',
      body: formData,
    });

    const contentType = response.headers.get('Content-Type') || '';
    const result = contentType.includes('application/json')
      ? await response.json()
      : { message: 'Ismeretlen válasz formátum.' };

    showMessage(result.message, response.ok ? 'green' : 'red');

    if (response.ok) {
      form.reset();
    }
  } catch (fetchErr) {
    console.error('Hálózati hiba:', fetchErr);
    showMessage('Hiba történt a feltöltés során!', 'red');
  }
}

form.addEventListener('submit', submitForm);
