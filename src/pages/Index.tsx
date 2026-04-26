import { useEffect, useState } from "react";
import { Loader2, AlertOctagon } from "lucide-react";
import { api, type AnalyzeResponse, type Defaults, BACKEND_URL } from "@/lib/api";
import ControlPanel, { type SidebarState } from "@/components/dashboard/ControlPanel";
import HeroHeader from "@/components/dashboard/HeroHeader";
import Section from "@/components/dashboard/Section";
import OverviewTable from "@/components/dashboard/OverviewTable";
import VarSection from "@/components/dashboard/VarSection";
import ChartsGrid from "@/components/dashboard/ChartsGrid";
import CorrelationSection from "@/components/dashboard/CorrelationSection";
import LearnMore from "@/components/dashboard/LearnMore";

function dateRangeFromLookback(years: number) {
  const end = new Date();
  const start = new Date();
  start.setFullYear(end.getFullYear() - years);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { start_date: fmt(start), end_date: fmt(end) };
}

function renormalize(weights: number[]) {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum <= 0) return weights.map(() => 1 / weights.length);
  return weights.map((w) => w / sum);
}

const Index = () => {
  const [defaults, setDefaults] = useState<Defaults | null>(null);
  const [state, setState] = useState<SidebarState | null>(null);
  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const d = await api.getDefaults();
        setDefaults(d);
        const initial: SidebarState = {
          tickers: d.tickers,
          weights: d.weights,
          portfolio_value: d.portfolio_value,
          confidence: d.confidence,
          risk_free_rate: d.risk_free_rate,
          lookback_years: d.lookback_years,
        };
        setState(initial);
        await runAnalyze(initial);
      } catch (e: any) {
        setError(e?.message || "Failed to load defaults");
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runAnalyze(s: SidebarState) {
    setLoading(true);
    setError(null);
    try {
      const weights = renormalize(s.weights);
      const { start_date, end_date } = dateRangeFromLookback(s.lookback_years);
      const res = await api.analyze({
        tickers: s.tickers,
        weights,
        portfolio_value: s.portfolio_value,
        confidence: s.confidence,
        risk_free_rate: s.risk_free_rate,
        start_date,
        end_date,
      });
      setData(res);
    } catch (e: any) {
      setError(e?.message || "Analyze request failed");
    } finally {
      setLoading(false);
    }
  }

  const onRecompute = () => {
    if (!state) return;
    const renorm = renormalize(state.weights);
    setState({ ...state, weights: renorm });
    runAnalyze({ ...state, weights: renorm });
  };

  const initializing = !state;

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {state && (
        <ControlPanel
          defaults={defaults}
          state={state}
          setState={setState}
          onRecompute={onRecompute}
          loading={loading}
        />
      )}

      <main className="flex-1 min-w-0">
        {/* Status bar — terminal style */}
        <div className="px-6 md:px-10 py-2 border-b border-border bg-foreground text-background flex items-center justify-between">
          <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.18em]">
            <span className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 ${loading ? "bg-destructive animate-pulse" : "bg-positive"}`} />
              {loading ? "live · computing" : "live · ready"}
            </span>
            <span className="text-background/60 hidden md:inline">
              backend → {BACKEND_URL}
            </span>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-background/60">
            {new Date().toISOString().slice(0, 10)}
          </div>
        </div>

        {error && (
          <div className="mx-6 md:mx-10 mt-6 border-2 border-negative bg-negative/5 p-4 flex items-start gap-3">
            <AlertOctagon className="h-4 w-4 text-negative shrink-0 mt-0.5" />
            <div>
              <div className="label-mono text-negative mb-1">Error</div>
              <div className="text-sm text-foreground">{error}</div>
            </div>
          </div>
        )}

        {initializing && !error && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Initialising risk engine…
            </div>
          </div>
        )}

        {loading && data && (
          <div className="px-6 md:px-10 py-2 border-b border-border bg-secondary flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
            <Loader2 className="h-3 w-3 animate-spin" />
            Fetching market data from Yahoo Finance…
          </div>
        )}

        {data && (
          <>
            <HeroHeader data={data} />

            <Section number="01" title="Portfolio Overview" caption="per-asset statistics">
              <OverviewTable data={data} />
            </Section>

            <Section number="02" title="Value at Risk Analysis" caption="tail-loss estimation">
              <VarSection data={data} />
            </Section>

            <Section number="03" title="Risk Visualisation" caption="distributional diagnostics">
              <ChartsGrid data={data} />
            </Section>

            <Section number="04" title="Correlation & Diversification" caption="cross-asset structure">
              <CorrelationSection data={data} />
            </Section>

            <Section number="A1" title="Appendix — Learn More" caption="methodology">
              <LearnMore />
            </Section>

            <footer className="bg-foreground text-background">
              <div className="px-6 md:px-10 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="label-mono text-background/50 mb-2">Data source</div>
                  <div className="font-mono text-sm">
                    {data.meta.data_source ?? "Yahoo Finance"}
                  </div>
                </div>
                <div>
                  <div className="label-mono text-background/50 mb-2">Range</div>
                  <div className="num text-sm">
                    {data.meta.start_date} → {data.meta.end_date}
                  </div>
                </div>
                <div className="md:text-right">
                  <div className="label-mono text-background/50 mb-2">Engine</div>
                  <div className="font-mono text-sm">risk_engine.py · v1.0</div>
                </div>
              </div>
              <div className="border-t border-background/20 px-6 md:px-10 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-background/50 flex justify-between">
                <span>// end of report</span>
                <span>© risk_engine</span>
              </div>
            </footer>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
