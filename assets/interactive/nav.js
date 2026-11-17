/**
 * Stage 3 S3.1: progressive navigation over the SSG DOM.
 * - turns known labels in header/footer into real links;
 * - sets aria-current for the current route;
 * - keyboard activation (Enter/Space) and focus signal.
 * Does not touch the bundle or reference.
 */
const ROUTES = new Map([
  ['О проекте', '/'],
  ['Понять себя', '/quiz.html'],
  ['Пространство практики', '/practice.html'],
  ['Практики', '/practice.html'],
  ['Библиотека', '/library.html'],
  ['Формат работы', '/practice.html'],
  ['Форматы работы', '/practice.html'],
  ['Отзывы', '/#voices'],
  ['Вопросы и ответы', '/#faq'],
  ['Задать вопрос', '/booking.html'],
  ['Начать с точки входа', '/booking.html'],
  ['Открыть библиотеку', '/library.html'],
  ['Политика конфиденциальности', '/legal-privacy.html'],
  ['Политика возвратов', '/legal-refund.html'],
  ['Согласия', '/legal-consent.html'],
  ['Условия использования и продажи', '/legal-terms.html'],
])

const normalize = (value) => value.replace(/\s+/g, ' ').trim()
const currentPath = () => location.pathname.replace(/\/+$/, '') || '/'

function siteBase() {
  const route = document.getElementById('root')?.dataset.route
  if (!route) return ''
  const suffix = route === '/' ? '/' : route
  if (!location.pathname.endsWith(suffix)) return ''
  const base = location.pathname.slice(0, -suffix.length).replace(/\/+$/, '')
  return base === '/' ? '' : base
}

function targetUrl(href) {
  const base = siteBase()
  return base && href.startsWith('/') ? base + href : href
}

function currentRoute(path) {
  if (path === '/' || path.endsWith('/index.html')) return '/'
  for (const route of new Set(ROUTES.values())) {
    if (route.startsWith('/#')) continue
    if (path.endsWith(route)) return route
  }
  return path
}

function scope() {
  const headerBar = document.querySelector('[class*="bg-bg-header"]')
  const footerMarker = [...document.querySelectorAll('p')].find((el) => normalize(el.textContent) === 'Политика конфиденциальности')
  let footer = footerMarker
  while (footer && !(normalize(footer.textContent).includes('© Syntonia') && normalize(footer.textContent).includes('Практики'))) footer = footer.parentElement
  return [headerBar?.closest('[data-node]'), footer].filter(Boolean)
}

function enhance(container) {
  const path = location.pathname
  for (const el of container.querySelectorAll('p, div, button')) {
    if (el.children.length > 0) continue
    if (el.closest('[data-interactive-link]')) continue
    const label = normalize(el.textContent)
    const href = ROUTES.get(label)
    if (!href) continue
    if (el.closest('a, button')) continue
    el.setAttribute('data-interactive-link', href)
    el.setAttribute('role', 'link')
    el.setAttribute('tabindex', '0')
    el.style.cursor = 'pointer'
    const targetPath = href.split('#')[0]
    if (targetPath && currentRoute(path) === currentRoute(targetPath)) el.setAttribute('aria-current', 'page')
    const activate = () => { location.href = targetUrl(href) }
    el.addEventListener('click', activate)
    el.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate() }
    })
  }
}

function start() {
  for (const container of scope()) enhance(container)
  document.documentElement.dataset.interactiveNav = 'ready'
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true })
else start()
