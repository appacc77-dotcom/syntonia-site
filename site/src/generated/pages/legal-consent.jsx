// [object Object] (Technical/legal-consent): разделы — FigCraft inspect.code; ассеты — слепок.
import { Section01 } from './legal-consent/Section01.jsx'
import { Section02 } from './legal-consent/Section02.jsx'
import { Section03 } from './legal-consent/Section03.jsx'

export function LegalConsentPage() {
  return (
    <div className="relative min-h-[8135px] w-full flex flex-col items-start bg-bg-page" data-node="10460">
      <div className="z-50" style={{ position: 'absolute', left: '8px', top: '8px', width: '1424px' }}>
        <Section03 />
      </div>
      <Section01 />
      <Section02 />
    </div>
  )
}
