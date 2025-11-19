import axios from 'axios'
import { store } from '../store/store'
import { logout } from '../store/authSlice'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL
})

// Public endpoints that don't require authentication
const PUBLIC_ENDPOINTS = [
  '/astrology/calculate-temp',
  '/astrology/zodiac-info',
  '/cards',
  '/moon/current'
]

// Request interceptor - add token to all requests except public ones
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState()
    const token = state.auth.token

    // Check if this is a public endpoint
    const isPublicEndpoint = PUBLIC_ENDPOINTS.some(endpoint =>
      config.url?.startsWith(endpoint)
    )

    // Only add token if it exists and this is not a public endpoint
    if (token && !isPublicEndpoint) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      const errorCode = error.response?.data?.error?.code

      // If token expired or invalid, logout automatically
      if (errorCode === 'TOKEN_EXPIRED' || errorCode === 'INVALID_TOKEN') {
        console.log('Token expired or invalid, logging out...')
        store.dispatch(logout())

        // Optionally redirect to login
        if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
