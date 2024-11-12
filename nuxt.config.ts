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

  shadcn: {
    prefix: '',
    componentDir: './components/ui',
  },

  vite: {
    plugins: [
      Icons({
        autoInstall: true,
        compiler: 'vue3',
      }),
    ],
  },

  compatibilityDate: '2024-10-10',

  css:['~/assets/css/tailwind.css'],

  build:{
    transpile:["@supabase/postgrest-js"]
  },

  // plugins: [
  //  { src: '~/plugins/pinia.js', mode: 'client' }
  // ]

});
