// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import robotsTxt from 'astro-robots-txt';
import { storyblok } from '@storyblok/astro';
import { loadEnv } from 'vite';

const env = loadEnv('', process.cwd(), 'STORYBLOK');

// https://astro.build/config
export default defineConfig({
    site: 'https://smilesavers.dental',
    output: 'static',
    integrations: [
        storyblok({
            accessToken: env.STORYBLOK_TOKEN,
            components: {
                page: 'storyblok/Page',
            },
            apiOptions: {
                region: 'eu',
            },
        }),
        sitemap(),
        partytown({ config: { forward: ['dataLayer.push'] } }),
        robotsTxt(),
    ],
    prefetch: {
        prefetchAll: true,
        defaultStrategy: 'hover'
    },
    vite: {
        plugins: [/** @type {any} */ (tailwindcss())],
    },
});
