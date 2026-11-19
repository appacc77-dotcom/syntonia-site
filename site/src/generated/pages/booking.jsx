// [object Object] (Booking/main): разделы — FigCraft inspect.code; ассеты — слепок.
import { Section01 } from './booking/Section01.jsx'
import { Section02 } from './booking/Section02.jsx'
import { Section03 } from './booking/Section03.jsx'
import { Section04 } from './booking/Section04.jsx'

export function BookingPage() {
  return (
    <main id="main" className="relative min-h-[2416px] w-full flex flex-col items-start bg-[#FFFFFF] [overflow:hidden]" data-node="8230">
      <div className="z-50" style={{ position: 'absolute', left: '8px', top: '8px', width: 'calc(100% - 16px)' }}>
        <Section04 />
      </div>
      <Section01 />
      <Section02 />
      <Section03 />
    </main>
  )
}
