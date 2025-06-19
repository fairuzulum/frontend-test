import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Ganti URL ini jika backend Anda berjalan di port atau alamat yang berbeda
const api = axios.create({ baseURL: 'http://127.0.0.1:8000/api' })

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }