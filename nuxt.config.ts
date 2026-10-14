import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  build: {
    transpile: ['notivue']
  },
  devtools: { enabled: true },
  css: [
    '~/assets/css/main.css',
    'notivue/notification.css',
    'notivue/animations.css'
  ],
  app:{
    pageTransition: {name: "page", mode: "out-in"},
    head:{
      title: "Nuxt COFFEE - Menu and Orders",
      meta: [
        {charset:'utf-8'},
        {name:'viewport', content:'width=device-width, initial-scale=1'},
      ],
      link:[
        {rel:'icon', type:'image/x-icon', href:''},
        { rel: 'preconnect', href: 'https://fonts.googleapis.com'},
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: ''},
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Cabin:wght@400;600;700&display'}
      ],
      script:[
        { src: 'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4', tagPosition: 'head'}
      ]
    }
  },
  modules: [
    'notivue/nuxt'
  ],
  // Opciones del módulo en Nuxt 4+
  notivue: {
    position: 'top-right',
    limit: 4,
    enqueue: true,
    avoidDuplicates: true,
    notifications: {
      global: {
        duration: 4000
      }
    }
  }
})
