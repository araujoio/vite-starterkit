#!/usr/bin/env node

import fs   from 'fs'
import path from 'path'

const ROOT = process.cwd()

const RESET  = '\x1b[0m'
const GREEN  = '\x1b[32m'
const BLUE   = '\x1b[34m'
const YELLOW = '\x1b[33m'
const RED    = '\x1b[31m'
const DIM    = '\x1b[2m'
const BOLD   = '\x1b[1m'

const log = {
  success : (msg) => console.log(`${GREEN}✔${RESET}  ${msg}`),
  info    : (msg) => console.log(`${BLUE}→${RESET}  ${msg}`),
  warn    : (msg) => console.log(`${YELLOW}⚠${RESET}  ${msg}`),
  error   : (msg) => console.log(`${RED}✖${RESET}  ${msg}`),
  dim     : (msg) => console.log(`${DIM}   ${msg}${RESET}`),
  title   : (msg) => console.log(`\n${BOLD}${msg}${RESET}\n`),
}

// ── validate input ─────────────────────────────────────────────────────────

const rawName = process.argv[2]

if (!rawName) {
  log.error('Page name is required.')
  log.dim('Usage: npm run create:page <PageName>')
  log.dim('Example: npm run create:page About')
  process.exit(1)
}

// PascalCase — "about" → "About", "my-page" → "MyPage"
const pageName = rawName
  .split(/[-_\s]+/)
  .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
  .join('')

// kebab-case route — "AboutUs" → "about-us"
const routePath = pageName
  .replace(/([A-Z])/g, (m, l, i) => (i === 0 ? l : '-' + l))
  .toLowerCase()

const PAGE_DIR    = path.join(ROOT, 'src', 'pages', pageName)
const PAGE_FILE   = path.join(PAGE_DIR, `${pageName}.tsx`)
const MAIN_FILE   = path.join(ROOT, 'src', 'main.tsx')
const CONFIG_FILE = path.join(ROOT, 'vite.config.ts')

log.title(`Creating page "${pageName}"...`)
log.dim(`ROOT        : ${ROOT}`)
log.dim(`PAGE_FILE   : ${PAGE_FILE}`)
log.dim(`MAIN_FILE   : ${MAIN_FILE}`)
log.dim(`CONFIG_FILE : ${CONFIG_FILE}`)
console.log('')

// ── check if page already exists ──────────────────────────────────────────

if (fs.existsSync(PAGE_DIR)) {
  log.error(`Page "${pageName}" already exists at src/pages/${pageName}/`)
  process.exit(1)
}

// ── page template ──────────────────────────────────────────────────────────

const PAGE_TEMPLATE = `import { Head } from 'vite-react-ssg'

export default function ${pageName}() {
  return (
    <>
      <Head>
        <title>${pageName} | My Site</title>
        <meta name="description" content="${pageName} page description." />
        <link rel="canonical" href={\`\${import.meta.env.VITE_SITE_URL}/${routePath}\`} />
        <meta property="og:title" content="${pageName} | My Site" />
        <meta property="og:description" content="${pageName} page description." />
        <meta property="og:url" content={\`\${import.meta.env.VITE_SITE_URL}/${routePath}\`} />
      </Head>

      <main>
        <h1>${pageName}</h1>
      </main>
    </>
  )
}
`

// ── step 1: create page file ───────────────────────────────────────────────

fs.mkdirSync(PAGE_DIR, { recursive: true })
fs.writeFileSync(PAGE_FILE, PAGE_TEMPLATE, 'utf8')
log.success(`src/pages/${pageName}/${pageName}.tsx created`)

// ── step 2: update main.tsx ────────────────────────────────────────────────

if (!fs.existsSync(MAIN_FILE)) {
  log.warn(`main.tsx not found — skipping route registration.`)
} else {
  // Normalise to LF so regex works on Windows (CRLF) and Linux/Mac (LF)
  const raw  = fs.readFileSync(MAIN_FILE, 'utf8')
  const isCRLF = raw.includes('\r\n')
  const main = raw.replace(/\r\n/g, '\n')

  const newRoute = [
    `      {`,
    `        path: '${routePath}',`,
    `        lazy: () => import('./pages/${pageName}/${pageName}').then(m => ({ element: <m.default /> })),`,
    `      },`,
  ].join('\n')

  if (main.includes(`path: '${routePath}'`)) {
    log.warn(`Route "/${routePath}" already exists in main.tsx — skipping.`)
  } else {
    // Matches the last closing brace of a child route right before ], 
    // Works regardless of trailing comma presence
    const lastChildPattern = /([ \t]*\},?)([ \t]*\n[ \t]*\],)/

    if (!lastChildPattern.test(main)) {
      log.warn('Could not find children array in main.tsx — add the route manually:')
      log.dim(`{ path: '${routePath}', lazy: () => import('./pages/${pageName}/${pageName}').then(m => ({ element: <m.default /> })) }`)
    } else {
      let updated = main.replace(lastChildPattern, (_, lastChild, closing) => {
        const fixed = lastChild.trimEnd().replace(/,?$/, ',')
        return `${fixed}\n${newRoute}${closing}`
      })

      // Restore original line endings if file was CRLF
      if (isCRLF) updated = updated.replace(/\n/g, '\r\n')

      if (updated === raw) {
        log.warn('Replacement produced no change — check main.tsx manually.')
      } else {
        fs.writeFileSync(MAIN_FILE, updated, 'utf8')
        log.success(`Route "/${routePath}" added to main.tsx`)
      }
    }
  }
}

// ── step 3: update vite.config.ts ─────────────────────────────────────────

if (!fs.existsSync(CONFIG_FILE)) {
  log.warn(`vite.config.ts not found — skipping sitemap update.`)
} else {
  const raw    = fs.readFileSync(CONFIG_FILE, 'utf8')
  const isCRLF = raw.includes('\r\n')
  const config = raw.replace(/\r\n/g, '\n')

  const dynamicRoutesPattern = /(dynamicRoutes\s*:\s*\[)([\s\S]*?)(\])/

  if (config.includes(`'/${routePath}'`)) {
    log.warn(`Route "/${routePath}" already exists in sitemap — skipping.`)
  } else if (!dynamicRoutesPattern.test(config)) {
    log.warn('Could not find dynamicRoutes in vite.config.ts — add manually:')
    log.dim(`'/${routePath}',`)
  } else {
    let updated = config.replace(dynamicRoutesPattern, (_, open, routes, close) => {
      const trimmed = routes.trimEnd()
      const comma   = trimmed.endsWith(',') ? '' : ','
      return `${open}${trimmed}${comma}\n        '/${routePath}',\n      ${close}`
    })

    if (isCRLF) updated = updated.replace(/\n/g, '\r\n')

    if (updated === raw) {
      log.warn('Sitemap replacement produced no change — check vite.config.ts manually.')
    } else {
      fs.writeFileSync(CONFIG_FILE, updated, 'utf8')
      log.success(`Route "/${routePath}" added to sitemap in vite.config.ts`)
    }
  }
}

// ── done ───────────────────────────────────────────────────────────────────

console.log('')
log.info(`Page   → src/pages/${pageName}/${pageName}.tsx`)
log.info(`Route  → /${routePath}`)
log.info(`Sitemap→ /${routePath}`)
console.log('')
log.dim('Remember to update <title> and <meta> description in the page file.')
console.log('')
