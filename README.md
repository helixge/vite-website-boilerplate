# Modern Web Boilerplate

Modern static website boilerplate with Vite, Handlebars templating, and SCSS.

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Start development server with auto-rebuild
npm run dev:watch
```

Opens at http://localhost:3000 with:
- ✨ Hot Module Replacement for JS
- 🔄 Auto-rebuild HTML from templates  
- 🎨 Auto-compile SCSS

## 🎯 Commands

| Command | Description |
|---------|-------------|
| `npm run dev:watch` | Dev server + template watch ⭐ recommended for development |
| `npm run dev` | Dev server only |
| `npm run html` | Build HTML from templates |
| `npm run build` | Alias for `build:prod` (default production build) |
| `npm run build:dev` | 🐛 **Development build** - Unminified, keeps debugger/console |
| `npm run build:prod` | 🚀 **Production build** - Minified, removes debugger/console |
| `npm run preview` | Preview built files locally with web server |
| `npm run verify` | Verify build output |

### Build Modes Explained

**Development Build** (`npm run build:dev`):
- ❌ No minification
- ✅ Keeps `debugger` statements
- ✅ Keeps `console.log()` statements  
- 📦 Larger file sizes (~2-3x production)
- 🐛 Good for debugging built code
- ⚠️ **Not for deployment**

**Production Build** (`npm run build:prod` or `npm run build`):
- ✅ Full minification with Terser
- ❌ Removes `debugger` statements
- ❌ Removes `console.log()` statements
- 📦 Optimized file sizes
- 🚀 **Ready for deployment**

**Preview Server** (`npm run preview`):
- Use after building to test the dist folder
- Serves files with proper paths (unlike opening `file://` directly)
- Works with both dev and prod builds

## 📁 Project Structure

```
project/
├── vite.config.js              # Vite configuration
├── package.json
├── build-tools/                # Build scripts
│   ├── build-html.js          # Template builder
│   ├── watch-html.js          # Template watcher
│   └── verify-vite-build.js   # Build verification
│
├── m/
│   ├── _templates/            # Source templates ✏️
│   │   ├── index.hbs         # Homepage template
│   │   ├── about.hbs         # About page template
│   │   ├── template-data.js  # ⭐ Data for all templates
│   │   └── shared/
│   │       ├── layouts/
│   │       │   └── master.hbs  # Master layout
│   │       └── components/
│   │           ├── header.hbs
│   │           ├── footer.hbs
│   │           └── menu.hbs
│   │
│   ├── _scss/                 # SCSS source
│   │   └── site.min.scss
│   │
│   ├── js/
│   │   ├── entries/           # Vite entry points
│   │   │   ├── pre.js        # Pre-bundle
│   │   │   └── post.js       # Post-bundle
│   │   └── app/              # Your JS code
│   │       ├── pre/
│   │       ├── post/
│   │       ├── services/
│   │       └── vue/
│   │
│   ├── css/                   # Compiled CSS 📦
│   └── i/_svg/               # SVG files for sprites
│
├── index.html                 # Generated 📦
└── about.html                 # Generated 📦
```

## 🎨 Template System

Uses **Handlebars** with master layout inheritance (like Nunjucks extends).

### Master Layout

**`m/_templates/shared/layouts/master.hbs`** - HTML skeleton for all pages:

```handlebars
<!DOCTYPE html>
<html lang="{{lang}}">
<head>
    <title>{{pageTitle}} - {{siteName}}</title>
    <link rel="stylesheet" href="/m/_scss/site.min.scss" />
    <script type="module" src="/m/js/entries/pre.js"></script>
</head>
<body class="{{pageCssClass}}">
    {{> header}}
    {{> menu}}
    <main>{{{body}}}</main>
    {{> footer}}
    <script type="module" src="/m/js/entries/post.js"></script>
</body>
</html>
```

### Page Templates

**`m/_templates/index.hbs`** - Just content + front-matter:

```handlebars
---
pageTitle: Homepage
pageCssClass: homepage
lang: en
---

<h1>Welcome to {{siteName}}!</h1>
<p>Your page content here</p>
```

**Automatically uses master.hbs layout!**

### Adding New Pages

1. Create `m/_templates/yourpage.hbs`
2. Add front-matter + content
3. Run `npm run html` (or auto-builds with `npm run dev:watch`)
4. Access at `/yourpage.html`

## 🚀 Features

✅ **Vite build system** - Lightning-fast HMR  
✅ **Template inheritance** - Master layouts & partials  
✅ **SCSS preprocessing** - Built-in Vite support  
✅ **Multiple JS bundles** - pre.min.js & post.min.js  
✅ **SVG sprites** - Automatic generation  
✅ **Legacy browser support** - Polyfills included  
✅ **Source maps** - For debugging  
✅ **Auto-rebuild** - Templates regenerate on save  
✅ **Git-friendly** - Generated files ignored  

## 📦 What's Included

**JavaScript Libraries:**
- Bootstrap 5.3.8
- Vue 3.5.25
- Axios
- Swiper 12.0.3

**Build Tools:**
- Vite 5.4.11
- Handlebars 4.7.8
- SASS 1.94.2

## 🎯 Output

### JS Bundles (No Code Splitting)
- `m/js/pre.min.js` - Bootstrap, Swiper, Vue, Axios + pre-scripts
- `m/js/post.min.js` - Services, Vue app + post-scripts

### HTML Files
- `index.html` - Generated from `m/_templates/index.hbs`
- `about.html` - Generated from `m/_templates/about.hbs`

### CSS
- `m/css/site.min.css` - Compiled SCSS

### Static Assets
- `m/f/` - Fonts (copied to dist)
- `m/i/` - Images & favicons (copied to dist, excluding `_svg`)
- `m/i/_svg/` - SVG source files (compiled to sprite, injected into HTML)
- `m/u/` - User uploads (copied to dist)

## 📦 Adding Third-Party Libraries

### Decision Tree: pre.js vs post.js

**Add to `m/js/entries/pre.js` if:**
- ❗ Required for critical page functionality
- ❗ Needed by other pre-loaded scripts
- ❗ Framework/foundation (Vue, React, etc.)
- ❗ Polyfills or essential utilities

**Add to `m/js/entries/post.js` if:**
- ✅ UI enhancement libraries (carousels, sliders, modals)
- ✅ Not needed for initial page render
- ✅ Can wait until DOM is ready
- ✅ Interactive features

### Example: Adding a New Library

**1. Install the package:**
```bash
npm install chart.js
```

**2. Import in the appropriate entry file:**

If it's a UI library (like Chart.js), add to **`m/js/entries/post.js`**:
```javascript
// Chart.js - for data visualization
import Chart from 'chart.js/auto';
window.Chart = Chart;
```

If it's critical (like a utility library), add to **`m/js/entries/pre.js`**:
```javascript
// Lodash - utility library
import _ from 'lodash';
window._ = _;
```

**3. Rebuild:**
```bash
npm run build
```

### Current Libraries

**pre.js** (Critical dependencies):
- Bootstrap, Swiper, Vue, Axios, SVG sprite system

**post.js** (Enhancement libraries):
- None currently (ready for additions)

## 💡 Template Data

Edit **`m/_templates/template-data.js`** to customize data for your templates.

Data is **organized by component** - each section corresponds to where it's used:

```javascript
export default {
  // Master layout data (master.hbs)
  layout: {
    siteName: 'My Website',
    year: new Date().getFullYear(),
  },
  
  // Menu component data (menu.hbs)
  menu: {
    menuItems: [
      { label: 'Home', url: '/' },
      { label: 'About', url: '/about.html' },
    ],
  },
  
  // Footer component data (footer.hbs)
  footer: {
    author: 'Your Name',
  },
};
```

**Data lives WITH your templates, not in build scripts!** 📍

### Adding npm Packages

```bash
npm install package-name
```

Import in `m/js/entries/pre.js` or `post.js`:

```javascript
import Package from 'package-name';
window.Package = Package; // Expose globally if needed
```

### SVG Sprites

1. Add `.svg` files to `m/i/_svg/`
2. Use in HTML:

```html
<svg><use xlink:href="#icon-filename"></use></svg>
```

## 🌐 Browser Support

Targets: `> 0.25%, not dead`

- Chrome, Firefox, Safari, Edge (last 2 versions)
- Modern mobile browsers

## 🐛 Troubleshooting

### Build fails
```bash
rm -rf node_modules
npm install
```

### Templates not building
```bash
npm run html
```

### Verify build
```bash
npm run verify
```

### Dev server not starting
Kill existing processes and restart:
```bash
npm run dev
```

## 📄 License

See [LICENSE](./LICENSE) file for details.
