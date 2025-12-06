import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingCart, 
  MessageCircle, 
  CreditCard, 
  BookOpen, 
  TrendingUp,
  Smartphone,
  ArrowRight
} from 'lucide-react'

const LandingPage = () => {
  const features = [
    {
      icon: <ShoppingCart className="h-8 w-8 text-green-600" />,
      title: "Digital Marketplace",
      description: "Connect directly with buyers and sell your produce at fair prices without middlemen."
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-blue-600" />,
      title: "Direct Communication",
      description: "Chat directly with buyers and sellers to negotiate prices and arrange deliveries."
    },
    {
      icon: <CreditCard className="h-8 w-8 text-purple-600" />,
      title: "Access to Credit",
      description: "Get loans and financial services tailored for farmers based on your farming history."
    },
    {
      icon: <BookOpen className="h-8 w-8 text-orange-600" />,
      title: "Training & Resources",
      description: "Access agricultural training, weather updates, and market price information."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-red-600" />,
      title: "Market Intelligence",
      description: "Real-time market prices and trends to help you make informed selling decisions."
    },
    {
      icon: <Smartphone className="h-8 w-8 text-indigo-600" />,
      title: "Mobile-First Design",
      description: "Works perfectly on your smartphone, even with slow internet connections."
    }
  ]

  const stats = [
    { number: "10,000+", label: "Farmers Connected" },
    { number: "5,000+", label: "Buyers Active" },
    { number: "KSh 50M+", label: "Transactions Processed" },
    { number: "95%", label: "User Satisfaction" }
  ]

  const testimonials = [
    {
      name: "John Mwangi",
      role: "Tomato Farmer, Nakuru",
      content: "FarmConnect helped me sell directly to restaurants in Nairobi. I now earn 40% more than before!",
      avatar: "JM"
    },
    {
      name: "Mary Wanjiku",
      role: "Vegetable Supplier, Kiambu",
      content: "The platform is so easy to use. I can manage my orders and communicate with buyers from my phone.",
      avatar: "MW"
    },
    {
      name: "David Ochieng",
      role: "Restaurant Owner, Nairobi",
      content: "I get fresh produce directly from farmers at great prices. The quality is consistently excellent.",
      avatar: "DO"
    }
  ]

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50">
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200">
              🌱 Connecting Farmers to Markets
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Grow Your Farm Business with
              <span className="text-green-600 block">FarmConnect</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The digital platform that connects Kenyan farmers directly to buyers, 
              provides access to credit, and offers agricultural training and market intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button className="px-8 py-3 bg-green-600 text-white hover:bg-green-700">
                  Start Selling Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button className="px-8 py-3 border border-green-600 text-green-600 hover:bg-green-50 bg-transparent">
                  Browse Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              FarmConnect provides all the tools and services farmers need to grow their business and increase their income.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How FarmConnect Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in just three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Create Your Profile</h3>
              <p className="text-gray-600">
                Sign up and create your farmer or buyer profile with your location and preferences.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">List or Browse Products</h3>
              <p className="text-gray-600">
                Farmers list their produce, buyers browse and find what they need at competitive prices.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Connect & Trade</h3>
              <p className="text-gray-600">
                Communicate directly, negotiate prices, and arrange delivery for successful transactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from farmers and buyers using FarmConnect
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                      <span className="text-green-600 font-semibold">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Farm Business?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of farmers and buyers who are already using FarmConnect to grow their business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button className="px-8 py-3 bg-white text-green-600 hover:bg-gray-100">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button className="px-8 py-3 border border-white text-white hover:bg-white hover:text-green-600 bg-transparent">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage