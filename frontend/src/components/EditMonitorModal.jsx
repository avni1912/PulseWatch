import { useEffect, useState } from 'react'

function EditMonitorModal({ monitor, onClose, onUpdate }) {
  const [name, setName] = useState(monitor.name)
  const [url, setUrl] = useState(monitor.url)
  const [interval, setInterval] = useState(
    monitor.interval_minutes
  )
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setName(monitor.name)
    setUrl(monitor.url)
    setInterval(monitor.interval_minutes)
  }, [monitor])

  async function handleSubmit(event) {
    event.preventDefault()

    setSaving(true)

    try {
      await onUpdate(monitor.id, {
        name,
        url,
        interval_minutes: Number(interval),
      })

      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">
            Edit monitor
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Update the monitor configuration.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Monitor name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/50"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              URL
            </label>

            <input
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/50"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Check interval
            </label>

            <select
              value={interval}
              onChange={(event) =>
                setInterval(event.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-emerald-400/50"
            >
              <option value="1">Every 1 minute</option>
              <option value="5">Every 5 minutes</option>
              <option value="10">Every 10 minutes</option>
              <option value="15">Every 15 minutes</option>
              <option value="30">Every 30 minutes</option>
              <option value="60">Every 60 minutes</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-400 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-300 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditMonitorModal