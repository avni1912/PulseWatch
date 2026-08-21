import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import StatCard from './components/StatCard'
import MonitorCard from './components/MonitorCard'
import AddMonitorModal from './components/AddMonitorModal'
import { getMonitors, createMonitor } from './services/monitorService'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [monitors, setMonitors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
                    name={monitor.name}
                    url={monitor.url}
                    status={monitor.status}
                    latency={
                      monitor.latency_ms
                        ? `${monitor.latency_ms}ms`
                        : '—'
                    }
                  />
                ))}
              </div>
            )}
          </section>
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