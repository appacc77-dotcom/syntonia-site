import { useState } from 'react'
import { hrefFor } from '../links.jsx'
import { FORMATS } from '../content/formats.js'

const cardBase = 'format-card min-h-[296px] flex flex-col p-4 items-start rounded-[12px] relative overflow-hidden transition-[width,background-color,outline-color] duration-300 ease-out'
const title = 'text-text-heading font-[\'Literata\'] font-light leading-[28px] text-center'

function Number({ value }) {
  return <span className="w-[32px] h-[32px] shrink-0 flex items-center justify-center rounded-full [outline:1px_solid_var(--color-accent,_#5A5A36)] [outline-offset:-1px]"><span className="text-accent font-['Lora'] text-[13px] italic leading-[20px] text-center">{value}</span></span>
}

export function FormatSlider({ route = '/' }) {
  const [selected, setSelected] = useState(0)
  const go = (next) => setSelected((next + FORMATS.length) % FORMATS.length)
  return (
    <div className="self-stretch w-full flex flex-col gap-2" role="group" aria-label="Форматы работы">
      <div className="self-stretch w-full max-w-[1264px] min-h-[420px] flex flex-row justify-between items-center rounded-m [background:url(/assets/img-ccc7781894.png)_-0.05px_-143.18px_/_1264px_705.49px] relative [overflow:hidden]">
        <div className="absolute left-[608px] top-[359px] w-[47px] min-h-[36px] flex flex-row py-space-xs px-space-s justify-center items-end rounded-full bg-bg-glass-strong"><p className="text-accent font-['Lora'] text-[20px] italic leading-[28px]" aria-live="polite" aria-atomic="true">{selected + 1}/5<span className="sr-only"> — выбран формат: {FORMATS[selected].title}</span></p></div>
        <button type="button" aria-label="Предыдущий формат" onClick={() => go(selected - 1)} className="w-12 min-h-[48px] flex items-center justify-center rounded-full bg-bg-glass-strong hover:bg-bg-glass transition-colors"><span className="text-accent text-[22px] leading-none">‹</span></button>
        <button type="button" aria-label="Следующий формат" onClick={() => go(selected + 1)} className="w-12 min-h-[48px] flex items-center justify-center rounded-full bg-bg-glass-strong hover:bg-bg-glass transition-colors"><span className="text-accent text-[22px] leading-none">›</span></button>
        <div className="absolute [inset:0] rounded-[inherit] [pointer-events:none] shadow-[inset_0_0_0_1px_#FFFFFF]" />
      </div>
      <div className="self-stretch w-full max-w-[1264px] flex flex-row items-start relative [overflow:hidden]">
        {FORMATS.map((item, index) => {
          const active = selected === index
          return (
            <div key={item.number} className={`${cardBase} ${active ? 'w-[335px] bg-bg-glass' : 'flex-1 max-w-[232.25px]'}`} data-format-index={index} onClick={() => setSelected(index)}>
              <div className={`w-full ${active ? 'min-h-[56px]' : 'min-h-[50px]'} flex flex-row gap-2 items-start`}>
                <Number value={item.number} />
                <p className={`${title} ${active ? 'text-[22px]' : 'text-[20px] leading-[25px]'}`}>{item.title}</p>
              </div>
              {active && <p className="w-full max-w-[303px] text-text-primary font-['Golos_Text'] text-[14px] leading-[19px]">{item.description}</p>}
              <div className="mt-auto flex flex-row gap-2 items-center rounded-full">
                <span className="inline-flex px-2 py-1 rounded-full bg-bg-glass [outline:1px_solid_var(--color-accent-muted,_#8A8560)] [outline-offset:-1px] text-text-primary font-['Golos_Text'] text-[13px] leading-[20px]">{item.duration}</span>
                <span className="text-text-primary font-['Golos_Text'] text-[13px] leading-[20px]">{item.price}</span>
              </div>
              {active && <a href={hrefFor(route, '/booking.html')} className="mt-2 w-[211px] min-h-[45px] flex flex-row gap-2 py-2 px-4 justify-center items-center rounded-[4px] [background:url(/assets/img-dcecf0bcc4.png)_center_/_cover] text-text-on-image font-['Golos_Text'] text-[17px] leading-[29px] tracking-[0.03em] no-underline">Перейти к записи <span>›</span></a>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
