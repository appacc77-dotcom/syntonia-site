// [object Object] (Technical/practice-detail): разделы — FigCraft inspect.code; ассеты — слепок.
import { Section01 } from './practice-detail/Section01.jsx'
import { Section02 } from './practice-detail/Section02.jsx'
import { Section03 } from './practice-detail/Section03.jsx'

export function PracticeDetailPage() {
  return (
    <div className="relative min-h-[1261px] w-full flex flex-col items-start bg-bg-page" data-node="9438">
      <div className="z-50" style={{ position: 'absolute', left: '8px', top: '8px', width: '1424px' }}>
        <Section03 />
      </div>
      <Section01 />
      <Section02 />
    </div>
  )
}
