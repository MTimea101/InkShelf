function setupFormLoadingState() {
  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', () => {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.classList.add('btn-loading');
        submitBtn.disabled = true;
        setTimeout(() => {
          submitBtn.classList.remove('btn-loading');
          submitBtn.disabled = false;
        }, 3000);
      }
    });
  });
}

function setupAlertAutohide() {
  document.querySelectorAll('.alert').forEach((alert) => {
    setTimeout(() => {
      alert.style.transition = 'opacity 0.5s ease-out';
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 500);
    }, 5000);
  });
}

function setupCardHoverEffects() {
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
    });
  });
}

function setupImageLazyLoading() {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;

        if (!img.complete) {
          img.style.opacity = '0';
          img.style.transition = 'opacity 0.3s ease-in-out';

          img.onload = () => {
            img.style.opacity = '1';
          };
        } else {
          img.style.opacity = '1';
        }
        imageObserver.unobserve(img);
      }
    });
  });
  document.querySelectorAll('img[src]').forEach((img) => imageObserver.observe(img));
}

function setupTableRowHover() {
  document.querySelectorAll('tbody tr').forEach((row) => {
    row.addEventListener('mouseenter', () => {
      row.style.backgroundColor = '#f8f9fa';
      row.style.transform = 'scale(1.02)';
      row.style.transition = 'all 0.2s ease';
    });

    row.addEventListener('mouseleave', () => {
      row.style.backgroundColor = '';
      row.style.transform = 'scale(1)';
    });
  });
}

function setupRatingStars() {
  document.querySelectorAll('select[name="rating"]').forEach((select) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'rating-stars';
    const label = document.createElement('span');
    label.textContent = 'Értékelés: ';
    wrapper.appendChild(label);

    const updateStars = (container, rating) => {
      container.querySelectorAll('.star').forEach((star, index) => {
        star.style.opacity = index < rating ? '1' : '0.3';
        star.style.transform = index < rating ? 'scale(1.1)' : 'scale(1)';
      });
    };

    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('span');
      star.className = 'star';
      star.textContent = '⭐';
      Object.assign(star.style, {
        cursor: 'pointer',
        fontSize: '1.5rem',
        opacity: '0.3',
        transition: 'opacity 0.2s ease',
      });

      star.addEventListener('click', () => {
        select.value = i;
        updateStars(wrapper, i);
      });

      star.addEventListener('mouseenter', () => {
        updateStars(wrapper, i);
      });

      wrapper.appendChild(star);
    }

    wrapper.addEventListener('mouseleave', () => {
      updateStars(wrapper, parseInt(select.value, 10) || 0);
    });

    select.style.display = 'none';
    select.parentNode.insertBefore(wrapper, select);
  });
}

function setupSearchFormEnhancements() {
  const searchForm = document.querySelector('form[action="/"]');

  if (!searchForm) return;

  searchForm.classList.add('search-form');

  const minYear = searchForm.querySelector('input[name="minYear"]');

  const maxYear = searchForm.querySelector('input[name="maxYear"]');

  if (minYear && maxYear) {
    const validateYears = () => {
      const min = parseInt(minYear.value, 10);
      const max = parseInt(maxYear.value, 10);

      if (min && max && min > max) {
        maxYear.setCustomValidity('Maximum year can not be less then minimum year!');
      } else {
        maxYear.setCustomValidity('');
      }
    };

    minYear.addEventListener('input', validateYears);
    maxYear.addEventListener('input', validateYears);
  }
}

function setupProfilePasswordValidation() {
  const newPassword = document.getElementById('newPassword');
  const confirmPassword = document.getElementById('confirmPassword');

  if (newPassword && confirmPassword) {
    const validatePassword = () => {
      if (newPassword.value !== confirmPassword.value) {
        confirmPassword.setCustomValidity("Passwords don't match");
        confirmPassword.classList.add('is-invalid');
        confirmPassword.classList.remove('is-valid');
      } else {
        confirmPassword.setCustomValidity('');
        confirmPassword.classList.remove('is-invalid');
        if (confirmPassword.value.length >= 6) {
          confirmPassword.classList.add('is-valid');
        }
      }
    };

    newPassword.addEventListener('change', validatePassword);
    confirmPassword.addEventListener('keyup', validatePassword);
    newPassword.addEventListener('keyup', validatePassword);
  }
}

function setupProfilePasswordFormValidation() {
  const passwordForm = document.querySelector('form[action="/profile/update-password"]');

  if (passwordForm) {
    passwordForm.addEventListener('submit', (e) => {
      const currentPassword = document.getElementById('currentPassword');
      const newPassword = document.getElementById('newPassword');
      const confirmPassword = document.getElementById('confirmPassword');

      // Additional validation
      if (newPassword.value !== confirmPassword.value) {
        e.preventDefault();
        alert('New passwords do not match!');
        return false;
      }

      if (newPassword.value.length < 6) {
        e.preventDefault();
        alert('New password must be at least 6 characters long!');
        return false;
      }

      if (currentPassword.value === newPassword.value) {
        e.preventDefault();
        alert('New password must be different from current password!');
        return false;
      }

      return true;
    });
  }
}

function setupEnhancedFormValidation() {
  const forms = document.querySelectorAll('form');

  forms.forEach((form) => {
    // Store original button text
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.dataset.originalText = submitBtn.innerHTML;
    }

    form.addEventListener('submit', () => {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '⏳ Processing...';

        // Re-enable after 5 seconds in case of error
        setTimeout(() => {
          if (submitBtn && submitBtn.disabled) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = submitBtn.dataset.originalText || 'Submit';
          }
        }, 5000);
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupFormLoadingState();
  setupAlertAutohide();
  setupCardHoverEffects();
  setupImageLazyLoading();
  setupTableRowHover();
  setupRatingStars();
  setupSearchFormEnhancements();

  setupProfilePasswordValidation();
  setupProfilePasswordFormValidation();
  setupEnhancedFormValidation();
});
