const express = require('express')
const pool = require('./db')

const app = express()
const PORT = 5000

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

    res.status(201).json(rows[0])
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to create monitor',
    })
  }
})

app.listen(PORT, () => {
  console.log(`PulseWatch API running on http://localhost:${PORT}`)
})