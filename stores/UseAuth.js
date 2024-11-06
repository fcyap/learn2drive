// stores/useAuth.js
// import { defineStore } from 'pinia'
import { ref, computed } from 'vue'



export const useAuthStore = defineStore('auth', () => {
  const userId = ref(null)

  const setUserId = (id) => {
    userId.value = id
  }

  const clearUserId = () => {
    userId.value = null
  }

  const isAuthenticated = computed(() => userId.value !== null)

  return {
    userId,
    setUserId,
    clearUserId,
    isAuthenticated
  }
}
// , {
// persist: {
//   enabled: process.client,
//   strategies: [
//     {
//       storage: process.client ? localStorage:null,
//       paths: ['userid'], // Only persist the userid
//     },
//   ],
// }}
)