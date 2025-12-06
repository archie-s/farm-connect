import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Thermometer,
  Droplets,
  Wind,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Newspaper,
  Users,
  Award,
  MapPin,
  Calendar,
  DollarSign,
  Lightbulb,
  Phone,
  Mail,
  ExternalLink,
  Search,
  Filter,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react'
import { useAuth } from '../App'
import '../App.css'

const InfoHubPage = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('weather')
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data - In production, this would come from external APIs
  const weatherData = {
    current: {
      location: user?.location || 'Nairobi, Kenya',
      temperature: 24,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 12,
      icon: 'partly-cloudy'
    },
    forecast: [
      { day: 'Today', high: 26, low: 18, condition: 'Partly Cloudy', icon: 'partly-cloudy', rain: 20 },
      { day: 'Tomorrow', high: 28, low: 19, condition: 'Sunny', icon: 'sunny', rain: 5 },
      { day: 'Wednesday', high: 25, low: 17, condition: 'Light Rain', icon: 'rain', rain: 80 },
      { day: 'Thursday', high: 23, low: 16, condition: 'Cloudy', icon: 'cloudy', rain: 40 },
      { day: 'Friday', high: 27, low: 20, condition: 'Sunny', icon: 'sunny', rain: 10 }
    ],
    alerts: [
      {
        type: 'warning',
        title: 'Heavy Rain Expected',
        message: 'Heavy rainfall expected Wednesday-Thursday. Protect crops and ensure proper drainage.',
        severity: 'medium'
      }
    ]
  }

  const marketPrices = [
    { commodity: 'Maize', price: 45, unit: 'kg', change: 2.5, trend: 'up', market: 'Nairobi' },
    { commodity: 'Beans', price: 120, unit: 'kg', change: -5.2, trend: 'down', market: 'Nakuru' },
    { commodity: 'Tomatoes', price: 60, unit: 'kg', change: 8.1, trend: 'up', market: 'Kiambu' },
    { commodity: 'Onions', price: 80, unit: 'kg', change: 1.8, trend: 'up', market: 'Meru' },
    { commodity: 'Potatoes', price: 35, unit: 'kg', change: -2.1, trend: 'down', market: 'Nakuru' },
    { commodity: 'Carrots', price: 55, unit: 'kg', change: 4.3, trend: 'up', market: 'Nairobi' }
  ]

  const newsArticles = [
    {
      id: 1,
      title: 'New Government Subsidy Program for Small-Scale Farmers',
      summary: 'The Ministry of Agriculture announces a new KSh 5 billion subsidy program to support small-scale farmers with seeds and fertilizers.',
      category: 'Government',
      date: '2024-10-08',
      readTime: '3 min read',
      source: 'Ministry of Agriculture'
    },
    {
      id: 2,
      title: 'Climate-Smart Agriculture Techniques Show Promise',
      summary: 'Recent studies show that climate-smart agriculture techniques can increase crop yields by up to 30% while reducing water usage.',
      category: 'Technology',
      date: '2024-10-07',
      readTime: '5 min read',
      source: 'Agricultural Research Institute'
    },
    {
      id: 3,
      title: 'Export Market Opens for Kenyan Avocados',
      summary: 'New trade agreements open European markets for Kenyan avocado farmers, promising better prices and increased demand.',
      category: 'Markets',
      date: '2024-10-06',
      readTime: '4 min read',
      source: 'Kenya Export Board'
    },
    {
      id: 4,
      title: 'Digital Payment Solutions Transform Rural Banking',
      summary: 'Mobile money and digital payment platforms are making financial services more accessible to rural farmers across Kenya.',
      category: 'Finance',
      date: '2024-10-05',
      readTime: '6 min read',
      source: 'Financial Times Kenya'
    }
  ]

  const trainingPrograms = [
    {
      id: 1,
      title: 'Organic Farming Certification Course',
      description: 'Learn organic farming techniques and get certified to access premium markets.',
      duration: '4 weeks',
      level: 'Intermediate',
      participants: 156,
      rating: 4.8,
      price: 'Free',
      provider: 'Kenya Organic Agriculture Network'
    },
    {
      id: 2,
      title: 'Digital Marketing for Farmers',
      description: 'Master online marketing strategies to sell your produce directly to consumers.',
      duration: '2 weeks',
      level: 'Beginner',
      participants: 89,
      rating: 4.6,
      price: 'KSh 2,500',
      provider: 'FarmTech Academy'
    },
    {
      id: 3,
      title: 'Water-Efficient Irrigation Systems',
      description: 'Design and implement water-saving irrigation systems for your farm.',
      duration: '3 weeks',
      level: 'Advanced',
      participants: 67,
      rating: 4.9,
      price: 'KSh 5,000',
      provider: 'Irrigation Institute of Kenya'
    },
    {
      id: 4,
      title: 'Post-Harvest Handling and Storage',
      description: 'Reduce post-harvest losses with proper handling and storage techniques.',
      duration: '1 week',
      level: 'Beginner',
      participants: 234,
      rating: 4.7,
      price: 'Free',
      provider: 'Ministry of Agriculture'
    }
  ]

  const expertTips = [
    {
      id: 1,
      title: 'Soil Testing: The Foundation of Successful Farming',
      content: 'Regular soil testing helps you understand nutrient levels and pH, enabling you to make informed decisions about fertilizers and crop selection.',
      author: 'Dr. Mary Kiprotich',
      expertise: 'Soil Scientist',
      likes: 45,
      category: 'Soil Management'
    },
    {
      id: 2,
      title: 'Integrated Pest Management for Sustainable Farming',
      content: 'Combine biological, cultural, and chemical methods to control pests while minimizing environmental impact and reducing costs.',
      author: 'Prof. James Mwangi',
      expertise: 'Entomologist',
      likes: 67,
      category: 'Pest Control'
    },
    {
      id: 3,
      title: 'Maximizing Crop Rotation Benefits',
      content: 'Strategic crop rotation improves soil health, breaks pest cycles, and can increase overall farm productivity by 15-25%.',
      author: 'Dr. Sarah Wanjiku',
      expertise: 'Agronomist',
      likes: 52,
      category: 'Crop Management'
    }
  ]

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return <Sun className="h-8 w-8 text-yellow-500" />
      case 'partly-cloudy': return <Cloud className="h-8 w-8 text-gray-500" />
      case 'cloudy': return <Cloud className="h-8 w-8 text-gray-600" />
      case 'rain':
      case 'light rain': return <CloudRain className="h-8 w-8 text-blue-500" />
      default: return <Sun className="h-8 w-8 text-yellow-500" />
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const filteredNews = newsArticles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredTraining = trainingPrograms.filter(program =>
    program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.level.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Information Hub</h1>
              <p className="text-gray-600 mt-1">
                Stay informed with weather, market prices, news, and training resources
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-sm">
                <MapPin className="h-4 w-4 mr-1" />
                {user?.location || 'Nairobi, Kenya'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="weather" className="flex items-center">
              <Cloud className="h-4 w-4 mr-2" />
              Weather
            </TabsTrigger>
            <TabsTrigger value="markets" className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Markets
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center">
              <Newspaper className="h-4 w-4 mr-2" />
              News
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              Training
            </TabsTrigger>
            <TabsTrigger value="tips" className="flex items-center">
              <Lightbulb className="h-4 w-4 mr-2" />
              Expert Tips
            </TabsTrigger>
          </TabsList>

          {/* Weather Tab */}
          <TabsContent value="weather" className="space-y-6">
            {/* Weather Alerts */}
            {weatherData.alerts.map((alert, index) => (
              <Alert key={index} className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <strong>{alert.title}:</strong> {alert.message}
                </AlertDescription>
              </Alert>
            ))}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Current Weather */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {getWeatherIcon(weatherData.current.condition)}
                    <span className="ml-3">Current Weather</span>
                  </CardTitle>
                  <CardDescription>{weatherData.current.location}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900">
                      {weatherData.current.temperature}°C
                    </div>
                    <div className="text-gray-600">{weatherData.current.condition}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Droplets className="h-4 w-4 text-blue-500 mr-2" />
                      <span>Humidity: {weatherData.current.humidity}%</span>
                    </div>
                    <div className="flex items-center">
                      <Wind className="h-4 w-4 text-gray-500 mr-2" />
                      <span>Wind: {weatherData.current.windSpeed} km/h</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 5-Day Forecast */}
              <Card className="lg:col-span-2 border-0 shadow-md">
                <CardHeader>
                  <CardTitle>5-Day Forecast</CardTitle>
                  <CardDescription>Plan your farming activities ahead</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {weatherData.forecast.map((day, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div className="flex items-center space-x-3">
                          {getWeatherIcon(day.condition)}
                          <div>
                            <div className="font-medium">{day.day}</div>
                            <div className="text-sm text-gray-600">{day.condition}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{day.high}°/{day.low}°</div>
                          <div className="text-sm text-blue-600">{day.rain}% rain</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Markets Tab */}
          <TabsContent value="markets" className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Current Market Prices
                </CardTitle>
                <CardDescription>Latest commodity prices from major markets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {marketPrices.map((item, index) => (
                    <div key={index} className="p-4 rounded-lg border bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{item.commodity}</h3>
                        <Badge variant="outline" className="text-xs">
                          {item.market}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            KSh {item.price}
                          </div>
                          <div className="text-sm text-gray-600">per {item.unit}</div>
                        </div>
                        <div className={`flex items-center text-sm ${
                          item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.trend === 'up' ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          )}
                          {Math.abs(item.change)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news" className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search news articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredNews.map((article) => (
                <Card key={article.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{article.category}</Badge>
                      <span className="text-sm text-gray-500">{formatDate(article.date)}</span>
                    </div>
                    <CardTitle className="text-lg leading-tight">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{article.summary}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <span>{article.readTime}</span> • <span>{article.source}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Read More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Training Tab */}
          <TabsContent value="training" className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search training programs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTraining.map((program) => (
                <Card key={program.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{program.level}</Badge>
                      <div className="text-lg font-bold text-green-600">{program.price}</div>
                    </div>
                    <CardTitle className="text-lg">{program.title}</CardTitle>
                    <CardDescription>{program.provider}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{program.description}</p>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Duration: {program.duration}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        {program.participants} participants
                      </div>
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-2" />
                        Rating: {program.rating}/5.0
                      </div>
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Enroll Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Expert Tips Tab */}
          <TabsContent value="tips" className="space-y-6">
            <div className="space-y-6">
              {expertTips.map((tip) => (
                <Card key={tip.id} className="border-0 shadow-md">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{tip.category}</Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {tip.likes} likes
                      </div>
                    </div>
                    <CardTitle className="text-xl">{tip.title}</CardTitle>
                    <CardDescription>
                      By {tip.author}, {tip.expertise}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{tip.content}</p>
                    <div className="flex items-center justify-between mt-4">
                      <Button variant="outline" size="sm">
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Helpful
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default InfoHubPage
