import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/services/api'
import type { User, LoginDto } from '@/types'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const token = ref<string | null>(null)

    const isAuthenticated = computed(() => !!token.value)

    function initAuth() {
        const savedToken = localStorage.getItem('token')
        const savedUser = localStorage.getItem('user')

        if (savedToken && savedUser) {
            token.value = savedToken
            user.value = JSON.parse(savedUser)
        }
    }

    async function login(credentials: LoginDto) {
        const response = await authApi.login(credentials)
        token.value = response.data.access_token
        user.value = response.data.user

        localStorage.setItem('token', token.value)
        localStorage.setItem('user', JSON.stringify(user.value))
    }

    function logout() {
        token.value = null
        user.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    return {
        user,
        token,
        isAuthenticated,
        initAuth,
        login,
        logout
    }
})
