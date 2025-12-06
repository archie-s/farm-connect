// PWA Utilities for FarmConnect
// Handles offline functionality, data sync, and PWA features

class PWAManager {
  constructor() {
    this.isOnline = navigator.onLine
    this.dbName = 'FarmConnectOffline'
    this.dbVersion = 1
    this.db = null
    
    this.init()
  }
  
  async init() {
    // Initialize IndexedDB for offline storage
    await this.initDB()
    
    // Set up event listeners
    this.setupEventListeners()
    
    // Register for background sync if supported
    this.registerBackgroundSync()
  }
  
  // Initialize IndexedDB
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)
      
      request.onerror = () => reject(request.error)
      
      request.onsuccess = () => {
        this.db = request.result
        console.log('[PWA] IndexedDB initialized')
        resolve(this.db)
      }
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result
        
        // Create object stores for offline data
        if (!db.objectStoreNames.contains('messages')) {
          const messageStore = db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true })
          messageStore.createIndex('timestamp', 'timestamp', { unique: false })
          messageStore.createIndex('conversationId', 'conversationId', { unique: false })
        }
        
        if (!db.objectStoreNames.contains('listings')) {
          const listingStore = db.createObjectStore('listings', { keyPath: 'id', autoIncrement: true })
          listingStore.createIndex('timestamp', 'timestamp', { unique: false })
          listingStore.createIndex('userId', 'userId', { unique: false })
        }
        
        if (!db.objectStoreNames.contains('orders')) {
          const orderStore = db.createObjectStore('orders', { keyPath: 'id', autoIncrement: true })
          orderStore.createIndex('timestamp', 'timestamp', { unique: false })
          orderStore.createIndex('userId', 'userId', { unique: false })
        }
        
        if (!db.objectStoreNames.contains('cache')) {
          const cacheStore = db.createObjectStore('cache', { keyPath: 'key' })
          cacheStore.createIndex('timestamp', 'timestamp', { unique: false })
        }
        
        console.log('[PWA] IndexedDB stores created')
      }
    })
  }
  
  // Set up event listeners for online/offline status
  setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true
      console.log('[PWA] Connection restored')
      this.syncOfflineData()
      this.showConnectionStatus('online')
    })
    
    window.addEventListener('offline', () => {
      this.isOnline = false
      console.log('[PWA] Connection lost')
      this.showConnectionStatus('offline')
    })
  }
  
  // Show connection status to user
  showConnectionStatus(status) {
    // Create or update connection status indicator
    let statusElement = document.getElementById('connection-status')
    
    if (!statusElement) {
      statusElement = document.createElement('div')
      statusElement.id = 'connection-status'
      statusElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        z-index: 1000;
        transition: all 0.3s ease;
        pointer-events: none;
      `
      document.body.appendChild(statusElement)
    }
    
    if (status === 'online') {
      statusElement.textContent = '🟢 Online'
      statusElement.style.background = '#dcfce7'
      statusElement.style.color = '#166534'
      statusElement.style.border = '1px solid #bbf7d0'
      
      // Hide after 3 seconds
      setTimeout(() => {
        statusElement.style.opacity = '0'
        setTimeout(() => {
          if (statusElement.parentNode) {
            statusElement.parentNode.removeChild(statusElement)
          }
        }, 300)
      }, 3000)
    } else {
      statusElement.textContent = '🔴 Offline'
      statusElement.style.background = '#fef2f2'
      statusElement.style.color = '#dc2626'
      statusElement.style.border = '1px solid #fecaca'
      statusElement.style.opacity = '1'
    }
  }
  
  // Store data for offline use
  async storeOfflineData(storeName, data) {
    if (!this.db) return false
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      
      const dataWithTimestamp = {
        ...data,
        timestamp: Date.now(),
        synced: false
      }
      
      const request = store.add(dataWithTimestamp)
      
      request.onsuccess = () => {
        console.log(`[PWA] Data stored offline in ${storeName}`)
        resolve(request.result)
      }
      
      request.onerror = () => {
        console.error(`[PWA] Failed to store offline data in ${storeName}:`, request.error)
        reject(request.error)
      }
    })
  }
  
  // Get offline data
  async getOfflineData(storeName, limit = 50) {
    if (!this.db) return []
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.getAll()
      
      request.onsuccess = () => {
        const data = request.result
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, limit)
        resolve(data)
      }
      
      request.onerror = () => reject(request.error)
    })
  }
  
  // Cache API responses
  async cacheResponse(key, data, ttl = 3600000) { // 1 hour default TTL
    if (!this.db) return false
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['cache'], 'readwrite')
      const store = transaction.objectStore('cache')
      
      const cacheData = {
        key,
        data,
        timestamp: Date.now(),
        ttl
      }
      
      const request = store.put(cacheData)
      
      request.onsuccess = () => resolve(true)
      request.onerror = () => reject(request.error)
    })
  }
  
  // Get cached response
  async getCachedResponse(key) {
    if (!this.db) return null
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['cache'], 'readonly')
      const store = transaction.objectStore('cache')
      const request = store.get(key)
      
      request.onsuccess = () => {
        const result = request.result
        
        if (!result) {
          resolve(null)
          return
        }
        
        // Check if cache is expired
        const now = Date.now()
        if (now - result.timestamp > result.ttl) {
          // Cache expired, delete it
          this.deleteCachedResponse(key)
          resolve(null)
          return
        }
        
        resolve(result.data)
      }
      
      request.onerror = () => reject(request.error)
    })
  }
  
  // Delete cached response
  async deleteCachedResponse(key) {
    if (!this.db) return false
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['cache'], 'readwrite')
      const store = transaction.objectStore('cache')
      const request = store.delete(key)
      
      request.onsuccess = () => resolve(true)
      request.onerror = () => reject(request.error)
    })
  }
  
  // Sync offline data when connection is restored
  async syncOfflineData() {
    if (!this.isOnline || !this.db) return
    
    console.log('[PWA] Starting offline data sync...')
    
    try {
      // Sync messages
      await this.syncStore('messages', '/api/v1/messages')
      
      // Sync listings
      await this.syncStore('listings', '/api/v1/listings')
      
      // Sync orders
      await this.syncStore('orders', '/api/v1/orders')
      
      console.log('[PWA] Offline data sync completed')
    } catch (error) {
      console.error('[PWA] Sync failed:', error)
    }
  }
  
  // Sync a specific store
  async syncStore(storeName, endpoint) {
    const offlineData = await this.getOfflineData(storeName)
    const unsyncedData = offlineData.filter(item => !item.synced)
    
    for (const item of unsyncedData) {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:4000${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(item.data)
        })
        
        if (response.ok) {
          // Mark as synced
          await this.markAsSynced(storeName, item.id)
          console.log(`[PWA] Synced ${storeName} item:`, item.id)
        }
      } catch (error) {
        console.error(`[PWA] Failed to sync ${storeName} item:`, error)
      }
    }
  }
  
  // Mark item as synced
  async markAsSynced(storeName, id) {
    if (!this.db) return false
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const getRequest = store.get(id)
      
      getRequest.onsuccess = () => {
        const data = getRequest.result
        if (data) {
          data.synced = true
          const putRequest = store.put(data)
          
          putRequest.onsuccess = () => resolve(true)
          putRequest.onerror = () => reject(putRequest.error)
        } else {
          resolve(false)
        }
      }
      
      getRequest.onerror = () => reject(getRequest.error)
    })
  }
  
  // Register for background sync
  registerBackgroundSync() {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then((registration) => {
        // Register sync events
        registration.sync.register('background-sync-messages')
        registration.sync.register('background-sync-orders')
        registration.sync.register('background-sync-listings')
        
        console.log('[PWA] Background sync registered')
      }).catch((error) => {
        console.error('[PWA] Background sync registration failed:', error)
      })
    }
  }
  
  // Request persistent storage
  async requestPersistentStorage() {
    if ('storage' in navigator && 'persist' in navigator.storage) {
      const persistent = await navigator.storage.persist()
      console.log(`[PWA] Persistent storage: ${persistent}`)
      return persistent
    }
    return false
  }
  
  // Get storage usage
  async getStorageUsage() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      console.log('[PWA] Storage usage:', estimate)
      return estimate
    }
    return null
  }
  
  // Show install prompt
  showInstallPrompt() {
    // This will be handled by the install prompt in index.html
    const event = new CustomEvent('show-install-prompt')
    window.dispatchEvent(event)
  }
  
  // Check if app is installed
  isAppInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true
  }
  
  // Get connection info
  getConnectionInfo() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    
    if (connection) {
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      }
    }
    
    return null
  }
}

// Create global PWA manager instance
const pwaManager = new PWAManager()

// Export for use in components
export default pwaManager

// Utility functions for components
export const storeOfflineMessage = (messageData) => {
  return pwaManager.storeOfflineData('messages', { data: messageData })
}

export const storeOfflineListing = (listingData) => {
  return pwaManager.storeOfflineData('listings', { data: listingData })
}

export const storeOfflineOrder = (orderData) => {
  return pwaManager.storeOfflineData('orders', { data: orderData })
}

export const getCachedData = (key) => {
  return pwaManager.getCachedResponse(key)
}

export const setCachedData = (key, data, ttl) => {
  return pwaManager.cacheResponse(key, data, ttl)
}

export const isOnline = () => {
  return pwaManager.isOnline
}

export const getOfflineMessages = () => {
  return pwaManager.getOfflineData('messages')
}

export const getOfflineListings = () => {
  return pwaManager.getOfflineData('listings')
}

export const getOfflineOrders = () => {
  return pwaManager.getOfflineData('orders')
}
