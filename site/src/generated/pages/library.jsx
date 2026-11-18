// [object Object] (Library/main): разделы — FigCraft inspect.code; ассеты — слепок.
import { Section01 } from './library/Section01.jsx'
import { Section02 } from './library/Section02.jsx'
import { Section03 } from './library/Section03.jsx'
import { Section04 } from './library/Section04.jsx'
import { Section05 } from './library/Section05.jsx'
import { Section06 } from './library/Section06.jsx'

export function LibraryPage() {
  return (
    <main id="main" className="relative min-h-[3188px] w-full flex flex-col items-start" data-node="3199">
      <div className="z-50" style={{ position: 'absolute', left: '8px', top: '8px', width: '1424px' }}>
        <Section06 />
      </div>
      <Section01 />
      <Section02 />
      <Section03 />
      <Section04 />
      <Section05 />
    </main>
  )
}
