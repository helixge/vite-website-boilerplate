import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Static asset folders to copy (preserving m/ folder structure)
const staticFolders = ['f', 'i', 'u'];

// Ensure dist directory exists
const distDir = path.join(rootDir, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Dynamically find all HTML files in root directory
function findHtmlFiles() {
  const files = fs.readdirSync(rootDir);
  return files.filter(file => file.endsWith('.html'));
}

// Helper function to recursively copy directory
function copyDirectoryRecursive(src, dest, excludeDirs = []) {
  if (!fs.existsSync(src)) {
    return false;
  }
  
  // Create destination directory
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  // Read directory contents
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    // Skip excluded directories
    if (entry.isDirectory() && excludeDirs.includes(entry.name)) {
      continue;
    }
    
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectoryRecursive(srcPath, destPath, excludeDirs);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
  
  return true;
}

console.log('\n📄 Copying HTML files to dist...\n');

const htmlFiles = findHtmlFiles();

if (htmlFiles.length === 0) {
  console.warn('  ⚠️  No HTML files found in root directory');
} else {
  console.log(`  Found ${htmlFiles.length} HTML file(s)\n`);
}

htmlFiles.forEach(file => {
  const srcPath = path.join(rootDir, file);
  const destPath = path.join(distDir, file);
  
  if (fs.existsSync(srcPath)) {
    // Read the file
    let content = fs.readFileSync(srcPath, 'utf8');
    
    // Transform references from source to built files
    content = content
      .replace('/m/_scss/site.min.scss', '/m/css/site.min.css')
      .replace('/m/js/entries/pre.js', '/m/js/pre.min.js')
      .replace('/m/js/entries/post.js', '/m/js/post.min.js');
    
    // Write to dist
    fs.writeFileSync(destPath, content, 'utf8');
    console.log(`  ✓ Copied and transformed: ${file}`);
  } else {
    console.warn(`  ⚠ File not found: ${file}`);
  }
});

console.log('\n✅ HTML files copied to dist\n');

// Copy static asset folders
console.log('📁 Copying static asset folders to dist/m/...\n');

staticFolders.forEach(folder => {
  const srcPath = path.join(rootDir, 'm', folder);
  const destPath = path.join(distDir, 'm', folder);
  
  // For 'i' folder, exclude '_svg' subdirectory (SVGs are processed by Vite plugin)
  const excludeDirs = folder === 'i' ? ['_svg'] : [];
  
  if (copyDirectoryRecursive(srcPath, destPath, excludeDirs)) {
    const excludeNote = excludeDirs.length > 0 ? ` (excluding: ${excludeDirs.join(', ')})` : '';
    console.log(`  ✓ Copied: m/${folder}/ → dist/m/${folder}/${excludeNote}`);
  } else {
    console.warn(`  ⚠ Folder not found: m/${folder}/`);
  }
});

console.log('\n✅ Static assets copied to dist\n');

