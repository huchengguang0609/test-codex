const demoStocks = [
  { ticker: "NVDA", price: 132, growth: 96, value: 54, momentum: 95, risk: 42, theme: 100 },
  { ticker: "AVGO", price: 184, growth: 88, value: 62, momentum: 86, risk: 38, theme: 94 },
  { ticker: "PLTR", price: 24, growth: 82, value: 66, momentum: 92, risk: 58, theme: 91 },
  { ticker: "UBER", price: 68, growth: 76, value: 72, momentum: 75, risk: 44, theme: 70 },
  { ticker: "CEG", price: 198, growth: 72, value: 63, momentum: 82, risk: 36, theme: 89 },
  { ticker: "VST", price: 92, growth: 78, value: 69, momentum: 88, risk: 50, theme: 86 },
  { ticker: "NOW", price: 725, growth: 84, value: 48, momentum: 78, risk: 40, theme: 82 },
  { ticker: "CRWD", price: 318, growth: 86, value: 45, momentum: 76, risk: 52, theme: 88 },
  { ticker: "ZS", price: 176, growth: 74, value: 58, momentum: 68, risk: 55, theme: 84 },
  { ticker: "LEU", price: 44, growth: 68, value: 74, momentum: 64, risk: 62, theme: 83 },
  { ticker: "BWXT", price: 96, growth: 66, value: 70, momentum: 70, risk: 34, theme: 80 },
  { ticker: "SMR", price: 9, growth: 60, value: 82, momentum: 72, risk: 78, theme: 85 },
  { ticker: "OKLO", price: 8, growth: 62, value: 80, momentum: 74, risk: 82, theme: 87 },
  { ticker: "CRWV", price: 11, growth: 70, value: 76, momentum: 80, risk: 76, theme: 90 },
  { ticker: "RKLB", price: 5, growth: 64, value: 84, momentum: 71, risk: 70, theme: 78 },
];

function scoreStock(stock) {
  const lowPriceBoost = Math.max(0, 100 - stock.price / 3);
  return Math.round(
    stock.growth * 0.24 +
      stock.value * 0.2 +
      stock.momentum * 0.22 +
      stock.theme * 0.22 +
      lowPriceBoost * 0.07 -
      stock.risk * 0.05
  );
}

function renderTopStocks() {
  const topStocks = demoStocks
    .map((stock) => ({ ...stock, score: scoreStock(stock) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const list = document.querySelector("#top-stocks");
  list.innerHTML = topStocks
    .map(
      (stock) => `
        <li class="stock-row">
          <span class="ticker">${stock.ticker}</span>
          <span class="score">硬核评分 ${stock.score}</span>
        </li>
      `
    )
    .join("");
}

function renderUniverse() {
  const universe = document.querySelector("#stock-universe");
  universe.innerHTML = demoStocks
    .map((stock) => `<span class="ticker-pill">${stock.ticker}</span>`)
    .join("");
}

window.addEventListener("DOMContentLoaded", () => {
  renderTopStocks();
  renderUniverse();
});
