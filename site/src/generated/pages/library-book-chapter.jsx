// [object Object] (Library/book-chapter): разделы — FigCraft inspect.code; ассеты — слепок.
import { Section01 } from './library-book-chapter/Section01.jsx'
import { Section02 } from './library-book-chapter/Section02.jsx'
import { Section03 } from './library-book-chapter/Section03.jsx'
import { Section04 } from './library-book-chapter/Section04.jsx'
import { Section05 } from './library-book-chapter/Section05.jsx'

export function LibraryBookChapterPage() {
  return (
    <div className="relative min-h-[1930px] w-full flex flex-col items-start bg-bg-reader" data-node="4258">
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
