// [object Object] (Practice/practice-page): разделы — FigCraft inspect.code; ассеты — слепок.
import { Section01 } from './practice/Section01.jsx'
import { Section02 } from './practice/Section02.jsx'
import { Section03 } from './practice/Section03.jsx'
import { Section04 } from './practice/Section04.jsx'
import { Section05 } from './practice/Section05.jsx'
import { Section06 } from './practice/Section06.jsx'
import { Section07 } from './practice/Section07.jsx'
import { Section08 } from './practice/Section08.jsx'

export function PracticePage() {
  return (
    // Высота страницы — по контенту: разделы можно скрывать флагами (см. SHOW_SOS_ALGORITHM
    // в practice/Section07.jsx), и страница не оставляет пустоту.
    <main id="main" className="relative w-full flex flex-col items-start bg-[#FFFFFF]" data-node="5008">
      <Section01 />
      <Section02 />
      <Section03 />
      <Section04 />
      <Section05 />
      <Section06 />
      <Section07 />
      <Section08 />
    </main>
  )
}
