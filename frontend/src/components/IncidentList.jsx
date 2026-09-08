function formatDate(date) {
  if (!date) return '—'

  return new Date(date).toLocaleString()
}

function getDuration(startedAt, resolvedAt) {
  const start = new Date(startedAt)
  const end = resolvedAt ? new Date(resolvedAt) : new Date()

  const diffMs = end - start
  const totalMinutes = Math.max(0, Math.floor(diffMs / 60000))

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }

  return `${minutes}m`
}

function IncidentList({ incidents }) {
  if (incidents.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <p className="text-sm text-slate-400">
          No incidents recorded.
        </p>

        <p className="mt-2 text-xs text-slate-600">
          Incidents will appear here when a monitor goes down.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {incidents.map((incident) => {
        const isActive = incident.status === 'Active'

        return (
          <div
            key={incident.id}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      isActive
                        ? 'bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.7)]'
                        : 'bg-emerald-400'
                    }`}
                  />

                  <h3 className="font-medium text-white">
                    {incident.monitor_name}
                  </h3>

                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      isActive
                        ? 'bg-red-400/10 text-red-400'
                        : 'bg-emerald-400/10 text-emerald-400'
                    }`}
                  >
                    {incident.status}
                  </span>
                </div>

                <p className="mt-2 truncate text-sm text-slate-500">
                  {incident.url}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm sm:min-w-[280px]">
                <div>
                  <p className="text-xs text-slate-600">
                    Started
                  </p>

                  <p className="mt-1 text-slate-300">
                    {formatDate(incident.started_at)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-600">
                    Duration
                  </p>

                  <p className="mt-1 text-slate-300">
                    {getDuration(
                      incident.started_at,
                      incident.resolved_at
                    )}
                  </p>
                </div>
              </div>
            </div>

            {incident.resolved_at && (
              <div className="mt-4 border-t border-white/5 pt-4">
                <p className="text-xs text-slate-600">
                  Resolved
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  {formatDate(incident.resolved_at)}
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default IncidentList