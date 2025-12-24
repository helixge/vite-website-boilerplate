# Vite Website Boilerplate

A minimal, production-ready static website boilerplate with Vite, Handlebars templating, SCSS, and Vue 3 support.

## ✨ Features

- ⚡ **Vite** - Lightning-fast HMR and optimized builds
- 📝 **Handlebars** - Template inheritance with layouts and partials
- 🎨 **SCSS** - Modular architecture with Bootstrap 5
- 🖼️ **Vue 3** - Ready for interactive components
- 📦 **Smart Bundling** - Pre/post load splitting
- 🔄 **Auto-rebuild** - Templates regenerate on save
- 🌐 **Production Ready** - Relative paths work anywhere
- 🎯 **Dynamic Build** - Auto-copies all HTML files

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development with auto-rebuild (recommended)
npm run dev:watch

# Or just development server
npm run dev
```

Opens at `http://localhost:3000` with hot module replacement.

## 📋 Commands

| Command | Description |
|---------|-------------|
| `npm run dev:watch` | 🔥 Dev server + template watch (recommended) |
| `npm run dev` | Dev server only |
| `npm run html` | Build HTML from templates |
| `npm run html:prod` | Build HTML with production paths |
| `npm run build` | Production build (relative paths) |
| `npm run build:dev` | Development build (absolute paths) |
| `npm run preview` | Preview production build |

### Build Modes

**Production Build** (`npm run build`):
- ✅ Relative paths (`./m/css/...`) - works anywhere
- ✅ Minified with Terser
- ✅ Console logs removed
- 🚀 Ready for deployment

**Development Build** (`npm run build:dev`):
- ⚠️ Absolute paths (`/m/css/...`) - needs server
- ⚠️ Unminified
- ⚠️ Console logs kept
- 🐛 For debugging only

## 📁 Project Structure

```
vite-website-boilerplate/
├── build-tools/              # Build scripts
│   ├── build-html.js        # Handlebars compiler
│   ├── watch-html.js        # Template watcher
│   └── copy-to-dist.js      # Asset copier (auto-finds HTML)
│
├── m/
│   ├── _templates/          # Handlebars templates
│   │   ├── index.hbs       # Example homepage
│   │   ├── template-data.js # ⭐ Template data config
│   │   └── shared/
│   │       ├── layouts/
│   │       │   └── master.hbs    # Master layout
│   │       └── components/
│   │           ├── header.hbs
│   │           ├── footer.hbs
│   │           └── menu.hbs
│   │
│   ├── _scss/              # SCSS source
│   │   ├── abstracts/
│   │   ├── base/
│   │   ├── components/
│   │   ├── layout/
│   │   ├── pages/
│   │   └── site.min.scss
│   │
│   ├── js/
│   │   ├── entries/        # Vite entry points
│   │   │   ├── pre.js     # Pre-load bundle
│   │   │   └── post.js    # Post-load bundle
│   │   └── app/           # Your application code
│   │       ├── pre/
│   │       ├── post/
│   │       └── vue/
│   │           ├── app.js
│   │           ├── components/
│   │           ├── directives/
│   │           ├── filters/
│   │           └── services/
│   │
│   ├── f/                  # Fonts (.gitkeep)
│   ├── i/_svg/            # SVG icons (.gitkeep)
│   └── u/                 # Static uploads (.gitkeep)
│
├── dist/                   # Build output (ignored)
├── index.html              # Generated (ignored)
├── package.json
├── vite.config.js
└── .gitignore
```

## 🎨 Template System

### Master Layout

`m/_templates/shared/layouts/master.hbs`:

```handlebars
<!DOCTYPE html>
<html lang="{{lang}}">
<head>
    <title>{{pageTitle}} - {{siteName}}</title>
    <link rel="stylesheet" href="{{cssPath}}" />
    <script type="module" src="{{preJsPath}}"></script>
</head>
<body class="{{pageCssClass}}">
    {{> header}}
    
    <main class="main">
        {{{body}}}
    </main>

    {{> footer}}
    
    <script type="module" src="{{postJsPath}}"></script>
</body>
</html>
```

### Creating Pages

**1. Create template:** `m/_templates/about.hbs`

```handlebars
---
pageTitle: About Us
pageCssClass: about-page
lang: en
---

<section class="hero">
    <h1>About {{siteName}}</h1>
    <p>Your content here</p>
</section>
```

**2. Build:**

```bash
npm run html:prod  # or npm run build
```

**3. Done!** → `about.html` is automatically created and copied to `dist/`

### Template Data

Edit `m/_templates/template-data.js`:

```javascript
export default {
  layout: {
    siteName: 'My Website',
    year: new Date().getFullYear(),
    buildTime: new Date().toISOString(),
    // Paths auto-switch between dev and production
    cssPath: isProd ? './m/css/site.min.css' : '/m/_scss/site.min.scss',
    preJsPath: isProd ? './m/js/pre.min.js' : '/m/js/entries/pre.js',
    postJsPath: isProd ? './m/js/post.min.js' : '/m/js/entries/post.js',
  },
  
  menu: {
    menuItems: [
      { label: 'Home', url: '/', active: true },
    ],
  },
  
  footer: {
    author: 'Your Name',
  },
};
```

## 📦 Adding Libraries

### Install Package

```bash
npm install package-name
```

### Import in Entry Files

**For critical dependencies** → `m/js/entries/pre.js`:
```javascript
import Package from 'package-name';
window.Package = Package;
```

**For UI enhancements** → `m/js/entries/post.js`:
```javascript
import Package from 'package-name';
window.Package = Package;
```

### Current Libraries

**Included:**
- Bootstrap 5.3.8
- Vue 3.5.25
- Axios
- Swiper 12.0.3

**Build Tools:**
- Vite 5.4.11
- Handlebars 4.7.8
- Sass 1.94.2

## 🎯 Output

### Production Build (`dist/`)

```
dist/
├── index.html              # Your pages (auto-copied)
├── m/
│   ├── css/
│   │   └── site.min.css   # Compiled SCSS
│   ├── js/
│   │   ├── pre.min.js     # Bootstrap, Vue, Swiper, Axios
│   │   └── post.min.js    # Post-load scripts
│   ├── f/                  # Fonts (copied)
│   ├── i/                  # Images (copied, excluding _svg)
│   └── u/                  # Uploads (copied)
```

**Note:** `copy-to-dist.js` automatically finds and copies ALL `.html` files from root - no manual configuration needed!

## 🖼️ Using SVG Sprites

**1. Add SVG files to** `m/i/_svg/`

```
m/i/_svg/
├── symbol-heart.svg
└── symbol-arrow.svg
```

**2. Use in templates:**

```html
<svg class="icon">
    <use xlink:href="#icon-symbol-heart"></use>
</svg>
```

The `vite-plugin-svg-icons` automatically generates sprites and injects them into your HTML.

## 🌐 Deployment

Your production build uses **relative paths**, so it works in any directory:

```bash
npm run build
```

Upload the entire `dist/` folder to:
- ✅ Domain root: `example.com/`
- ✅ Subdirectory: `example.com/mysite/`
- ✅ Test servers
- ✅ GitHub Pages

**No configuration needed!**

## 🔧 Customization

### Using Menu Partial

The menu partial exists but isn't included by default. To use it:

**Edit** `m/_templates/shared/layouts/master.hbs`:

```handlebars
<body class="{{pageCssClass}}">
    {{> header}}
    {{> menu}}  <!-- Add this line -->
    
    <main class="main">
        {{{body}}}
    </main>
    ...
```

### SCSS Structure

```
m/_scss/
├── abstracts/          # Variables, mixins, functions
├── base/              # Base styles, typography, fonts
├── components/        # Buttons, dropdowns, etc.
├── layout/           # Header, footer, forms
└── pages/            # Page-specific styles
```

### Vue Integration

The Vue structure is ready but empty:

```
m/js/app/vue/
├── app.js            # Main Vue app
├── components/       # Vue components
├── directives/       # Custom directives
├── filters/          # Filters/composables
└── services/         # API services
```

## 🐛 Troubleshooting

### Templates not updating

```bash
npm run html:prod
```

### Build fails

```bash
rm -rf node_modules dist
npm install
npm run build
```

### Paths not working

- Development: Uses absolute paths (`/m/...`)
- Production: Uses relative paths (`./m/...`)
- Always use `npm run build` for deployment builds

## 📄 License

MIT License - See [LICENSE](./LICENSE) file for details.

---

**Built with ❤️ using Vite + Handlebars + SCSS**
