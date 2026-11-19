// [object Object] (Method/main): разделы — FigCraft inspect.code; ассеты — слепок.
import { Section01 } from './method/Section01.jsx'
import { Section02 } from './method/Section02.jsx'
import { Section03 } from './method/Section03.jsx'
import { Section04 } from './method/Section04.jsx'
import { Section05 } from './method/Section05.jsx'

export function MethodPage() {
  return (
    <main id="main" className="relative min-h-[2737px] w-full flex flex-col items-start bg-[#FFFFFF] [overflow:hidden]" data-node="9023">
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
