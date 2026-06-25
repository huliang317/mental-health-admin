import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(sessionStorage.getItem('token') || '')
  const username = ref(sessionStorage.getItem('username') || '')

  const isLoggedIn = computed(() => !!token.value)

  function setAuth(newToken: string, newUsername: string) {
    token.value = newToken
    username.value = newUsername
    sessionStorage.setItem('token', newToken)
    sessionStorage.setItem('username', newUsername)
  }

  function clearAuth() {
    token.value = ''
    username.value = ''
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('username')
  }

  return { token, username, isLoggedIn, setAuth, clearAuth }
})
