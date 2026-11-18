import { useId, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion.js'

const QUESTION = "flex-1 w-full max-w-[766px] text-text-primary font-['Literata'] text-[29px] font-light leading-[39px] text-left"
const ANSWER = "self-stretch w-full max-w-[787px] text-text-deep font-['Golos_Text'] text-[20px] font-normal leading-[34px]"
const ITEM = 'self-stretch w-full max-w-[835px] flex flex-col gap-0 py-4 px-space-l items-start rounded-m relative [overflow:hidden]'

function Arrow({ open }) {
  return (
    <span className="w-full max-w-[21px] min-h-[21px] flex flex-row gap-[2.14px] justify-center items-center relative shrink-0" aria-hidden="true">
      <span className={`w-[17.82px] h-[14.47px] origin-top-left relative ${open ? 'rotate-[-90deg]' : 'rotate-[90deg]'}`}>
        <span className="absolute left-0 top-[5.01px] w-[8.31px] h-[4.44px] border-[2.25px] border-accent" />
        <span className="absolute left-[10.45px] top-0 w-[7.37px] h-[14.47px] rounded-[1.07px] border-[4.5px] border-accent" />
      </span>
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
          className="self-stretch min-h-[39px] w-full flex flex-row gap-6 justify-between items-center text-left cursor-pointer"
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
