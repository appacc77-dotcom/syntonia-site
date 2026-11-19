import { useHref } from '../../interactive/links.jsx'
// hero as React + Tailwind CSS v4. Theme: variable.export {format: "tailwind"}.
export function Section01() {
  const href = useHref()
  return (
    <div className="relative w-full min-h-[780px] flex flex-row gap-space-m justify-end items-start [overflow:hidden]" data-node="952">
      <div className="flex-1 self-stretch w-full min-h-[780px] flex flex-row gap-8 p-space-3xl justify-between items-end [background:url(/assets/img-815aa456cd.jpg)_center_/_cover] relative [overflow:hidden]" data-node="953">
        <div className="absolute left-0 top-0 w-full h-[780px] bg-overlay-dark" data-node="954"></div>
        <div className="w-[600px] min-h-[369px] flex flex-col gap-8 items-start relative" data-node="955">
          <h1 className="w-full max-w-[600px] text-text-on-image font-['Literata'] text-[64px] font-light leading-[64px]" data-node="956">Состояние, из которого строится жизнь</h1>
          <p className="self-stretch w-full max-w-[600px] text-text-on-image font-['Golos_Text'] text-[20px] font-normal leading-[34px]" data-node="957">Когда меняется внутреннее основание, меняются выборы, отношения, энергия и жизнь.</p>
          <a className="w-[303px] min-h-[45px] flex flex-row gap-space-s py-space-s px-space-m justify-center items-center rounded-(--radius-s) bg-accent-muted relative no-underline" data-node="958" href={href('/quiz.html')}>
            <p className="text-text-on-image font-['Golos_Text'] text-[17px] font-normal leading-[29px] [white-space:nowrap] tracking-[0.03em]" data-node="959">Узнать свой код реальности</p>
            <div className="w-full max-w-[14px] min-h-[14px] flex flex-row gap-[1.43px] justify-center items-center relative" data-node="960">
              <div className="w-[11.88px] h-[9.65px] relative" data-node="961">
                <div className="absolute left-0 top-[3.34px] w-[5.54px] h-[2.96px] border-[1.5px] border-text-on-image" data-node="962"></div>
                <div className="absolute left-[6.97px] top-0 w-[4.91px] h-[9.65px] rounded-[0.71px] border-[3px] border-text-on-image" data-node="963"></div>
              </div>
            </div>
          </a>
        </div>
        <div className="w-[47.24px] h-[46.73px] relative" data-node="964">
          <div className="absolute left-0 top-0 w-[47.24px] h-[46.73px] border-[1.5px] border-text-on-image" data-node="965"></div>
        </div>
      </div>
    </div>
  );
}
