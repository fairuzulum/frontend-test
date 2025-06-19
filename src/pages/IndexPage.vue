<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold">Manajemen Pasien</div>
      <div class="q-gutter-sm">
        <q-btn
          label="Tambah Pasien"
          color="primary"
          icon="person_add"
          @click="openRegisterDialog"
        />
        <q-btn
          label="Buat Kunjungan"
          color="secondary"
          icon="event_available"
          @click="openVisitDialog"
        />
      </div>
    </div>

    <q-table
      title="Daftar Pasien Terdaftar"
      :rows="patients"
      :columns="columns"
      row-key="id"
      :loading="pageLoading"
      class="shadow-1"
    >
      <template v-slot:body-cell-no="props">
        <q-td :props="props">
          {{ props.rowIndex + 1 }}
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="showRegisterDialog" persistent>
      <q-card style="width: 500px; max-width: 90vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Pendaftaran Pasien Baru</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="handleRegisterSubmit">
            <q-input v-model="registerForm.patient_name" label="Nama Pasien" :rules="[val => !!val || 'Wajib diisi']" dense class="q-mb-sm" />
            <q-input v-model="registerForm.nik" label="NIK" mask="################" :rules="[val => val && val.length === 16 || 'Harus 16 digit']" dense class="q-mb-sm" />
            <q-input v-model="registerForm.email" label="Email" type="email" :rules="[val => !!val || 'Wajib diisi']" dense class="q-mb-sm" />
            <q-input v-model="registerForm.address" label="Alamat" type="textarea" :rules="[val => !!val || 'Wajib diisi']" dense />
            <div class="q-mt-md text-right">
              <q-btn label="Batal" color="grey" v-close-popup />
              <q-btn label="Daftarkan" type="submit" color="primary" class="q-ml-sm" :loading="formLoading" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showVisitDialog" persistent>
      <q-card style="width: 500px; max-width: 90vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Buat Kunjungan Baru</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="handleCreateVisitSubmit">
            <q-input
              v-model="visitForm.noRekamMedik"
              label="Ketik Nomor Rekam Medik Pasien"
              :rules="[val => !!val || 'Wajib diisi']"
              @update:model-value="fetchPatientData"
              debounce="500"
              dense
              autofocus
            />

            <div v-if="visitForm.patientData" class="q-mt-md q-pa-md bg-grey-2 rounded-borders">
              <div class="text-subtitle1 text-weight-medium">Data Pasien Ditemukan</div>
              <div><strong>Nama:</strong> {{ visitForm.patientData.patient_name }}</div>
              <div><strong>NIK:</strong> {{ visitForm.patientData.nik }}</div>
              <div><strong>Alamat:</strong> {{ visitForm.patientData.address }}</div>
            </div>
            
            <div v-if="visitForm.patientNotFound" class="text-negative q-mt-md">
              Pasien dengan No. RM tersebut tidak ditemukan.
            </div>
            <div class="q-mt-md text-right">
              <q-btn label="Batal" color="grey" v-close-popup />
              <q-btn
                label="Catat Kunjungan"
                type="submit"
                color="secondary"
                class="q-ml-sm"
                :loading="formLoading"
                :disable="!visitForm.patientData"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const patients = ref([])
const pageLoading = ref(true)
const showRegisterDialog = ref(false)
const showVisitDialog = ref(false)
const formLoading = ref(false)
const registerForm = ref({
  patient_name: '',
  nik: '',
  email: '',
  address: ''
})
const visitForm = ref({
  noRekamMedik: '',
  patientData: null,
  patientNotFound: false,
})


const columns = [
  { name: 'no', label: 'No.', align: 'left' },
  { name: 'number_record_medik', label: 'No. Rekam Medik', align: 'left', field: 'number_record_medik', sortable: true },
  { name: 'patient_name', label: 'Nama Pasien', align: 'left', field: 'patient_name', sortable: true },
  { name: 'nik', label: 'NIK', align: 'left', field: 'nik', sortable: true },
  { name: 'address', label: 'Alamat', align: 'left', field: 'address' },
  { name: 'visits_count', label: 'Jml. Kunjungan', align: 'center', field: 'visits_count', sortable: true },
]

const fetchPatients = async () => {
  pageLoading.value = true
  try {
    const response = await api.get('/patients')
    patients.value = response.data.data
  } catch (error) {
    console.error('Gagal memuat data pasien:', error.response?.data || error)
    $q.notify({
      type: 'negative',
      message: 'Gagal memuat data pasien. Cek console untuk detail.',
    })
  } finally {
    pageLoading.value = false
  }
}

onMounted(() => {
  fetchPatients()
})

const resetRegisterForm = () => {
  registerForm.value = { patient_name: '', nik: '', email: '', address: '' }
}

const openRegisterDialog = () => {
  resetRegisterForm()
  showRegisterDialog.value = true
}

const handleRegisterSubmit = async () => {
  formLoading.value = true
  try {
    await api.post('/patients', registerForm.value)
    $q.notify({ type: 'positive', message: 'Pasien baru berhasil didaftarkan!' })
    showRegisterDialog.value = false
    fetchPatients()
  } catch (error) {
    console.error('Pendaftaran gagal:', error.response?.data || error)
    $q.notify({ type: 'negative', message: 'Pendaftaran gagal. Pastikan semua data valid.' })
  } finally {
    formLoading.value = false
  }
}

const resetVisitForm = () => {
  visitForm.value = { noRekamMedik: '', patientData: null, patientNotFound: false }
}

const openVisitDialog = (rmNumber) => {
  resetVisitForm()
  if (typeof rmNumber === 'string' && rmNumber) {
    visitForm.value.noRekamMedik = rmNumber
    fetchPatientData()
  }
  showVisitDialog.value = true
}

const fetchPatientData = async () => {
  if (!visitForm.value.noRekamMedik) {
    visitForm.value.patientData = null
    visitForm.value.patientNotFound = false
    return
  }
  try {
    const response = await api.get(`/patients/${visitForm.value.noRekamMedik}`)
    visitForm.value.patientData = response.data.data
    visitForm.value.patientNotFound = false
  } catch (error) {
    console.error('Gagal mencari data pasien:', error)
    visitForm.value.patientData = null
    visitForm.value.patientNotFound = true
  }
}

const handleCreateVisitSubmit = async () => {
  if (!visitForm.value.patientData) return
  formLoading.value = true
  try {
    await api.post('/visits', { number_record_medik: visitForm.value.noRekamMedik })
    $q.notify({ type: 'positive', message: 'Kunjungan baru berhasil dicatat!' })
    showVisitDialog.value = false
    fetchPatients()
  } catch (error) {
    console.error('Gagal membuat visit:', error.response?.data || error)
    $q.notify({ type: 'negative', message: 'Gagal mencatat kunjungan. Cek console.' })
  } finally {
    formLoading.value = false
  }
}
</script>