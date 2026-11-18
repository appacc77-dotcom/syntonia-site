// [object Object] (Technical/thanks-booking): разделы — FigCraft inspect.code; ассеты — слепок.
import { Section01 } from './thanks-booking/Section01.jsx'
import { Section02 } from './thanks-booking/Section02.jsx'
import { Section03 } from './thanks-booking/Section03.jsx'

export function ThanksBookingPage() {
  return (
    <main id="main" className="relative min-h-[1324px] w-full flex flex-col items-start bg-bg-page" data-node="9564">
      <div className="z-50" style={{ position: 'absolute', left: '8px', top: '8px', width: '1424px' }}>
        <Section03 />
      </div>
      <Section01 />
      <Section02 />
    </main>
  )
}
