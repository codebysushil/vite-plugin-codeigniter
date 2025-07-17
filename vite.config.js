import { defineConfig } from 'vite';
import vitePugglin from './vite-pugglin.js';

export default defineConfig({
    build: {
        manifest: true,
        outDir: 'public/build',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                app: 'resources/js/app.js',
                style: 'resources/css/style.css'
            }
        }
    },
    plugins: [
        vitePugglin({
            hotFile: '.vite/hot',
            outputFile: 'public/vite.php',
            publicPath: '/build/'
        })
    ]
});
