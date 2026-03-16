import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Banknote, CheckCircle2, Clock3, XCircle } from 'lucide-react'
import { useAuth } from '../App'

const initialApplications = [
  {
    id: 'LN-001',
    farmerName: 'John Mwangi',
    farmerEmail: 'farmer1@farmconnect.co.ke',
    amount: 120000,
    purpose: 'Irrigation pump and drip lines for dry season production.',
    repaymentMonths: 18,
    status: 'UNDER_REVIEW',
    requestedAt: '2026-03-10T09:00:00.000Z',
    creditor: 'Kenya Women Finance Trust',
    location: 'Nakuru'
  },
  {
    id: 'LN-002',
    farmerName: 'Mary Wanjiku',
    farmerEmail: 'farmer2@farmconnect.co.ke',
    amount: 80000,
    purpose: 'Greenhouse seedling inputs and farm labor.',
    repaymentMonths: 12,
    status: 'PENDING',
    requestedAt: '2026-03-14T10:00:00.000Z',
    creditor: 'Faulu Microfinance',
    location: 'Kiambu'
  }
]

const creditorOptions = [
  'Kenya Women Finance Trust',
  'Faulu Microfinance',
  'KWFT Bank'
]

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0
  }).format(amount)

const normalizeRole = (role) => {
  if (!role) return ''
  return role.toString().toUpperCase().replace(/\s+/g, '_')
}

const statusBadgeClass = (status) => {
  if (status === 'APPROVED' || status === 'DISBURSED') return 'bg-green-100 text-green-700'
  if (status === 'REJECTED') return 'bg-red-100 text-red-700'
  if (status === 'UNDER_REVIEW') return 'bg-blue-100 text-blue-700'
  return 'bg-yellow-100 text-yellow-800'
}

const LoansPage = () => {
  const { user } = useAuth()
  const [applications, setApplications] = useState(initialApplications)
  const [message, setMessage] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const [formData, setFormData] = useState({
    amount: '',
    repaymentMonths: '12',
    creditor: creditorOptions[0],
    purpose: ''
  })

  const role = normalizeRole(user?.role)
  const isFarmer = role === 'FARMER'
  const isCreditor = role === 'MFI' || role === 'ADMIN'

  const visibleApplications = useMemo(() => {
    const roleScoped = isFarmer
      ? applications.filter((application) => application.farmerEmail === user?.email)
      : applications

    if (statusFilter === 'ALL') return roleScoped
    return roleScoped.filter((application) => application.status === statusFilter)
  }, [applications, isFarmer, statusFilter, user?.email])

  const summary = useMemo(() => {
    const scoped = isFarmer
      ? applications.filter((application) => application.farmerEmail === user?.email)
      : applications

    return {
      total: scoped.length,
      pending: scoped.filter((application) => application.status === 'PENDING').length,
      underReview: scoped.filter((application) => application.status === 'UNDER_REVIEW').length,
      approved: scoped.filter((application) => application.status === 'APPROVED' || application.status === 'DISBURSED').length,
      rejected: scoped.filter((application) => application.status === 'REJECTED').length,
      requestedVolume: scoped.reduce((sum, application) => sum + application.amount, 0)
    }
  }, [applications, isFarmer, user?.email])

  const createApplication = (event) => {
    event.preventDefault()

    if (!formData.amount || !formData.purpose.trim()) {
      setMessage('Amount and loan purpose are required.')
      return
    }

    const amountNumber = Number(formData.amount)
    if (Number.isNaN(amountNumber) || amountNumber <= 0) {
      setMessage('Loan amount must be a valid positive number.')
      return
    }

    const newApplication = {
      id: `LN-${Math.floor(Math.random() * 900 + 100)}`,
      farmerName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Farmer',
      farmerEmail: user?.email || 'unknown@farmconnect.co.ke',
      amount: amountNumber,
      purpose: formData.purpose.trim(),
      repaymentMonths: Number(formData.repaymentMonths),
      status: 'PENDING',
      requestedAt: new Date().toISOString(),
      creditor: formData.creditor,
      location: user?.location || 'Not specified'
    }

    setApplications((current) => [newApplication, ...current])
    setFormData({ amount: '', repaymentMonths: '12', creditor: creditorOptions[0], purpose: '' })
    setMessage('Loan application submitted successfully. A creditor will review it shortly.')
  }

  const updateApplicationStatus = (applicationId, nextStatus) => {
    setApplications((current) =>
      current.map((application) =>
        application.id === applicationId ? { ...application, status: nextStatus } : application
      )
    )
    setMessage(`Application ${applicationId} marked as ${nextStatus}.`)
  }

  if (!isFarmer && !isCreditor) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Access Restricted
            </CardTitle>
            <CardDescription>
              Loans are available only to farmers (borrowers) and creditors (MFI/Admin).
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
          <h1 className="text-2xl font-bold text-gray-900">Loans</h1>
          <p className="text-gray-600 mt-1">
            {isFarmer
              ? 'Apply for agricultural loans and track your submitted applications.'
              : 'Review, approve, and manage farmer loan applications as a creditor.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {message && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md p-3">{message}</p>}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Card><CardContent className="p-4"><p className="text-xs text-gray-500">Total</p><p className="text-xl font-semibold">{summary.total}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-xs text-gray-500">Pending</p><p className="text-xl font-semibold">{summary.pending}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-xs text-gray-500">Under Review</p><p className="text-xl font-semibold">{summary.underReview}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-xs text-gray-500">Approved</p><p className="text-xl font-semibold">{summary.approved}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-xs text-gray-500">Rejected</p><p className="text-xl font-semibold">{summary.rejected}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-xs text-gray-500">Requested Volume</p><p className="text-sm font-semibold">{formatCurrency(summary.requestedVolume)}</p></CardContent></Card>
        </div>

        {isFarmer && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Banknote className="h-4 w-4" />New Loan Application</CardTitle>
              <CardDescription>Submit a loan request to a creditor.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={createApplication} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Amount (KES)</label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(event) => setFormData((current) => ({ ...current, amount: event.target.value }))}
                    placeholder="50000"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Repayment Term</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={formData.repaymentMonths}
                    onChange={(event) => setFormData((current) => ({ ...current, repaymentMonths: event.target.value }))}
                  >
                    <option value="6">6 months</option>
                    <option value="12">12 months</option>
                    <option value="18">18 months</option>
                    <option value="24">24 months</option>
                    <option value="36">36 months</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 mb-1">Creditor</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={formData.creditor}
                    onChange={(event) => setFormData((current) => ({ ...current, creditor: event.target.value }))}
                  >
                    {creditorOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 mb-1">Purpose</label>
                  <Textarea
                    rows={4}
                    placeholder="Describe what this loan will finance on your farm."
                    value={formData.purpose}
                    onChange={(event) => setFormData((current) => ({ ...current, purpose: event.target.value }))}
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <Button type="submit">Submit Loan Request</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>{isFarmer ? 'My Applications' : 'Farmer Loan Applications'}</CardTitle>
            <CardDescription>
              {isFarmer
                ? 'Track status updates for your submissions.'
                : 'Review and process incoming farmer requests.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 w-full md:w-64">
              <label className="block text-sm text-gray-700 mb-1">Filter Status</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="ALL">All</option>
                <option value="PENDING">Pending</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="DISBURSED">Disbursed</option>
              </select>
            </div>

            <div className="space-y-3">
              {visibleApplications.map((application) => (
                <div key={application.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900">{application.id} • {formatCurrency(application.amount)}</p>
                      <p className="text-sm text-gray-600">
                        {application.farmerName} • {application.location} • {application.creditor}
                      </p>
                    </div>
                    <Badge className={statusBadgeClass(application.status)}>{application.status}</Badge>
                  </div>

                  <p className="text-sm text-gray-700 mt-3">{application.purpose}</p>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                    <p>Requested: {new Date(application.requestedAt).toLocaleDateString()}</p>
                    <p>Term: {application.repaymentMonths} months</p>
                    <p>Email: {application.farmerEmail}</p>
                  </div>

                  {isCreditor && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => updateApplicationStatus(application.id, 'UNDER_REVIEW')}>
                        <Clock3 className="h-4 w-4 mr-1" /> Review
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => updateApplicationStatus(application.id, 'APPROVED')}>
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => updateApplicationStatus(application.id, 'REJECTED')}>
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => updateApplicationStatus(application.id, 'DISBURSED')}>
                        <Banknote className="h-4 w-4 mr-1" /> Disburse
                      </Button>
                    </div>
                  )}
                </div>
              ))}

              {visibleApplications.length === 0 && (
                <p className="text-sm text-gray-500 py-4">No loan applications found for the selected filter.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LoansPage
