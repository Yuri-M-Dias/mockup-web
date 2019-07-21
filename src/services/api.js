import axios from 'axios'
import { getToken } from './auth'

const api = axios.create({
  // params?!
  baseURL: 'http://127.0.0.1:3333',
  headers: {
    'content-type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

api.interceptors.request.use(async config => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
