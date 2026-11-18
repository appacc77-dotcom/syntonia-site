// voices as React + Tailwind CSS v4. Theme: variable.export {format: "tailwind"}.
import { VOICES } from '../../interactive/content/voices.js'
import { VoiceSlider } from '../../interactive/components/VoiceSlider.jsx'

export function Section10() {
  return (
    <div id="voices" className="relative min-h-[920px] w-full flex flex-col gap-space-2xl py-space-4xl px-6 items-center [background:url(/assets/img-acf48f09f2.png)_-38.75px_-37.95px_/_1611.75px_985.27px] [overflow:hidden]" data-node="1184">
      <div className="self-stretch mx-auto min-h-[728px] w-full max-w-[1280px] flex flex-col gap-space-2xl pl-16 items-start relative" data-node="1185">
        <div className="w-[711px] min-h-[102px] flex flex-col gap-2 items-start relative" data-node="1186">
          <p className="text-text-heading font-['Literata'] text-[48px] font-light leading-[60px] [white-space:nowrap]" data-node="1187">Голоса</p>
          <p className="text-text-primary font-['Golos_Text'] text-[20px] font-normal leading-[34px] [white-space:nowrap]" data-node="1188">О том, как внутренняя работа начинает менять состояние и саму жизнь</p>
        </div>
        <VoiceSlider items={VOICES} />
      </div>
    </div>
  )
}
