// Плавная прокрутка (Lenis). Один общий экземпляр на страницу.
// Включается только в браузере и только если пользователь не просил уменьшить движение:
// при prefers-reduced-motion ничего не инициализируем — остаётся нативный скролл.
let started = false

export function initSmoothScroll() {
  if (started || typeof window === 'undefined') return
  started = true
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (reduceMotion.matches) return
  import('lenis')
    .then(({ default: Lenis }) => {
      const lenis = new Lenis({
        autoRaf: true, // анимация кадров внутри библиотеки
        lerp: 0.1, // сила «догоняния» прокрутки
        smoothWheel: true,
        syncTouch: false, // на тач-устройствах оставляем нативный инерционный скролл
        anchors: { offset: -8 }, // якорные ссылки (#formats, #voices) — с плавным переходом
        respectReducedMotion: true,
      })
      window.__lenis = lenis
      // Плавный переход по внутренним якорям (в т.ч. ./#formats, ../#voices): перехватываем клик
      document.addEventListener('click', (event) => {
        const link = event.target instanceof Element ? event.target.closest('a[href]') : null
        if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        const href = link.getAttribute('href') || ''
        const hashIndex = href.indexOf('#')
        if (hashIndex === -1) return
        const path = href.slice(0, hashIndex)
        const sameDocument = path === '' || path === '.' || path === './' || path === location.pathname
        if (!sameDocument) return
        const target = document.getElementById(href.slice(hashIndex + 1))
        if (!target) return
        event.preventDefault()
        lenis.scrollTo(target, { duration: 1.1 })
        history.pushState(null, '', href)
      })
      // если пользователь включит «меньше движения» посреди сессии — освобождаем нативный скролл
      reduceMotion.addEventListener('change', (event) => {
        if (event.matches) {
          lenis.destroy()
          window.__lenis = null
          started = false
        }
      })
    })
    .catch(() => {})
}
