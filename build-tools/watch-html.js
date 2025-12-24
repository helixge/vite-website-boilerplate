import { watch } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

const templatesDir = resolve(rootDir, 'm/_templates');

console.log('👀 Watching templates for changes...\n');

let buildTimeout;

function rebuild() {
  clearTimeout(buildTimeout);
  buildTimeout = setTimeout(() => {
    console.log('🔄 Rebuilding HTML...');
    
    const build = spawn('node', ['build-tools/build-html.js'], {
      stdio: 'inherit',
      shell: true
    });
    
    build.on('close', (code) => {
      if (code === 0) {
        console.log('✅ HTML rebuilt\n');
      }
    });
  }, 100);
}

// Watch templates directory recursively
watch(templatesDir, { recursive: true }, (eventType, filename) => {
  if (filename && (filename.endsWith('.hbs') || filename.endsWith('.html') || filename.endsWith('.js'))) {
    console.log(`📝 Changed: ${filename}`);
    rebuild();
  }
});

// Build once on start
rebuild();

console.log('Press Ctrl+C to stop\n');


