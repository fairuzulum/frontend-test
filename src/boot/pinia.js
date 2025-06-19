import { createPinia } from 'pinia'
import { boot } from 'quasar/wrappers'

// "boot" function (dijalankan sebelum aplikasi Vue di-mount)
export default boot(({ app }) => {
  // Buat instance Pinia
  const pinia = createPinia()

  // Beritahu aplikasi Vue untuk menggunakan Pinia
  // Ini adalah langkah krusial `app.use(pinia)` yang kita diskusikan
  app.use(pinia)
})