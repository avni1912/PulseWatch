async function checkMonitor(url) {
  const startTime = Date.now()

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(10000),
    })
    const latency = Date.now() - startTime

    return {
      status: response.ok ? 'Operational' : 'Down',
      latency,
      statusCode: response.status,
    }
  } catch (error) {
    console.error('Monitor check failed:', error)

    return {
      status: 'Down',
      latency: null,
      statusCode: null,
    }
  }
}

module.exports = {
  checkMonitor,
}