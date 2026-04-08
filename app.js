let isLoading = false;
let currentRequestId = 0;
const baseSelect = document.getElementById("baseCurrency");
const amountInput = document.getElementById("amount");
const resultsDiv = document.getElementById("results");
const loadingText = document.getElementById("loading");
const lastUpdated = document.getElementById("lastUpdated");


const searchInput = document.getElementById("searchInput");
const filterBtns = document.querySelectorAll(".filter-btn");
const sortSelect = document.getElementById("sortSelect");
const themeToggle = document.getElementById("themeToggle");
const controlsPanel = document.getElementById("controlsPanel");

let currenciesList = {}; 
let currenciesArray = []; 
let favorites = JSON.parse(localStorage.getItem("jetsetter-favorites")) || [];


let searchTerm = "";
let currentFilter = "all"; 
let currentSort = "value-desc";
const TOP_CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'NZD'];


if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
});


const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {

  entries.map(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('card-enter');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easeProgress = progress * (2 - progress);
    const currentValue = start + easeProgress * (end - start);
    
    const currencyCode = obj.dataset.currency;
    const formatter = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currencyCode,
        maximumFractionDigits: 2
    });
    
    obj.innerHTML = formatter.format(currentValue);
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      obj.innerHTML = formatter.format(end);
    }
  };
  window.requestAnimationFrame(step);
}

async function loadCurrencies() {
  try {
    const res = await fetch("https://api.frankfurter.dev/v1/currencies");
    currenciesList = await res.json();


    Object.keys(currenciesList).map(code => {
      baseSelect.add(new Option(`${code} - ${currenciesList[code]}`, code));
    });

    baseSelect.value = "USD";
  } catch (err) {
    console.error("Error loading currencies:", err);
  }
}

async function fetchRates() {
  const requestId = ++currentRequestId;
  if (isLoading) return;
  isLoading = true;

  const base = baseSelect.value;
  const amount = parseFloat(amountInput.value) || 0;

  loadingText.classList.remove("hidden");
  
  try {

    const url = `https://api.frankfurter.dev/v1/latest?base=${base}`;
    const res = await fetch(url);
    const data = await res.json();

    if (requestId !== currentRequestId) return;
    lastUpdated.textContent = "Rates auto-updated: " + (data.date || new Date().toISOString().split('T')[0]);


    currenciesArray = Object.keys(data.rates).map(code => {
      return {
        code: code,
        name: currenciesList[code] || code,
        baseValue: data.rates[code],
        calculatedValue: data.rates[code] * amount,
        isFavorite: favorites.includes(code)
      };
    });


    controlsPanel.style.display = "flex";
    
    renderCards();
  } catch (err) {
    console.error("Error fetching rates:", err);
    resultsDiv.innerHTML = "<p class='no-results'>Error fetching data. Check your connection.</p>";
  } finally {
    isLoading = false;
    loadingText.classList.add("hidden");
  }
}

function toggleFavorite(code) {

  if (favorites.includes(code)) {
    favorites = favorites.filter(f => f !== code);
  } else {
    favorites = [...favorites, code];
  }
  localStorage.setItem("jetsetter-favorites", JSON.stringify(favorites));
  
  // Update state array via map
  currenciesArray = currenciesArray.map(c => 
    c.code === code ? { ...c, isFavorite: !c.isFavorite } : c
  );
  
  renderCards();
}

function renderCards() {

  

  const filtered = currenciesArray.filter(c => {

    if (currentFilter === 'top' && !TOP_CURRENCIES.includes(c.code)) return false;
    

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return c.code.toLowerCase().includes(term) || c.name.toLowerCase().includes(term);
    }
    return true;
  });


  const sorted = [...filtered].sort((a, b) => {

    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;


    if (currentSort === 'code-asc') {
      return a.code.localeCompare(b.code);
    } else if (currentSort === 'value-asc') {
      return a.calculatedValue - b.calculatedValue;
    } else {

      return b.calculatedValue - a.calculatedValue;
    }
  });


  resultsDiv.innerHTML = "";

  if (sorted.length === 0) {
    resultsDiv.innerHTML = "<p class='no-results'>No currencies found matching your criteria.</p>";
    return;
  }


  const tempFrag = document.createDocumentFragment();
  
  sorted.map(c => {
    const card = document.createElement("div");
    card.className = "card";
    
    const favClass = c.isFavorite ? "fav-btn active" : "fav-btn";
    
    card.innerHTML = `
      <div class="card-content">
          <div class="card-header">
            <button class="${favClass}" data-code="${c.code}" aria-label="Favorite">⭐</button>
            <h3>${c.code}</h3>
          </div>
          <small>Converted from ${baseSelect.value}</small>
      </div>
      <p class="currency-value" data-currency="${c.code}">$0.00</p>
    `;
    

    card.querySelector('.fav-btn').addEventListener('click', () => toggleFavorite(c.code));
    
    tempFrag.appendChild(card);
    observer.observe(card);
    

    setTimeout(() => {
      const valueEl = card.querySelector('.currency-value');
      animateValue(valueEl, 0, c.calculatedValue, 600);
    }, 0);
    
    return card;
  });

  resultsDiv.appendChild(tempFrag);
}


loadCurrencies().then(fetchRates);

baseSelect.addEventListener("change", fetchRates);


let amountTimer;
amountInput.addEventListener("input", () => {
  clearTimeout(amountTimer);
  amountTimer = setTimeout(() => {
    const amount = parseFloat(amountInput.value) || 0;
    

    currenciesArray = currenciesArray.map(c => ({
      ...c,
      calculatedValue: c.baseValue * amount
    }));
    
    renderCards();
  }, 300); 
});


let searchTimer;
searchInput.addEventListener("input", (e) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    searchTerm = e.target.value.trim();
    renderCards();
  }, 300); 
});


Array.from(filterBtns).map(btn => {
  btn.addEventListener("click", (e) => {

    Array.from(filterBtns).map(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentFilter = e.target.dataset.filter;
    renderCards();
  });
});


sortSelect.addEventListener("change", (e) => {
  currentSort = e.target.value;
  renderCards();
});
