import { isCurrent, useHref, useRoute } from '../../../interactive/links.jsx'
// quiz as React + Tailwind CSS v4. Theme: variable.export {format: "tailwind"}.
export function Section03() {
  const href = useHref()
  const route = useRoute()
  return (
    <div className="relative w-full min-h-[550px] flex flex-row items-start bg-[#FFFFFF] [overflow:hidden]" data-node="5154">
      <div className="flex-1 self-stretch w-full min-h-[550px] flex flex-row px-space-5xl items-center [background:url(/assets/img-0d49458ee5.jpg)_-0.01px_-0.21px_/_1440px_630.88px] relative [overflow:hidden]" data-node="5155">
        <div className="w-[701px] min-h-[298px] flex flex-col gap-space-xl items-start relative [overflow:hidden]" data-node="5156">
          <div className="w-[701px] min-h-[144px] flex flex-col gap-space-m items-start relative" data-node="5157">
            <h2 className="text-[#FFFFFF] font-['Literata'] text-[48px] font-light leading-[60px] [white-space:nowrap]" data-node="5158">Не знаешь, с чего начать?</h2>
            <p className="text-[#FFFFFF] font-['Golos_Text'] text-[20px] font-normal leading-[34px]" data-node="5159">Пройди короткий тест и узнай свой код — состояние, которое сильнее <br />всего влияет на твою жизнь сейчас.</p>
          </div>
          <div className="w-[427px] min-h-[122px] flex flex-col gap-space-m items-start relative" data-node="5160">
            <p className="text-[#FFFFFF] font-['Golos_Text'] text-[20px] font-normal leading-[34px]" data-node="5161" style={{ boxSizing: 'border-box', minWidth: 0, flexShrink: 0, flex: '0 0 auto', width: '427px' }}>Практика  по твоему коду — в подарок.</p>
            <div className="w-84 min-h-[45px] flex flex-row gap-space-l justify-center items-center relative" data-node="5162">
              <a className="w-[162px] min-h-[45px] flex flex-row gap-space-s py-space-s px-space-m justify-center items-center rounded-(--radius-s) bg-accent-muted [outline:0.45px_solid_var(--color-thread,_#C9BEA4)] [outline-offset:-0.45px] relative" data-node="5163" data-m3-link href={href('/quiz.html')} aria-current={isCurrent(route, '/quiz.html') ? 'page' : undefined}>
                <p className="text-text-on-image font-['Golos_Text'] text-[17px] font-normal leading-[29px] [white-space:nowrap] tracking-[0.03em]" data-node="5164">Пройти тест</p>
                <div className="w-full max-w-[14px] min-h-[14px] flex flex-row gap-[1.43px] justify-center items-center relative" data-node="5165">
                  <div className="w-[11.88px] h-[9.65px] relative" data-node="5166">
                    <div className="absolute left-0 top-[3.34px] w-[5.54px] h-[2.96px] border-[1.5px] border-text-on-image" data-node="5167"></div>
                    <div className="absolute left-[6.97px] top-0 w-[4.91px] h-[9.65px] rounded-[0.71px] border-[3px] border-text-on-image" data-node="5168"></div>
                  </div>
                </div>
              </a>
              <div className="w-[150px] min-h-[20px] flex flex-row gap-space-xs justify-center items-center relative" data-node="5169">
                <p className="text-[#FFFFFF] font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap]" data-node="5170">Бесплатно   </p>
                <div className="w-[2px] h-[2px] rounded-full bg-text-on-image" data-node="5171"></div>
                <p className="text-[#FFFFFF] font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap]" data-node="5172">2-3 минуты</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute [inset:0] rounded-[inherit] [pointer-events:none] shadow-[inset_0_0_0_1px_#FFFFFF]"></div>
    </div>
  );
}
