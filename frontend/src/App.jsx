import Sidebar from './components/Sidebar'
import StatCard from './components/StatCard'
import MonitorCard from './components/MonitorCard'
import { monitors, dashboardStats } from './data/mockData'

function App() {
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
            {dashboardStats.map((stat) => (
              <StatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                description={stat.description}
              />
            ))}
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

              <button className="rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">
                + Add monitor
              </button>
            </div>

            <div className="space-y-3">
              {monitors.map((monitor) => (
                <MonitorCard
                  key={monitor.id}
                  name={monitor.name}
                  url={monitor.url}
                  status={monitor.status}
                  latency={monitor.latency}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default App