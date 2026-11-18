// [object Object] (Masters/main): разделы — FigCraft inspect.code; ассеты — слепок.
import { Section01 } from './masters/Section01.jsx'
import { Section02 } from './masters/Section02.jsx'
import { Section03 } from './masters/Section03.jsx'
import { Section04 } from './masters/Section04.jsx'
import { Section05 } from './masters/Section05.jsx'

export function MastersPage() {
  return (
    <div className="relative min-h-[3886.46px] w-full flex flex-col items-start" data-node="2692" style={{ height: '3886.46435546875px' }}>
      <div className="z-50" style={{ position: 'absolute', left: '8px', top: '8px', width: '1424px' }}>
        <Section05 />
      </div>
      <Section01 />
      <Section02 />
      <Section03 />
      <Section04 />
    </div>
  )
}
