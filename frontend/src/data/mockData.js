export const monitors = [
  {
    id: 1,
    name: 'Payment API',
    url: 'api.example.com/health',
    status: 'Operational',
    latency: '124ms',
  },
  {
    id: 2,
    name: 'Authentication API',
    url: 'api.example.com/auth',
    status: 'Operational',
    latency: '98ms',
  },
  {
    id: 3,
    name: 'User API',
    url: 'api.example.com/users',
    status: 'Down',
    latency: 'Timeout',
  },
]

export const dashboardStats = [
  {
    label: 'Uptime',
    value: '99.7%',
    description: 'Across all monitors',
  },
  {
    label: 'Monitors',
    value: '8',
    description: '7 operational',
  },
  {
    label: 'Incidents',
    value: '1',
    description: 'This month',
  },
  {
    label: 'Avg. Latency',
    value: '142ms',
    description: 'Last 24 hours',
  },
]