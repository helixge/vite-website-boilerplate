// Pre-loaded dependencies - loaded before the main app
// These dependencies are loaded first and available globally
//
// ADD NEW DEPENDENCIES HERE IF:
// - Required for critical page functionality
// - Needed by other pre-loaded scripts
// - Framework/foundation libraries (Vue, React, etc.)
// - Polyfills or essential utilities
//
// EXAMPLES: Vue, Axios, Lodash, Moment.js (if critical)

// Import SCSS (Vite will compile to CSS)
import '../../_scss/site.min.scss';

// Bootstrap 5 (no jQuery required)
import 'bootstrap';

// Swiper - expose globally
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
window.Swiper = Swiper;

// Axios - expose globally
import axios from 'axios';
window.axios = axios;

// Vue - expose globally
import * as Vue from 'vue';
window.Vue = Vue;

// SVG Icons - Virtual module from vite-plugin-svg-icons
import 'virtual:svg-icons-register';

// Custom pre-scripts
// Import all JS files from the pre directory
const preModules = import.meta.glob('../app/pre/**/*.js', { eager: true });

// Log loaded pre-scripts (optional, remove in production if not needed)
if (Object.keys(preModules).length > 0) {
  console.log(`[Vite] Loaded ${Object.keys(preModules).length} pre-script(s)`);
}

