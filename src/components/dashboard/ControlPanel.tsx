import { useEffect, useState } from "react";
import { Plus, X, AlertTriangle } from "lucide-react";
import type { Defaults } from "@/lib/api";

export type SidebarState = {
  tickers: string[];
  weights: number[];
  portfolio_value: number;
  confidence: number;
  risk_free_rate: number;
  lookback_years: number;
};

type Props = {
  defaults: Defaults | null;
  state: SidebarState;
  setState: (s: SidebarState) => void;
  onRecompute: () => void;
  loading: boolean;
};

const LOOKBACKS = [1, 2, 3, 5, 7];
const CONFIDENCES = [0.9, 0.95, 0.99];

export default function ControlPanel({ state, setState, onRecompute, loading }: Props) {
  const [newTicker, setNewTicker] = useState("");

  const sum = state.weights.reduce((a, b) => a + b, 0);
  const sumPct = sum * 100;
  const offBy1 = Math.abs(sumPct - 100) > 0.01;

  const update = (patch: Partial<SidebarState>) => setState({ ...state, ...patch });

  const setWeight = (i: number, v: number) => {
    const w = [...state.weights];
    w[i] = v / 100;
    update({ weights: w });
  };

  const removeTicker = (i: number) => {
    update({
      tickers: state.tickers.filter((_, idx) => idx !== i),
      weights: state.weights.filter((_, idx) => idx !== i),
    });
  };

  const addTicker = () => {
    const t = newTicker.trim().toUpperCase();
    if (!t || state.tickers.includes(t)) return;
    update({
      tickers: [...state.tickers, t],
      weights: [...state.weights, 0],
    });
    setNewTicker("");
  };

  return (
    <aside className="w-80 shrink-0 border-r border-border bg-surface min-h-screen sticky top-0 h-screen overflow-y-auto">
      <div className="p-5 border-b border-border">
        <div className="font-mono text-sm text-foreground">risk_engine.py</div>
        <div className="font-mono text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">
          // configuration
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Portfolio value */}
        <Field label="PORTFOLIO_VALUE">
          <input
            type="number"
            min={0}
            value={state.portfolio_value}
            onChange={(e) => update({ portfolio_value: Number(e.target.value) })}
            className="num w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary"
          />
        </Field>

        {/* Lookback */}
        <Field label="LOOKBACK_YEARS">
          <select
            value={state.lookback_years}
            onChange={(e) => update({ lookback_years: Number(e.target.value) })}
            className="num w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary"
          >
            {LOOKBACKS.map((y) => (
              <option key={y} value={y}>
                {y} {y === 1 ? "year" : "years"}
              </option>
            ))}
          </select>
        </Field>

        {/* Confidence */}
        <Field label="CONFIDENCE">
          <select
            value={state.confidence}
            onChange={(e) => update({ confidence: Number(e.target.value) })}
            className="num w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary"
          >
            {CONFIDENCES.map((c) => (
              <option key={c} value={c}>
                {(c * 100).toFixed(0)}%
              </option>
            ))}
          </select>
        </Field>

        {/* Risk free */}
        <Field label="RISK_FREE_RATE">
          <div className="flex items-center border border-border bg-background">
            <input
              type="number"
              step="0.1"
              value={(state.risk_free_rate * 100).toFixed(2)}
              onChange={(e) =>
                update({ risk_free_rate: Number(e.target.value) / 100 })
              }
              className="num w-full bg-transparent px-3 py-2 text-sm focus:outline-none"
            />
            <span className="num px-3 text-sm text-muted-foreground">%</span>
          </div>
        </Field>

        {/* Weights */}
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              WEIGHTS
            </div>
            <div
              className={`num text-xs ${
                offBy1 ? "text-negative" : "text-foreground"
              }`}
            >
              Σ = {sumPct.toFixed(1)}%
            </div>
          </div>

          {offBy1 && (
            <div className="flex items-start gap-2 border border-negative bg-negative/5 p-2 mb-3">
              <AlertTriangle className="h-3.5 w-3.5 text-negative shrink-0 mt-0.5" />
              <div className="font-mono text-[10px] text-negative leading-tight">
                Weights will be renormalised
              </div>
            </div>
          )}

          <div className="space-y-3">
            {state.tickers.map((t, i) => (
              <div key={t} className="border border-border p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-mono text-sm font-semibold">{t}</div>
                  <div className="flex items-center gap-2">
                    <span className="num text-xs text-muted-foreground">
                      {(state.weights[i] * 100).toFixed(1)}%
                    </span>
                    <button
                      onClick={() => removeTicker(i)}
                      className="text-muted-foreground hover:text-negative"
                      aria-label={`remove ${t}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={0.5}
                  value={state.weights[i] * 100}
                  onChange={(e) => setWeight(i, Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Add ticker */}
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
            ADD_TICKER
          </div>
          <div className="flex">
            <input
              value={newTicker}
              onChange={(e) => setNewTicker(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTicker()}
              placeholder="AAPL"
              className="font-mono uppercase flex-1 border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
            <button
              onClick={addTicker}
              className="border border-l-0 border-border bg-background px-3 hover:bg-secondary"
              aria-label="add ticker"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Recompute */}
        <button
          onClick={onRecompute}
          disabled={loading}
          className="w-full bg-foreground text-background font-mono text-xs uppercase tracking-widest py-3 hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Computing…" : "Recompute"}
        </button>
      </div>
    </aside>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
        {label}
      </div>
      {children}
    </div>
  );
}
