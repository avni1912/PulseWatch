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

function scheduleMonitor(monitor) {
  const interval = monitor.interval_minutes * 60 * 1000

  runMonitorCheck(monitor)

  setInterval(() => {
    runMonitorCheck(monitor)
  }, interval)

  console.log(
    `Scheduled ${monitor.name} every ${monitor.interval_minutes} minute(s)`
  )
}

async function startMonitorScheduler() {
  try {
    const [monitors] = await pool.query(
      'SELECT * FROM monitors'
    )

    for (const monitor of monitors) {
      scheduleMonitor(monitor)
    }

    console.log(`Scheduler started for ${monitors.length} monitor(s)`)
  } catch (error) {
    console.error('Scheduler error:', error)
  }
}

module.exports = {
  startMonitorScheduler,
  scheduleMonitor,
}