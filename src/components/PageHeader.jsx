export default function PageHeader({ title, subtitle, actions }) {
  return (
    <header className="mb-5 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-black tracking-normal text-ink">{title}</h1>
        {subtitle && <p className="mt-1 max-w-3xl text-sm font-semibold text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}
