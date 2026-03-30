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
  log.dim('Usage: npm run delete:page <PageName>')
  log.dim('Example: npm run delete:page About')
  process.exit(1)
}

const pageName = rawName
  .split(/[-_\s]+/)
  .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
  .join('')

const routePath = pageName
  .replace(/([A-Z])/g, (m, l, i) => (i === 0 ? l : '-' + l))
  .toLowerCase()

// Guard: never allow deleting Home
if (pageName === 'Home') {
  log.error('The Home page cannot be deleted.')
  process.exit(1)
}

const PAGE_DIR    = path.join(ROOT, 'src', 'pages', pageName)
const MAIN_FILE   = path.join(ROOT, 'src', 'main.tsx')
const CONFIG_FILE = path.join(ROOT, 'vite.config.ts')

log.title(`Deleting page "${pageName}"...`)
log.dim(`ROOT        : ${ROOT}`)
log.dim(`PAGE_DIR    : ${PAGE_DIR}`)
log.dim(`MAIN_FILE   : ${MAIN_FILE}`)
log.dim(`CONFIG_FILE : ${CONFIG_FILE}`)
console.log('')

// ── check if page exists ───────────────────────────────────────────────────

if (!fs.existsSync(PAGE_DIR)) {
  log.error(`Page "${pageName}" not found at src/pages/${pageName}/`)
  process.exit(1)
}

// ── step 1: delete page folder ─────────────────────────────────────────────

fs.rmSync(PAGE_DIR, { recursive: true, force: true })
log.success(`src/pages/${pageName}/ deleted`)

// ── step 2: remove route from main.tsx ────────────────────────────────────

if (!fs.existsSync(MAIN_FILE)) {
  log.warn('main.tsx not found — skipping route removal.')
} else {
  const raw    = fs.readFileSync(MAIN_FILE, 'utf8')
  const isCRLF = raw.includes('\r\n')
  const main   = raw.replace(/\r\n/g, '\n')

  if (!main.includes(`path: '${routePath}'`)) {
    log.warn(`Route "/${routePath}" not found in main.tsx — skipping.`)
  } else {
    // Remove the entire route block — from opening { to closing },
    // Matches:
    //   \n      {
    //     path: 'about',
    //     lazy: () => ...,
    //   },
    const routeBlockPattern = new RegExp(
      `\\n[ \\t]*\\{[^}]*path:\\s*'${routePath}'[\\s\\S]*?\\},`,
      'g'
    )

    let updated = main.replace(routeBlockPattern, '')

    if (isCRLF) updated = updated.replace(/\n/g, '\r\n')

    if (updated === raw) {
      log.warn('Could not remove route from main.tsx — remove manually.')
    } else {
      fs.writeFileSync(MAIN_FILE, updated, 'utf8')
      log.success(`Route "/${routePath}" removed from main.tsx`)
    }
  }
}

// ── step 3: remove route from vite.config.ts ──────────────────────────────

if (!fs.existsSync(CONFIG_FILE)) {
  log.warn('vite.config.ts not found — skipping sitemap update.')
} else {
  const raw    = fs.readFileSync(CONFIG_FILE, 'utf8')
  const isCRLF = raw.includes('\r\n')
  const config = raw.replace(/\r\n/g, '\n')

  if (!config.includes(`'/${routePath}'`)) {
    log.warn(`Route "/${routePath}" not found in sitemap — skipping.`)
  } else {
    // Remove the line containing '/<routePath>',  (with optional trailing comma)
    const sitemapLinePattern = new RegExp(
      `[ \\t]*'\\/${routePath}',?\\n`,
      'g'
    )

    let updated = config.replace(sitemapLinePattern, '')

    if (isCRLF) updated = updated.replace(/\n/g, '\r\n')

    if (updated === raw) {
      log.warn('Could not remove route from sitemap — remove manually.')
    } else {
      fs.writeFileSync(CONFIG_FILE, updated, 'utf8')
      log.success(`Route "/${routePath}" removed from sitemap in vite.config.ts`)
    }
  }
}

// ── done ───────────────────────────────────────────────────────────────────

console.log('')
log.info(`Page   → src/pages/${pageName}/ deleted`)
log.info(`Route  → /${routePath} removed`)
log.info(`Sitemap→ /${routePath} removed`)
console.log('')
