const pool = require('../db')
const { checkMonitor } = require('./monitorChecker')

async function checkAllMonitors() {
  try {
    const [monitors] = await pool.query(
      'SELECT * FROM monitors'
    )

    for (const monitor of monitors) {
      const result = await checkMonitor(monitor.url)

      await pool.query(
        `UPDATE monitors
         SET status = ?, latency_ms = ?
         WHERE id = ?`,
        [result.status, result.latency, monitor.id]
      )
    }

    console.log(`Checked ${monitors.length} monitor(s)`)
  } catch (error) {
    console.error('Scheduler error:', error)
  }
}

function startMonitorScheduler() {
  checkAllMonitors()

  setInterval(checkAllMonitors, 60 * 1000)
}

module.exports = {
  startMonitorScheduler,
}