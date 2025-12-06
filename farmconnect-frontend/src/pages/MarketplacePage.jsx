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

  // Mock data for visual testing (since DB might be empty of images)
  const mockImages = [
    "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
    "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ]

  useEffect(() => {
    loadListings()
  }, [])

  const loadListings = async () => {
    try {
      setLoading(true)
      const response = await apiService.getListings()
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Figma-Style Header */}
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
         
         {/* Filter Chips (Figma Style) */}
         <div className="max-w-7xl mx-auto mt-6 flex gap-3 overflow-x-auto pb-2">
            <Badge variant="secondary" className="px-4 py-2 rounded-full bg-black text-white cursor-pointer">All Products</Badge>
            <Badge variant="outline" className="px-4 py-2 rounded-full bg-white border-gray-300 cursor-pointer hover:bg-gray-50">Vegetables</Badge>
            <Badge variant="outline" className="px-4 py-2 rounded-full bg-white border-gray-300 cursor-pointer hover:bg-gray-50">Fruits</Badge>
            <Badge variant="outline" className="px-4 py-2 rounded-full bg-white border-gray-300 cursor-pointer hover:bg-gray-50">Grains</Badge>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
                <span className="block sm:inline">{success}</span>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((listing, index) => (
            <Card key={listing.id} className="border border-gray-200 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-shadow bg-white">
              
              {/* Image Area */}
              <div className="relative h-56 w-full bg-gray-200">
                <img 
                  src={listing.images?.[0] || mockImages[index % mockImages.length]} 
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
                  <h3 className="text-xl font-bold text-gray-900">{listing.title}</h3>
                </div>
                
                <div className="flex items-center text-gray-500 text-sm mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    {listing.location}
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

                {/* Figma Style Action Buttons */}
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
                    {sending ? <Loader2 className="animate-spin" /> : <><Send className="mr-2 h-4 w-4" /> Send Message</>}
                </Button>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MarketplacePage
