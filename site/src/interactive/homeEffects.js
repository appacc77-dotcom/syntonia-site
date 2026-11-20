// Лёгкие эффекты главной: появление блоков при прокрутке + небольшой параллакс фото.
// Только opacity/transform (без изменений раскладки), совместимо с Lenis.
// При prefers-reduced-motion ничего не включаем — страница статична, как в макете.
export function initHomeEffects() {
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const revealEls = Array.from(document.querySelectorAll('[data-reveal]'))
  const parallaxEls = Array.from(document.querySelectorAll('[data-parallax]'))
  if (!revealEls.length && !parallaxEls.length) return

  // Класс на <html> включает исходное (скрытое) состояние в CSS — только когда JS готов.
  document.documentElement.classList.add('home-effects')

  // Появление блоков: проверяем позиции на скролле (устойчиво к перерисовке React
  // после гидратации — в отличие от IntersectionObserver на «снятых» при старте узлах).
  const checkReveals = () => {
    const vh = window.innerHeight || 1
    for (const el of document.querySelectorAll('[data-reveal]:not(.is-revealed)')) {
      const rect = el.getBoundingClientRect()
      // либо блок входит в экран, либо мы уже прокрутили выше него — тогда показываем сразу
      if (rect.bottom <= 0 || (rect.top < vh * 0.92 && rect.bottom > 0)) el.classList.add('is-revealed')
    }
  }

  let frame = 0
  const applyParallax = () => {
    frame = 0
    const vh = window.innerHeight || 1
    for (const el of parallaxEls) {
      const rect = el.getBoundingClientRect()
      if (rect.bottom < -vh || rect.top > vh * 2) continue
      const speed = Number.parseFloat(el.dataset.parallax) || 0.1
      // элемент проходит через экран: -1 (ниже) → 0 (в центре) → 1 (выше)
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh
      const shift = (-progress * speed * 160).toFixed(2)
      el.style.transform = `translate3d(0, ${shift}px, 0) scale(1.08)`
    }
  }
  const schedule = () => {
    if (!frame) {
      frame = window.requestAnimationFrame(() => {
        applyParallax()
        checkReveals()
      })
    }
  }
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })
  applyParallax()
  checkReveals()
}
