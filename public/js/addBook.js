// ISBN validation
function setupISBNValidation() {
  const isbnInput = document.getElementById('isbn');
  if (!isbnInput) return;

  isbnInput.addEventListener('input', () => {
    const isbn = isbnInput.value.replace(/[-\s]/gu, '');
    const isValidISBN = /^\d{10}$/u.test(isbn) || /^\d{13}$/u.test(isbn);

    if (isbn.length > 0 && !isValidISBN) {
      isbnInput.setCustomValidity('Please provide a valid ISBN (10 or 13 digits)');
    } else {
      isbnInput.setCustomValidity('');
    }
  });
}

// year validation
function setupYearValidation() {
  const yearInput = document.getElementById('year');
  if (!yearInput) return;

  yearInput.addEventListener('input', () => {
    const year = parseInt(yearInput.value, 10);
    const currentYear = new Date().getFullYear();

    if (year > currentYear + 1) {
      yearInput.setCustomValidity('The year can not be from the future.');
    } else if (year < 1000) {
      yearInput.setCustomValidity('Please provide a valid year.');
    } else {
      yearInput.setCustomValidity('');
    }
  });
}

// nr of copies validation
function setupCopiesValidation() {
  const copiesInput = document.getElementById('copies');
  if (!copiesInput) return;

  copiesInput.addEventListener('input', () => {
    const copies = parseInt(copiesInput.value, 10);

    if (copies < 1) {
      copiesInput.setCustomValidity('Minimum number of copies should be at least 1.');
    } else if (copies > 1000) {
      copiesInput.setCustomValidity('Too many copies (maximum 1000)');
    } else {
      copiesInput.setCustomValidity('');
    }
  });
}

// category formatting
function setupCategoriesFormatting() {
  const categoriesInput = document.getElementById('categories');
  if (!categoriesInput) return;

  categoriesInput.addEventListener('blur', () => {
    const categories = categoriesInput.value
      .split(',')
      .map((cat) => {
        const trimmed = cat.trim();
        return trimmed.length > 0 ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase() : '';
      })
      .filter((cat) => cat.length > 0)
      .join(', ');

    categoriesInput.value = categories;
  });
}

// validate every form
function setupFormValidation() {
  setupISBNValidation();
  setupYearValidation();
  setupCopiesValidation();
  setupCategoriesFormatting();
}

document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('cover');
  const previewContainer = document.getElementById('previewContainer');
  const previewImage = document.getElementById('previewImage');
  const removeBtn = document.getElementById('removeImage');

  if (fileInput) {
    fileInput.addEventListener('change', function handleFileChange() {
      const file = this.files[0];

      if (file) {
        // file type check
        if (!file.type.startsWith('image/')) {
          alert('Please choose an image file (JPG, PNG, GIF)');
          this.value = '';
          return;
        }

        // file size check (5MB max)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          alert('The files size must be maximum 5MB.');
          this.value = '';
          return;
        }

        const reader = new FileReader();
        reader.onload = function onload(e) {
          if (previewImage && previewContainer) {
            previewImage.src = e.target.result; // contains the files information
            previewContainer.style.display = 'block';
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // remove image
  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      if (fileInput) fileInput.value = '';
      if (previewContainer) previewContainer.style.display = 'none';
    });
  }

  // form validation
  setupFormValidation();
});
