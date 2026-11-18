import { isCurrent, useHref, useRoute } from '../../../interactive/links.jsx'
// chapter-nav as React + Tailwind CSS v4. Theme: variable.export {format: "tailwind"}.
export function Section04() {
  const href = useHref()
  const route = useRoute()
  return (
    <div className="relative min-h-[139px] w-full flex flex-col pr-space-l pb-space-4xl pl-space-l items-center" data-node="4368">
      <div className="self-stretch mx-auto min-h-[43px] w-full max-w-[1280px] flex flex-row gap-space-l items-start relative" data-node="4369">
        <a className="flex-1 min-h-[43px] w-full max-w-[628px] flex flex-col gap-space-xs items-start relative" data-node="4370" data-m3-link href={href('/library/book-chapter-intro.html')} aria-current={isCurrent(route, '/library/book-chapter-intro.html') ? 'page' : undefined}>
          <p className="text-accent-muted font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap] tracking-[0.16em] uppercase" data-node="4371">назад</p>
          <div className="w-57 min-h-[19px] flex flex-row gap-space-s items-center relative" data-node="4372">
            <div className="w-full max-w-[14px] min-h-[14px] flex flex-row gap-[1.43px] justify-center items-center relative" data-node="4373">
              <div className="w-[11.88px] h-[9.65px] rotate-[-180deg] origin-top-left relative" data-node="4374">
                <div className="absolute left-0 top-[3.34px] w-[5.54px] h-[2.96px] border-[1.5px] border-accent" data-node="4375"></div>
                <div className="absolute left-[6.97px] top-0 w-[4.91px] h-[9.65px] rounded-[0.71px] border-[3px] border-accent" data-node="4376"></div>
              </div>
            </div>
            <p className="text-accent font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap]" data-node="4377">Коды построения реальности</p>
          </div>
        </a>
        <a className="flex-1 min-h-[43px] w-full max-w-[628px] flex flex-col gap-space-xs items-end relative" data-node="4378" data-m3-link href={href('/library/book-chapter-technique.html')} aria-current={isCurrent(route, '/library/book-chapter-technique.html') ? 'page' : undefined}>
          <p className="text-accent-muted font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap] tracking-[0.16em] text-right uppercase" data-node="4379">далее</p>
          <div className="w-95 min-h-[19px] flex flex-row gap-space-s items-center relative" data-node="4380">
            <p className="text-accent font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap] text-right" data-node="4381">Техника для самостоятельной работы с кодом Боли</p>
            <div className="w-full max-w-[14px] min-h-[14px] flex flex-row gap-[1.43px] justify-center items-center relative" data-node="4382">
              <div className="w-[11.88px] h-[9.65px] relative" data-node="4383">
                <div className="absolute left-0 top-[3.34px] w-[5.54px] h-[2.96px] border-[1.5px] border-accent" data-node="4384"></div>
                <div className="absolute left-[6.97px] top-0 w-[4.91px] h-[9.65px] rounded-[0.71px] border-[3px] border-accent" data-node="4385"></div>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
