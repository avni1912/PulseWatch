const API_URL = 'http://localhost:5000/api/monitors'

export async function getMonitors() {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error('Failed to fetch monitors')
  }

  return response.json()
}

export async function createMonitor(monitor) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(monitor),
  })

  if (!response.ok) {
    throw new Error('Failed to create monitor')
  }

  return response.json()
}

export async function getMonitorHistory(monitorId) {
  const response = await fetch(
    `${API_URL}/${monitorId}/history?t=${Date.now()}`,
    {
      cache: 'no-store',
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch monitor history')
  }

  return response.json()
}

export async function checkMonitorNow(monitorId) {
  const response = await fetch(
    `${API_URL}/${monitorId}/check`
  )

  if (!response.ok) {
    throw new Error('Failed to check monitor')
  }

  return response.json()
}

export async function getIncidents() {
  const response = await fetch(
    'http://localhost:5000/api/incidents',
    {
      cache: 'no-store',
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch incidents')
  }

  return response.json()
}
export async function updateMonitor(monitorId, monitor) {
  const response = await fetch(
    `${API_URL}/${monitorId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(monitor),
    }
  )

  if (!response.ok) {
    throw new Error('Failed to update monitor')
  }

  return response.json()
}

export async function deleteMonitor(monitorId) {
  const response = await fetch(
    `${API_URL}/${monitorId}`,
    {
      method: 'DELETE',
    }
  )

  if (!response.ok) {
    throw new Error('Failed to delete monitor')
  }

  return response.json()
}