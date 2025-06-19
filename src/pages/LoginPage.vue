<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <q-card class="q-pa-md shadow-2" style="width: 400px">
          <q-card-section class="text-center">
            <div class="text-grey-9 text-h5 text-weight-bold">Selamat Datang</div>
            <div class="text-grey-8">Silakan login untuk melanjutkan</div>
          </q-card-section>
          <q-card-section>
            <q-form @submit.prevent="handleLogin">
              <q-input
                v-model="email"
                label="Email"
                type="email"
                lazy-rules
                :rules="[(val) => !!val || 'Email tidak boleh kosong']"
              />
              <q-input
                v-model="password"
                label="Password"
                type="password"
                lazy-rules
                :rules="[(val) => !!val || 'Password tidak boleh kosong']"
              />
              <q-btn
                class="full-width q-mt-md"
                label="Login"
                type="submit"
                color="primary"
                :loading="loading"
              />
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth'
import { getEncryptedPayload } from 'src/utils/crypto'

const email = ref('')
const password = ref('')
const loading = ref(false)
const authStore = useAuthStore()
const $q = useQuasar()

const handleLogin = async () => {
  loading.value = true
  try {
    const encryptedPayload = await getEncryptedPayload(email.value, password.value)
    await authStore.login(encryptedPayload)
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Proses login gagal. Cek console untuk detail.',
    })
    console.error('Login process failed:', error)
  } finally {
    loading.value = false
  }
}
</script>
