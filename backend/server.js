const express = require('express')
const cors = require('cors')
const pool = require('./db')
const { checkMonitor } = require('./services/monitorChecker')
const { startMonitorScheduler, scheduleMonitor } = require('./services/monitorScheduler')

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    message: 'PulseWatch API is running',
  })
})

app.get('/api/monitors', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM monitors ORDER BY created_at DESC'
    )

    res.json(rows)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to fetch monitors',
    })
  }
})

app.post('/api/monitors', async (req, res) => {
  try {
    const { name, url, interval } = req.body

    if (!name || !url || !interval) {
      return res.status(400).json({
        message: 'Name, URL and interval are required.',
      })
    }

    const [result] = await pool.query(
      `INSERT INTO monitors
       (name, url, interval_minutes, status)
       VALUES (?, ?, ?, ?)`,
      [name, url, interval, 'Pending']
    )

    const [rows] = await pool.query(
      'SELECT * FROM monitors WHERE id = ?',
      [result.insertId]
    )

    const newMonitor = rows[0]

    scheduleMonitor(newMonitor)

    res.status(201).json(newMonitor)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to create monitor',
    })
  }
})

app.get('/api/monitors/:id/check', async (req, res) => {
  try {
    const { id } = req.params

    const [rows] = await pool.query(
      'SELECT * FROM monitors WHERE id = ?',
      [id]
    )

    if (rows.length === 0) {
      return res.status(404).json({
        message: 'Monitor not found',
      })
    }

    const monitor = rows[0]

    const result = await checkMonitor(monitor.url)

    await pool.query(
      `UPDATE monitors
       SET status = ?, latency_ms = ?
       WHERE id = ?`,
      [result.status, result.latency, id]
    )

    const [updatedRows] = await pool.query(
      'SELECT * FROM monitors WHERE id = ?',
      [id]
    )

    res.json(updatedRows[0])
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to check monitor',
    })
  }
})

startMonitorScheduler()

app.listen(PORT, () => {
  console.log(`PulseWatch API running on http://localhost:${PORT}`)
})