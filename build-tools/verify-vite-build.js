#!/usr/bin/env node

/**
 * Verification script to check if Vite build produces the expected output files
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
};

function log(message, color = '') {
  console.log(color + message + COLORS.reset);
}

function checkFile(filePath, required = true) {
  const fullPath = path.join(rootDir, filePath);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    const stats = fs.statSync(fullPath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    log(`  ✓ ${filePath} (${sizeKB} KB)`, COLORS.green);
    return true;
  } else {
    if (required) {
      log(`  ✗ ${filePath} (missing)`, COLORS.red);
    } else {
      log(`  - ${filePath} (optional, not found)`, COLORS.yellow);
    }
    return false;
  }
}

function checkFileContains(filePath, searchString, description) {
  const fullPath = path.join(rootDir, filePath);
  
  if (!fs.existsSync(fullPath)) {
    log(`  ✗ Cannot check "${description}" - file missing`, COLORS.red);
    return false;
  }
  
  const content = fs.readFileSync(fullPath, 'utf8');
  const contains = content.includes(searchString);
  
  if (contains) {
    log(`  ✓ ${description}`, COLORS.green);
  } else {
    log(`  ✗ ${description} (not found)`, COLORS.red);
  }
  
  return contains;
}

log('\n' + '='.repeat(60), COLORS.bold);
log('Vite Build Verification', COLORS.bold + COLORS.blue);
log('='.repeat(60) + '\n', COLORS.bold);

// Check configuration files
log('1. Configuration Files:', COLORS.bold + COLORS.blue);
let configCheck = true;
configCheck &= checkFile('vite.config.js');
configCheck &= checkFile('m/js/entries/pre.js');
configCheck &= checkFile('m/js/entries/post.js');
configCheck &= checkFile('package.json');
console.log();

// Check output files
log('2. Output Files (after build):', COLORS.bold + COLORS.blue);
let outputCheck = true;
outputCheck &= checkFile('m/js/pre.min.js');
outputCheck &= checkFile('m/js/pre.min.js.map');
outputCheck &= checkFile('m/js/post.min.js');
outputCheck &= checkFile('m/js/post.min.js.map');
console.log();

// Check if dependencies are installed
log('3. Dependencies Check:', COLORS.bold + COLORS.blue);
let depsCheck = true;
depsCheck &= checkFile('node_modules/vite/package.json');
depsCheck &= checkFile('node_modules/handlebars/package.json');
depsCheck &= checkFile('node_modules/sass/package.json');
console.log();

// Check bundle contents (if built)
if (fs.existsSync(path.join(rootDir, 'm/js/pre.min.js'))) {
  log('4. Bundle Content Verification:', COLORS.bold + COLORS.blue);
  
  // Check pre.min.js for key dependencies
  checkFileContains('m/js/pre.min.js', 'jquery', 'jQuery included in pre.min.js');
  checkFileContains('m/js/pre.min.js', 'bootstrap', 'Bootstrap included in pre.min.js');
  
  // Check for no code splitting (no separate chunk files)
  const jsDir = path.join(rootDir, 'm/js');
  const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js') && !f.endsWith('.map'));
  
  // We should only have pre.min.js and post.min.js (and possibly app files)
  const unexpectedFiles = jsFiles.filter(f => 
    !f.startsWith('pre.min') && 
    !f.startsWith('post.min') && 
    !f.startsWith('app')
  );
  
  if (unexpectedFiles.length === 0) {
    log('  ✓ No code splitting detected (only pre.min.js and post.min.js)', COLORS.green);
  } else {
    log(`  ✗ Unexpected JS files found (code splitting may be enabled): ${unexpectedFiles.join(', ')}`, COLORS.red);
  }
  
  console.log();
}

// Summary
log('='.repeat(60), COLORS.bold);
log('Summary:', COLORS.bold + COLORS.blue);
log('='.repeat(60), COLORS.bold);

if (configCheck && outputCheck && depsCheck) {
  log('\n✓ All checks passed! Vite setup working.\n', COLORS.green + COLORS.bold);
  log('Next steps:', COLORS.blue);
  log('  1. Test in browser: npm run dev');
  log('  2. Build for production: npm run build:prod');
  log('  3. Verify functionality in your application\n');
  process.exit(0);
} else {
  log('\n✗ Some checks failed. Please review the errors above.\n', COLORS.red + COLORS.bold);
  
  if (!configCheck) {
    log('Configuration files are missing. Make sure you have:', COLORS.yellow);
    log('  - vite.config.js');
    log('  - m/js/entries/pre.js');
    log('  - m/js/entries/post.js\n');
  }
  
  if (!depsCheck) {
    log('Dependencies are not installed. Run:', COLORS.yellow);
    log('  npm install\n');
  }
  
  if (!outputCheck) {
    log('Output files are missing. Build the project:', COLORS.yellow);
    log('  npm run build\n');
  }
  
  process.exit(1);
}

