const DEMO_NOTICE = "Demo 数据，仅用于演示，不是最新真实财务数据。";

const demoStocks = [
  { ticker: "NVDA", revenueGrowth: 72, grossMargin: 74, freeCashFlow: 28, debtRisk: "low", shareDilution: "low", avgVolume: 43000000, valuation: 88, conceptStrength: 95, moat: 96, profitability: 94, notes: "AI 算力龙头" },
  { ticker: "AVGO", revenueGrowth: 44, grossMargin: 68, freeCashFlow: 34, debtRisk: "medium", shareDilution: "low", avgVolume: 5200000, valuation: 63, conceptStrength: 86, moat: 92, profitability: 90, notes: "AI 网络与基础设施" },
  { ticker: "PLTR", revenueGrowth: 26, grossMargin: 81, freeCashFlow: 22, debtRisk: "low", shareDilution: "medium", avgVolume: 61000000, valuation: 84, conceptStrength: 90, moat: 79, profitability: 74, notes: "AI 软件平台" },
  { ticker: "UBER", revenueGrowth: 18, grossMargin: 39, freeCashFlow: 19, debtRisk: "medium", shareDilution: "low", avgVolume: 18000000, valuation: 54, conceptStrength: 52, moat: 78, profitability: 72, notes: "平台网络效应" },
  { ticker: "CEG", revenueGrowth: 15, grossMargin: 42, freeCashFlow: 21, debtRisk: "medium", shareDilution: "low", avgVolume: 3100000, valuation: 59, conceptStrength: 83, moat: 86, profitability: 78, notes: "核电与电力需求" },
  { ticker: "VST", revenueGrowth: 13, grossMargin: 37, freeCashFlow: 24, debtRisk: "medium", shareDilution: "low", avgVolume: 6500000, valuation: 55, conceptStrength: 76, moat: 74, profitability: 76, notes: "电力紧缺主题" },
  { ticker: "NOW", revenueGrowth: 22, grossMargin: 79, freeCashFlow: 31, debtRisk: "low", shareDilution: "low", avgVolume: 1300000, valuation: 77, conceptStrength: 73, moat: 88, profitability: 86, notes: "企业软件高质量" },
  { ticker: "CRWD", revenueGrowth: 30, grossMargin: 75, freeCashFlow: 29, debtRisk: "low", shareDilution: "medium", avgVolume: 4100000, valuation: 79, conceptStrength: 75, moat: 83, profitability: 80, notes: "网络安全平台" },
  { ticker: "ZS", revenueGrowth: 27, grossMargin: 77, freeCashFlow: 18, debtRisk: "low", shareDilution: "medium", avgVolume: 2600000, valuation: 72, conceptStrength: 70, moat: 76, profitability: 70, notes: "云安全" },
  { ticker: "LEU", revenueGrowth: 12, grossMargin: 31, freeCashFlow: -8, debtRisk: "high", shareDilution: "medium", avgVolume: 850000, valuation: 69, conceptStrength: 82, moat: 61, profitability: 45, notes: "核燃料概念" },
  { ticker: "BWXT", revenueGrowth: 11, grossMargin: 27, freeCashFlow: 12, debtRisk: "medium", shareDilution: "low", avgVolume: 950000, valuation: 52, conceptStrength: 69, moat: 82, profitability: 73, notes: "核工业供应链" },
  { ticker: "SMR", revenueGrowth: 4, grossMargin: 12, freeCashFlow: -30, debtRisk: "high", shareDilution: "high", avgVolume: 12000000, valuation: 92, conceptStrength: 88, moat: 42, profitability: 12, notes: "小型核反应堆概念" },
  { ticker: "OKLO", revenueGrowth: 2, grossMargin: 8, freeCashFlow: -36, debtRisk: "high", shareDilution: "high", avgVolume: 17500000, valuation: 94, conceptStrength: 92, moat: 39, profitability: 10, notes: "核能概念热度高" },
  { ticker: "CRWV", revenueGrowth: 62, grossMargin: 48, freeCashFlow: -18, debtRisk: "high", shareDilution: "high", avgVolume: 9000000, valuation: 91, conceptStrength: 94, moat: 58, profitability: 24, notes: "AI 云算力概念" },
  { ticker: "RKLB", revenueGrowth: 48, grossMargin: 25, freeCashFlow: -22, debtRisk: "medium", shareDilution: "medium", avgVolume: 15000000, valuation: 76, conceptStrength: 86, moat: 66, profitability: 28, notes: "航天与国防概念" }
];

let rankedStocks = [];
let finalOnly = false;

const rowsEl = document.querySelector("#stockRows");
const candidateEl = document.querySelector("#candidateTickers");
const dataSourceEl = document.querySelector("#dataSource");
const tableHintEl = document.querySelector("#tableHint");
const copyStatusEl = document.querySelector("#copyStatus");

function numeric(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function riskValue(value) {
  return String(value || "medium").trim().toLowerCase();
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function scoreStock(stock, isDemo = false) {
  const freeCashFlow = numeric(stock.freeCashFlow);
  const avgVolume = numeric(stock.avgVolume);
  const debtRisk = riskValue(stock.debtRisk);
  const dilution = riskValue(stock.shareDilution);
  const conceptOnly = numeric(stock.conceptStrength) >= 80 && freeCashFlow < 0 && numeric(stock.profitability) < 35;
  const lowVolume = avgVolume < 500000;
  let score = 0;

  score += clamp(numeric(stock.revenueGrowth), -30, 80) * 0.22;
  score += clamp(numeric(stock.grossMargin), 0, 90) * 0.13;
  score += clamp(freeCashFlow, -40, 40) * 0.38;
  score += clamp(numeric(stock.moat), 0, 100) * 0.16;
  score += clamp(numeric(stock.profitability), 0, 100) * 0.18;
  score += clamp(numeric(stock.conceptStrength), 0, 100) * 0.07;
  score -= clamp(numeric(stock.valuation), 0, 100) * 0.12;
  score += avgVolume >= 1000000 ? 7 : avgVolume >= 500000 ? 2 : -24;

  if (debtRisk === "high") score -= 18;
  if (debtRisk === "medium") score -= 6;
  if (dilution === "high") score -= 14;
  if (dilution === "medium") score -= 6;
  if (freeCashFlow < 0 && debtRisk === "high") score -= 22;
  if (conceptOnly) score -= 18;

  score = Math.round(clamp(score + 28, 0, 100));
  const category = categorize({ score, freeCashFlow, debtRisk, dilution, lowVolume, conceptOnly, valuation: numeric(stock.valuation) });
  return {
    ...stock,
    score,
    category,
    reason: buildReason(stock, category, score),
    risk: buildRisk(stock, { freeCashFlow, debtRisk, dilution, lowVolume, conceptOnly }),
    notice: isDemo ? DEMO_NOTICE : "CSV 数据，按当前导入字段计算。"
  };
}

function categorize({ score, freeCashFlow, debtRisk, lowVolume, conceptOnly, valuation }) {
  if (lowVolume) return "排除";
  if (conceptOnly) return "纯炒作";
  if (freeCashFlow < 0 && debtRisk === "high") return valuation > 75 ? "估值陷阱" : "排除";
  if (score >= 72) return "真硬核";
  if (score >= 62 && valuation <= 60) return "被错杀";
  if (score >= 58) return "等回调";
  if (valuation >= 78 && freeCashFlow <= 5) return "估值陷阱";
  return score < 38 ? "排除" : "等回调";
}

function buildReason(stock, category, score) {
  if (["排除", "估值陷阱", "纯炒作"].includes(category)) return `${stock.ticker} 未进入最终研究候选：评分 ${score}，质量或风险条件不达标。`;
  const strengths = [];
  if (numeric(stock.freeCashFlow) > 15) strengths.push("自由现金流较强");
  if (numeric(stock.moat) > 75) strengths.push("护城河分数高");
  if (numeric(stock.revenueGrowth) > 20) strengths.push("收入增长较快");
  if (numeric(stock.valuation) <= 60) strengths.push("估值压力相对可控");
  return `${stock.ticker} 作为研究候选：${strengths.slice(0, 3).join("、") || "综合分数靠前"}。`;
}

function buildRisk(stock, flags) {
  if (flags.lowVolume) return "平均成交量太低，流动性不足。";
  if (flags.conceptOnly) return "主要依赖 AI/核能/机器人等概念，现金流和盈利质量不足。";
  if (flags.freeCashFlow < 0 && flags.debtRisk === "high") return "自由现金流为负且债务风险高。";
  if (flags.dilution === "high") return "股本稀释风险高，可能压低每股价值。";
  if (numeric(stock.valuation) > 75) return "估值偏高，可能需要等待回调验证。";
  return "行业景气度、竞争格局或执行不及预期。";
}

function rankAndRender(stocks, source = "Demo 数据") {
  rankedStocks = stocks.map(stock => scoreStock(stock, source === "Demo 数据"))
    .sort((a, b) => b.score - a.score);
  dataSourceEl.textContent = source;
  tableHintEl.textContent = source === "Demo 数据" ? "每只 demo 股票均标注演示数据说明，非最新真实财务数据。" : "已使用 CSV 数据覆盖 demo 数据并重新筛选。";
  render();
}

function getFinalCandidates() {
  return rankedStocks
    .filter(stock => !["排除", "估值陷阱", "纯炒作"].includes(stock.category))
    .slice(0, 10);
}

function render() {
  const finalCandidates = getFinalCandidates();
  candidateEl.textContent = finalCandidates.map(stock => stock.ticker).join(", ") || "暂无符合规则的研究候选";
  const visibleStocks = finalOnly ? finalCandidates : rankedStocks;
  rowsEl.innerHTML = visibleStocks.map(stock => `
    <tr>
      <td>${escapeHtml(stock.ticker)}</td>
      <td class="score">${stock.score}</td>
      <td><span class="category ${categoryClass(stock.category)}">${stock.category}</span></td>
      <td>${escapeHtml(stock.reason)}</td>
      <td>${escapeHtml(stock.risk)}</td>
      <td class="notice">${escapeHtml(stock.notice)}</td>
    </tr>
  `).join("");
}

function categoryClass(category) {
  return { "排除": "exclude", "估值陷阱": "trap", "等回调": "watch", "纯炒作": "spec" }[category] || "";
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  const headers = splitCsvLine(lines.shift()).map(header => header.trim());
  return lines.map(line => {
    const values = splitCsvLine(line);
    return headers.reduce((row, header, index) => ({ ...row, [header]: values[index] ?? "" }), {});
  }).filter(row => row.ticker);
}

function splitCsvLine(line) {
  const result = [];
  let current = "";
  let quoted = false;
  for (const char of line) {
    if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { result.push(current.trim()); current = ""; }
    else current += char;
  }
  result.push(current.trim());
  return result;
}

document.querySelector("#showFinalBtn").addEventListener("click", () => { finalOnly = true; render(); });
document.querySelector("#showAllBtn").addEventListener("click", () => { finalOnly = false; render(); });
document.querySelector("#copyBtn").addEventListener("click", async () => {
  const tickers = getFinalCandidates().map(stock => stock.ticker).join(", ");
  await navigator.clipboard.writeText(tickers);
  copyStatusEl.textContent = `已复制研究候选代码：${tickers}`;
});
document.querySelector("#csvInput").addEventListener("change", event => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => rankAndRender(parseCsv(reader.result), "CSV 数据");
  reader.readAsText(file);
});

rankAndRender(demoStocks);
