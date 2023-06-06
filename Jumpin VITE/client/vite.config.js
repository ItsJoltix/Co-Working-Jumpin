import { defineConfig } from 'vite'
import { resolve } from 'path'
import fs from 'fs-extra'

export default defineConfig({
    base: './',
    root: 'src',
    publicDir: '../public',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/index.html'),
                spelregels: resolve(__dirname, 'src/spelregels/index.html'),
                review: resolve(__dirname, 'src/review/index.html'),
                thankyou: resolve(__dirname, 'src/review/thankyou/index.html'),
                reviews: resolve(__dirname, 'src/review/reviews/index.html'),
            },
        },
    },
})
