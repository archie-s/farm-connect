import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Sprout, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '../App'
import apiService from '../services/api'
import '../App.css'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await apiService.login(formData)
      
      if (response.success) {
        login(response.data.user, {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken
        })
        const redirectTo = location.state?.from?.pathname || '/dashboard'
        navigate(redirectTo, { replace: true })
      }
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Demo credentials for easy testing
  const demoCredentials = [
    { email: 'farmer1@farmconnect.co.ke', password: 'password123', role: 'Farmer' },
    { email: 'buyer1@farmconnect.co.ke', password: 'password123', role: 'Buyer' },
    { email: 'mfi1@farmconnect.co.ke', password: 'password123', role: 'MFI' },
    { email: 'admin@farmconnect.co.ke', password: 'password123', role: 'Admin' }
  ]

  const fillDemoCredentials = (email, password) => {
    setFormData({ email, password })
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-2xl font-bold text-gray-900 hover:text-green-600 transition-colors">
            <Sprout className="h-8 w-8 text-green-600" />
            <span>FarmConnect</span>
          </Link>
          <p className="text-gray-600 mt-2">Welcome back! Sign in to your account</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="farmer@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="text-center">
              <Link 
                to="#" 
                className="text-sm text-green-600 hover:text-green-700 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Demo Accounts</span>
              </div>
            </div>

            {/* Demo Credentials */}
            <div className="space-y-2">
              <p className="text-xs text-gray-600 text-center">Quick login with demo accounts:</p>
              <div className="grid grid-cols-2 gap-2">
                {demoCredentials.map((cred, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => fillDemoCredentials(cred.email, cred.password)}
                    className="text-xs h-8"
                  >
                    {cred.role}
                  </Button>
                ))}
              </div>
            </div>

            <div className="text-center pt-4">
              <span className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-green-600 hover:text-green-700 font-medium hover:underline"
                >
                  Sign up here
                </Link>
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Link 
            to="/" 
            className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
