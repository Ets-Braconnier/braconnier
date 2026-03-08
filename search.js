function normalizeText(str) {
    return (str || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function uniqueByUrlAndTitle(items) {
    const seen = new Set();
    return items.filter(item => {
        const key = `${item.url}||${item.title}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function scoreItem(item, query) {
    const q = normalizeText(query);
    const title = normalizeText(item.title);
    const keywords = normalizeText(item.keywords || "");
    const category = normalizeText(item.category || "");

    let score = 0;

    if (title === q) score += 100;
    if (title.startsWith(q)) score += 60;
    if (title.includes(q)) score += 35;
    if (keywords.includes(q)) score += 15;
    if (category.includes(q)) score += 8;

    return score;
}

function renderResults(matches) {
    const results = document.getElementById("searchResults");
    if (!results) return;

    if (!matches.length) {
        results.style.display = "block";
        results.innerHTML = '<div class="search-empty">Aucun résultat trouvé.</div>';
        return;
    }

    results.style.display = "block";
    results.innerHTML = `
    <div class="search-results-list">
      ${matches.map(item => `
        <a class="search-result-item" href="${item.url}">
          <span class="search-group">${item.category || "Produit"}</span>
          ${item.title}
        </a>
      `).join("")}
    </div>
  `;
}

function searchSite() {
    const input = document.getElementById("searchInput");
    const results = document.getElementById("searchResults");

    if (!input || !results || !window.SEARCH_INDEX) return;

    const query = input.value.trim();

    if (query.length < 2) {
        results.style.display = "none";
        results.innerHTML = "";
        return;
    }

    const normalizedQuery = normalizeText(query);

    let matches = window.SEARCH_INDEX.filter(item => {
        const haystack = normalizeText(
            `${item.title} ${item.keywords || ""} ${item.category || ""}`
        );
        return haystack.includes(normalizedQuery);
    });

    matches = uniqueByUrlAndTitle(matches)
        .map(item => ({ ...item, _score: scoreItem(item, query) }))
        .sort((a, b) => b._score - a._score || a.title.localeCompare(b.title))
        .slice(0, 30);

    renderResults(matches);
}

document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("searchInput");
    const button = document.getElementById("searchButton");

    if (!input) return;

    input.addEventListener("input", searchSite);

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            searchSite();
        }
    });

    if (button) {
        button.addEventListener("click", searchSite);
    }
});