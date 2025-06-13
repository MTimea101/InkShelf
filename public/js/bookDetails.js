/* global axios */
document.addEventListener('DOMContentLoaded', () => {
  // wishlist
  const wishlistBtn = document.querySelector('#wishlist-btn');
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', async () => {
      const isbn = wishlistBtn.dataset.isbn;
      try {
        const response = await axios.post(`/wishlist/${isbn}`);
        alert(response.data.message);
      } catch {
        alert('An error accured while addign to wishlist.');
      }
    });
  }

  // share link
  const copyBtn = document.getElementById('copy-btn');
  const shareInput = document.getElementById('share-url');
  const feedback = document.getElementById('copy-feedback');

  if (copyBtn && shareInput && feedback) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(shareInput.value);
        feedback.style.display = 'block';
        setTimeout(() => (feedback.style.display = 'none'), 2000);
      } catch {
        feedback.textContent = 'Failed to copy link.';
        feedback.style.display = 'block';
      }
    });
  }
});
