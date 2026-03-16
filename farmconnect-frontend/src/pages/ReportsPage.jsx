import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Download, FileBarChart, FileText, Loader2 } from 'lucide-react'
import { useAuth } from '../App'

const getRoleValue = (role) => {
  if (!role) return ''
  return role.toString().toUpperCase().replace(/\s+/g, '_')
}

const initialSchedules = [
  { id: 'r1', name: 'Weekly Operational Summary', frequency: 'Weekly', recipients: 'ops@farmconnect.co.ke', enabled: true },
  { id: 'r2', name: 'Monthly Compliance Audit Pack', frequency: 'Monthly', recipients: 'compliance@farmconnect.co.ke', enabled: true },
  { id: 'r3', name: 'Daily Revenue Pulse', frequency: 'Daily', recipients: 'finance@farmconnect.co.ke', enabled: false }
]

const ReportsPage = () => {
  const { user } = useAuth()
  const [reportType, setReportType] = useState('OPERATIONS')
  const [dateRange, setDateRange] = useState('LAST_30_DAYS')
  const [format, setFormat] = useState('CSV')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedReports, setGeneratedReports] = useState([])
  const [schedules, setSchedules] = useState(initialSchedules)
  const [lastAction, setLastAction] = useState('')

  const isAdmin = getRoleValue(user?.role) === 'ADMIN'

  const reportTypeLabel = {
    OPERATIONS: 'Operations Overview',
    USERS: 'User Directory & Access',
    FINANCIAL: 'Financial Performance',
    SECURITY: 'Security & Risk',
    INVENTORY: 'Marketplace Inventory'
  }

  const mockSummary = useMemo(() => {
    return {
      accountsReviewed: 128,
      suspendedAccounts: 7,
      openIncidents: 3,
      revenueMonthToDate: 'KES 3,450,000'
    }
  }, [])

  const buildPayload = () => ({
    generatedAt: new Date().toISOString(),
    generatedBy: user?.email,
    reportType,
    dateRange,
    summary: mockSummary,
    controls: {
      includeAllAccounts: true,
      includeAllUsers: true,
      includeSecurityEvents: true,
      includeOperationalHealth: true
    }
  })

  const downloadReport = (payload, filename) => {
    if (format === 'JSON') {
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `${filename}.json`
      anchor.click()
      URL.revokeObjectURL(url)
      return
    }

    const rows = [
      ['field', 'value'],
      ['generatedAt', payload.generatedAt],
      ['generatedBy', payload.generatedBy],
      ['reportType', payload.reportType],
      ['dateRange', payload.dateRange],
      ['accountsReviewed', payload.summary.accountsReviewed],
      ['suspendedAccounts', payload.summary.suspendedAccounts],
      ['openIncidents', payload.summary.openIncidents],
      ['revenueMonthToDate', payload.summary.revenueMonthToDate]
    ]

    const csv = rows.map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${filename}.csv`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const generateReport = async () => {
    setIsGenerating(true)
    setLastAction('')

    const payload = buildPayload()
    const filename = `farmconnect-${reportType.toLowerCase()}-${new Date().toISOString().split('T')[0]}`

    await new Promise((resolve) => setTimeout(resolve, 900))

    setGeneratedReports((currentReports) => [
      {
        id: crypto.randomUUID(),
        name: reportTypeLabel[reportType],
        dateRange,
        format,
        generatedAt: new Date().toISOString(),
        generatedBy: user?.email,
        payload
      },
      ...currentReports
    ])

    downloadReport(payload, filename)
    setLastAction(`${reportTypeLabel[reportType]} generated and downloaded successfully.`)
    setIsGenerating(false)
  }

  const toggleSchedule = (id) => {
    setSchedules((currentSchedules) =>
      currentSchedules.map((schedule) =>
        schedule.id === id ? { ...schedule, enabled: !schedule.enabled } : schedule
      )
    )
    setLastAction('Report schedule updated.')
  }

  const removeGeneratedReport = (id) => {
    setGeneratedReports((currentReports) => currentReports.filter((report) => report.id !== id))
    setLastAction('Generated report removed from history.')
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
              Report generation and compliance exports are restricted to administrators.
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Generate and schedule full-platform administrative reports for operations, users, and compliance.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {lastAction && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md p-3">{lastAction}</p>}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileBarChart className="h-4 w-4" />Generate New Report</CardTitle>
            <CardDescription>Create exports with platform-wide administrative scope.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <select className="border rounded-md px-3 py-2" value={reportType} onChange={(event) => setReportType(event.target.value)}>
                <option value="OPERATIONS">Operations Overview</option>
                <option value="USERS">User Directory & Access</option>
                <option value="FINANCIAL">Financial Performance</option>
                <option value="SECURITY">Security & Risk</option>
                <option value="INVENTORY">Marketplace Inventory</option>
              </select>

              <select className="border rounded-md px-3 py-2" value={dateRange} onChange={(event) => setDateRange(event.target.value)}>
                <option value="LAST_7_DAYS">Last 7 Days</option>
                <option value="LAST_30_DAYS">Last 30 Days</option>
                <option value="LAST_90_DAYS">Last 90 Days</option>
                <option value="YTD">Year to Date</option>
              </select>

              <select className="border rounded-md px-3 py-2" value={format} onChange={(event) => setFormat(event.target.value)}>
                <option value="CSV">CSV</option>
                <option value="JSON">JSON</option>
              </select>

              <Button onClick={generateReport} disabled={isGenerating}>
                {isGenerating ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating...</>
                ) : (
                  <><Download className="h-4 w-4 mr-2" />Generate & Download</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Manage recurring report automation for admin teams.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="border rounded-lg p-3 flex flex-wrap justify-between items-center gap-2">
                  <div>
                    <p className="font-medium text-sm">{schedule.name}</p>
                    <p className="text-xs text-gray-500">{schedule.frequency} • {schedule.recipients}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={schedule.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}>
                      {schedule.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => toggleSchedule(schedule.id)}>
                      {schedule.enabled ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileText className="h-4 w-4" />Compliance Snapshot</CardTitle>
              <CardDescription>Current reporting inputs from system-wide compliance controls.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="text-gray-500">Accounts Reviewed:</span> {mockSummary.accountsReviewed}</p>
              <p><span className="text-gray-500">Suspended Accounts:</span> {mockSummary.suspendedAccounts}</p>
              <p><span className="text-gray-500">Open Incidents:</span> {mockSummary.openIncidents}</p>
              <p><span className="text-gray-500">Revenue (MTD):</span> {mockSummary.revenueMonthToDate}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Generated Report History</CardTitle>
            <CardDescription>Track and manage generated exports from this admin session.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {generatedReports.map((report) => (
              <div key={report.id} className="border rounded-lg p-3 flex flex-wrap justify-between items-center gap-2">
                <div>
                  <p className="font-medium text-sm">{report.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(report.generatedAt).toLocaleString()} • {report.dateRange} • {report.format}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadReport(report.payload, `farmconnect-${report.name.toLowerCase().replace(/\s+/g, '-')}`)}
                  >
                    Download Again
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => removeGeneratedReport(report.id)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            {generatedReports.length === 0 && <p className="text-sm text-gray-500">No generated reports yet.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ReportsPage
