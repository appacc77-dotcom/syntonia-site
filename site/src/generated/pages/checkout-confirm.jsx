// [object Object] (Technical/checkout-confirm): разделы — FigCraft inspect.code; ассеты — слепок.
import { Section01 } from './checkout-confirm/Section01.jsx'
import { Section02 } from './checkout-confirm/Section02.jsx'
import { Section03 } from './checkout-confirm/Section03.jsx'

export function CheckoutConfirmPage() {
  return (
    <main id="main" className="relative w-[1440px] h-[1000px] bg-bg-page [overflow:hidden]" data-node="10610">
      <div className="z-50" style={{ position: 'absolute', left: '8px', top: '8px', width: 'calc(100% - 16px)' }}>
        <Section01 />
      </div>
      <div style={{ position: 'absolute', left: '0px', top: '0px', width: '1440px', }}>
        <Section02 />
      </div>
      <div style={{ position: 'absolute', left: '460px', top: '164px', width: '520px', }}>
        <Section03 />
      </div>
    </main>
  )
}
