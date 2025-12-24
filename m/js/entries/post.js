// Post-loaded scripts - loaded after pre.js
// Contains services, Vue components, directives, filters, and app initialization
//
// ADD NEW DEPENDENCIES HERE IF:
// - UI enhancement libraries (carousels, sliders, modals)
// - Not needed for initial page render
// - Can wait until DOM is ready
// - Interactive/progressive enhancement features
//
// EXAMPLES: Chart.js, AOS (animations), Lightbox, etc.

// Import all services (in alphabetical order)
const serviceModules = import.meta.glob('../app/vue/services/**/*.js', { eager: true });

// Import all Vue directives (in alphabetical order)
const directiveModules = import.meta.glob('../app/vue/directives/**/*.js', { eager: true });

// Import all Vue components (in alphabetical order)
const componentModules = import.meta.glob('../app/vue/components/**/*.js', { eager: true });

// Import all Vue filters (in alphabetical order)
const filterModules = import.meta.glob('../app/vue/filters/**/*.js', { eager: true });

// Import Vue app initialization
import '../app/vue/app.js';

// Import all post-scripts (in alphabetical order)
const postModules = import.meta.glob('../app/post/**/*.js', { eager: true });

// Log loaded modules (optional, for debugging - remove in production if not needed)
const totalModules = 
  Object.keys(serviceModules).length +
  Object.keys(directiveModules).length +
  Object.keys(componentModules).length +
  Object.keys(filterModules).length +
  Object.keys(postModules).length;

if (totalModules > 0) {
  console.log('[Vite] Post-bundle loaded:', {
    services: Object.keys(serviceModules).length,
    directives: Object.keys(directiveModules).length,
    components: Object.keys(componentModules).length,
    filters: Object.keys(filterModules).length,
    scripts: Object.keys(postModules).length,
  });
}

