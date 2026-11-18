// Страница Home: корень и порядок разделов — из FigCraft (inspect.code для фрейма 951).
// Сами разделы — отдельные компоненты в src/generated/sections/ (тоже FigCraft).
// Header — оверлей поверх первого экрана (в дереве Figma он последний).
import { Section01 } from './sections/Section01.jsx'
import { Section02 } from './sections/Section02.jsx'
import { Section03 } from './sections/Section03.jsx'
import { Section04 } from './sections/Section04.jsx'
import { Section05 } from './sections/Section05.jsx'
import { Section06 } from './sections/Section06.jsx'
import { Section07 } from './sections/Section07.jsx'
import { Section08 } from './sections/Section08.jsx'
import { Section09 } from './sections/Section09.jsx'
import { Section10 } from './sections/Section10.jsx'
import { Section11 } from './sections/Section11.jsx'
import { Section12 } from './sections/Section12.jsx'
import { Section13 } from './sections/Section13.jsx'
import { Section14 } from './sections/Section14.jsx'
import { Section15 } from './sections/Section15.jsx'

export function Page() {
  return (
    <main id="main" className="relative min-h-[10548px] w-full flex flex-col items-start bg-[#FFFFFF] [overflow:hidden]" data-node="951">
      <div className="z-50" style={{ position: 'absolute', left: '8px', top: '8px', width: '1424px' }}>
        <Section15 />
      </div>
      <Section01 />
      <Section02 />
      <Section03 />
      <Section04 />
      <Section05 />
      <Section06 />
      <Section07 />
      <Section08 />
      <Section09 />
      <Section10 />
      <Section11 />
      <Section12 />
      <Section13 />
      <Section14 />
    </main>
  )
}
