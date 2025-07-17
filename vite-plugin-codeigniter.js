// vite-pugglin.js

import fs from 'fs';
import path from 'path';

export default function vitePugglin(options = {}) {
    const {
        hotFile = '.vite/hot',
        outputFile = 'public/vite.php',
        publicPath = '/build/',
    } = options;

    return {
        name: 'vite-pugglin',

        configureServer(server) {
            const hotFilePath = path.resolve(hotFile);

            fs.mkdirSync(path.dirname(hotFilePath), { recursive: true });
            fs.writeFileSync(hotFilePath, '');  // Create empty .vite/hot

            server.httpServer.once('close', () => {
                if (fs.existsSync(hotFilePath)) {
                    fs.unlinkSync(hotFilePath);  // Remove .vite/hot on server stop
                }
            });

            console.log(`vite-pugglin: Dev mode detected. Created ${hotFile}`);
        },

        closeBundle() {
            const hotFilePath = path.resolve(hotFile);

            if (fs.existsSync(hotFilePath)) {
                fs.unlinkSync(hotFilePath);  // Ensure hot file is removed in production
            }

            const manifestPath = path.resolve('public/build/manifest.json');
            if (!fs.existsSync(manifestPath)) {
                console.warn('vite-pugglin: No manifest found.');
                return;
            }

            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
            const assets = [];

            for (const file in manifest) {
                const entry = manifest[file];
                if (entry.file) {
                    assets.push(publicPath + entry.file);
                }
                if (entry.css) {
                    entry.css.forEach(cssFile => {
                        assets.push(publicPath + cssFile);
                    });
                }
            }

            const phpArray = "<?php\nreturn " + varExport(assets) + ";\n";
            fs.writeFileSync(outputFile, phpArray);

            console.log(`vite-pugglin: Production assets written to ${outputFile}`);
        }
    };
}

function varExport(arr) {
    return JSON.stringify(arr, null, 4)
        .replace(/"/g, "'")
        .replace(//g, "[")
        .replace(//g, "]");
}
