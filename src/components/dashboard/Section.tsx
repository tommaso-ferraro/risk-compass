type Props = {
  number: string;
  title: string;
  caption?: string;
  children: React.ReactNode;
};

export default function Section({ number, title, caption, children }: Props) {
  return (
    <section className="border-b border-border">
      {/* Section header — left rail with number, right caption */}
      <div className="grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] border-b border-border">
        <div className="border-r border-border bg-surface px-4 py-6 flex items-start">
          <span className="num text-primary text-xs">§ {number}</span>
        </div>
        <div className="px-6 md:px-10 py-6 flex items-baseline justify-between gap-6 flex-wrap">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight leading-none">
            {title}
          </h2>
          {caption && <span className="label-mono">{caption}</span>}
        </div>
      </div>

      {/* Body — same rail */}
      <div className="grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr]">
        <div className="border-r border-border bg-surface" aria-hidden />
        <div className="px-6 md:px-10 py-8">{children}</div>
      </div>
    </section>
  );
}
