import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Search, Filter, MapPin, Plus, ShoppingCart, Star, Phone, Loader2, Send, MessageCircle } from 'lucide-react'
import { useAuth } from '../App'
import apiService from '../services/api'
import '../App.css'

const MarketplacePage = () => {
  const { user } = useAuth()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [contactListing, setContactListing] = useState(null)
  const [messageText, setMessageText] = useState('')
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  // 1. SMART IMAGE LOGIC: Matches keywords to real images
  const getProductImage = (title, category) => {
    const t = title.toLowerCase();
    const c = category.toLowerCase();
    
    if (t.includes('maize') || t.includes('corn')) return "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&q=80"; // Maize
    if (t.includes('tomato')) return "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80"; // Tomato
    if (t.includes('onion')) return "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&q=80"; // Onion
    if (t.includes('potato')) return "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80"; // Potato
    if (t.includes('bean')) return "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80"; // Beans
    if (t.includes('carrot')) return "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&q=80"; // Carrots
    if (t.includes('kales') || t.includes('sukuma')) return "https://images.unsplash.com/photo-1524593166156-312f362cada0?w=800&q=80"; // Greens
    
    // Fallbacks by category
    if (c.includes('fruit')) return "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=80";
    if (c.includes('grain')) return "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80";
    
    // Default
    return "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=800&q=80"; 
  }

  useEffect(() => {
    loadListings()
  }, [activeCategory])

  const loadListings = async () => {
    try {
      setLoading(true)
      // 2. INTERACTIVE FILTERS: Pass category to API
      const params = {}
      if (activeCategory !== 'all') {
        params.category = activeCategory
      }
      
      const response = await apiService.getListings(params)
      if (response.success) {
        setListings(response.data.listings)
      }
    } catch (error) {
      console.error('Error loading listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const openContactDialog = (listing) => {
    setContactListing(listing)
    setMessageText(`Hi, I'm interested in your ${listing.title}. Is it still available?`)
  }

  const handleSendMessage = async () => {
    if (!messageText.trim()) return
    setSending(true)
    try {
        const response = await apiService.sendMessage({
            receiverId: contactListing.farmer.id,
            content: messageText
        })
        if (response.success) {
            setSuccess('Message sent!')
            setContactListing(null)
            setMessageText('')
            setTimeout(() => setSuccess(''), 3000)
        }
    } catch (err) {
        console.error(err)
    } finally {
        setSending(false)
    }
  }

  const filterCategories = [
    { id: 'all', label: 'All Products' },
    { id: 'Vegetables', label: 'Vegetables' },
    { id: 'Fruits', label: 'Fruits' },
    { id: 'Grains', label: 'Grains' },
    { id: 'Root Vegetables', label: 'Root Veg' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-8 py-4">
         <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
            
            {user?.role === 'FARMER' && (
               <Button className="bg-green-500 hover:bg-green-600 rounded-full px-6">
                 <Plus className="h-4 w-4 mr-2" />
                 Create Listing
               </Button>
            )}
         </div>
         
         {/* 3. INTERACTIVE FILTER CHIPS */}
         <div className="max-w-7xl mx-auto mt-6 flex gap-3 overflow-x-auto pb-2">
            {filterCategories.map((cat) => (
                <Badge 
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    variant={activeCategory === cat.id ? "secondary" : "outline"}
                    className={`px-4 py-2 rounded-full cursor-pointer transition-colors ${
                        activeCategory === cat.id 
                        ? 'bg-black text-white hover:bg-gray-800' 
                        : 'bg-white border-gray-300 hover:bg-gray-100 text-gray-700'
                    }`}
                >
                    {cat.label}
                </Badge>
            ))}
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
                <span className="block sm:inline">{success}</span>
            </div>
        )}

        {loading ? (
            <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing) => (
                <Card key={listing.id} className="border border-gray-200 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow bg-white">
                
                {/* Image Area with Smart Logic */}
                <div className="relative h-56 w-full bg-gray-100">
                    <img 
                    src={getProductImage(listing.title, listing.category)} 
                    alt={listing.title}
                    className="w-full h-full object-cover"
                    />
                    {listing.farmer?.isVerified && (
                    <Badge className="absolute top-3 right-3 bg-green-500 hover:bg-green-600 text-white border-none px-3 py-1 rounded-full">
                        Verified Seller
                    </Badge>
                    )}
                </div>

                {/* Content Area */}
                <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{listing?.title ?? ''}</h3>
                    </div>
                    
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{listing?.location ?? ''}</span>
                    </div>

                    <div className="flex items-center text-yellow-500 text-sm mb-4">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="ml-1 font-medium text-gray-900">4.8</span>
                        <span className="text-gray-400 ml-1">(24 reviews)</span>
                    </div>

                    <div className="space-y-1 mb-6">
                        <div className="flex items-baseline">
                            <span className="text-green-600 font-bold text-xl">KSh {listing.pricePerUnit}</span>
                            <span className="text-gray-500 text-sm ml-1">per {listing.unitType}</span>
                        </div>
                        <div className="text-gray-600 text-sm">
                            Available: <span className="font-medium text-gray-900">{listing.quantityAvailable} {listing.unitType}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button 
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl h-12 font-semibold"
                            onClick={() => openContactDialog(listing)}
                        >
                            <ShoppingCart className="h-5 w-5 mr-2" />
                            Contact Seller
                        </Button>
                        
                        <Button variant="outline" className="w-12 h-12 rounded-xl border-gray-300 p-0 flex items-center justify-center">
                            <Phone className="h-5 w-5 text-gray-600" />
                        </Button>
                    </div>
                </CardContent>
                </Card>
            ))}
            </div>
        )}
        
        {!loading && listings.length === 0 && (
            <div className="text-center py-12 text-gray-500">
                No products found in this category.
            </div>
        )}
      </div>

      {/* Contact Dialog */}
      <Dialog open={!!contactListing} onOpenChange={(open) => !open && setContactListing(null)}>
        <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle>Contact Seller</DialogTitle>
                <DialogDescription>Send a message to {contactListing?.farmer?.firstName}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <Textarea 
                    value={messageText} 
                    onChange={(e) => setMessageText(e.target.value)} 
                    rows={4} 
                />
                <Button onClick={handleSendMessage} disabled={sending} className="w-full bg-green-500">
                  {sending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <span className="inline-flex items-center">
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </span>
                  )}
                </Button>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MarketplacePage
