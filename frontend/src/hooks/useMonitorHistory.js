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
    } catch {
      setError('Failed to load monitor history.')
    }
  }, [monitorId])

  useEffect(() => {
    let isMounted = true

    if (!monitorId) {
      return
    }

    async function loadHistory() {
      setLoading(true)
      try {
        const data = await getMonitorHistory(monitorId)
        if (isMounted) {
          setHistory(data)
          setError('')
        }
      } catch {
        if (isMounted) {
          setError('Failed to load monitor history.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadHistory()

    const interval = setInterval(() => {
      refreshHistory()
    }, 30000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [monitorId, refreshHistory])

  return {
    history,
    loading,
    error,
    refreshHistory,
  }
}

export default useMonitorHistory