const API_URL = 'http://localhost:5000/api'

export async function getMonitors() {
  const response = await fetch(`${API_URL}/monitors`)

  if (!response.ok) {
    throw new Error('Failed to fetch monitors')
  }

  return response.json()
}

export async function createMonitor(monitor) {
  const response = await fetch(`${API_URL}/monitors`, {
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