import { defineConfig } from 'vite';
import { resolve } from 'path';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    root: '.',
    publicDir: false, // Static assets (m/f, m/i, m/u) handled by build script
    
    plugins: [
      // SVG sprite generation
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'm/i/_svg')],
        symbolId: 'icon-[name]',
        inject: 'body-last',
        customDomId: '__svg__icons__dom__',
      }),
    ],
    
    // SCSS support (built-in to Vite)
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: [resolve(__dirname, 'node_modules')],
        },
      },
    },
    
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: true,
      minify: isProd ? 'terser' : false,
      
      rollupOptions: {
        input: {
          pre: resolve(__dirname, 'm/js/entries/pre.js'),
          post: resolve(__dirname, 'm/js/entries/post.js'),
        },
        
        output: {
          // Place assets in their respective folders  
          entryFileNames: (chunkInfo) => {
            // Check both the facadeModuleId and the module graph to find the actual entry file
            if (chunkInfo.facadeModuleId) {
              const modulePath = chunkInfo.facadeModuleId.replace(/\\/g, '/');
              if (modulePath.includes('/entries/pre.js')) {
                return 'm/js/pre.min.js';
              }
              if (modulePath.includes('/entries/post.js')) {
                return 'm/js/post.min.js';
              }
            }
            // Check the modules in the chunk to find entry files
            if (chunkInfo.moduleIds) {
              const hasPreEntry = chunkInfo.moduleIds.some(id => id.includes('/entries/pre.js') || id.includes('\\entries\\pre.js'));
              const hasPostEntry = chunkInfo.moduleIds.some(id => id.includes('/entries/post.js') || id.includes('\\entries\\post.js'));
              if (hasPreEntry) return 'm/js/pre.min.js';
              if (hasPostEntry) return 'm/js/post.min.js';
            }
            // Fallback to default naming
            return 'm/js/[name].min.js';
          },
          chunkFileNames: 'm/js/[name].min.js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name.endsWith('.css')) {
              return 'm/css/site.min[extname]';
            }
            return 'm/assets/[name][extname]';
          },
          
          // Prevent vendor chunking and inline helpers
          manualChunks: (id) => {
            // Don't create separate chunks for anything
            return undefined;
          },
          hoistTransitiveImports: false, // Inline helpers into each entry
        },
        
        // Prevent vendor chunking
        preserveEntrySignatures: 'strict',
      },
      
      terserOptions: {
        compress: {
          drop_console: isProd,
        },
      },
      
      chunkSizeWarningLimit: 1000,
      cssCodeSplit: false,
    },
    
    resolve: {
      alias: {
        '@': resolve(__dirname, 'm/js/app'),
        '@scss': resolve(__dirname, 'm/_scss'),
      },
    },
    
    // Development server
    server: {
      port: 3000,
      open: true,
      watch: {
        // Watch for changes in these files
        include: ['**/*.html', 'm/_scss/**/*.scss', 'm/js/**/*.js'],
      },
    },
  };
});

