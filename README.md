### Cara Menjalankan

1.  **Clone Repositori**

    ```bash
    git clone https://github.com/fairuzulum/frontend-test.git
    cd frontend-test
    ```

2.  **Install Dependencies**
    Gunakan `npm` untuk menginstall semua package yang dibutuhkan.

    ```bash
    npm install
    ```

3.  **Konfigurasi Environment (.env)**
    Ini adalah langkah paling penting.

    a. Buka file `.env` yang baru dibuat. Cari variabel `VITE_APP_KEY` dan **samakan nilainya** dengan `APP_KEY` yang ada di file `.env` proyek Laravel (backend) Anda.

    Contoh isi file `.env`:

    ```env
    # NILAI INI HARUS SAMA PERSIS DENGAN APP_KEY DI BACKEND LARAVEL ANDA
    VITE_APP_KEY=base64:A0uBuw4bIIvzFwcaZ7q7o2d3DPLxIZA1oAYABcgLM0M=
    ```

4.  **Jalankan Development Server**
    Setelah semua siap, jalankan server pengembangan Quasar.

    ```bash
    quasar dev
    ```

5.  **Install quasar**
    Jika "quasar dev" tidak bisa dijalankan, install @quasar/cli terlebih dahulu
    ```bash
    npm i -g @quasar/cli
    ```

---
