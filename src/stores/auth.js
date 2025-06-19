
import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { Router } from 'src/router' 

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(null)

  if (token.value) {
    api.defaults.headers.common['Authorization'] = 'Bearer ' + token.value
  }

  async function login(encryptedPayload) {
    const $q = useQuasar() 
    try {
      const response = await api.post('/login', encryptedPayload)
      const newToken = response.data.access_token

      localStorage.setItem('token', newToken)
      api.defaults.headers.common['Authorization'] = 'Bearer ' + newToken
      token.value = newToken

      Router.push('/')

    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Login Gagal! Cek kembali kredensial Anda.'
      })
      console.error('Login error:', error.response?.data || error.message)
    }
  }

    
  async function logout() {
    const $q = useQuasar()
    
    try {
    
      await api.post('/logout')

      $q.notify({
        type: 'positive',
        message: 'Anda berhasil logout.'
      })

    } catch (error) {
      console.error('API logout request failed, proceeding with client-side logout.', error.response?.data || error)
      $q.notify({
        type: 'warning',
        message: 'Gagal menghubungi server, sesi Anda akan dihapus secara lokal.'
      })
    } finally {
     
      localStorage.removeItem('token')
      
      token.value = null
      user.value = null
      
      delete api.defaults.headers.common['Authorization']
      
      Router.push('/login') 
    }
  }


  return { token, user, login, logout }
})