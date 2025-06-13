function isPositiveIntegerOrEmpty(value) {
  if (!value) {
    return true;
  }
  const number = Number(value);
  return Number.isInteger(number) && number >= 0;
}

function validateSearchForm(minYear, maxYear) {
  if (!isPositiveIntegerOrEmpty(minYear)) {
    return 'A minimum évnek nemnegatív egész számnak kell lennie!';
  }
  if (!isPositiveIntegerOrEmpty(maxYear)) {
    return 'A maximum évnek nemnegatív egész számnak kell lennie!';
  }
  if (minYear && maxYear && Number(minYear) > Number(maxYear)) {
    return 'A minimum év nem lehet nagyobb, mint a maximum év!';
  }
  return null;
}

async function submitSearchForm(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const minYear = formData.get('minYear')?.trim();
  const maxYear = formData.get('maxYear')?.trim();
  const messageEl = document.getElementById('message');
  const resultsDiv = document.getElementById('results');

  const validationError = validateSearchForm(minYear, maxYear);

  if (validationError) {
    messageEl.textContent = validationError;
    messageEl.style.color = 'red';
    return;
  }

  try {
    const params = new URLSearchParams(formData);
    const res = await fetch(`/search-books?${params.toString()}`);
    const books = await res.json();

    resultsDiv.innerHTML = ''; // torli az ezelotti eredemnyeket

    if (books.length === 0) {
      const noResult = document.createElement('p');
      noResult.textContent = 'Nincs találat.';
      resultsDiv.appendChild(noResult);
    } else {
      books.forEach((book) => {
        const card = document.createElement('div');
        card.className = 'book-card';

        const title = document.createElement('strong');
        title.textContent = `${book.title} (${book.year})`;
        card.appendChild(title);

        card.appendChild(document.createElement('br'));

        const author = document.createElement('em');
        author.textContent = book.author;
        card.appendChild(author);

        card.appendChild(document.createElement('br'));

        const copies = document.createElement('small');
        copies.textContent = `${book.copies} példány elérhető`;
        card.appendChild(copies);

        resultsDiv.appendChild(card);
      });
    }
  } catch (err) {
    console.error('Hiba történt a keresés során:', err);
    messageEl.textContent = 'Hiba történt a keresés során!';
    messageEl.style.color = 'red';
  }
}

document.getElementById('searchForm').addEventListener('submit', submitSearchForm);
