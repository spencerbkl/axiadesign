document.addEventListener('DOMContentLoaded', function () {
  const revealElements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach((el) => observer.observe(el));

  // --- Recherche fonctionnelle ---
  const searchInput = document.getElementById('site-search-input');
  const searchButton = document.getElementById('site-search-button');
  const resultsBox = document.getElementById('site-search-results');

  function normalize(str) {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function runSearch() {
    if (!searchInput || !resultsBox || typeof SEARCH_INDEX === 'undefined') return;
    const query = normalize(searchInput.value.trim());
    resultsBox.innerHTML = '';

    if (!query) {
      resultsBox.classList.remove('is-open');
      return;
    }

    const matches = SEARCH_INDEX.filter((item) =>
      normalize(item.label + ' ' + item.keywords).includes(query)
    );

    if (matches.length === 0) {
      const noResult = document.createElement('div');
      noResult.className = 'search-no-result';
      noResult.textContent = 'Aucun résultat pour "' + searchInput.value.trim() + '"';
      resultsBox.appendChild(noResult);
    } else {
      matches.slice(0, 8).forEach((item) => {
        const link = document.createElement('a');
        link.href = item.url;
        link.textContent = item.label;
        resultsBox.appendChild(link);
      });
    }
    resultsBox.classList.add('is-open');
  }

  if (searchInput && searchButton) {
    searchButton.addEventListener('click', runSearch);
    searchInput.addEventListener('input', runSearch);
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const firstLink = resultsBox.querySelector('a');
        if (firstLink) {
          window.location.href = firstLink.href;
        }
      }
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-bar')) {
        resultsBox.classList.remove('is-open');
      }
    });
  }
});

