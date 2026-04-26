import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ITEMS = [
  {
    q: "Why log returns instead of simple returns?",
    a: "Log returns are time-additive: the log return over N periods equals the sum of single-period log returns, which makes multi-period aggregation and resampling mathematically clean. They are also approximately symmetric around zero and better behaved under the Gaussian assumptions used in parametric VaR. Simple returns, by contrast, are bounded below at −100% and compound multiplicatively, which complicates statistical inference. For small daily moves the two are nearly identical, but for risk modelling over longer horizons log returns are the standard.",
  },
  {
    q: "Why does CVaR matter more than VaR under Basel III?",
    a: "VaR tells you the threshold loss at a given confidence level but says nothing about how bad losses can get beyond that point — it is silent on the tail. CVaR (Expected Shortfall) averages all losses worse than the VaR cutoff, capturing the magnitude of tail events rather than just their frontier. The Basel Committee's Fundamental Review of the Trading Book replaced 99% VaR with 97.5% Expected Shortfall precisely because CVaR is a coherent risk measure (it satisfies sub-additivity) and penalises fat-tailed exposures that VaR understates.",
  },
  {
    q: "What is the Cornish-Fisher expansion?",
    a: "The Cornish-Fisher expansion adjusts the standard normal quantile to account for the empirical skewness and excess kurtosis of a return distribution. Concretely, it produces a corrected z-score z* = z + (z²−1)·S/6 + (z³−3z)·K/24 − (2z³−5z)·S²/36, where S is skewness and K is excess kurtosis. Plugged into a parametric VaR formula, this yields a tail estimate that respects the asymmetry and fat-tailedness of real returns without abandoning the closed-form parametric framework. It is the pragmatic middle ground between Gaussian VaR and full historical simulation.",
  },
];

export default function LearnMore() {
  return (
    <Accordion type="single" collapsible className="border border-border bg-surface">
      {ITEMS.map((item, i) => (
        <AccordionItem
          key={item.q}
          value={`item-${i}`}
          className="border-b border-border last:border-b-0"
        >
          <AccordionTrigger className="px-5 py-5 hover:bg-secondary/60 hover:no-underline text-left group">
            <div className="flex items-baseline gap-5 w-full">
              <span className="num text-xs text-primary shrink-0">
                Q.{String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-base font-medium group-hover:text-primary transition-colors">
                {item.q}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-6 pl-[68px] text-sm text-muted-foreground leading-relaxed max-w-4xl">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
