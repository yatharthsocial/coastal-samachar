export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="relative mb-10 animate-fade-up overflow-hidden rounded-3xl bg-white px-6 py-10 sm:px-10 sm:py-12">
      <span className="absolute -right-16 -top-20 size-64 rounded-full bg-accent-soft" />
      <span className="absolute -bottom-24 right-32 size-40 rounded-full bg-[#eef8f3]" />
      <div className="relative">
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">{eyebrow}</p>
        )}
        <h1 className="mt-2 text-[30px] font-bold tracking-tight sm:text-[38px]">{title}</h1>
        {description && <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-2">{description}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </header>
  );
}

export function EmptyState({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-3xl bg-white px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent">{icon}</span>
      <p className="mt-4 text-[18px] font-semibold">{title}</p>
      {children && <div className="mt-2 max-w-sm text-[14px] text-muted">{children}</div>}
    </div>
  );
}
