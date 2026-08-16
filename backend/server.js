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

app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS result')

    res.json({
      message: 'Database connected successfully',
      result: rows[0].result,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Database connection failed',
    })
  }
})

app.listen(PORT, () => {
  console.log(`PulseWatch API running on http://localhost:${PORT}`)
})