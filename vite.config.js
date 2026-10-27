import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const root = dirname(fileURLToPath(import.meta.url))

function applyPartials(html) {
  return html.replace(/<!--\s*partial:([a-z0-9-]+)\s*-->/g, (_, name) => {
    return readFileSync(resolve(root, 'src/partials', `${name}.html`), 'utf8')
  })
}

function htmlPartials() {
  return {
    name: 'html-partials',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return applyPartials(html)
      },
    },
  }
}

function pageExists(url) {
  const pathname = decodeURIComponent((url || '/').split('?')[0])
  if (pathname === '/' || pathname === '') return existsSync(resolve(root, 'index.html'))
  const clean = pathname.replace(/^\/+/, '').replace(/\/+$/, '')
  if (!clean || clean.includes('..')) return false
  return [
    resolve(root, clean),
    resolve(root, `${clean}.html`),
    resolve(root, clean, 'index.html'),
  ].some((file) => existsSync(file))
}

function wantsHtml(req) {
  const pathname = (req.url || '').split('?')[0]
  if (
    pathname.startsWith('/@') ||
    pathname.startsWith('/src/') ||
    pathname.startsWith('/node_modules')
  ) {
    return false
  }
  if (/\.[a-z0-9]+$/i.test(pathname) && !pathname.endsWith('.html')) return false
  if (pageExists(pathname)) return false
  const accept = String(req.headers.accept || '')
  return accept.includes('text/html') || accept.includes('*/*') || accept === ''
}

function frenchNotFound() {
  return {
    name: 'french-not-found',
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          if ((req.method !== 'GET' && req.method !== 'HEAD') || !wantsHtml(req)) return next()
          try {
            const raw = readFileSync(resolve(root, '404.html'), 'utf8')
            const html = await server.transformIndexHtml(req.originalUrl || req.url || '/', raw)
            res.statusCode = 404
            res.setHeader('Content-Type', 'text/html; charset=utf-8')
            res.end(req.method === 'HEAD' ? undefined : html)
          } catch (error) {
            next(error)
          }
        })
      }
    },
    configurePreviewServer(server) {
      return () => {
        server.middlewares.use((req, res, next) => {
          if ((req.method !== 'GET' && req.method !== 'HEAD') || !wantsHtml(req)) return next()
          const file = resolve(root, 'dist/404.html')
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end(req.method === 'HEAD' ? undefined : readFileSync(file))
        })
      }
    },
  }
}

export default defineConfig({
  appType: 'mpa',
  plugins: [htmlPartials(), frenchNotFound()],
  server: {
    host: '0.0.0.0',
    port: 4317,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 4317,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      input: {
        accueil: resolve(root, 'index.html'),
        services: resolve(root, 'services/index.html'),
        apropos: resolve(root, 'a-propos/index.html'),
        contact: resolve(root, 'contact/index.html'),
        notfound: resolve(root, '404.html'),
      },
    },
  },
})
