// [object Object] (Technical/login): разделы — FigCraft inspect.code; ассеты — слепок.
import { Section01 } from './login/Section01.jsx'
import { Section02 } from './login/Section02.jsx'
import { Section03 } from './login/Section03.jsx'

export function LoginPage() {
  return (
    <main id="main" className="relative min-h-[1261px] w-full flex flex-col items-start bg-bg-page" data-node="9123">
      <h1 className="sr-only" data-m3-hidden-h1>Вход</h1>
      <div className="z-50" style={{ position: 'absolute', left: '8px', top: '8px', width: 'calc(100% - 16px)' }}>
        <Section03 />
      </div>
      <Section01 />
      <Section02 />
    </main>
  )
}
