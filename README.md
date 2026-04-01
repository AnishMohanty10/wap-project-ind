# ✈️ Jetsetter — Global Currency Converter

> *See how far your money flies.*

A travel-focused, multi-currency converter built as a graded college project. Jetsetter lets you pick multiple destination currencies at once and instantly compare how your money stretches across the world — complete with live exchange rates, flag icons, and a 7-day historical sparkline chart.

---

## 📸 Preview

> *(Add a screenshot or GIF of the running app here)*

---

## 🌍 Features

| Feature | Description |
|---|---|
| 🔁 **Multi-Currency Conversion** | Select multiple target currencies simultaneously and view all conversions at a glance |
| 🏳️ **Flag Icons** | Each currency is paired with its country flag for quick visual identification |
| 🕐 **Last Updated Timestamp** | Displays exactly when the exchange rates were last fetched |
| 🔄 **Base Currency Toggle** | Instantly swap your source currency without re-entering an amount |
| 📊 **7-Day Sparkline** | A CSS bar chart showing the historical rate trend over the last week |

---

## 🛠️ Tech Stack

- **HTML / CSS / JavaScript** *(vanilla or your chosen framework)*
- **[Frankfurter API](https://frankfurter.dev/)** — free, open-source exchange rate API
- No paid services or API keys required

---

## 🔌 API Reference

This project uses the **[Frankfurter](https://frankfurter.dev/)** public API.

### Endpoints Used

**Latest rates**
```
GET https://api.frankfurter.app/latest?from=USD&to=EUR,INR,GBP
```

**Historical rates (for sparkline)**
```
GET https://api.frankfurter.app/YYYY-MM-DD?from=USD&to=EUR
```

**All available currencies**
```
GET https://api.frankfurter.app/currencies
```

> No authentication or API key is needed.

---

## 🗂️ Project Structure

```
jetsetter/
├── index.html          # Main HTML file
├── style.css           # Stylesheet (financial-app aesthetic)
├── app.js              # Core logic — fetch, convert, render
├── sparkline.js        # 7-day historical chart rendering
├── flags/              # Flag icon assets (or CDN-linked)
└── README.md
```

---

## 🚀 Getting Started

1. **Clone or download** this repository:
   ```bash
   git clone https://github.com/your-username/jetsetter.git
   cd jetsetter
   ```

2. **Open `index.html`** directly in your browser — no build step or server required.

3. That's it! The app fetches live data from the Frankfurter API on load.

> ⚠️ If you see CORS errors, serve the project via a local server:
> ```bash
> npx serve .
> # or
> python -m http.server 8000
> ```

---

## 📊 Sparkline Chart

The 7-day sparkline is built purely with **CSS bar charts** — no chart library needed.

- Makes 7 separate `GET` requests to the Frankfurter historical endpoint (one per day)
- Normalises the values to render proportional bar heights
- Displayed inline below each target currency card

---

## 💡 UI Design Notes

- **Aesthetic:** Clean, financial-app style — inspired by tools like Revolut and Wise
- **Color Palette:** Neutral whites/greys with a strong accent color for interactivity
- **Typography:** Monospaced or tabular number fonts for rate values (e.g. `font-variant-numeric: tabular-nums`)
- **Flag Icons:** Sourced via [Flagcdn](https://flagcdn.com/) or a local `/flags` folder
- **Responsive:** Mobile-first layout, usable on phones during travel

---

## 🎯 Grading Checklist

- [x] Multi-select target currency conversion
- [x] "Last Updated" timestamp displayed
- [x] Base currency toggle
- [x] Flag icons per currency
- [x] 7-day historical sparkline (CSS bar chart)
- [x] Live data from Frankfurter public API
- [x] Clean, financial-app UI

---

## ⚠️ Known Limitations

- Frankfurter API does not include all world currencies (focuses on major ones)
- Historical data may have gaps on weekends/bank holidays — the sparkline handles this gracefully by skipping missing dates
- Exchange rates are updated once per business day by the European Central Bank

---

## 📄 License

This project was created for academic/educational purposes as part of a college graded assignment.

---

## 🙏 Acknowledgements

- [Frankfurter.dev](https://frankfurter.dev/) for the free, reliable exchange rate API
- [Flagcdn.com](https://flagcdn.com/) for open-source flag images
- European Central Bank (ECB) for the underlying rate data
