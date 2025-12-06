import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  MessageCircle, 
  Users, 
  Clock, 
  Send, 
  Search, 
  User, 
  CheckCircle, 
  Circle,
  Phone,
  Mail,
  MapPin,
  Package,
  Loader2
} from 'lucide-react'
import { useAuth } from '../App'
import apiService from '../services/api'
import '../App.css'

const MessagesPage = () => {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadMessages()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadMessages = async () => {
    try {
      setLoading(true)
      const response = await apiService.getMessages()
      if (response.success) {
        // Group messages by conversation
        const messageGroups = {}
        response.data.messages.forEach(message => {
          const otherUserId = message.senderId === user.id ? message.receiverId : message.senderId
          const otherUser = message.senderId === user.id ? message.receiver : message.sender
          
          if (!messageGroups[otherUserId]) {
            messageGroups[otherUserId] = {
              id: otherUserId,
              user: otherUser,
              messages: [],
              lastMessage: null,
              unreadCount: 0
            }
          }
          
          messageGroups[otherUserId].messages.push(message)
          
          // Update last message
          if (!messageGroups[otherUserId].lastMessage || 
              new Date(message.createdAt) > new Date(messageGroups[otherUserId].lastMessage.createdAt)) {
            messageGroups[otherUserId].lastMessage = message
          }
          
          // Count unread messages
          if (!message.isRead && message.receiverId === user.id) {
            messageGroups[otherUserId].unreadCount++
          }
        })
        
        // Convert to array and sort by last message time
        const conversationList = Object.values(messageGroups).sort((a, b) => {
          const aTime = a.lastMessage ? new Date(a.lastMessage.createdAt) : new Date(0)
          const bTime = b.lastMessage ? new Date(b.lastMessage.createdAt) : new Date(0)
          return bTime - aTime
        })
        
        setConversations(conversationList)
        
        // Select first conversation if none selected
        if (conversationList.length > 0 && !selectedConversation) {
          selectConversation(conversationList[0])
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error)
      setError('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  const selectConversation = async (conversation) => {
    setSelectedConversation(conversation)
    setMessages(conversation.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)))
    
    // Mark messages as read
    const unreadMessages = conversation.messages.filter(msg => 
      !msg.isRead && msg.receiverId === user.id
    )
    
    for (const message of unreadMessages) {
      try {
        await apiService.markMessageAsRead(message.id)
      } catch (error) {
        console.error('Error marking message as read:', error)
      }
    }
    
    // Update conversation unread count
    setConversations(prev => prev.map(conv => 
      conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
    ))
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation || sending) return

    setSending(true)
    setError('')

    try {
      const messageData = {
        receiverId: selectedConversation.id,
        content: newMessage.trim()
      }

      const response = await apiService.sendMessage(messageData)
      if (response.success) {
        const sentMessage = response.data.message
        setMessages(prev => [...prev, sentMessage])
        setNewMessage('')
        
        // Update conversation last message
        setConversations(prev => prev.map(conv => 
          conv.id === selectedConversation.id 
            ? { ...conv, lastMessage: sentMessage, messages: [...conv.messages, sentMessage] }
            : conv
        ))
      }
    } catch (error) {
      setError(error.message || 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-KE', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('en-KE', { 
        weekday: 'short',
        hour: '2-digit', 
        minute: '2-digit' 
      })
    } else {
      return date.toLocaleDateString('en-KE', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  const filteredConversations = conversations.filter(conv =>
    conv.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage?.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600 mt-1">
                Communicate with farmers and buyers
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-sm">
                <MessageCircle className="h-4 w-4 mr-1" />
                {conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)} Unread
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Users className="h-5 w-5 mr-2" />
                Conversations
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[450px] overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No conversations yet</p>
                    <p className="text-sm mt-1">Start by contacting a seller in the marketplace</p>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => selectConversation(conversation)}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedConversation?.id === conversation.id ? 'bg-green-50 border-l-4 border-l-green-600' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conversation.user.profileImageUrl} />
                          <AvatarFallback className="bg-green-100 text-green-700">
                            {getInitials(conversation.user.firstName, conversation.user.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {conversation.user.firstName} {conversation.user.lastName}
                            </p>
                            <div className="flex items-center space-x-2">
                              {conversation.unreadCount > 0 && (
                                <Badge className="bg-green-600 text-white text-xs">
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                              <p className="text-xs text-gray-500">
                                {conversation.lastMessage && formatTime(conversation.lastMessage.createdAt)}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 truncate mt-1">
                            {conversation.lastMessage?.content || 'No messages yet'}
                          </p>
                          <div className="flex items-center mt-2 space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {conversation.user.role}
                            </Badge>
                            {conversation.user.isVerified && (
                              <Badge variant="outline" className="text-xs text-green-600">
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <Card className="border-0 shadow-md h-full flex flex-col">
                {/* Chat Header */}
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedConversation.user.profileImageUrl} />
                      <AvatarFallback className="bg-green-100 text-green-700">
                        {getInitials(selectedConversation.user.firstName, selectedConversation.user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedConversation.user.firstName} {selectedConversation.user.lastName}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {selectedConversation.user.role}
                        </span>
                        {selectedConversation.user.location && (
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {selectedConversation.user.location}
                          </span>
                        )}
                        {selectedConversation.user.isVerified && (
                          <Badge variant="outline" className="text-xs text-green-600">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 p-4 overflow-y-auto max-h-[350px]">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === user.id
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className={`flex items-center justify-between mt-1 text-xs ${
                            message.senderId === user.id ? 'text-green-100' : 'text-gray-500'
                          }`}>
                            <span>{formatTime(message.createdAt)}</span>
                            {message.senderId === user.id && (
                              <span className="ml-2">
                                {message.isRead ? (
                                  <CheckCircle className="h-3 w-3" />
                                ) : (
                                  <Circle className="h-3 w-3" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <form onSubmit={sendMessage} className="flex space-x-2">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          sendMessage(e)
                        }
                      }}
                    />
                    <Button 
                      type="submit" 
                      disabled={!newMessage.trim() || sending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {sending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </form>
                  <p className="text-xs text-gray-500 mt-2">
                    Press Enter to send, Shift+Enter for new line
                  </p>
                </div>
              </Card>
            ) : (
              <Card className="border-0 shadow-md h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                  <p>Choose a conversation from the left to start messaging</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{conversations.length}</p>
                  <p className="text-gray-600">Total Conversations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)}
                  </p>
                  <p className="text-gray-600">Unread Messages</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {conversations.filter(conv => conv.user.isVerified).length}
                  </p>
                  <p className="text-gray-600">Verified Contacts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default MessagesPage
