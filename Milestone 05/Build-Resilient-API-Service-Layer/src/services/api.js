import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token')

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            throw new Error('Session expired.')
        }

        if (error.response?.status === 500) {
            throw new Error('Server error.')
        }

        if (!error.response) {
            throw new Error('Network error.')
        }

        throw error
    }
)

export const getProducts = async() => {
    const response = await api.get('/products')
    return response.data
}

export const getProduct = async (id) => {
  const response = await api.get(`/products/${id}`)
  return response.data
}

export const getProductsByCategory = async (category) => {
  const response = await api.get(`/products/category/${category}`)
  return response.data
}

export const getCategories = async () => {
  const response = await api.get('/products/categories')
  return response.data
}

export const addToCart = async (data) => {
  const response = await api.post('/carts', data)
  return response.data
}

export const getCart = async (userId) => {
  const response = await api.get(`/carts/user/${userId}`)
  return response.data
}

export const deleteCartItem = async (id) => {
  const response = await api.delete(`/carts/${id}`)
  return response.data
}

export const getUser = async (id) => {
  const response = await api.get(`/users/${id}`)
  return response.data
}

export const updateUser = async (id, data) => {
  const response = await api.put(`/users/${id}`, data)
  return response.data
}

export const submitReview = async (data) => {
  const response = await api.post('/users', data)
  return response.data
}

export default api;