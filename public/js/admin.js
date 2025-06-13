document.addEventListener('DOMContentLoaded', () => {
  // tabs
  const statsTab = document.getElementById('stats-tab');
  const usersTab = document.getElementById('users-tab');
  const statsSection = document.getElementById('stats-section');
  const usersSection = document.getElementById('users-section');

  // search
  const searchInput = document.getElementById('user-search');
  const rows = document.querySelectorAll('.user-row');
  const searchResults = document.getElementById('search-results');

  const resultText = document.createElement('small');
  searchResults.appendChild(resultText);

  // tab click events
  if (statsTab && usersTab) {
    statsTab.addEventListener('click', (e) => {
      e.preventDefault();
      statsTab.classList.add('active');
      usersTab.classList.remove('active');
      statsSection.style.display = 'block';
      usersSection.style.display = 'none';
    });

    usersTab.addEventListener('click', (e) => {
      e.preventDefault();
      usersTab.classList.add('active');
      statsTab.classList.remove('active');
      usersSection.style.display = 'block';
      statsSection.style.display = 'none';
    });
  }

  // search
  if (searchInput && rows.length > 0) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      let visibleCount = 0;

      rows.forEach((row) => {
        const name = row.querySelector('.user-name')?.textContent.toLowerCase() || '';
        const email = row.querySelector('.user-email')?.textContent.toLowerCase() || '';
        const visible = name.includes(query) || email.includes(query);

        row.style.display = visible ? '' : 'none';
        if (visible) visibleCount++;
      });

      searchResults.textContent = '';

      if (query) {
        resultText.textContent = `${visibleCount} results found for "${query}"`;
        resultText.className = 'text-success';
      } else {
        resultText.textContent = `${rows.length} users total`;
        resultText.className = 'text-muted';
      }

      searchResults.appendChild(resultText);
    });
  }
});
