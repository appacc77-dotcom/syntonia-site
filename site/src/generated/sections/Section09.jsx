// formats as React + Tailwind CSS v4. Theme: variable.export {format: "tailwind"}.
import { useRoute } from '../../interactive/links.jsx'
import { FormatSlider } from '../../interactive/components/FormatSlider.jsx'

export function Section09() {
  const route = useRoute()
  return (
    <div id="formats" className="relative min-h-[1164px] w-full flex flex-col gap-space-2xl py-space-4xl px-6 items-center [background:url(/assets/img-8abb88a1df.png)_center_/_cover] [overflow:hidden] [scroll-margin-top:24px]" data-node="1107">
      <div className="self-stretch min-h-[102px] w-full max-w-[1392px] flex flex-col gap-space-s justify-center items-center relative [overflow:hidden]" data-node="1108">
        <h2 className="text-text-heading font-['Literata'] text-[48px] font-light leading-[60px] [white-space:nowrap]" data-node="1109">Форматы работы</h2>
        <p className="text-text-primary font-['Golos_Text'] text-[20px] font-normal leading-[34px] [white-space:nowrap]" data-node="1110">Форматы различаются по глубине запроса, длительности и степени сопровождения.</p>
      </div>
      <div className="self-stretch mx-auto min-h-[740px] w-full max-w-[1280px] flex flex-col gap-space-s p-space-s items-start rounded-(--radius-l) bg-bg-surface relative [overflow:hidden]" data-node="1111">
        <FormatSlider route={route} />
      </div>
      <div className="self-stretch min-h-[34px] w-full max-w-[1392px] flex flex-col gap-2 justify-center items-center relative [overflow:hidden]" data-node="1182">
        <p className="self-stretch w-full max-w-[1392px] text-text-secondary font-['Golos_Text'] text-[20px] font-normal leading-[34px] [white-space:nowrap] text-center" data-node="1183">Переход к записи ни к чему не обязывает: сначала ты можешь задать вопросы, оплата идёт последним шагом.</p>
      </div>
    </div>
  )
}
