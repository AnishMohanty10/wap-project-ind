let isLoading = false;
let currentRequestId = 0;
const baseSelect = document.getElementById("baseCurrency");
const targetSelect = document.getElementById("targetCurrencies");
const amountInput = document.getElementById("amount");
const resultsDiv = document.getElementById("results");
const loadingText = document.getElementById("loading");
const lastUpdated = document.getElementById("lastUpdated");

let currencies = {};


async function loadCurrencies() {
  try {
    const res = await fetch("https://api.frankfurter.app/currencies");
    currencies = await res.json();

    Object.keys(currencies).forEach(code => {
      const option1 = new Option(code, code);
      const option2 = new Option(code, code);

      baseSelect.add(option1);
      targetSelect.add(option2);
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
  const amount = amountInput.value;

  const targets = Array.from(targetSelect.selectedOptions)
    .map(option => option.value);

  if (targets.length === 0) {
    resultsDiv.innerHTML = "<p>Please select at least one target currency.</p>";
    isLoading = false;
    return;
  }

  loadingText.classList.remove("hidden");
  resultsDiv.innerHTML = "";

  try {
    const url = `https://api.frankfurter.app/latest?from=${base}&to=${targets.join(",")}`;
    const res = await fetch(url);
    const data = await res.json();


    if (requestId !== currentRequestId) return;

    lastUpdated.textContent = "Last Updated: " + data.date;

    Object.keys(data.rates).forEach(currency => {
      const value = data.rates[currency] * amount;

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
  <div>
    <h3>${currency}</h3>
    <small>Converted from ${base}</small>
  </div>
  <p>${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
`;

      resultsDiv.appendChild(card);
    });

  } catch (err) {
    console.error("Error fetching rates:", err);
    resultsDiv.innerHTML = "<p>Error fetching data.</p>";
  } finally {
    isLoading = false;
    loadingText.classList.add("hidden");
  }
}

loadCurrencies();

baseSelect.addEventListener("change", fetchRates);
targetSelect.addEventListener("change", fetchRates);
let debounceTimer;

amountInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    fetchRates();
  }, 500); 
});

