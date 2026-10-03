const pool = require('../db')
const { checkMonitor } = require('./monitorChecker')

async function createIncidentIfNeeded(monitorId) {
  const [activeIncidents] = await pool.query(
    `SELECT id
     FROM incidents
     WHERE monitor_id = ?
       AND status = 'Active'
     LIMIT 1`,
    [monitorId]
  )

  if (activeIncidents.length === 0) {
    await pool.query(
      `INSERT INTO incidents
       (monitor_id, status, started_at)
       VALUES (?, 'Active', NOW())`,
      [monitorId]
    )

    console.log(`Incident created for monitor ${monitorId}`)
  }
}

async function resolveIncidentIfNeeded(monitorId) {
  const [activeIncidents] = await pool.query(
    `SELECT id
     FROM incidents
     WHERE monitor_id = ?
       AND status = 'Active'
     LIMIT 1`,
    [monitorId]
  )

  if (activeIncidents.length > 0) {
    await pool.query(
      `UPDATE incidents
       SET status = 'Resolved',
           resolved_at = NOW()
       WHERE id = ?`,
      [activeIncidents[0].id]
    )

    console.log(`Incident resolved for monitor ${monitorId}`)
  }
}

const scheduledTimers = new Map()

async function runMonitorCheck(monitor) {
  try {
    const result = await checkMonitor(monitor.url)

    await pool.query(
      `INSERT INTO monitor_checks
      (monitor_id, status, latency_ms, status_code)
      VALUES (?, ?, ?, ?)`,
      [
        monitor.id,
        result.status,
        result.latency,
        result.statusCode,
      ]
    )

    await pool.query(
      `UPDATE monitors
       SET status = ?, latency_ms = ?
       WHERE id = ?`,
      [
        result.status,
        result.latency,
        monitor.id,
      ]
    )

    if (result.status === 'Down') {
      await createIncidentIfNeeded(monitor.id)
    } else if (result.status === 'Operational') {
      await resolveIncidentIfNeeded(monitor.id)
    }

    console.log(
      `Checked ${monitor.name}: ${result.status} (${result.latency ?? '—'}ms)`
    )

    return {
      id: Number(monitor.id),
      status: result.status,
      latency_ms: result.latency,
      status_code: result.statusCode,
    }
  } catch (error) {
    console.error(`Failed to check ${monitor.name}:`, error)
    throw error
  }
}

function unscheduleMonitor(monitorId) {
  const numericId = Number(monitorId)
  if (scheduledTimers.has(numericId)) {
    clearInterval(scheduledTimers.get(numericId))
    scheduledTimers.delete(numericId)
    console.log(`Unscheduled monitor ${numericId}`)
  }
}

function scheduleMonitor(monitor) {
  unscheduleMonitor(monitor.id)

  const interval = (monitor.interval_minutes || 5) * 60 * 1000

  runMonitorCheck(monitor)

  const timerId = setInterval(() => {
    runMonitorCheck(monitor)
  }, interval)

  scheduledTimers.set(Number(monitor.id), timerId)

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

    console.log(
      `Scheduler started for ${monitors.length} monitor(s)`
    )
  } catch (error) {
    console.error('Scheduler error:', error)
  }
}

module.exports = {
  startMonitorScheduler,
  scheduleMonitor,
  unscheduleMonitor,
  runMonitorCheck,
}