import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingCart, 
  MessageCircle, 
  Package, 
  TrendingUp, 
  Users, 
  DollarSign,
  Plus,
  Eye
} from 'lucide-react'
import { useAuth } from '../App'
import apiService from '../services/api'
import '../App.css'

const DashboardPage = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    listings: 0,
    orders: 0,
    messages: 0,
    revenue: 0
  })
  const [recentListings, setRecentListings] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Load recent listings and orders
      const [listingsResponse, ordersResponse] = await Promise.all([
        apiService.getListings({ limit: 5 }),
        apiService.getOrders({ limit: 5 })
      ])

      if (listingsResponse.success) {
        setRecentListings(listingsResponse.data.listings)
        setStats(prev => ({ ...prev, listings: listingsResponse.data.pagination.total }))
      }

      if (ordersResponse.success) {
        setRecentOrders(ordersResponse.data.orders)
        setStats(prev => ({ 
          ...prev, 
          orders: ordersResponse.data.orders.length,
          revenue: ordersResponse.data.orders.reduce((sum, order) => sum + order.totalAmount, 0)
        }))
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const getRoleSpecificStats = () => {
    if (user?.role === 'FARMER') {
      return [
        { title: 'Active Listings', value: stats.listings, icon: Package, color: 'text-blue-600' },
        { title: 'Total Orders', value: stats.orders, icon: ShoppingCart, color: 'text-green-600' },
        { title: 'Revenue (KSh)', value: stats.revenue.toLocaleString(), icon: DollarSign, color: 'text-purple-600' },
        { title: 'Messages', value: stats.messages, icon: MessageCircle, color: 'text-orange-600' }
      ]
    } else if (user?.role === 'BUYER') {
      return [
        { title: 'Orders Placed', value: stats.orders, icon: ShoppingCart, color: 'text-green-600' },
        { title: 'Suppliers', value: stats.listings, icon: Users, color: 'text-blue-600' },
        { title: 'Spent (KSh)', value: stats.revenue.toLocaleString(), icon: DollarSign, color: 'text-purple-600' },
        { title: 'Messages', value: stats.messages, icon: MessageCircle, color: 'text-orange-600' }
      ]
    } else {
      return [
        { title: 'Total Users', value: '10,000+', icon: Users, color: 'text-blue-600' },
        { title: 'Transactions', value: '5,000+', icon: ShoppingCart, color: 'text-green-600' },
        { title: 'Revenue', value: 'KSh 50M+', icon: DollarSign, color: 'text-purple-600' },
        { title: 'Growth', value: '+25%', icon: TrendingUp, color: 'text-orange-600' }
      ]
    }
  }

  const getQuickActions = () => {
    if (user?.role === 'FARMER') {
      return [
        { title: 'Create New Listing', href: '/marketplace?action=create', icon: Plus, color: 'bg-green-600' },
        { title: 'View Orders', href: '/orders', icon: ShoppingCart, color: 'bg-blue-600' },
        { title: 'Messages', href: '/messages', icon: MessageCircle, color: 'bg-purple-600' },
        { title: 'Browse Market', href: '/marketplace', icon: Eye, color: 'bg-orange-600' }
      ]
    } else if (user?.role === 'BUYER') {
      return [
        { title: 'Browse Products', href: '/marketplace', icon: Eye, color: 'bg-green-600' },
        { title: 'My Orders', href: '/orders', icon: ShoppingCart, color: 'bg-blue-600' },
        { title: 'Messages', href: '/messages', icon: MessageCircle, color: 'bg-purple-600' },
        { title: 'Find Suppliers', href: '/marketplace?category=all', icon: Users, color: 'bg-orange-600' }
      ]
    } else {
      return [
        { title: 'View Analytics', href: '/analytics', icon: TrendingUp, color: 'bg-green-600' },
        { title: 'User Management', href: '/users', icon: Users, color: 'bg-blue-600' },
        { title: 'System Health', href: '/health', icon: Eye, color: 'bg-purple-600' },
        { title: 'Reports', href: '/reports', icon: Package, color: 'bg-orange-600' }
      ]
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {getGreeting()}, {user?.firstName}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome to your FarmConnect dashboard
              </p>
            </div>
            <Badge variant="outline" className="text-sm">
              {user?.role?.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {getRoleSpecificStats().map((stat, index) => (
            <Card key={index} className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {getQuickActions().map((action, index) => (
              <Link key={index} to={action.href}>
                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className={`inline-flex p-3 rounded-full ${action.color} text-white mb-3`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{action.title}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Listings */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Listings
                <Link to="/marketplace">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </CardTitle>
              <CardDescription>
                Latest products available in the marketplace
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentListings.length > 0 ? (
                <div className="space-y-4">
                  {recentListings.slice(0, 3).map((listing) => (
                    <div key={listing.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{listing.title}</h4>
                        <p className="text-sm text-gray-600">{listing.category}</p>
                        <p className="text-sm font-medium text-green-600">
                          KSh {listing.pricePerUnit}/{listing.unitType}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {listing.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No recent listings</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Orders
                <Link to="/orders">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </CardTitle>
              <CardDescription>
                Latest order activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{order.listing?.title}</h4>
                        <p className="text-sm text-gray-600">
                          Qty: {order.quantityOrdered} {order.listing?.unitType}
                        </p>
                        <p className="text-sm font-medium text-green-600">
                          KSh {order.totalAmount.toLocaleString()}
                        </p>
                      </div>
                      <Badge 
                        variant={order.status === 'DELIVERED' ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {order.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No recent orders</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
