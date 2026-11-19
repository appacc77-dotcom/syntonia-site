import { useHref } from '../../interactive/links.jsx'
// quiz as React + Tailwind CSS v4. Theme: variable.export {format: "tailwind"}.
export function Section05() {
  const href = useHref()
  return (
    <div className="relative w-full min-h-[550px] flex flex-row items-start [overflow:hidden]" data-node="1021">
      <div className="wide-bg flex-1 self-stretch w-full min-h-[550px] flex flex-row px-6 justify-center items-center [background:url(/assets/img-0d49458ee5.jpg)_-0.01px_-0.21px_/_1440px_630.88px] relative [overflow:hidden]" data-node="1022">
        <div className="flex-1 min-h-[265px] w-full max-w-[1280px] flex flex-col gap-[10px] items-start relative" data-node="1023">
          <div className="self-stretch min-h-[265px] w-full max-w-[1280px] flex flex-col gap-space-xl items-start relative [overflow:hidden]" data-node="1024">
            <h2 className="text-text-on-image font-['Literata'] text-[48px] font-light leading-[60px] [white-space:nowrap]" data-node="1025">Диагностика состояния</h2>
            <div className="w-full max-w-[520px] text-text-on-image font-['Golos_Text'] text-[20px] font-normal leading-[34px]" data-node="1026" style={{ width: '520px', whiteSpace: 'pre-wrap' }}><span className="font-['Great_Vibes'] text-[48px] leading-[61.2px]" style={{ position: 'relative', top: '11px' }}>{"Тест "}</span><span className="font-['Golos_Text'] text-[20px] leading-[34px]">{"поможет увидеть, что сейчас управляет твоим состоянием и жизнью"}</span></div>
            <div className="w-[354px] min-h-[45px] flex flex-row gap-space-l justify-center items-center relative" data-node="1027">
              <a className="w-45 min-h-[45px] flex flex-row gap-space-s py-space-s px-space-m justify-center items-center rounded-(--radius-s) bg-accent-muted [outline:1px_solid_var(--color-thread,_#C9BEA4)] [outline-offset:-1px] relative no-underline" data-node="1028" href={href('/quiz.html')}>
                <p className="text-text-on-image font-['Golos_Text'] text-[17px] font-normal leading-[29px] [white-space:nowrap] tracking-[0.03em] uppercase" data-node="1029">понять себя</p>
                <div className="w-full max-w-[14px] min-h-[14px] flex flex-row gap-[1.43px] justify-center items-center relative" data-node="1030">
                  <div className="w-[11.88px] h-[9.65px] relative" data-node="1031">
                    <div className="absolute left-0 top-[3.34px] w-[5.54px] h-[2.96px] border-[1.5px] border-text-on-image" data-node="1032"></div>
                    <div className="absolute left-[6.97px] top-0 w-[4.91px] h-[9.65px] rounded-[0.71px] border-[3px] border-text-on-image" data-node="1033"></div>
                  </div>
                </div>
              </a>
              <div className="w-[150px] min-h-[20px] flex flex-row gap-space-xs justify-center items-center relative" data-node="1034">
                <p className="text-text-on-image font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap]" data-node="1035">Бесплатно</p>
                <div className="w-[2px] h-[2px] rounded-full bg-text-on-image" data-node="1036"></div>
                <p className="text-text-on-image font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap]" data-node="1037">2-3 минуты</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
