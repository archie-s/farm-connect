import pwaManager from '../pwa';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthToken() {
    return localStorage.getItem('accessToken');
  }

  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }
    return headers;
  }

  // Helper to determine which offline store to use
  getStoreName(endpoint) {
    if (endpoint.includes('/listings')) return 'listings';
    if (endpoint.includes('/orders')) return 'orders';
    if (endpoint.includes('/messages')) return 'messages';
    return null;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.includeAuth !== false),
      ...options,
    };

    // 1. OFFLINE INTERCEPTION
    if (!navigator.onLine) {
      console.log('🔌 Device is offline. Intercepting request:', endpoint);

      // Only intercept "write" operations (POST, PUT, PATCH, DELETE)
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(config.method)) {
        const storeName = this.getStoreName(endpoint);

        if (storeName) {
          try {
            // Save the request payload to IndexedDB
            const offlineData = JSON.parse(config.body || '{}');
            // Ensure pwaManager is available
            if (pwaManager) {
                await pwaManager.storeOfflineData(storeName, {
                ...offlineData,
                _offlineParams: { endpoint, method: config.method }
                });

                // Return a "Fake" Success Response
                return {
                success: true,
                data: offlineData,
                message: 'Saved offline. Will sync when online.',
                isOffline: true 
                };
            }
          } catch (error) {
            console.error('Failed to save offline:', error);
            // Don't throw, just let it fail naturally if PWA fails
          }
        }
      }
      throw new Error('You are offline. Please check your connection.');
    }

    // 2. ONLINE REQUEST
    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // --- Auth methods ---
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      includeAuth: false,
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      includeAuth: false,
    });
  }

  // --- User methods ---
  async getProfile() {
    return this.request('/users/profile');
  }

  async updateProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // --- Listing methods ---
  async getListings(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/listings?${queryString}` : '/listings';
    return this.request(endpoint, { includeAuth: false });
  }

  async createListing(listingData) {
    return this.request('/listings', {
      method: 'POST',
      body: JSON.stringify(listingData),
    });
  }

  // --- Order methods ---
  async getOrders(params = {}) {
    return this.request('/orders');
  }

  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  // --- Message methods ---
  async getMessages() {
    return this.request('/messages');
  }

  async sendMessage(messageData) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }
}

export default new ApiService();