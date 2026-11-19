// [object Object] (Technical/account-practices): разделы — FigCraft inspect.code; ассеты — слепок.
import { Section01 } from './account-practices/Section01.jsx'
import { Section02 } from './account-practices/Section02.jsx'
import { Section03 } from './account-practices/Section03.jsx'

export function AccountPracticesPage() {
  return (
    <main id="main" className="relative min-h-[1261px] w-full flex flex-col items-start bg-bg-page" data-node="9186">
      <h1 className="sr-only" data-m3-hidden-h1>Мои практики</h1>
      <div className="z-50" style={{ position: 'absolute', left: '8px', top: '8px', width: 'calc(100% - 16px)' }}>
        <Section03 />
      </div>
      <Section01 />
      <Section02 />
    </main>
  )
}
