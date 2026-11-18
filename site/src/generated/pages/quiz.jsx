// [object Object] (Quiz/quiz-q1): разделы — FigCraft inspect.code; ассеты — слепок.
import { Section01 } from './quiz/Section01.jsx'
import { Section02 } from './quiz/Section02.jsx'
import { Section03 } from './quiz/Section03.jsx'

export function QuizPage() {
  return (
    <div className="relative min-h-[1171.5px] w-full flex flex-col items-start bg-bg-page [overflow:hidden]" data-node="5950" style={{ height: '1171.5px' }}>
      <div className="z-50" style={{ position: 'absolute', left: '8px', top: '10px', width: '1424px' }}>
        <Section03 />
      </div>
      <Section01 />
      <Section02 />
    </div>
  )
}
