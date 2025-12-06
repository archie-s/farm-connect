import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  PieChart,
  BarChart3,
  Calculator,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Building2,
  Percent,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  Banknote,
  Target,
  Award,
  History,
  Plus,
  Download,
  Upload,
  Loader2,
  Info
} from 'lucide-react'
import { useAuth } from '../App'
import '../App.css'

const FinancialServicesPage = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [loanAmount, setLoanAmount] = useState('')
  const [loanPurpose, setLoanPurpose] = useState('')
  const [loanTerm, setLoanTerm] = useState('12')

  // Mock financial data - In production, this would come from backend APIs
  const creditScore = {
    score: 720,
    rating: 'Good',
    factors: [
      { factor: 'Payment History', score: 85, impact: 'positive' },
      { factor: 'Credit Utilization', score: 78, impact: 'positive' },
      { factor: 'Length of Credit History', score: 65, impact: 'neutral' },
      { factor: 'Types of Credit', score: 72, impact: 'positive' },
      { factor: 'Recent Credit Inquiries', score: 90, impact: 'positive' }
    ],
    trend: 'up',
    change: 15
  }

  const financialSummary = {
    totalIncome: 125000,
    totalExpenses: 87500,
    netProfit: 37500,
    profitMargin: 30,
    monthlyIncome: 10417,
    monthlyExpenses: 7292,
    savingsRate: 25,
    debtToIncomeRatio: 15
  }

  const loanApplications = [
    {
      id: 1,
      amount: 50000,
      purpose: 'Equipment Purchase',
      status: 'APPROVED',
      appliedDate: '2024-09-15',
      approvedDate: '2024-09-20',
      interestRate: 12.5,
      term: 24,
      mfi: 'Kenya Women Finance Trust',
      nextPayment: '2024-11-01',
      remainingBalance: 45000
    },
    {
      id: 2,
      amount: 25000,
      purpose: 'Seed Capital',
      status: 'PENDING',
      appliedDate: '2024-10-05',
      interestRate: 14.0,
      term: 12,
      mfi: 'Faulu Microfinance',
      processingDays: 3
    }
  ]

  const availableLoans = [
    {
      id: 1,
      name: 'Agricultural Equipment Loan',
      provider: 'Kenya Women Finance Trust',
      minAmount: 10000,
      maxAmount: 500000,
      interestRate: 12.5,
      term: '6-36 months',
      requirements: ['Credit score 600+', 'Farm ownership proof', 'Income verification'],
      features: ['Flexible repayment', 'No collateral required', 'Quick approval'],
      rating: 4.8
    },
    {
      id: 2,
      name: 'Seasonal Crop Financing',
      provider: 'Faulu Microfinance',
      minAmount: 5000,
      maxAmount: 200000,
      interestRate: 14.0,
      term: '3-12 months',
      requirements: ['Active farming', 'Group membership', 'Previous harvest records'],
      features: ['Harvest-based repayment', 'Insurance included', 'Technical support'],
      rating: 4.6
    },
    {
      id: 3,
      name: 'Livestock Investment Loan',
      provider: 'KWFT Bank',
      minAmount: 20000,
      maxAmount: 1000000,
      interestRate: 11.5,
      term: '12-48 months',
      requirements: ['Livestock experience', 'Land ownership', 'Business plan'],
      features: ['Veterinary support', 'Market linkage', 'Insurance coverage'],
      rating: 4.9
    }
  ]

  const paymentHistory = [
    { date: '2024-10-01', type: 'Loan Payment', amount: -2500, balance: 45000, status: 'completed' },
    { date: '2024-09-25', type: 'Crop Sale', amount: 15000, balance: 47500, status: 'completed' },
    { date: '2024-09-20', type: 'Loan Disbursement', amount: 50000, balance: 32500, status: 'completed' },
    { date: '2024-09-15', type: 'Equipment Purchase', amount: -18000, balance: -17500, status: 'completed' },
    { date: '2024-09-10', type: 'Fertilizer Purchase', amount: -3500, balance: 500, status: 'completed' }
  ]

  const getCreditRating = (score) => {
    if (score >= 750) return { rating: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' }
    if (score >= 700) return { rating: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' }
    if (score >= 650) return { rating: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
    if (score >= 600) return { rating: 'Poor', color: 'text-orange-600', bgColor: 'bg-orange-100' }
    return { rating: 'Very Poor', color: 'text-red-600', bgColor: 'bg-red-100' }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'PENDING': return <Clock className="h-5 w-5 text-yellow-600" />
      case 'REJECTED': return <XCircle className="h-5 w-5 text-red-600" />
      case 'UNDER_REVIEW': return <AlertCircle className="h-5 w-5 text-blue-600" />
      default: return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const calculateMonthlyPayment = (principal, rate, term) => {
    const monthlyRate = rate / 100 / 12
    const numPayments = term
    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                          (Math.pow(1 + monthlyRate, numPayments) - 1)
    return monthlyPayment
  }

  const creditRating = getCreditRating(creditScore.score)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Financial Services</h1>
              <p className="text-gray-600 mt-1">
                Manage your credit, apply for loans, and track your financial health
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={`${creditRating.bgColor} ${creditRating.color} border-0`}>
                <Award className="h-4 w-4 mr-1" />
                Credit Score: {creditScore.score}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="credit" className="flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Credit Score
            </TabsTrigger>
            <TabsTrigger value="loans" className="flex items-center">
              <Banknote className="h-4 w-4 mr-2" />
              Loans
            </TabsTrigger>
            <TabsTrigger value="apply" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Apply
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center">
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(financialSummary.totalIncome)}
                      </p>
                      <p className="text-gray-600">Total Income (YTD)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingDown className="h-8 w-8 text-red-600" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(financialSummary.totalExpenses)}
                      </p>
                      <p className="text-gray-600">Total Expenses (YTD)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(financialSummary.netProfit)}
                      </p>
                      <p className="text-gray-600">Net Profit (YTD)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Percent className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-gray-900">
                        {financialSummary.profitMargin}%
                      </p>
                      <p className="text-gray-600">Profit Margin</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Credit Score Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Credit Score Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-gray-900 mb-2">
                      {creditScore.score}
                    </div>
                    <Badge className={`${creditRating.bgColor} ${creditRating.color} border-0 text-lg px-4 py-1`}>
                      {creditRating.rating}
                    </Badge>
                    <div className="flex items-center justify-center mt-2 text-sm text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +{creditScore.change} points this month
                    </div>
                  </div>
                  <Progress value={(creditScore.score / 850) * 100} className="h-3" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>300</span>
                    <span>850</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Active Loans</CardTitle>
                  <CardDescription>Your current loan portfolio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loanApplications.filter(loan => loan.status === 'APPROVED').map((loan) => (
                    <div key={loan.id} className="p-4 rounded-lg border bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{loan.purpose}</h3>
                        <Badge variant="outline" className="text-green-600">
                          {loan.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Amount:</span> {formatCurrency(loan.amount)}
                        </div>
                        <div>
                          <span className="font-medium">Balance:</span> {formatCurrency(loan.remainingBalance)}
                        </div>
                        <div>
                          <span className="font-medium">Rate:</span> {loan.interestRate}%
                        </div>
                        <div>
                          <span className="font-medium">Next Payment:</span> {formatDate(loan.nextPayment)}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Credit Score Tab */}
          <TabsContent value="credit" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Credit Score Details */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Credit Score Breakdown</CardTitle>
                  <CardDescription>Factors affecting your credit score</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {creditScore.factors.map((factor, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{factor.factor}</span>
                        <span className="text-sm text-gray-600">{factor.score}%</span>
                      </div>
                      <Progress value={factor.score} className="h-2" />
                      <div className="flex items-center text-xs">
                        {factor.impact === 'positive' && (
                          <Badge variant="outline" className="text-green-600">
                            Positive Impact
                          </Badge>
                        )}
                        {factor.impact === 'neutral' && (
                          <Badge variant="outline" className="text-gray-600">
                            Neutral Impact
                          </Badge>
                        )}
                        {factor.impact === 'negative' && (
                          <Badge variant="outline" className="text-red-600">
                            Negative Impact
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Credit Improvement Tips */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Improve Your Credit Score</CardTitle>
                  <CardDescription>Tips to boost your creditworthiness</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Make payments on time</p>
                        <p className="text-sm text-gray-600">Payment history is the most important factor</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Keep credit utilization low</p>
                        <p className="text-sm text-gray-600">Use less than 30% of available credit</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Maintain old accounts</p>
                        <p className="text-sm text-gray-600">Longer credit history improves your score</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Diversify credit types</p>
                        <p className="text-sm text-gray-600">Mix of credit cards, loans, and mortgages</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Loans Tab */}
          <TabsContent value="loans" className="space-y-6">
            {/* Current Applications */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Your Loan Applications</CardTitle>
                <CardDescription>Track the status of your loan applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loanApplications.map((loan) => (
                    <div key={loan.id} className="p-4 rounded-lg border bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(loan.status)}
                          <div>
                            <h3 className="font-semibold text-gray-900">{loan.purpose}</h3>
                            <p className="text-sm text-gray-600">{loan.mfi}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={
                          loan.status === 'APPROVED' ? 'text-green-600' :
                          loan.status === 'PENDING' ? 'text-yellow-600' :
                          loan.status === 'REJECTED' ? 'text-red-600' : 'text-blue-600'
                        }>
                          {loan.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Amount:</span>
                          <p className="font-medium">{formatCurrency(loan.amount)}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Interest Rate:</span>
                          <p className="font-medium">{loan.interestRate}%</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Term:</span>
                          <p className="font-medium">{loan.term} months</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Applied:</span>
                          <p className="font-medium">{formatDate(loan.appliedDate)}</p>
                        </div>
                      </div>
                      {loan.status === 'APPROVED' && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Next payment: {formatDate(loan.nextPayment)}
                            </span>
                            <Button variant="outline" size="sm">
                              Make Payment
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Available Loans */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Available Loan Products</CardTitle>
                <CardDescription>Explore loan options that match your profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableLoans.map((loan) => (
                    <div key={loan.id} className="p-6 rounded-lg border bg-white hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">{loan.name}</h3>
                        <div className="flex items-center text-sm text-yellow-600">
                          <Award className="h-4 w-4 mr-1" />
                          {loan.rating}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{loan.provider}</p>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-medium">
                            {formatCurrency(loan.minAmount)} - {formatCurrency(loan.maxAmount)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Interest Rate:</span>
                          <span className="font-medium">{loan.interestRate}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Term:</span>
                          <span className="font-medium">{loan.term}</span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <p className="text-sm font-medium text-gray-900">Key Features:</p>
                        {loan.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                            {feature}
                          </div>
                        ))}
                      </div>

                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        Apply Now
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Apply Tab */}
          <TabsContent value="apply" className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Loan Application</CardTitle>
                <CardDescription>Apply for a new agricultural loan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loan Amount (KSh)
                      </label>
                      <Input
                        type="number"
                        placeholder="50000"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loan Term (months)
                      </label>
                      <select 
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(e.target.value)}
                      >
                        <option value="6">6 months</option>
                        <option value="12">12 months</option>
                        <option value="18">18 months</option>
                        <option value="24">24 months</option>
                        <option value="36">36 months</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Purpose of Loan
                      </label>
                      <Textarea
                        placeholder="Describe how you plan to use this loan..."
                        value={loanPurpose}
                        onChange={(e) => setLoanPurpose(e.target.value)}
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {loanAmount && (
                      <Card className="border-2 border-green-200 bg-green-50">
                        <CardHeader>
                          <CardTitle className="text-lg">Loan Calculator</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span>Loan Amount:</span>
                            <span className="font-medium">{formatCurrency(parseInt(loanAmount) || 0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Interest Rate:</span>
                            <span className="font-medium">12.5% per annum</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Term:</span>
                            <span className="font-medium">{loanTerm} months</span>
                          </div>
                          <hr />
                          <div className="flex justify-between text-lg font-bold">
                            <span>Monthly Payment:</span>
                            <span className="text-green-600">
                              {formatCurrency(calculateMonthlyPayment(parseInt(loanAmount) || 0, 12.5, parseInt(loanTerm)))}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Your application will be reviewed within 2-3 business days. 
                        Make sure all information is accurate to avoid delays.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button variant="outline">Save as Draft</Button>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Submit Application
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Your recent financial transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentHistory.map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-white">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          payment.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {payment.amount > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{payment.type}</p>
                          <p className="text-sm text-gray-600">{formatDate(payment.date)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${
                          payment.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {payment.amount > 0 ? '+' : ''}{formatCurrency(payment.amount)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Balance: {formatCurrency(payment.balance)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default FinancialServicesPage
