function MonitorCard({
  id,
  name,
  url,
  status,
  latency,
  onClick,
  onCheckNow,
}) {
  const isOperational = status === 'Operational'

  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20 hover:bg-white/[0.05]">
      <button
        type="button"
        onClick={() => onClick(id)}
        className="flex min-w-0 flex-1 items-center gap-4 text-left"
      >
        <span
          className={`h-2.5 w-2.5 shrink-0 rounded-full ${
            isOperational
              ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]'
              : 'bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.7)]'
          }`}
        />

        <div className="min-w-0">
          <h3 className="font-medium text-white">
            {name}
          </h3>

          <p className="mt-1 truncate text-sm text-slate-500">
            {url}
          </p>
        </div>
      </button>

      <div className="ml-4 flex items-center gap-5">
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

        <button
          type="button"
          onClick={() => onCheckNow(id)}
          className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-emerald-400/40 hover:text-emerald-400"
        >
          Check now
        </button>
      </div>
    </div>
  )
}

export default MonitorCard