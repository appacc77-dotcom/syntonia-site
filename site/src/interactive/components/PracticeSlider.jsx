import { useCallback, useRef, useState } from 'react'
import { PRACTICE_CARDS } from './practiceCards.jsx'

// Слайдер «Практики для мягкого входа» (/practice).
// Стрелки листают карточки по одной с зацикливанием: сдвиг на шаг (карточка + gap),
// в конце анимации порядок карточек прокручивается и трансформ сбрасывается —
// визуально бесконечная карусель без дублирования узлов (data-node не дублируются).
const STEP = 328 // 296 (карточка) + 32 (space-xl)
const DURATION = 450

const ARROW = 'absolute top-[428px] w-12 min-h-[48px] flex flex-row items-center rounded-full cursor-pointer p-0 m-0 border-0 bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-opacity duration-150 hover:opacity-80 motion-reduce:transition-none'

export function PracticeSlider() {
  const [order, setOrder] = useState(() => PRACTICE_CARDS.map((_, index) => index))
  const [offset, setOffset] = useState(0)
  const [animating, setAnimating] = useState(false)
  const trackRef = useRef(null)

  const move = useCallback((direction) => {
    if (animating) return
    const element = trackRef.current
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let done = false
    let timer = null
    const finish = () => {
      if (done) return
      done = true
      if (element) element.removeEventListener('transitionend', finish)
      if (timer) window.clearTimeout(timer)
      setOrder((prev) =>
        direction === 'next' ? [...prev.slice(1), prev[0]] : [prev[prev.length - 1], ...prev.slice(0, -1)],
      )
      setOffset(0)
      setAnimating(false)
    }
    if (!element || reduceMotion) {
      setOrder((prev) =>
        direction === 'next' ? [...prev.slice(1), prev[0]] : [prev[prev.length - 1], ...prev.slice(0, -1)],
      )
      setAnimating(false)
      return
    }
    setAnimating(true)
    setOffset(direction === 'next' ? -STEP : STEP)
    element.addEventListener('transitionend', finish, { once: true })
    timer = window.setTimeout(finish, DURATION + 150)
  }, [animating])

  return (
    <div className="relative min-h-[915.56px] w-full flex flex-row justify-center items-start bg-bg-practice" data-node="5042">
      <div className="flex-1 min-h-[915.56px] w-full max-w-[1280px] flex flex-col gap-space-3xl py-space-4xl items-center relative [overflow:hidden]" data-node="5043">
        <div className="self-stretch min-h-[163px] w-full max-w-[1280px] flex flex-col gap-4 py-space-m items-center relative" data-node="5044">
          <h2 className="text-text-primary font-['Literata'] text-[65px] font-light leading-[81px] [white-space:nowrap]" data-node="5045">Практики для мягкого входа</h2>
          <p className="text-text-primary font-['Golos_Text'] text-[20px] font-normal leading-[34px] [white-space:nowrap]" data-node="5046">Для бережной самостоятельной настройки состояния. </p>
        </div>
        <div className="self-stretch min-h-[496.56px] w-full max-w-[1280px] flex flex-col gap-space-l items-center relative" data-node="5047">
          <div className="self-stretch min-h-[470.72px] w-full max-w-[1280px] flex flex-row gap-space-xl items-start relative [overflow:hidden]" data-node="5048">
            <div
              ref={trackRef}
              className="w-full flex flex-row gap-space-xl items-start transition-transform motion-reduce:transition-none"
              style={{ transform: `translateX(${offset}px)`, transitionDuration: `${DURATION}ms`, transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)', transitionProperty: 'transform' }}
            >
              {order.map((cardIndex) => (
                <div key={cardIndex} className="w-[296px] min-h-[470.72px] shrink-0">
                  {PRACTICE_CARDS[cardIndex]}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        aria-label="Предыдущие практики"
        onClick={() => move('prev')}
        className={`${ARROW} left-[calc(50%-664px)]`}
        data-node="5144"
      >
        <img src="assets/figma-practice-arrow-left.svg" alt="" aria-hidden="true" className="absolute block w-[49px] h-[49px] max-w-none left-[-0.5px] top-[-0.5px]" />
      </button>
      <button
        type="button"
        aria-label="Следующие практики"
        onClick={() => move('next')}
        className={`${ARROW} right-[calc(50%-664px)]`}
        data-node="5149"
      >
        <img src="assets/figma-practice-arrow-right.svg" alt="" aria-hidden="true" className="absolute block w-[49px] h-[49px] max-w-none left-[-0.5px] top-[-0.5px]" />
      </button>
    </div>
  )
}
