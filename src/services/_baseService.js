
import axios from 'axios'

const baseService = axios.create({
  timeout: 60000,
  baseURL: import.meta.env.VITE_PUBLIC_API_URL,
})


baseService.interceptors.response.use(
  (response) => response
)

export default baseService
