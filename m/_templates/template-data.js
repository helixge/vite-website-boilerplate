/**
 * Template Data Configuration
 * 
 * This file contains all data used in templates.
 * Organized by component/layout for easy maintenance.
 */

// Determine if we're building for production
const isProd = process.env.NODE_ENV === 'production' || process.env.BUILD_MODE === 'production';

export default {
  // ============================================================================
  // MASTER LAYOUT DATA
  // Used in: m/_templates/shared/layouts/master.hbs
  // ============================================================================
  layout: {
    siteName: 'My Website',
    year: new Date().getFullYear(),
    buildTime: new Date().toISOString(),
    // Asset paths - use relative paths for production, absolute for dev
    cssPath: isProd ? './m/css/site.min.css' : '/m/_scss/site.min.scss',
    preJsPath: isProd ? './m/js/pre.min.js' : '/m/js/entries/pre.js',
    postJsPath: isProd ? './m/js/post.min.js' : '/m/js/entries/post.js',
  },

  // ============================================================================
  // HEADER COMPONENT DATA  
  // Used in: m/_templates/shared/components/header.hbs
  // ============================================================================
  header: {
    // Add header-specific data here
    // Example: logo path, tagline, etc.
  },

  // ============================================================================
  // MENU COMPONENT DATA
  // Used in: m/_templates/shared/components/menu.hbs
  // ============================================================================
  menu: {
    menuItems: [
      { label: 'Home', url: '/', active: true },
      { label: 'About', url: '/about.html', active: false },
      { label: 'Test', url: '/test.html', active: false },
    ],
  },

  // ============================================================================
  // FOOTER COMPONENT DATA
  // Used in: m/_templates/shared/components/footer.hbs
  // ============================================================================
  footer: {
    author: 'Your Name',
    // Add footer-specific data here
    // Example: social links, copyright info, etc.
  },

  // ============================================================================
  // Add more components here as needed
  // ============================================================================
};


