// [object Object] (Library/book-chapter-intro): разделы — FigCraft inspect.code; ассеты — слепок.
import { Section01 } from './library-book-chapter-intro/Section01.jsx'
import { Section02 } from './library-book-chapter-intro/Section02.jsx'
import { Section03 } from './library-book-chapter-intro/Section03.jsx'
import { Section04 } from './library-book-chapter-intro/Section04.jsx'
import { Section05 } from './library-book-chapter-intro/Section05.jsx'

export function LibraryBookChapterIntroPage() {
  return (
    <main id="main" className="relative min-h-[3484px] w-full flex flex-col items-start bg-bg-reader" data-node="4418">
      <div className="z-50" style={{ position: 'absolute', left: '8px', top: '8px', width: '1424px' }}>
        <Section01 />
      </div>
      <Section02 />
      <Section03 />
      <Section04 />
      <Section05 />
    </main>
  )
}
