import { defineEnv } from 'astro/env';

export const env = defineEnv({
    schema: {
        PUBLIC_PRACTICE_PHONE: {
            type: 'string',
            default: '123-456-7890'
        },
        PUBLIC_PRACTICE_EMAIL: {
            type: 'string',
            default: 'care@smilesavers.dental'
        }
    }
});
