// [object Object] (Technical/account-profile): разделы — FigCraft inspect.code; ассеты — слепок.
import { Section01 } from './account-profile/Section01.jsx'
import { Section02 } from './account-profile/Section02.jsx'
import { Section03 } from './account-profile/Section03.jsx'

export function AccountProfilePage() {
  return (
    <main id="main" className="relative min-h-[1261px] w-full flex flex-col items-start bg-bg-page" data-node="9375">
      <h1 className="sr-only" data-m3-hidden-h1>Профиль</h1>
      <div className="z-50" style={{ position: 'absolute', left: '8px', top: '8px', width: '1424px' }}>
        <Section03 />
      </div>
      <Section01 />
      <Section02 />
    </main>
  )
}
