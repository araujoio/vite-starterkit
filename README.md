# Vite Starterkit

![Vite](https://img.shields.io/badge/Vite-000000?style=for-the-badge&logo=vite&logoColor=646CFF)
![React](https://img.shields.io/badge/React-000000?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-000000?style=for-the-badge&logo=typescript&logoColor=3178C6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-000000?style=for-the-badge&logo=tailwindcss&logoColor=06B6D4)
![ESLint](https://img.shields.io/badge/ESLint-000000?style=for-the-badge&logo=eslint&logoColor=4B32C3)
![MIT License](https://img.shields.io/badge/license-MIT-000000?style=for-the-badge&logo=open-source-initiative&logoColor=22C55E)

# The problem with starting a React project today

When you run `npm create vite@latest`, you get a blank canvas — no routing, no SEO, no structure, no sitemap. Every project ends up spending the first days solving the exact same boilerplate problems before writing a single line of real code.

There's a second, bigger problem: **Vite's default output is a CSR (Client-Side Rendering) app.** That means the HTML shipped to browsers and crawlers is essentially empty. Google may eventually index it, but WhatsApp, LinkedIn, Facebook, and most social bots will never execute your JavaScript — they read the raw HTML and move on. Your `<title>` and `<meta>` tags simply don't exist for them.

This starterkit fixes both problems.

---

# Why this starterkit?

This is the right way to start any React application. It ships production-ready from the first `npm install`:

- **SSG (Static Site Generation)** — at build time, every route becomes a real, standalone HTML file. Crawlers and social bots read actual content — no JavaScript needed.
- **Per-page SEO** — every page ships with its own `<title>`, `<meta>`, Open Graph and Twitter Card tags, injected directly into the static HTML.
- **Automatic sitemap** — `sitemap.xml` is generated on every build, keeping search engines up to date without any manual work.
- **Built-in page CLI** — create and delete pages with a single command. Routes, SEO, sitemap and folder structure are all handled automatically.
- **CSS architecture** — global styles organized by responsibility (`variables`, `fonts`, `scrollbar`, `global`), with Tailwind for components and CSS Modules for complex cases.
- **Scalable folder structure** — `pages/`, `components/`, `hooks/`, `service/`, `types/`, `utils/` — defined, documented and ready to populate.

---

# Getting started

**1. Clone the repository**

```bash
git clone https://github.com/lucas-araujoeng/vite-starterkit.git
cd vite-starterkit
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```bash
VITE_APP_TITLE=My Site
VITE_APP_DESCRIPTION=My site description
VITE_SITE_URL=https://yourdomain.com
VITE_TWITTER_HANDLE=@yourhandle
VITE_THEME_COLOR_LIGHT=#ffffff
VITE_THEME_COLOR_DARK=#0f0f0f
```

**4. Start development server**

```bash
npm run dev
```

**5. Build for production**

```bash
npm run build
```

---

# Page CLI

This starterkit ships with a built-in CLI for managing pages. No manual route registration, no sitemap editing, no folder creation — one command does everything.

**Creating a page**

```bash
npm run create:page <PageName>
```

```bash
npm run create:page About
```

```
✔  src/pages/About/About.tsx created
✔  Route "/about" added to main.tsx
✔  Route "/about" added to sitemap in vite.config.ts
```

The generated page comes with a complete `<Head>` block — title, description, canonical URL, Open Graph and Twitter Card tags — all wired to your `.env` variables.

**Deleting a page**

```bash
npm run delete:page <PageName>
```

```bash
npm run delete:page About
```

```
✔  src/pages/About/ deleted
✔  Route "/about" removed from main.tsx
✔  Route "/about" removed from sitemap in vite.config.ts
```

The CLI accepts any casing — `about`, `ABOUT`, `about-page` and `AboutPage` are all valid and will be normalized automatically.

---

# Project structure

```
vite-starterkit/
├── public/
│   └── favicon.svg
├── scripts/
│   ├── create-page.mjs           # page generator CLI
│   └── delete-page.mjs           # page remover CLI
├── src/
│   ├── assets/
│   │   ├── css/
│   │   │   ├── index.css             # imports all global styles
│   │   │   └── global/
│   │   │       ├── variables.css     # CSS tokens (colors, spacing, fonts)
│   │   │       ├── fonts.css         # @font-face declarations
│   │   │       ├── global.css        # base styles
│   │   │       └── scrollbar.css     # scrollbar styling
│   │   ├── fonts/                    # .woff2 font files
│   │   ├── icons/                    # .svg icon files
│   │   ├── videos/                   # .mp4, .webm video files
│   │   └── imgs/                     # .png, .jpg, .jpeg, .webp images
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header/
│   │   │   │   └── Header.tsx
│   │   │   └── Footer/
│   │   │       └── Footer.tsx
│   │   └── ui/                       # Button, Card, Input, etc.
│   ├── hooks/                        # custom React hooks
│   ├── pages/
│   │   └── Home/
│   │       ├── Home.tsx
│   │       ├── Home.module.css
│   │       └── components/           # sections exclusive to this page
│   ├── service/                      # API calls and external services
│   ├── types/                        # global TypeScript interfaces
│   ├── utils/                        # pure helper functions
│   ├── App.tsx                       # root layout with Outlet
│   └── main.tsx                      # SSG entry point with routes
├── .env.example
├── .gitignore
├── index.html                        # Vite template with SEO fallback
├── robots.txt
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
└── vite.config.ts
```

---

# Styling approach

This starterkit uses **Tailwind CSS as the primary styling tool**, with **CSS Modules as an escape hatch** for cases Tailwind can't handle cleanly.

**Use Tailwind for:** layout, spacing, colors, typography, hover states, responsive design.

**Use CSS Modules for:** complex animations with `@keyframes`, gradient text effects, pseudo-elements (`::before`, `::after`).

```tsx
// Tailwind only — no .module.css needed
<button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
  Click me
</button>
```

```tsx
// Tailwind + CSS Module when animation is needed
import styles from './Hero.module.css'

<section className={`flex flex-col items-center py-24 ${styles.hero}`}>
  <h1 className={`text-5xl font-bold ${styles.title}`}>Hello world</h1>
</section>
```

---

# Code of Conduct

See the [CODE_OF_CONDUCT](./CODE_OF_CONDUCT).

# License

See the [LICENSE](./LICENSE).
