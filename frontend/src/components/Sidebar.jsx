function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-white/10 bg-slate-950 p-5 text-white">
      <div className="mb-10">
        <h1 className="text-xl font-bold tracking-tight">
          PulseWatch
        </h1>

        <p className="mt-1 text-xs text-slate-500">
          API Monitoring
        </p>
      </div>

      <nav className="space-y-2">
        <button className="w-full rounded-xl bg-white/10 px-4 py-3 text-left text-sm font-medium text-white">
          Overview
        </button>

        <button className="w-full rounded-xl px-4 py-3 text-left text-sm text-slate-400 transition hover:bg-white/5 hover:text-white">
          Monitors
        </button>

        <button className="w-full rounded-xl px-4 py-3 text-left text-sm text-slate-400 transition hover:bg-white/5 hover:text-white">
          Incidents
        </button>

        <button className="w-full rounded-xl px-4 py-3 text-left text-sm text-slate-400 transition hover:bg-white/5 hover:text-white">
          Analytics
        </button>

        <button className="w-full rounded-xl px-4 py-3 text-left text-sm text-slate-400 transition hover:bg-white/5 hover:text-white">
          Settings
        </button>
      </nav>

      <div className="mt-auto border-t border-white/10 pt-4">
        <p className="text-xs text-slate-500">
          PulseWatch
        </p>

        <p className="mt-1 text-xs text-slate-600">
          v1.0.0
        </p>
      </div>
    </aside>
  )
}

export default Sidebar