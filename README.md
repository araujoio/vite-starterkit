# Vite Starterkit

![Vite](https://img.shields.io/badge/Vite-C4B5FD?style=for-the-badge&logo=vite&logoColor=1E1B4B)
![React](https://img.shields.io/badge/React-BAE6FD?style=for-the-badge&logo=react&logoColor=0C4A6E)
![TypeScript](https://img.shields.io/badge/TypeScript-BFDBFE?style=for-the-badge&logo=typescript&logoColor=1E3A8A)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CFFAFE?style=for-the-badge&logo=tailwindcss&logoColor=155E75)
![ESLint](https://img.shields.io/badge/ESLint-DDD6FE?style=for-the-badge&logo=eslint&logoColor=4C1D95)
![License](https://img.shields.io/badge/License-BBF7D0?style=for-the-badge&logo=open-source-initiative&logoColor=14532D)

## ⭐ Show Your Support
If this project helped you, please follow us and give it a ⭐️ on [GitHub](https://github.com/araujoio/vite-starterkit). Your support makes a difference!

## The problem with starting a React project today

When you run `npm create vite@latest`, you get a blank canvas — no routing, no SEO, no structure, no sitemap. Every project ends up spending the first days solving the exact same boilerplate problems before writing a single line of real code.

There's a second, bigger problem: **Vite's default output is a CSR (Client-Side Rendering) app.** That means the HTML shipped to browsers and crawlers is essentially empty. Google may eventually index it, but WhatsApp, LinkedIn, Facebook, and most social bots will never execute your JavaScript — they read the raw HTML and move on. Your `<title>` and `<meta>` tags simply don't exist for them.

This starterkit fixes both problems.

## Why this starterkit?

This is the right way to start any React application. It ships production-ready from the first `npm install`:

- ✅ **SSG (Static Site Generation)** — at build time, every route becomes a real, standalone HTML file. Crawlers and social bots read actual content — no JavaScript needed.
- ✅ **Per-page SEO** — every page ships with its own `<title>`, `<meta>`, Open Graph and Twitter Card tags, injected directly into the static HTML.
- ✅ **Automatic sitemap** — `sitemap.xml` is generated on every build, keeping search engines up to date without any manual work.
- ✅ **Built-in page CLI** — Create pages with a single command. The CLI automatically generates routes, registers them in React Router, injects pre-configured SEO tags, adds entries to the sitemap, and creates a standardized folder structure with error handling built-in.
- ✅ **CSS architecture** — global styles organized by responsibility (`variables`, `fonts`, `scrollbar`, `global`), with Tailwind for components and CSS Modules for complex cases.
- ✅ **Scalable folder structure** — `pages/`, `components/`, `hooks/`, `service/`, `types/`, `utils/` — defined, documented and ready to populate.

## Getting started

**1. Clone the repository**

```bash
git clone https://github.com/araujoio/vite-starterkit.git
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
# ─── App Info ───
APP_TITLE="vite-starterkit"
APP_DESCRIPTION="Your description here"
SITE_URL="https://yourdomain.com"
TWITTER_HANDLE="@yourhandle"

# ─── PWA & Mobile Theme ───
THEME_COLOR_LIGHT="#ffffff"
THEME_COLOR_DARK="#090a0b"

# ─── API ───
API_URL="https://api.yourdomain.com"
```

## Page CLI

Stop editing routes manually. This starterkit ships with a CLI that automates React Router integration — create and delete pages without touching route files, sitemaps, or folders.
One command. Everything wired.

**Creating a page**

```bash
npm run create:page <PageName>
```
**Example**

```bash
npm run create:page About
```

**Deleting a page**

```bash
npm run delete:page <PageName>
```
**Example**

```bash
npm run delete:page About
```

The CLI accepts any casing — `about`, `ABOUT`, `about-page` and `AboutPage` are all valid and will be normalized automatically.

## 📂 Project structure

```
vite-starterkit/
├── public/
│   └── favicon.svg
├── scripts/
│   ├── create-page.mjs           
│   └── delete-page.mjs           
├── src/
│   ├── assets/
│   │   ├── css/
│   │   │   ├── index.css             
│   │   │   └── global/
│   │   │       ├── variables.css     
│   │   │       ├── fonts.css         
│   │   │       └── scrollbar.css     
│   │   ├── fonts/                    
│   │   ├── icons/                    
│   │   ├── videos/                   
│   │   └── imgs/                     
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header/
│   │   │   │   └── Header.tsx
│   │   │   └── Footer/
│   │   │       └── Footer.tsx
│   │   └── ui/
│   │       └── ThemeToggle/
│   │           ├── ThemeToggle.tsx
│   │           └── ThemeToggle.module.css
│   ├── hooks/                        
│   ├── pages/
│   │   ├── Home/
│   │   │   └── Home.tsx
│   │   └── NotFound/
│   │       └── NotFound.tsx
│   ├── service/                      
│   ├── types/                        
│   ├── utils/                        
│   ├── App.tsx                       
│   └── main.tsx                      
├── .env.example
├── .gitignore
├── eslint.config.js
├── index.html                        
├── package.json
├── package-lock.json
├── robots.txt
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Styling approach

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
