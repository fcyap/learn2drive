import Icons from 'unplugin-icons/vite';

export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', '@nuxtjs/supabase','@pinia/nuxt'],

  // Supabase Module Configuration
  supabase: {
    redirectOptions: {
      login: '/',
      callback: '/confirm',
      include: undefined,
      exclude: ['/*'],
      cookieRedirect: false,
    },

    // redirectOptions: {
    //   login: '/',
    //   callback: '/Instructor/homePage',
    //   include: undefined,
    //   exclude: [],
    //   cookieRedirect: false,
    // }
  },

  // shadcn-nuxt Module Configuration
  shadcn: {
    prefix: '',
    componentDir: './components/ui',
  },

  // Vite Configuration for Icons Plugin
  vite: {
    plugins: [
      Icons({
        autoInstall: true, // Automatically installs missing icons
        compiler: 'vue3', // Ensure Vue 3 compatibility
      }),
    ],
  },

  // Compatibility Settings
  compatibilityDate: '2024-10-10',

  build:{
    transpile:["@supabase/postgrest-js"]
  },

  // plugins: [
  //  { src: '~/plugins/pinia.js', mode: 'client' }
  // ]

});
