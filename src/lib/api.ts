// Read backend URL from Vite env, with REACT_APP_BACKEND_URL fallback for compatibility.
const env = (import.meta as any).env ?? {};
export const BACKEND_URL: string =
  env.VITE_BACKEND_URL ||
  env.REACT_APP_BACKEND_URL ||
  "http://localhost:8000";

export type Defaults = {
  tickers: string[];
  weights: number[];
  portfolio_value: number;
  confidence: number;
  confidence_levels: number[];
  risk_free_rate: number;
  lookback_years: number;
};

export type AnalyzeRequest = {
  tickers: string[];
  weights: number[];
  portfolio_value: number;
  confidence: number;
  risk_free_rate: number;
  start_date: string;
  end_date: string;
};

export type TickerStats = {
  ticker: string;
  weight: number;
  annual_return: number;
  annual_volatility: number;
  sharpe: number;
};

export type AnalyzeResponse = {
  meta: {
    start_date: string;
    end_date: string;
    data_source?: string;
    [k: string]: any;
  };
  overview: {
    rows: TickerStats[];
    portfolio: TickerStats;
  };
  portfolio: {
    annual_return: number;
    annual_volatility: number;
    sharpe: number;
    portfolio_value: number;
  };
  var: {
    historical: { loss_pct: number; loss_eur: number };
    parametric: { loss_pct: number; loss_eur: number };
    cornish_fisher: { loss_pct: number; loss_eur: number };
    cvar_historical: { loss_pct: number; loss_eur: number };
    cvar_parametric: { loss_pct: number; loss_eur: number };
    confidence: number;
  };
  normality: {
    jarque_bera_stat: number;
    p_value: number;
    is_normal: boolean;
  };
  correlation: {
    matrix_png_b64: string;
    most_correlated: { pair: [string, string]; value: number };
    least_correlated: { pair: [string, string]; value: number };
  };
  charts: {
    return_distribution_b64: string;
    cumulative_performance_b64: string;
    rolling_var_b64: string;
    drawdown_b64: string;
  };
};

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return (await res.json()) as T;
}

export const api = {
  getDefaults: () => http<Defaults>("/api/defaults"),
  analyze: (body: AnalyzeRequest) =>
    http<AnalyzeResponse>("/api/portfolio/analyze", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
