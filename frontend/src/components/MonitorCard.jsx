function MonitorCard({ name, url, status, latency }) {
  const isOperational = status === 'Operational'

  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20 hover:bg-white/[0.05]">
      <div className="flex items-center gap-4">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            isOperational
              ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]'
              : 'bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.7)]'
          }`}
        />

        <div>
          <h3 className="font-medium text-white">
            {name}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {url}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p
          className={`text-sm font-medium ${
            isOperational
              ? 'text-emerald-400'
              : 'text-red-400'
          }`}
        >
          {status}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {latency}
        </p>
      </div>
    </div>
  )
}

export default MonitorCard