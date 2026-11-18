import { useRef, useState } from 'react'

const CARD_WIDTH = 672
const GAP = 48
const STEP = CARD_WIDTH + GAP

function Arrow({ direction }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d={direction === 'prev' ? 'M10 3L5 8l5 5' : 'M6 3l5 5-5 5'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function VoiceSlider({ items }) {
  const [index, setIndex] = useState(0)
  const touch = useRef(null)
  const slides = [...items, items[0]]
  const max = items.length - 1
  const go = (next) => setIndex(next < 0 ? max : next > max ? 0 : next)
  const card = (item, key) => (
    <article key={key} className="voice-card min-h-[482px] w-[672px] shrink-0 flex flex-col gap-6 p-space-2xl items-start rounded-(--radius-l) bg-bg-glass-light relative [overflow:hidden]">
      <div className="self-stretch min-h-[343px] w-full max-w-[576px] flex flex-col gap-6 items-start relative">
        <div className="min-w-[166px] min-h-[47px] flex flex-col gap-space-xs items-start relative">
          <p className="text-accent-muted font-['Golos_Text'] text-[15px] font-medium leading-[23px] tracking-[0.16em] uppercase">{item.label}</p>
          <p className="text-text-secondary font-['Golos_Text'] text-[13px] font-normal leading-[20px]">{item.source}</p>
        </div>
        <div className="w-[18.44px] h-6 relative"><div className="absolute left-0 top-0 w-[18.44px] h-6 bg-accent-muted" /></div>
        <p className="self-stretch w-full max-w-[576px] text-text-primary font-['Lora'] text-[20px] font-normal italic leading-[28px]">{item.quote}</p>
      </div>
      <p className="text-text-deep font-['Golos_Text'] text-[14px] font-normal leading-[19px]">{item.author}</p>
      <div className="absolute [inset:0] rounded-[inherit] [pointer-events:none] shadow-[inset_0_0_0_1px_#FFFFFF]" />
    </article>
  )
  return (
    <div className="w-[1392px] max-w-full flex flex-col gap-8 items-start" role="region" aria-roledescription="carousel" aria-label="Голоса">
      <div
        className="w-[1392px] max-w-full overflow-hidden"
        onTouchStart={(event) => { touch.current = event.touches[0]?.clientX ?? null }}
        onTouchEnd={(event) => { if (touch.current == null) return; const dx = (event.changedTouches[0]?.clientX ?? touch.current) - touch.current; if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1)); touch.current = null }}
        onKeyDown={(event) => { if (event.key === 'ArrowLeft') { event.preventDefault(); go(index - 1) } if (event.key === 'ArrowRight') { event.preventDefault(); go(index + 1) } }}
        tabIndex={0}
      >
        <div className="flex gap-12 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ transform: `translateX(-${index * STEP}px)` }}>
          {slides.map((item, i) => card(item, `${item.author}-${i}`))}
        </div>
      </div>
      <div className="w-full flex flex-row items-center justify-between gap-8">
        <div className="flex flex-row gap-1 items-center" role="tablist" aria-label="Слайды отзывов">
          {items.map((item, i) => (
            <button key={item.author + i} type="button" role="tab" aria-selected={i === index} aria-label={`Отзыв ${i + 1}`} onClick={() => go(i)} className={`w-[21px] h-[15px] rounded-full transition-colors ${i === index ? 'bg-accent' : 'bg-accent-muted/40 hover:bg-accent-muted/70'}`} />
          ))}
        </div>
        <div className="flex flex-row gap-4 items-center">
          <button type="button" onClick={() => go(index - 1)} aria-label="Предыдущий отзыв" className="w-12 h-12 flex items-center justify-center rounded-full bg-bg-glass-strong text-accent hover:bg-bg-glass transition-colors"><Arrow direction="prev" /></button>
          <button type="button" onClick={() => go(index + 1)} aria-label="Следующий отзыв" className="w-12 h-12 flex items-center justify-center rounded-full bg-bg-glass-strong text-accent hover:bg-bg-glass transition-colors"><Arrow direction="next" /></button>
        </div>
      </div>
    </div>
  )
}
