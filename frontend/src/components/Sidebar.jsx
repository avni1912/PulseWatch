function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-slate-950 lg:block">
      <div className="sticky top-0 flex h-screen flex-col p-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white">
            PulseWatch
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            API monitoring platform
          </p>
        </div>

        <nav className="mt-10 space-y-2">
          <button
            type="button"
            onClick={() => onNavigate('overview')}
            className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
              activePage === 'overview'
                ? 'bg-white/[0.08] text-white'
                : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-300'
            }`}
          >
            Overview
          </button>

          <button
            type="button"
            onClick={() => onNavigate('incidents')}
            className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
              activePage === 'incidents'
                ? 'bg-white/[0.08] text-white'
                : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-300'
            }`}
          >
            Incidents
          </button>
        </nav>

        <div className="mt-auto border-t border-white/10 pt-5">
          <p className="text-xs text-slate-600">
            PulseWatch
          </p>

          <p className="mt-1 text-xs text-slate-700">
            API Monitoring & Incident Tracking
          </p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar