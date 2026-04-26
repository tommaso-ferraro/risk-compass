type Props = {
  number: string;
  title: string;
  caption?: string;
  children: React.ReactNode;
};

export default function Section({ number, title, caption, children }: Props) {
  return (
    <section className="px-8 py-10 border-b border-border">
      <div className="flex items-baseline gap-4 mb-6">
        <div className="font-mono text-xs text-primary">{number}</div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {caption && (
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground ml-auto">
            {caption}
          </div>
        )}
      </div>
      {children}
    </section>
  );
}
