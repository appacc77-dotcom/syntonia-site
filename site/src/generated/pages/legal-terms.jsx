// [object Object] (Technical/legal-terms): разделы — FigCraft inspect.code; ассеты — слепок.
import { Section01 } from './legal-terms/Section01.jsx'
import { Section02 } from './legal-terms/Section02.jsx'
import { Section03 } from './legal-terms/Section03.jsx'

export function LegalTermsPage() {
  return (
    <main id="main" className="relative min-h-[13979px] w-full flex flex-col items-start bg-bg-page" data-node="9928">
      <div className="z-50" style={{ position: 'absolute', left: '8px', top: '8px', width: '1424px' }}>
        <Section03 />
      </div>
      <Section01 />
      <Section02 />
    </main>
  )
}
