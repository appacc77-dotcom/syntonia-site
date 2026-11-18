import { useId, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion.js'
import { useHref } from '../links.jsx'

const QUESTION = "flex-1 w-full max-w-[766px] text-text-primary font-['Literata'] text-[29px] font-light leading-[39px] text-left"
const ANSWER = "self-stretch w-full max-w-[787px] text-text-deep font-['Golos_Text'] text-[20px] font-normal leading-[34px]"
const ITEM = 'self-stretch w-full max-w-[835px] flex flex-col gap-0 py-4 px-space-l items-start rounded-m relative [overflow:hidden]'

// Стрелка — настоящий SVG-вектор из Figma (arrow-quiet), повёрнутый как в макете:
// закрытый пункт — вниз (90°), открытый — вверх (−90°). Раньше здесь была аппроксимация
// двумя div с border, из-за которой на 21 px иконка выглядела «квадратом».
function Arrow({ open }) {
  const href = useHref()
  return (
    <span className="w-full max-w-[21px] min-h-[21px] flex flex-row justify-center items-center relative shrink-0" aria-hidden="true">
      <img
        src={href('/icons/arrow-right.svg')}
        alt=""
        width={14.47}
        height={14.47}
        className={`w-[14.47px] h-[14.47px] ${open ? 'rotate-[-90deg]' : 'rotate-[90deg]'} transition-transform`}
      />
    </span>
  )
}

export function Accordion({ items }) {
  const initial = Math.max(0, items.findIndex((item) => item.defaultOpen))
  const [openIndex, setOpenIndex] = useState(initial)
  const baseId = useId()
  const reduced = useReducedMotion()
  return items.map((item, index) => {
    const open = openIndex === index
    const panelId = `${baseId}-panel-${index}`
    const buttonId = `${baseId}-button-${index}`
    return (
      <div key={item.id} className={`${ITEM} ${open ? 'min-h-[163px] bg-bg-glass' : 'min-h-[71px]'}`}>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpenIndex(open ? -1 : index)}
          className="self-stretch min-h-[39px] w-full flex flex-row gap-0 justify-between items-center text-left cursor-pointer"
        >
          <span className={QUESTION}>{item.question}</span>
          <Arrow open={open} />
        </button>
        <div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          className={`grid w-full transition-[grid-template-rows] duration-300 ease-out ${open ? 'pt-space-l' : ''}`}
          style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden">
            <p className={ANSWER}>{item.answer}</p>
          </div>
        </div>
        <span className="absolute [inset:0] rounded-[inherit] [pointer-events:none] shadow-[inset_0_0_0_1px_#5A5A36]" />
      </div>
    )
  })
}
