import { useState } from "react";
import { Plus, X, AlertTriangle, Play, Loader2 } from "lucide-react";
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

  const sumPct = state.weights.reduce((a, b) => a + b, 0) * 100;
  const offBy = Math.abs(sumPct - 100) > 0.01;

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
    update({ tickers: [...state.tickers, t], weights: [...state.weights, 0] });
    setNewTicker("");
  };

  return (
    <aside className="w-80 shrink-0 border-r border-border bg-surface min-h-screen sticky top-0 h-screen overflow-y-auto flex flex-col">
      {/* Header / brand */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm font-semibold">risk_engine.py</span>
          <span className="num text-[10px] text-muted-foreground">v1.0</span>
        </div>
        <div className="label-mono mt-1">// configuration · params</div>
      </div>

      <div className="flex-1 px-5 py-6 space-y-7">
        <Field label="PORTFOLIO_VALUE" suffix="EUR">
          <input
            type="number"
            min={0}
            value={state.portfolio_value}
            onChange={(e) => update({ portfolio_value: Number(e.target.value) })}
            className="num w-full bg-transparent px-3 py-2.5 text-sm focus:outline-none"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="LOOKBACK">
            <select
              value={state.lookback_years}
              onChange={(e) => update({ lookback_years: Number(e.target.value) })}
              className="num w-full bg-transparent px-3 py-2.5 text-sm focus:outline-none appearance-none"
            >
              {LOOKBACKS.map((y) => (
                <option key={y} value={y}>{y}y</option>
              ))}
            </select>
          </Field>
          <Field label="CONFIDENCE">
            <select
              value={state.confidence}
              onChange={(e) => update({ confidence: Number(e.target.value) })}
              className="num w-full bg-transparent px-3 py-2.5 text-sm focus:outline-none appearance-none"
            >
              {CONFIDENCES.map((c) => (
                <option key={c} value={c}>{(c * 100).toFixed(0)}%</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="RISK_FREE_RATE" suffix="%">
          <input
            type="number"
            step="0.1"
            value={(state.risk_free_rate * 100).toFixed(2)}
            onChange={(e) => update({ risk_free_rate: Number(e.target.value) / 100 })}
            className="num w-full bg-transparent px-3 py-2.5 text-sm focus:outline-none"
          />
        </Field>

        {/* Weights */}
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <span className="label-mono">WEIGHTS</span>
            <span className={`num text-xs ${offBy ? "text-negative" : "text-foreground"}`}>
              Σ = {sumPct.toFixed(1)}%
            </span>
          </div>

          {/* Sum bar */}
          <div className="relative h-1 bg-secondary mb-3">
            <div
              className={`absolute inset-y-0 left-0 ${offBy ? "bg-negative" : "bg-primary"}`}
              style={{ width: `${Math.min(sumPct, 200)}%` }}
            />
            <div className="absolute inset-y-0 left-full -translate-x-px w-px bg-foreground" />
          </div>

          {offBy && (
            <div className="flex items-start gap-2 border border-negative bg-negative/5 p-2 mb-3">
              <AlertTriangle className="h-3 w-3 text-negative shrink-0 mt-0.5" />
              <span className="font-mono text-[10px] text-negative leading-tight">
                Weights will be renormalised on recompute
              </span>
            </div>
          )}

          <div className="border-t border-border">
            {state.tickers.map((t, i) => (
              <div
                key={t}
                className="border-b border-border py-3 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-baseline gap-2">
                    <span className="num text-[10px] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-sm font-semibold">{t}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="num text-xs text-foreground tabular-nums">
                      {(state.weights[i] * 100).toFixed(1)}%
                    </span>
                    <button
                      onClick={() => removeTicker(i)}
                      className="text-muted-foreground hover:text-negative opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={`remove ${t}`}
                    >
                      <X className="h-3 w-3" />
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
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Add ticker */}
        <div>
          <div className="label-mono mb-2">ADD_TICKER</div>
          <div className="flex border border-border">
            <input
              value={newTicker}
              onChange={(e) => setNewTicker(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTicker()}
              placeholder="AAPL"
              className="font-mono uppercase flex-1 bg-transparent px-3 py-2.5 text-sm focus:outline-none placeholder:text-muted-foreground/60"
            />
            <button
              onClick={addTicker}
              className="border-l border-border px-3 hover:bg-foreground hover:text-background transition-colors"
              aria-label="add ticker"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Sticky recompute */}
      <div className="border-t border-border p-5 bg-surface">
        <button
          onClick={onRecompute}
          disabled={loading || state.tickers.length === 0}
          className="w-full bg-foreground text-background font-mono text-xs uppercase tracking-[0.2em] py-3.5 hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Computing
            </>
          ) : (
            <>
              <Play className="h-3 w-3 fill-current" />
              Recompute
            </>
          )}
        </button>
        <div className="label-mono mt-3 text-center">$ python risk_engine.py</div>
      </div>
    </aside>
  );
}

function Field({
  label,
  suffix,
  children,
}: {
  label: string;
  suffix?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="label-mono">{label}</span>
        {suffix && <span className="label-mono">{suffix}</span>}
      </div>
      <div className="border border-border bg-background focus-within:border-primary transition-colors">
        {children}
      </div>
    </div>
  );
}
