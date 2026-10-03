import { useState } from 'react'

function AddMonitorModal({ onClose, onAddMonitor }) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [interval, setInterval] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    if (!name.trim()) {
      setError('Monitor name is required.')
      return
    }

    if (!url.trim()) {
      setError('URL is required.')
      return
    }

    if (!interval || Number(interval) < 1) {
      setError('Interval must be at least 1 minute.')
      return
    }

    try {
      await onAddMonitor({
        name: name.trim(),
        url: url.trim(),
        interval_minutes: Number(interval),
      })
    } catch {
      setError('Failed to create monitor.')
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold text-white">
          Add Monitor
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Add an API endpoint to monitor.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Monitor name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError('')
              }}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400"
            />

            <input
              type="url"
              placeholder="https://api.example.com/health"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                setError('')
              }}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400"
            />

            <input
              type="number"
              placeholder="Interval (minutes)"
              value={interval}
              onChange={(e) => {
                setInterval(e.target.value)
                setError('')
              }}
              min="1"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400"
            />

            {error && (
              <p className="text-sm text-red-400">
                {error}
              </p>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm text-slate-400 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
            >
              Add Monitor
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddMonitorModal