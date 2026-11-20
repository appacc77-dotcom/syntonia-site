// [object Object] (Masters/main): разделы — FigCraft inspect.code; ассеты — слепок.
import { Section01 } from './masters/Section01.jsx'
import { Section02 } from './masters/Section02.jsx'
import { Section03 } from './masters/Section03.jsx'
import { Section04 } from './masters/Section04.jsx'
import { Section05 } from './masters/Section05.jsx'

export function MastersPage() {
  return (
    // Высота страницы — по контенту: секции можно скрывать флагами (см. VISIBLE_MASTERS
// в masters/Section02.jsx), и страница не оставляет пустоту.
    <main id="main" className="relative w-full flex flex-col items-start" data-node="2692">
      <div className="z-50" style={{ position: 'absolute', left: '8px', top: '8px', width: 'calc(100% - 16px)' }}>
        <Section05 />
      </div>
      <Section01 />
      <Section02 />
      <Section03 />
      <Section04 />
    </main>
  )
}
