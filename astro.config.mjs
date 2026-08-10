import { defineConfig } from 'astro/config';

// GitHub Pages project site: https://github.com/iGEMOkinawa2026/igem-okinawa.git
export default defineConfig({
  site: 'https://iGEMOkinawa2026.github.io',
  base: process.env.ASTRO_BASE ?? '/igem-okinawa/',
  redirects: {
    '/human-practice': '/activities/human-practice',
    '/ja/human-practice': '/ja/activities/human-practice'
  }
});
