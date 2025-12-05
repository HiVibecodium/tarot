import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

// Safe localStorage access (handles private browsing mode)
const safeGetItem = (key) => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, value)
  } catch {
    // localStorage not available (private browsing)
  }
}

const safeRemoveItem = (key) => {
  try {
    localStorage.removeItem(key)
  } catch {
    // localStorage not available
  }
}

// Load token from localStorage
const token = safeGetItem('token')
const storedUser = safeGetItem('user')
const user = storedUser ? JSON.parse(storedUser) : null

const initialState = {
  user: user,
  token: token,
  isAuthenticated: !!token,
  loading: false,
  error: null,
}

// Async actions
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData)
      const { user, token, refreshToken } = response.data.data

      // Store in localStorage
      safeSetItem('token', token)
      safeSetItem('refreshToken', refreshToken)
      safeSetItem('user', JSON.stringify(user))

      return { user, token, refreshToken }
    } catch (error) {
      console.error('Registration error:', error)
      console.error('Response:', error.response)

      // Return detailed error
      if (error.response?.data?.error) {
        return rejectWithValue(error.response.data.error)
      } else if (error.request) {
        return rejectWithValue({
          code: 'NETWORK_ERROR',
          message: 'Не удалось подключиться к серверу',
          details: 'Проверьте что backend запущен на http://localhost:4000'
        })
      } else {
        return rejectWithValue({
          code: 'UNKNOWN_ERROR',
          message: 'Неизвестная ошибка',
          details: error.message
        })
      }
    }
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials)
      const { user, token, refreshToken } = response.data.data

      // Store in localStorage
      safeSetItem('token', token)
      safeSetItem('refreshToken', refreshToken)
      safeSetItem('user', JSON.stringify(user))

      return { user, token, refreshToken }
    } catch (error) {
      console.error('Login error:', error)
      console.error('Response:', error.response)

      // Return detailed error
      if (error.response?.data?.error) {
        return rejectWithValue(error.response.data.error)
      } else if (error.request) {
        return rejectWithValue({
          code: 'NETWORK_ERROR',
          message: 'Не удалось подключиться к серверу',
          details: 'Проверьте что backend запущен на http://localhost:4000'
        })
      } else {
        return rejectWithValue({
          code: 'UNKNOWN_ERROR',
          message: 'Неизвестная ошибка',
          details: error.message
        })
      }
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Clear localStorage
      safeRemoveItem('token')
      safeRemoveItem('refreshToken')
      safeRemoveItem('user')

      return {}
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(register.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false
      state.isAuthenticated = true
      state.user = action.payload.user
      state.token = action.payload.token
    })
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false
      state.isAuthenticated = true
      state.user = action.payload.user
      state.token = action.payload.token
    })
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
    })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
