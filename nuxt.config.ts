export default defineNuxtConfig({
    ssr: false,
    compatibilityDate: '2024-11-01',
    devtools: {enabled: true},
    css: [
        '~/assets/css/main.css'
    ],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    runtimeConfig: {
        public: {
            apiBase: `${process.env.PROTOCOL}://${process.env.BASE_URL}`,
        },
    },
    modules: [
        '@pinia/nuxt',
        'pinia-plugin-persistedstate/nuxt',
    ],
})
