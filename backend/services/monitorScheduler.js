const pool = require('../db')
const { checkMonitor } = require('./monitorChecker')

async function runMonitorCheck(monitor) {
  try {
    const result = await checkMonitor(monitor.url)

    await pool.query(
      `UPDATE monitors
       SET status = ?, latency_ms = ?
       WHERE id = ?`,
      [result.status, result.latency, monitor.id]
    )

    console.log(
      `Checked ${monitor.name}: ${result.status} (${result.latency ?? '—'}ms)`
    )
  } catch (error) {
    console.error(`Failed to check ${monitor.name}:`, error)
  }
}

async function startMonitorScheduler() {
  try {
    const [monitors] = await pool.query(
      'SELECT * FROM monitors'
    )

    for (const monitor of monitors) {
      await runMonitorCheck(monitor)

      const interval = monitor.interval_minutes * 60 * 1000

      setInterval(() => {
        runMonitorCheck(monitor)
      }, interval)
    }

    console.log(`Scheduler started for ${monitors.length} monitor(s)`)
  } catch (error) {
    console.error('Scheduler error:', error)
  }
}

module.exports = {
  startMonitorScheduler,
}