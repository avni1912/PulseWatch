import { useCallback, useEffect, useState } from 'react'
import { getMonitorHistory } from '../services/monitorService'

function useMonitorHistory(monitorId) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refreshHistory = useCallback(async () => {
    if (!monitorId) {
      setHistory([])
      return
    }

    try {
      const data = await getMonitorHistory(monitorId)
      setHistory(data)
      setError('')
    } catch (error) {
      setError('Failed to load monitor history.')
    }
  }, [monitorId])

  useEffect(() => {
    if (!monitorId) {
      setHistory([])
      setLoading(false)
      return
    }

    async function loadHistory() {
      setLoading(true)
      await refreshHistory()
      setLoading(false)
    }

    loadHistory()

    const interval = setInterval(refreshHistory, 30000)

    return () => clearInterval(interval)
  }, [monitorId, refreshHistory])

  return {
    history,
    loading,
    error,
    refreshHistory,
  }
}

export default useMonitorHistory