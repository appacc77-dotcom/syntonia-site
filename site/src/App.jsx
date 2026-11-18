import { Suspense, useEffect } from 'react'
import { ROUTES as PAGE_ROUTES } from './generated/router.jsx'
import { RouteContext } from './interactive/links.jsx'
import { PageReveal } from './interactive/components/PageReveal.jsx'

// Все продуктовые страницы целиком сгенерированы FigCraft; маршрут выбирается
// по pathname статической HTML-страницы. router.jsx генерируется build-pages.mjs.
const ROUTES = { ...PAGE_ROUTES }

// Якорные ссылки на fixtures (#FixtureNNN): контент рендерится React-ом после загрузки,
// поэтому браузерный автоскролл по hash срабатывает раньше цели — докручиваем вручную.
function useHashScroll() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id) return
    let frame = 0
    let timer = null
    const tryScroll = () => {
      const target = document.getElementById(id)
      if (target) {
        target.scrollIntoView({ block: 'start' })
        return
      }
      if (frame++ < 120) timer = setTimeout(tryScroll, 50)
    }
    tryScroll()
    return () => clearTimeout(timer)
  }, [])
}

// Базовый путь хостинга (`/repo/`) неизвестен сборке, поэтому маршрут ищется по
// самому длинному суффиксу pathname: `/syntonia-site/method.html` → `/method.html`.
// Это же правило работает для SSG и клиентской гидратации без patch-base.
export function resolveRoute(pathname) {
  const path = String(pathname || '/').split('?')[0].split('#')[0]
  if (ROUTES[path]) return path
  let match = null
  for (const route of Object.keys(ROUTES)) {
    if (route === '/' || route === '/index.html') continue
    if (path.endsWith(route) && (!match || route.length > match.length)) match = route
  }
  return match
}

// route приходит из SSR (entry-server.jsx) или из pathname при гидратации.
export default function App({ route }) {
  useHashScroll()
  const resolved = route ?? (typeof window === 'undefined' ? '/' : resolveRoute(window.location.pathname)) ?? '/not-found.html'
  const PageComponent = ROUTES[resolved] || ROUTES['/not-found.html']
  return (
    <RouteContext.Provider value={resolved}>
      <PageReveal>
        <Suspense fallback={null}>
          <PageComponent />
        </Suspense>
      </PageReveal>
    </RouteContext.Provider>
  )
}
