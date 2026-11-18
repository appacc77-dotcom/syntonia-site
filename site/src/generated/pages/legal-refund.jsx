// [object Object] (Technical/legal-refund): разделы — FigCraft inspect.code; ассеты — слепок.
import { Section01 } from './legal-refund/Section01.jsx'
import { Section02 } from './legal-refund/Section02.jsx'
import { Section03 } from './legal-refund/Section03.jsx'

export function LegalRefundPage() {
  return (
    <main id="main" className="relative min-h-[10201px] w-full flex flex-col items-start bg-bg-page" data-node="10289">
      <div className="z-50" style={{ position: 'absolute', left: '8px', top: '8px', width: '1424px' }}>
        <Section03 />
      </div>
      <Section01 />
      <Section02 />
    </main>
  )
}
