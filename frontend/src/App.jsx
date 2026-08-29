import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import StatCard from './components/StatCard'
import MonitorCard from './components/MonitorCard'
import AddMonitorModal from './components/AddMonitorModal'
import { getMonitors, createMonitor, checkMonitorNow } from './services/monitorService'
import useMonitorHistory from './hooks/useMonitorHistory'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [monitors, setMonitors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedMonitorId, setSelectedMonitorId] = useState(null)

  const {
    history,
    loading: historyLoading,
    error: historyError,
    refreshHistory,
  } = useMonitorHistory(selectedMonitorId)

  const operationalCount = monitors.filter(
    (monitor) => monitor.status === 'Operational'
  ).length

  const downCount = monitors.filter(
    (monitor) => monitor.status === 'Down'
  ).length

  const averageLatency =
    monitors.length > 0
      ? Math.round(
          monitors.reduce(
            (total, monitor) => total + (monitor.latency_ms || 0),
            0
          ) / monitors.length
        )
      : 0

  useEffect(() => {
    async function loadMonitors() {
      try {
        const data = await getMonitors()
        setMonitors(data)
        setError('')
      } catch (error) {
        setError('Failed to load monitors.')
      } finally {
        setLoading(false)
      }
    }

    loadMonitors()

    const interval = setInterval(loadMonitors, 30000)

    return () => clearInterval(interval)
  }, [])

  async function handleAddMonitor(monitor) {
    try {
      const newMonitor = await createMonitor(monitor)

      setMonitors((currentMonitors) => [
        ...currentMonitors,
        newMonitor,
      ])

      setIsModalOpen(false)
    } catch (error) {
      setError('Failed to create monitor.')
    }
  }

  async function handleCheckNow(monitorId) {
  try {
    setError(' ')
    await checkMonitorNow(monitorId)

    const data = await getMonitors()
    setMonitors(data)

    if (selectedMonitorId === monitorId) {
      await refreshHistory()
    }
  } catch (error) {
    setError('Failed to check monitor.')
  }
}

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl p-8">
          <header className="mb-8">
            <p className="text-sm font-medium text-emerald-400">
              Overview
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              Monitor your APIs.
            </h2>

            <p className="mt-2 text-slate-400">
              Keep track of uptime, latency, and incidents from one place.
            </p>
          </header>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total monitors"
              value={monitors.length}
              description="Currently configured"
            />

            <StatCard
              label="Operational"
              value={operationalCount}
              description="Healthy monitors"
            />

            <StatCard
              label="Down"
              value={downCount}
              description="Currently unavailable"
            />

            <StatCard
              label="Avg. latency"
              value={`${averageLatency}ms`}
              description="Across all monitors"
            />
          </section>

          <section className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Your monitors
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Current health of your monitored APIs.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
              >
                + Add monitor
              </button>
            </div>

            {error && (
              <p className="mb-4 text-sm text-red-400">
                {error}
              </p>
            )}

            {loading ? (
              <p className="text-sm text-slate-500">
                Loading monitors...
              </p>
            ) : monitors.length === 0 ? (
              <p className="text-sm text-slate-500">
                No monitors yet.
              </p>
            ) : (
              <div className="space-y-3">
                {monitors.map((monitor) => (
                  <MonitorCard
                    key={monitor.id}
                    id={monitor.id}
                    name={monitor.name}
                    url={monitor.url}
                    status={monitor.status}
                    latency={
                      monitor.latency_ms
                        ? `${monitor.latency_ms}ms`
                        : '—'
                    }
                    onClick={(id) => setSelectedMonitorId(id)}
                    onCheckNow={handleCheckNow}
                  />
                ))}
              </div>
            )}
          </section>

          {selectedMonitorId && (
            <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Monitor history
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Recent health checks for this monitor.
                  </p>
                </div>

                <button
                  onClick={() => setSelectedMonitorId(null)}
                  className="text-sm text-slate-500 hover:text-white"
                >
                  Close
                </button>
              </div>

              {historyLoading ? (
                <p className="mt-6 text-sm text-slate-500">
                  Loading history...
                </p>
              ) : historyError ? (
                <p className="mt-6 text-sm text-red-400">
                  {historyError}
                </p>
              ) : history.length === 0 ? (
                <p className="mt-6 text-sm text-slate-500">
                  No history available.
                </p>
              ) : (
                <>
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl bg-white/[0.03] p-3">
                      <p className="text-xs text-slate-500">
                        Checks
                      </p>

                      <p className="mt-1 text-lg font-semibold text-white">
                        {history.length}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/[0.03] p-3">
                      <p className="text-xs text-slate-500">
                        Operational
                      </p>

                      <p className="mt-1 text-lg font-semibold text-emerald-400">
                        {
                          history.filter(
                            (check) => check.status === 'Operational'
                          ).length
                        }
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/[0.03] p-3">
                      <p className="text-xs text-slate-500">
                        Down
                      </p>

                      <p className="mt-1 text-lg font-semibold text-red-400">
                        {
                          history.filter(
                            (check) => check.status === 'Down'
                          ).length
                        }
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/[0.03] p-3">
                      <p className="text-xs text-slate-500">
                        Uptime
                      </p>

                      <p className="mt-1 text-lg font-semibold text-white">
                        {Math.round(
                          (history.filter(
                            (check) => check.status === 'Operational'
                          ).length /
                            history.length) *
                            100
                        )}
                        %
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    {history.slice(0, 10).map((check) => (
                      <div
                        key={check.id}
                        className="grid grid-cols-[1fr_auto_auto] items-center gap-4 rounded-xl bg-white/[0.03] px-4 py-3"
                      >
                        <div>
                          <p
                            className={`text-sm font-medium ${
                              check.status === 'Operational'
                                ? 'text-emerald-400'
                                : 'text-red-400'
                            }`}
                          >
                            {check.status}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {check.status_code != null
                              ? `HTTP ${check.status_code}`
                              : 'No response'}
                          </p>
                        </div>

                        <p className="text-sm text-slate-400">
                          {check.latency_ms != null
                            ? `${check.latency_ms}ms`
                            : '—'}
                        </p>

                        <p className="text-xs text-slate-500">
                          {new Date(check.checked_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>
          )}
          
        </div>
      </main>

      {isModalOpen && (
        <AddMonitorModal
          onClose={() => setIsModalOpen(false)}
          onAddMonitor={handleAddMonitor}
        />
      )}
    </div>
  )
}

export default App
