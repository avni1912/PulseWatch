import { useEffect, useState } from 'react'
import IncidentList from './IncidentList'
import { getIncidents } from '../services/monitorService'

function Incidents() {
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function fetchIncidents() {
      try {
        const data = await getIncidents()
        if (isMounted) {
          setIncidents(data)
          setError('')
        }
      } catch {
        if (isMounted) {
          setError('Failed to load incidents.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchIncidents()

    const interval = setInterval(fetchIncidents, 30000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  const activeCount = incidents.filter(
    (incident) => incident.status === 'Active'
  ).length

  const resolvedCount = incidents.filter(
    (incident) => incident.status === 'Resolved'
  ).length

  return (
    <section className="mt-10">
      <div className="mb-6">
        <p className="text-sm font-medium text-emerald-400">
          Incidents
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-white">
          Incident history
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Track monitor outages and their resolution.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs text-slate-500">
            Active incidents
          </p>

          <p className="mt-2 text-2xl font-semibold text-red-400">
            {activeCount}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs text-slate-500">
            Resolved incidents
          </p>

          <p className="mt-2 text-2xl font-semibold text-emerald-400">
            {resolvedCount}
          </p>
        </div>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-400">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">
          Loading incidents...
        </p>
      ) : (
        <IncidentList incidents={incidents} />
      )}
    </section>
  )
}

export default Incidents