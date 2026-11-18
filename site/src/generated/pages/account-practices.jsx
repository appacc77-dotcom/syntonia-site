// [object Object] (Technical/account-practices): разделы — FigCraft inspect.code; ассеты — слепок.
import { Section01 } from './account-practices/Section01.jsx'
import { Section02 } from './account-practices/Section02.jsx'
import { Section03 } from './account-practices/Section03.jsx'

export function AccountPracticesPage() {
  return (
    <div className="relative min-h-[1261px] w-full flex flex-col items-start bg-bg-page" data-node="9186">
      <div className="z-50" style={{ position: 'absolute', left: '8px', top: '8px', width: '1424px' }}>
        <Section03 />
      </div>
      <Section01 />
      <Section02 />
    </div>
  )
}
