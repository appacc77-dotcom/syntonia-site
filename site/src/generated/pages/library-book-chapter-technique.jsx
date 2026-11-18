// [object Object] (Library/book-chapter-technique): разделы — FigCraft inspect.code; ассеты — слепок.
import { Section01 } from './library-book-chapter-technique/Section01.jsx'
import { Section02 } from './library-book-chapter-technique/Section02.jsx'
import { Section03 } from './library-book-chapter-technique/Section03.jsx'
import { Section04 } from './library-book-chapter-technique/Section04.jsx'
import { Section05 } from './library-book-chapter-technique/Section05.jsx'

export function LibraryBookChapterTechniquePage() {
  return (
    <div className="relative min-h-[5392.08px] w-full flex flex-col items-start bg-bg-reader" data-node="4589" style={{ height: '5392.08349609375px' }}>
      <div className="z-50" style={{ position: 'absolute', left: '8px', top: '8px', width: '1424px' }}>
        <Section01 />
      </div>
      <Section02 />
      <Section03 />
      <Section04 />
      <Section05 />
    </div>
  )
}
