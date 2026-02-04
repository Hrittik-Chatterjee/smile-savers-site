// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import robotsTxt from 'astro-robots-txt';
import { storyblok } from "@storyblok/astro";

// https://astro.build/config
export default defineConfig({
    site: 'https://smilesavers.dental',
    output: 'static',
    integrations: [
        sitemap(),
        partytown({ config: { forward: ['dataLayer.push'] } }),
        robotsTxt(),
        storyblok({
            accessToken: "audR8TSb4Z4r1Qw5qMebiQtt",
            apiOptions: {
                region: "eu",
            },
            components: {
                page: "storyblok/Page",
                feature: "storyblok/Feature",
            },
        }),
    ],
    prefetch: {
        prefetchAll: true,
        defaultStrategy: 'hover'
    },
    vite: {
        plugins: [/** @type {any} */ (tailwindcss())],
    },
});
