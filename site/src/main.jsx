import { createRoot, hydrateRoot } from 'react-dom/client'
import App, { resolveRoute } from './App.jsx'
import './fonts.css'
import './generated/theme.css'
import './generated/font-metrics.css'
import './generated/vector-assets.css'
import './generated/vector-extra.css'
import './generated/practice-arrows.css'
import './generated/quiz-overrides.css'
import './base.css'
import './interactive/styles/motion.css'
import { initSmoothScroll } from './interactive/smoothScroll.js'

const container = document.getElementById('root')
// data-route ставит SSG: маршрут страницы известен из сборки, pathname нужен
// только для клиентского рендера без готовой разметки.
const route = container.dataset.route || resolveRoute(window.location.pathname)
const app = <App route={route} />

// SSG-страницы приходят с готовой разметкой — гидратируем её. Остальные
// маршруты пока рендерятся на клиенте, как раньше.
if (container.hasChildNodes()) hydrateRoot(container, app)
else createRoot(container).render(app)

// Плавная прокрутка страницы (Lenis), кроме prefers-reduced-motion
initSmoothScroll()
