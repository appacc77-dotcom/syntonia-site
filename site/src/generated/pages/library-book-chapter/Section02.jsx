import { isCurrent, useHref, useRoute } from '../../../interactive/links.jsx'
// chapter-bar as React + Tailwind CSS v4. Theme: variable.export {format: "tailwind"}.
export function Section02() {
  const href = useHref()
  const route = useRoute()
  return (
    <div className="relative min-h-[192px] w-full flex flex-row pt-32 pr-6 pl-6 justify-center items-center" data-node="4288">
      <div className="flex-1 min-h-[64px] w-full max-w-[1280px] flex flex-col gap-6 items-start relative" data-node="4289">
        <div className="self-stretch min-h-[37px] w-full max-w-[1280px] flex flex-row gap-[430px] justify-between items-center relative" data-node="4290">
          <div className="w-[150px] min-h-[19px] flex flex-row gap-2 items-center relative" data-node="4291" style={{ boxSizing: 'border-box', minWidth: 0, flexShrink: 0, flex: '0 0 auto', width: '150px' }}>
            <div className="w-full max-w-[14px] min-h-[14px] flex flex-row gap-[1.43px] justify-center items-center relative" data-node="4292" style={{ boxSizing: 'border-box', minWidth: 0, flexShrink: 0, flex: '0 0 auto', width: '14px' }}>
              <div className="w-[11.88px] h-[9.65px] rotate-[-180deg] origin-top-left relative" data-node="4293">
                <div className="absolute left-0 top-[3.34px] w-[5.54px] h-[2.96px] border-[1.5px] border-accent" data-node="4294"></div>
                <div className="absolute left-[6.97px] top-0 w-[4.91px] h-[9.65px] rounded-[0.71px] border-[3px] border-accent" data-node="4295"></div>
              </div>
            </div>
            <a className="text-accent font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap]" data-node="4296" data-m3-link href={href('/library.html')} aria-current={isCurrent(route, '/library.html') ? 'page' : undefined}>Вернуться к книге</a>
          </div>
          <div className="min-h-[37px] w-full max-w-[280px] flex flex-row gap-6 p-[9px] items-center rounded-[4px] bg-bg-reader [outline:1px_solid_var(--color-thread,_#C9BEA4)] [outline-offset:-1px] relative" data-node="4297" style={{ position: 'relative', left: '-48.5px', top: '0px',  boxSizing: 'border-box', minWidth: 0, flexShrink: 0, flex: '0 0 auto', width: '280px' }}>
            <p className="flex-1 w-full max-w-[224px] text-accent font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap] [overflow:hidden] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]" data-node="4298" style={{ boxSizing: 'border-box', minWidth: 0, flexShrink: 0, flex: '0 0 auto', width: '224px' }}>Код 1. Боль</p>
            <div className="w-full max-w-[14px] min-h-[14px] flex flex-row gap-[1.43px] justify-center items-center relative" data-node="4299">
              <div className="w-[11.88px] h-[9.65px] rotate-[-90deg] origin-top-left relative" data-node="4300">
                <div className="absolute left-0 top-[3.34px] w-[5.54px] h-[2.96px] border-[1.5px] border-accent" data-node="4301"></div>
                <div className="absolute left-[6.97px] top-0 w-[4.91px] h-[9.65px] rounded-[0.71px] border-[3px] border-accent" data-node="4302"></div>
              </div>
            </div>
            <div className="absolute left-0 top-[37px] w-full max-w-[280px] min-h-[542px] flex flex-col p-[1px] items-start rounded-[4px] bg-bg-inverse [overflow:hidden]" data-node="4303">
              <a className="self-stretch min-h-[27px] w-full max-w-[278px] flex flex-row py-1 px-2 items-center relative" data-node="4304" data-m3-link href={href('/library/book-chapter-intro.html')} aria-current={isCurrent(route, '/library/book-chapter-intro.html') ? 'page' : undefined}>
                <p className="flex-1 w-full max-w-[262px] text-text-on-dark font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap] [overflow:hidden] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]" data-node="4305" style={{ boxSizing: 'border-box', minWidth: 0, flexShrink: 0, flex: '0 0 auto', width: '262px' }}>Введение</p>
              </a>
              <div className="self-stretch min-h-[27px] w-full max-w-[278px] flex flex-row py-1 px-2 items-center relative" data-node="4306">
                <p className="flex-1 w-full max-w-[262px] text-text-on-dark font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap] [overflow:hidden] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]" data-node="4307" style={{ boxSizing: 'border-box', minWidth: 0, flexShrink: 0, flex: '0 0 auto', width: '262px' }}>Наука и Душа</p>
              </div>
              <div className="self-stretch min-h-[27px] w-full max-w-[278px] flex flex-row py-1 px-2 items-center relative" data-node="4308">
                <p className="flex-1 w-full max-w-[262px] text-text-on-dark font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap] [overflow:hidden] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]" data-node="4309" style={{ boxSizing: 'border-box', minWidth: 0, flexShrink: 0, flex: '0 0 auto', width: '262px' }}>Коды построения реальности</p>
              </div>
              <div className="self-stretch min-h-[27px] w-full max-w-[278px] flex flex-row py-1 px-2 items-center bg-bg-selected relative" data-node="4310">
                <p className="flex-1 w-full max-w-[262px] text-text-on-dark font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap] [overflow:hidden] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]" data-node="4311" style={{ boxSizing: 'border-box', minWidth: 0, flexShrink: 0, flex: '0 0 auto', width: '262px' }}>Код 1. Боль</p>
              </div>
              <a className="self-stretch min-h-[27px] w-full max-w-[278px] flex flex-row py-1 px-2 items-center relative" data-node="4312" data-m3-link href={href('/library/book-chapter-technique.html')} aria-current={isCurrent(route, '/library/book-chapter-technique.html') ? 'page' : undefined}>
                <p className="flex-1 w-full max-w-[262px] text-text-on-dark font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap] [overflow:hidden] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]" data-node="4313" style={{ boxSizing: 'border-box', minWidth: 0, flexShrink: 0, flex: '0 0 auto', width: '262px' }}>Техника для самостоятельной работы с кодом Боли</p>
              </a>
              <a className="self-stretch min-h-[27px] w-full max-w-[278px] flex flex-row py-1 px-2 items-center relative" data-node="4314" data-m3-link href={href('/library/book-chapter-story.html')} aria-current={isCurrent(route, '/library/book-chapter-story.html') ? 'page' : undefined}>
                <p className="flex-1 w-full max-w-[262px] text-text-on-dark font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap] [overflow:hidden] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]" data-node="4315" style={{ boxSizing: 'border-box', minWidth: 0, flexShrink: 0, flex: '0 0 auto', width: '262px' }}>История Анны</p>
              </a>
              <div className="self-stretch min-h-[27px] w-full max-w-[278px] flex flex-row py-1 px-2 items-center relative" data-node="4316">
                <p className="flex-1 w-full max-w-[262px] text-text-on-dark font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap] [overflow:hidden] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]" data-node="4317" style={{ boxSizing: 'border-box', minWidth: 0, flexShrink: 0, flex: '0 0 auto', width: '262px' }}>Код 2. Гнев</p>
              </div>
              <div className="self-stretch min-h-[27px] w-full max-w-[278px] flex flex-row py-1 px-2 items-center relative" data-node="4318">
                <p className="flex-1 w-full max-w-[262px] text-text-on-dark font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap] [overflow:hidden] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]" data-node="4319" style={{ boxSizing: 'border-box', minWidth: 0, flexShrink: 0, flex: '0 0 auto', width: '262px' }}>Анна и Гнев</p>
              </div>
              <div className="self-stretch min-h-[27px] w-full max-w-[278px] flex flex-row py-1 px-2 items-center relative" data-node="4320">
                <p className="flex-1 w-full max-w-[262px] text-text-on-dark font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap] [overflow:hidden] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]" data-node="4321" style={{ boxSizing: 'border-box', minWidth: 0, flexShrink: 0, flex: '0 0 auto', width: '262px' }}>Техника для самостоятельной работы с кодом Гнева</p>
              </div>
              <div className="self-stretch min-h-[27px] w-full max-w-[278px] flex flex-row py-1 px-2 items-center relative" data-node="4322">
                <p className="flex-1 w-full max-w-[262px] text-text-on-dark font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap] [overflow:hidden] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]" data-node="4323" style={{ boxSizing: 'border-box', minWidth: 0, flexShrink: 0, flex: '0 0 auto', width: '262px' }}>Код 3. Страх</p>
              </div>
              <div className="self-stretch min-h-[27px] w-full max-w-[278px] flex flex-row py-1 px-2 items-center relative" data-node="4324">
                <p className="flex-1 w-full max-w-[262px] text-text-on-dark font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap] [overflow:hidden] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]" data-node="4325" style={{ boxSizing: 'border-box', minWidth: 0, flexShrink: 0, flex: '0 0 auto', width: '262px' }}>Анна и её код Страха</p>
              </div>
              <div className="self-stretch min-h-[27px] w-full max-w-[278px] flex flex-row py-1 px-2 items-center relative" data-node="4326">
                <p className="flex-1 w-full max-w-[262px] text-text-on-dark font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap] [overflow:hidden] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]" data-node="4327" style={{ boxSizing: 'border-box', minWidth: 0, flexShrink: 0, flex: '0 0 auto', width: '262px' }}>Техника для самостоятельной работы с кодом Страха</p>
              </div>
              <div className="self-stretch min-h-[27px] w-full max-w-[278px] flex flex-row py-1 px-2 items-center relative" data-node="4328">
                <p className="flex-1 w-full max-w-[262px] text-text-on-dark font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap] [overflow:hidden] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]" data-node="4329" style={{ boxSizing: 'border-box', minWidth: 0, flexShrink: 0, flex: '0 0 auto', width: '262px' }}>Код 4. Негодование</p>
              </div>
              <div className="self-stretch min-h-[27px] w-full max-w-[278px] flex flex-row py-1 px-2 items-center relative" data-node="4330">
                <p className="flex-1 w-full max-w-[262px] text-text-on-dark font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap] [overflow:hidden] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]" data-node="4331" style={{ boxSizing: 'border-box', minWidth: 0, flexShrink: 0, flex: '0 0 auto', width: '262px' }}>Как негодование прожила Анна</p>
              </div>
              <div className="self-stretch min-h-[27px] w-full max-w-[278px] flex flex-row py-1 px-2 items-center relative" data-node="4332">
                <p className="flex-1 w-full max-w-[262px] text-text-on-dark font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap] [overflow:hidden] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]" data-node="4333" style={{ boxSizing: 'border-box', minWidth: 0, flexShrink: 0, flex: '0 0 auto', width: '262px' }}>Техника для самостоятельной работы с кодом Негодования</p>
              </div>
              <div className="self-stretch min-h-[27px] w-full max-w-[278px] flex flex-row py-1 px-2 items-center relative" data-node="4334">
                <p className="flex-1 w-full max-w-[262px] text-text-on-dark font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap] [overflow:hidden] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]" data-node="4335" style={{ boxSizing: 'border-box', minWidth: 0, flexShrink: 0, flex: '0 0 auto', width: '262px' }}>Код 5. Гордыня</p>
              </div>
              <div className="self-stretch min-h-[27px] w-full max-w-[278px] flex flex-row py-1 px-2 items-center relative" data-node="4336">
                <p className="flex-1 w-full max-w-[262px] text-text-on-dark font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap] [overflow:hidden] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]" data-node="4337">Как Анна прошла код Гордыни</p>
              </div>
              <div className="self-stretch min-h-[27px] w-full max-w-[278px] flex flex-row py-1 px-2 items-center relative" data-node="4338">
                <p className="flex-1 w-full max-w-[262px] text-text-on-dark font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap] [overflow:hidden] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]" data-node="4339">Техника для самостоятельной работы с кодом Гордыни</p>
              </div>
              <div className="self-stretch min-h-[27px] w-full max-w-[278px] flex flex-row py-1 px-2 items-center relative" data-node="4340">
                <p className="flex-1 w-full max-w-[262px] text-text-on-dark font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap] [overflow:hidden] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]" data-node="4341">Код 6. Растерянность</p>
              </div>
              <div className="self-stretch min-h-[27px] w-full max-w-[278px] flex flex-row py-1 px-2 items-center relative" data-node="4342">
                <p className="flex-1 w-full max-w-[262px] text-text-on-dark font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap] [overflow:hidden] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]" data-node="4343">Анна и состояние растерянности</p>
              </div>
              <div className="absolute left-68 top-1 w-[3px] h-[534px] rounded-xs bg-border [overflow:hidden]" data-node="4344">
                <div className="absolute left-0 top-0 w-[3px] h-45 rounded-xs bg-accent-muted" data-node="4345"></div>
              </div>
              <div className="absolute [inset:0] rounded-[inherit] [pointer-events:none] shadow-[inset_0_0_0_1px_#C9BEA4]"></div>
            </div>
          </div>
          <div className="w-[87px] min-h-[37px] flex flex-row gap-2 p-[1px] items-center rounded-[4px] bg-bg-glass [outline:1px_solid_var(--color-thread,_#C9BEA4)] [outline-offset:-1px] relative" data-node="4346" style={{ position: 'relative', left: '-97px', top: '0px' }}>
            <div className="w-[34px] min-h-[35px] flex flex-col p-2 justify-center items-center relative" data-node="4347">
              <p className="self-stretch w-full max-w-[18px] text-border font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap]" data-node="4348">A−</p>
            </div>
            <div className="w-[1px] h-5 bg-thread" data-node="4349"></div>
            <div className="w-[34px] min-h-[35px] flex flex-col p-2 justify-center items-center relative" data-node="4350">
              <p className="self-stretch w-full max-w-[18px] text-accent font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap]" data-node="4351">A+</p>
            </div>
          </div>
        </div>
        <div className="self-stretch min-h-[3px] w-full max-w-[1280px] flex flex-col items-start relative [overflow:hidden]" data-node="4352">
          <div className="self-stretch w-full max-w-[1280px] h-[3px] rounded-[16px] bg-border" data-node="4353"></div>
          <div className="absolute left-0 top-0 w-[448px] h-[3px] rounded-[16px] bg-accent" data-node="4354"></div>
        </div>
      </div>
    </div>
  );
}
