// [object Object] (Technical/legal-privacy): разделы — FigCraft inspect.code; ассеты — слепок.
import { Section01 } from './legal-privacy/Section01.jsx'
import { Section02 } from './legal-privacy/Section02.jsx'
import { Section03 } from './legal-privacy/Section03.jsx'

export function LegalPrivacyPage() {
  return (
    <div className="relative min-h-[13973px] w-full flex flex-col items-start bg-bg-page" data-node="10113">
      <div className="z-50" style={{ position: 'absolute', left: '8px', top: '8px', width: '1424px' }}>
        <Section03 />
      </div>
      <Section01 />
      <Section02 />
    </div>
  )
}
