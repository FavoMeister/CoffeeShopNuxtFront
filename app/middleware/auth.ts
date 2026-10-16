import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'

export default defineNuxtRouteMiddleware(() => {
    if (import.meta.server) return
    try {
        const token = localStorage.getItem('token')
        const token_type = localStorage.getItem('token_type')
        const user = localStorage.getItem('user')
        if (!user || !token || !token_type) {
            return navigateTo('/auth')
        }
    } catch (error) {
        return navigateTo('/')
    }
})
