// [object Object] (Technical/thanks-purchase): разделы — FigCraft inspect.code; ассеты — слепок.
import { Section01 } from './thanks-purchase/Section01.jsx'
import { Section02 } from './thanks-purchase/Section02.jsx'
import { Section03 } from './thanks-purchase/Section03.jsx'

export function ThanksPurchasePage() {
  return (
    <main id="main" className="relative min-h-[1261px] w-full flex flex-col items-start bg-bg-page" data-node="9756">
      <div className="z-50" style={{ position: 'absolute', left: '8px', top: '8px', width: 'calc(100% - 16px)' }}>
        <Section03 />
      </div>
      <Section01 />
      <Section02 />
    </main>
  )
}
