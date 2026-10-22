export default function PageHeader({ title, subtitle, actions }) {
  return (
    <header className="sticky top-14 z-20 -mx-7 -mt-7 mb-6 border-b border-coral-100/80 bg-white/95 px-7 py-3.5 shadow-2xs backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-ink">{title}</h1>
          {subtitle && <p className="mt-0.5 max-w-3xl text-xs sm:text-sm font-semibold text-slate-500">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
