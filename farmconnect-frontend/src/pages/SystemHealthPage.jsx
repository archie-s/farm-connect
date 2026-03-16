import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Activity, AlertTriangle, Database, RefreshCcw, Server, ShieldAlert } from 'lucide-react'
import { useAuth } from '../App'

const getRoleValue = (role) => {
  if (!role) return ''
  return role.toString().toUpperCase().replace(/\s+/g, '_')
}

const initialServices = [
  { id: 'api', name: 'API Gateway', status: 'HEALTHY', uptime: 99.98, latencyMs: 126, errorRate: 0.3, lastIncident: '2026-03-12T08:16:00.000Z' },
  { id: 'db', name: 'PostgreSQL Cluster', status: 'HEALTHY', uptime: 99.99, latencyMs: 48, errorRate: 0.1, lastIncident: '2026-03-09T14:10:00.000Z' },
  { id: 'queue', name: 'Background Queue', status: 'DEGRADED', uptime: 98.44, latencyMs: 532, errorRate: 4.6, lastIncident: '2026-03-16T05:42:00.000Z' },
  { id: 'storage', name: 'Object Storage', status: 'HEALTHY', uptime: 99.92, latencyMs: 74, errorRate: 0.2, lastIncident: '2026-03-02T19:00:00.000Z' },
  { id: 'notifications', name: 'Notification Service', status: 'WARNING', uptime: 97.81, latencyMs: 305, errorRate: 2.1, lastIncident: '2026-03-15T22:09:00.000Z' }
]

const SystemHealthPage = () => {
  const { user } = useAuth()
  const [services, setServices] = useState(initialServices)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [lastAction, setLastAction] = useState('')

  const isAdmin = getRoleValue(user?.role) === 'ADMIN'

  const globalHealth = useMemo(() => {
    const degradedCount = services.filter((service) => service.status !== 'HEALTHY').length
    const avgUptime = services.length
      ? services.reduce((sum, service) => sum + service.uptime, 0) / services.length
      : 0
    const avgLatency = services.length
      ? Math.round(services.reduce((sum, service) => sum + service.latencyMs, 0) / services.length)
      : 0

    return {
      degradedCount,
      avgUptime: avgUptime.toFixed(2),
      avgLatency,
      healthScore: Math.max(0, Math.round(100 - degradedCount * 12 - avgLatency / 20))
    }
  }, [services])

  const getStatusBadgeClass = (status) => {
    if (status === 'HEALTHY') return 'bg-green-100 text-green-700'
    if (status === 'WARNING') return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-700'
  }

  const restartService = (serviceId) => {
    setServices((currentServices) =>
      currentServices.map((service) => {
        if (service.id !== serviceId) return service
        return {
          ...service,
          status: 'HEALTHY',
          latencyMs: Math.max(40, Math.round(service.latencyMs * 0.6)),
          errorRate: Number(Math.max(0.1, service.errorRate * 0.4).toFixed(1)),
          lastIncident: new Date().toISOString()
        }
      })
    )
    setLastAction(`Service ${serviceId} restarted and health metrics recalculated.`)
  }

  const refreshMetrics = () => {
    setServices((currentServices) =>
      currentServices.map((service) => ({
        ...service,
        latencyMs: Math.max(30, service.latencyMs + Math.floor(Math.random() * 30) - 12),
        errorRate: Number(Math.max(0.1, service.errorRate + (Math.random() - 0.5)).toFixed(1))
      }))
    )
    setLastAction('System health metrics refreshed.')
  }

  const clearQueueBacklog = () => {
    restartService('queue')
    setLastAction('Background queue backlog cleared and workers restarted.')
  }

  const rotateLogs = () => {
    setLastAction('Application logs rotated and archived for compliance retention.')
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Administrator Access Required
            </CardTitle>
            <CardDescription>
              System health operations are restricted to administrators.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/dashboard">
              <Button variant="outline">Return to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-wrap justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">System Health</h1>
            <p className="text-gray-600">Infrastructure monitoring and incident controls for all FarmConnect services.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={refreshMetrics}><RefreshCcw className="h-4 w-4 mr-2" />Refresh Metrics</Button>
            <Button variant="outline" onClick={clearQueueBacklog}>Clear Queue Backlog</Button>
            <Button variant="outline" onClick={rotateLogs}>Rotate Logs</Button>
            <Button onClick={() => setMaintenanceMode((enabled) => !enabled)}>
              {maintenanceMode ? 'Disable Maintenance' : 'Enable Maintenance'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {lastAction && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md p-3">{lastAction}</p>}

        {maintenanceMode && (
          <Card className="border-yellow-300 bg-yellow-50">
            <CardContent className="p-4 flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-yellow-700 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900">Maintenance Mode Enabled</p>
                <p className="text-sm text-yellow-800">Only administrative traffic is expected during this window.</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Global Health Score</p>
              <p className="text-2xl font-semibold">{globalHealth.healthScore}%</p>
              <Progress value={globalHealth.healthScore} />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Average Uptime</p>
              <p className="text-2xl font-semibold">{globalHealth.avgUptime}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Average Latency</p>
              <p className="text-2xl font-semibold">{globalHealth.avgLatency}ms</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Services Degraded</p>
              <p className="text-2xl font-semibold">{globalHealth.degradedCount}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Server className="h-4 w-4" />Service Status Board</CardTitle>
            <CardDescription>Operational status across API, storage, queues, notifications, and database.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {services.map((service) => (
              <div key={service.id} className="border rounded-lg p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-xs text-gray-500">Last incident: {new Date(service.lastIncident).toLocaleString()}</p>
                  </div>
                  <Badge className={getStatusBadgeClass(service.status)}>{service.status}</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 text-sm">
                  <p><span className="text-gray-500">Uptime:</span> {service.uptime}%</p>
                  <p><span className="text-gray-500">Latency:</span> {service.latencyMs}ms</p>
                  <p><span className="text-gray-500">Error rate:</span> {service.errorRate}%</p>
                </div>

                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => restartService(service.id)}>Restart</Button>
                  <Button variant="outline" size="sm" onClick={() => setLastAction(`Incident opened for ${service.name}.`)}>Open Incident</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Database className="h-4 w-4" />Database & Storage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="text-gray-500">Primary DB Connections:</span> 184 / 500</p>
              <p><span className="text-gray-500">Replica Lag:</span> 0.8s</p>
              <p><span className="text-gray-500">Storage Utilization:</span> 71%</p>
              <p><span className="text-gray-500">Backups:</span> Last successful at 03:00 UTC</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Activity className="h-4 w-4" />Security & Compliance Signals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="text-gray-500">Failed Login Attempts (24h):</span> 42</p>
              <p><span className="text-gray-500">Privileged Role Changes:</span> 3</p>
              <p><span className="text-gray-500">Suspicious API Tokens:</span> 0</p>
              <p><span className="text-gray-500">Open Security Alerts:</span> 1 medium severity</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SystemHealthPage
