# Risk Compass — Portfolio Risk Analytics Dashboard

![CI](https://github.com/tommaso-ferraro/risk-compass/actions/workflows/ci.yml/badge.svg)
![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)

A quantitative risk-analytics dashboard for equity portfolios: Value at Risk
(Historical, Parametric, Cornish-Fisher), Conditional VaR / Expected
Shortfall, Sharpe ratio, maximum drawdown, correlation structure, and
normality diagnostics — computed on real market data and presented in a
Swiss/brutalist-style interface.

**Live demo:** [add your Vercel URL here]
**Backend API:** [add your HuggingFace Space URL here]

<!-- Add a screenshot at docs/screenshot.png and uncomment the line below -->
<!-- ![Dashboard screenshot](docs/screenshot.png) -->

## Features

- **Portfolio construction** — add/remove tickers, set weights via sliders
  (auto-renormalised to 100% on recompute), configurable portfolio value,
  lookback window (1–7y) and confidence level (90/95/99%).
- **Risk metrics** — annualised return, volatility, Sharpe ratio, and
  maximum drawdown at the portfolio level; per-asset breakdown in a
  sortable overview table.
- **Value at Risk**, computed three ways side by side:
  - *Historical* — empirical quantile of observed returns.
  - *Parametric* — Gaussian assumption (μ ± z·σ).
  - *Cornish-Fisher* — parametric VaR adjusted for empirical skewness and
    kurtosis, for a closed-form estimate that doesn't assume normality.
- **Conditional VaR (Expected Shortfall)**, historical and parametric —
  the average loss *beyond* the VaR threshold, the tail-risk measure
  Basel III's Fundamental Review of the Trading Book uses in place of VaR.
- **Jarque-Bera normality test** on the return distribution, with skewness
  and excess kurtosis reported directly.
- **Correlation matrix** with a heatmap, and automatic identification of
  the most- and least-correlated asset pairs (diversification signal).
- **In-app methodology notes** (`Learn More` section) explaining the
  reasoning behind log returns, CVaR vs VaR, and the Cornish-Fisher
  expansion — written for a reader who wants the "why", not just the
  numbers.

## Tech stack

**Frontend** (this repo)
- React 18 + TypeScript, built with Vite
- Tailwind CSS with a hand-built design-token system (no default shadcn
  theme — the "Swiss/brutalist" look is custom, defined in
  `src/index.css`)
- Radix UI primitives only where actually used (currently: Accordion)

**Backend** (separate repo/service)
- Python, FastAPI
- NumPy / SciPy for the statistical computations (VaR/CVaR, Cornish-Fisher
  expansion, Jarque-Bera test, covariance-based portfolio volatility)
- Market data via Yahoo Finance
- Charts (distribution, cumulative performance, rolling VaR, drawdown,
  correlation heatmap) are rendered server-side and returned as base64 PNGs

**Deployment**
- Frontend: Vercel
- Backend: HuggingFace Spaces (Docker)

## Architecture

```
┌──────────────────┐        GET  /api/defaults          ┌───────────────────┐
│                  │ ───────────────────────────────────▶│                    │
│  React frontend  │        POST /api/portfolio/analyze   │  FastAPI backend   │
│    (Vercel)      │ ───────────────────────────────────▶│ (HuggingFace Space)│
│                  │◀─────────────────────────────────── │  NumPy / SciPy     │
└──────────────────┘   JSON: metrics + base64 PNG charts  └───────────────────┘
```

The frontend holds no business logic beyond input handling and
presentation — every statistic (VaR, CVaR, Sharpe, correlation,
normality test) is computed on the backend and returned as a typed JSON
payload (see `src/lib/api.ts` for the full response shape).

## Getting started

### Prerequisites
- Node.js 20+
- A running instance of the backend API (or point `VITE_BACKEND_URL` at a
  deployed one)

### Setup

```bash
git clone https://github.com/tommaso-ferraro/risk-compass.git
cd risk-compass
npm install
cp .env.example .env   # then edit VITE_BACKEND_URL if needed
npm run dev
```

The app runs at `http://localhost:8080` and expects the backend at
`http://localhost:8000` by default (see `.env.example`).

### Scripts

| Command              | Description                           |
| --------------------- | -------------------------------------- |
| `npm run dev`          | Start the Vite dev server              |
| `npm run build`        | Production build to `dist/`            |
| `npm run preview`      | Preview the production build locally   |
| `npm run lint`         | ESLint                                 |
| `npm run typecheck`    | TypeScript, no emit                    |
| `npm test`             | Run the test suite once (Vitest)       |
| `npm run test:watch`   | Run tests in watch mode                |

## Project structure

```
src/
├── components/
│   ├── dashboard/     # HeroHeader, OverviewTable, VarSection,
│   │                  # CorrelationSection, ChartsGrid, LearnMore, ...
│   └── ui/            # Radix-based primitives actually in use (Accordion)
├── lib/
│   ├── api.ts         # Typed API client + response shapes
│   ├── format.ts      # Number/percent/currency formatting helpers
│   └── utils.ts       # `cn` class-name helper
├── pages/
│   ├── Index.tsx      # Main dashboard page (data fetching + layout)
│   └── NotFound.tsx
└── test/               # Vitest setup and specs
```

## Roadmap / known limitations

- Test coverage is currently minimal — contributions/extensions welcome
  around `src/lib/format.ts` and the API response mapping.
- `tsconfig` strictness (`strict`, `noImplicitAny`, etc.) is being
  progressively tightened; a handful of files still predate that effort.
- No CI-enforced accessibility checks yet on form controls in the control
  panel.

## License

MIT — see [LICENSE](LICENSE).

## Author

Tommaso Ferraro — [GitHub](https://github.com/tommaso-ferraro)
