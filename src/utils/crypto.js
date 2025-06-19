
import CryptoJS from 'crypto-js'

function laravelEncrypt(data) {
  const rawKey = import.meta.env.VITE_APP_KEY
  if (!rawKey || !rawKey.startsWith('base64:')) {
    throw new Error('VITE_APP_KEY tidak valid atau tidak ditemukan di file .env frontend.')
  }
  const key = CryptoJS.enc.Base64.parse(rawKey.substring(7))

  const iv = CryptoJS.lib.WordArray.random(16)

  const encrypted = CryptoJS.AES.encrypt(data, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  })


  const mac = CryptoJS.HmacSHA256(
    CryptoJS.enc.Base64.stringify(iv) + encrypted.ciphertext.toString(CryptoJS.enc.Base64),
    key
  )

  const jsonPayload = JSON.stringify({
    iv: iv.toString(CryptoJS.enc.Base64),
    value: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
    mac: mac.toString(CryptoJS.enc.Hex),
  })

  const finalPayload = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(jsonPayload))

  return finalPayload
}


export function getEncryptedPayload(username, password) {
  try {
    const encryptedUsername = laravelEncrypt(username)
    const encryptedPassword = laravelEncrypt(password)
    
    return {
      user_name: encryptedUsername,
      password: encryptedPassword
    }
  } catch (error) {
    console.error('Enkripsi Gagal:', error)
    throw error
  }
}