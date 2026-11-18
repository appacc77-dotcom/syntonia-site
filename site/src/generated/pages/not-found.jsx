// [object Object] (Technical/not-found): разделы — FigCraft inspect.code; ассеты — слепок.
import { Section01 } from './not-found/Section01.jsx'
import { Section02 } from './not-found/Section02.jsx'
import { Section03 } from './not-found/Section03.jsx'

export function NotFoundPage() {
  return (
    <main id="main" className="relative min-h-[1261px] w-full flex flex-col items-start bg-bg-page" data-node="9845">
      <div className="z-50" style={{ position: 'absolute', left: '8px', top: '8px', width: '1424px' }}>
        <Section03 />
      </div>
      <Section01 />
      <Section02 />
    </main>
  )
}
