import Handlebars from 'handlebars';
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname, basename, resolve } from 'path';
import { fileURLToPath } from 'url';
import templateData from '../m/_templates/template-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

// Configuration
const templatesDir = resolve(rootDir, 'm/_templates');
const componentsDir = resolve(rootDir, 'm/_templates/shared/components');
const layoutsDir = resolve(rootDir, 'm/_templates/shared/layouts');
const outputDir = rootDir;

// ============================================================================
// TEMPLATE DATA
// ============================================================================
// Data is imported from: m/_templates/template-data.js
// It's organized by component/layout:
//   - layout.*   → Used in master.hbs
//   - header.*   → Used in header.hbs
//   - footer.*   → Used in footer.hbs
//   - menu.*     → Used in menu.hbs
//
// Edit template-data.js to modify component data.
// ============================================================================

// Flatten all data for Handlebars (it needs a single object)
const globalData = {
  ...templateData.layout,
  ...templateData.header,
  ...templateData.footer,
  ...templateData.menu,
};

// Register partials
function registerPartials(dir) {
  if (!existsSync(dir)) return;
  
  const files = readdirSync(dir);
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      registerPartials(filePath);
    } else if (file.endsWith('.hbs')) {
      const name = basename(file, '.hbs');
      const content = readFileSync(filePath, 'utf8');
      Handlebars.registerPartial(name, content);
      console.log(`  Registered partial: ${name}`);
    }
  });
}

// Register helpers
Handlebars.registerHelper('uppercase', (str) => str.toUpperCase());
Handlebars.registerHelper('lowercase', (str) => str.toLowerCase());
Handlebars.registerHelper('year', () => new Date().getFullYear());

// Find all .hbs files in templates directory (not in subdirectories)
function findTemplates(dir) {
  const files = readdirSync(dir);
  return files
    .filter(file => file.endsWith('.hbs') && statSync(join(dir, file)).isFile())
    .map(file => join(dir, file));
}

// Parse front matter from template
function parseFrontMatter(content) {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);
  
  if (match) {
    const frontMatter = {};
    const lines = match[1].split('\n');
    lines.forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        frontMatter[key.trim()] = valueParts.join(':').trim();
      }
    });
    return {
      data: frontMatter,
      content: match[2]
    };
  }
  
  return {
    data: {},
    content: content
  };
}

// Build HTML from template with layout support
function buildTemplate(templatePath) {
  const filename = basename(templatePath, '.hbs');
  const outputPath = join(outputDir, `${filename}.html`);
  
  console.log(`  Building: ${filename}.hbs → ${filename}.html`);
  
  try {
    const templateContent = readFileSync(templatePath, 'utf8');
    const { data: pageMeta, content: pageContent } = parseFrontMatter(templateContent);
    
    // Use layout if specified, otherwise use 'master' by default
    const layoutName = pageMeta.layout || 'master';
    const layoutPath = join(layoutsDir, `${layoutName}.hbs`);
    
    let finalHtml;
    
    if (existsSync(layoutPath)) {
      // Compile page content first
      const pageTemplate = Handlebars.compile(pageContent);
      const compiledPageContent = pageTemplate({ ...globalData, ...pageMeta });
      
      // Then inject into layout
      const layoutContent = readFileSync(layoutPath, 'utf8');
      const layoutTemplate = Handlebars.compile(layoutContent);
      finalHtml = layoutTemplate({
        ...globalData,
        ...pageMeta,
        body: compiledPageContent,
        pageTitle: pageMeta.pageTitle || pageMeta.title || 'Page',
        pageCssClass: pageMeta.pageCssClass || filename
      });
    } else {
      // No layout, compile page directly
      const template = Handlebars.compile(pageContent);
      finalHtml = template({ ...globalData, ...pageMeta });
    }
    
    writeFileSync(outputPath, finalHtml, 'utf8');
    console.log(`  ✓ Generated: ${filename}.html (using ${layoutName} layout)`);
  } catch (error) {
    console.error(`  ✗ Error building ${filename}:`, error.message);
  }
}

// Main build function
console.log('\n🔨 Building HTML from Handlebars templates...\n');

// 1. Register all partials
console.log('📦 Registering partials:');
registerPartials(componentsDir);

// 2. Build all templates
console.log('\n🏗️  Building templates:');
const templates = findTemplates(templatesDir);

if (templates.length === 0) {
  console.log('  ⚠️  No .hbs templates found in', templatesDir);
} else {
  templates.forEach(buildTemplate);
  console.log(`\n✅ Built ${templates.length} template(s)\n`);
}

