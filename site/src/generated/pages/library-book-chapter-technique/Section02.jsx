import { isCurrent, useHref, useRoute } from '../../../interactive/links.jsx'
// chapter-bar as React + Tailwind CSS v4. Theme: variable.export {format: "tailwind"}.
export function Section02() {
  const href = useHref()
  const route = useRoute()
  return (
    <div className="relative min-h-[192px] w-full flex flex-row pt-32 pr-6 pl-6 justify-center items-center" data-node="4619">
      <div className="flex-1 min-h-[64px] w-full max-w-[1280px] flex flex-col gap-6 items-start relative" data-node="4620">
        <div className="self-stretch min-h-[37px] w-full max-w-[1280px] flex flex-row gap-[430px] justify-between items-center relative" data-node="4621">
          <div className="w-[150px] min-h-[19px] flex flex-row gap-2 items-center relative" data-node="4622" style={{ boxSizing: 'border-box', minWidth: 0, flexShrink: 0, flex: '0 0 auto', width: '150px' }}>
            <div className="w-full max-w-[14px] min-h-[14px] flex flex-row gap-[1.43px] justify-center items-center relative" data-node="4623" style={{ boxSizing: 'border-box', minWidth: 0, flexShrink: 0, flex: '0 0 auto', width: '14px' }}>
              <div className="w-[11.88px] h-[9.65px] rotate-[-180deg] origin-top-left relative" data-node="4624">
                <div className="absolute left-0 top-[3.34px] w-[5.54px] h-[2.96px] border-[1.5px] border-accent" data-node="4625"></div>
                <div className="absolute left-[6.97px] top-0 w-[4.91px] h-[9.65px] rounded-[0.71px] border-[3px] border-accent" data-node="4626"></div>
              </div>
            </div>
            <a className="text-accent font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap]" data-node="4627" data-m3-link href={href('/library.html')} aria-current={isCurrent(route, '/library.html') ? 'page' : undefined}>Вернуться к книге</a>
          </div>
          <div className="min-h-[37px] w-full max-w-[280px] flex flex-row gap-6 p-[9px] items-center rounded-[4px] bg-bg-reader [outline:1px_solid_var(--color-thread,_#C9BEA4)] [outline-offset:-1px] relative" data-node="4628" style={{ position: 'relative', left: '-48.5px', top: '0px',  boxSizing: 'border-box', minWidth: 0, flexShrink: 0, flex: '0 0 auto', width: '280px' }}>
            <p className="flex-1 w-full max-w-[224px] text-accent font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap] [overflow:hidden] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]" data-node="4629" style={{ boxSizing: 'border-box', minWidth: 0, flexShrink: 0, flex: '0 0 auto', width: '224px' }}>Техника для самостоятельной работы с кодом Боли</p>
            <div className="w-full max-w-[14px] min-h-[14px] flex flex-row gap-[1.43px] justify-center items-center relative" data-node="4630">
              <div className="w-[11.88px] h-[9.65px] rotate-[90deg] origin-top-left relative" data-node="4631">
                <div className="absolute left-0 top-[3.34px] w-[5.54px] h-[2.96px] border-[1.5px] border-accent" data-node="4632"></div>
                <div className="absolute left-[6.97px] top-0 w-[4.91px] h-[9.65px] rounded-[0.71px] border-[3px] border-accent" data-node="4633"></div>
              </div>
            </div>
          </div>
          <div className="w-[87px] min-h-[37px] flex flex-row gap-2 p-[1px] items-center rounded-[4px] bg-bg-glass [outline:1px_solid_var(--color-thread,_#C9BEA4)] [outline-offset:-1px] relative" data-node="4677" style={{ position: 'relative', left: '-97px', top: '0px' }}>
            <div className="w-[34px] min-h-[35px] flex flex-col p-2 justify-center items-center relative" data-node="4678">
              <p className="self-stretch w-full max-w-[18px] text-border font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap]" data-node="4679">A−</p>
            </div>
            <div className="w-[1px] h-5 bg-thread" data-node="4680"></div>
            <div className="w-[34px] min-h-[35px] flex flex-col p-2 justify-center items-center relative" data-node="4681">
              <p className="self-stretch w-full max-w-[18px] text-accent font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap]" data-node="4682">A+</p>
            </div>
          </div>
        </div>
        <div className="self-stretch min-h-[3px] w-full max-w-[1280px] flex flex-col items-start relative [overflow:hidden]" data-node="4683">
          <div className="self-stretch w-full max-w-[1280px] h-[3px] rounded-[16px] bg-border" data-node="4684"></div>
          <div className="absolute left-0 top-0 w-[448px] h-[3px] rounded-[16px] bg-accent" data-node="4685"></div>
        </div>
      </div>
    </div>
  );
}
