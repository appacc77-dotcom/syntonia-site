import { isCurrent, useHref, useRoute } from '../../../interactive/links.jsx'
// chapter-nav as React + Tailwind CSS v4. Theme: variable.export {format: "tailwind"}.
export function Section04() {
  const href = useHref()
  const route = useRoute()
  return (
    <div className="relative min-h-[139px] w-full flex flex-col pr-space-l pb-space-4xl pl-space-l items-center" data-node="4763">
      <div className="self-stretch mx-auto min-h-[43px] w-full max-w-[1280px] flex flex-row gap-space-l items-start relative" data-node="4764">
        <a className="flex-1 min-h-[43px] w-full max-w-[628px] flex flex-col gap-space-xs items-start relative" data-node="4765" data-m3-link href={href('/library/book-chapter.html')} aria-current={isCurrent(route, '/library/book-chapter.html') ? 'page' : undefined}>
          <p className="text-accent-muted font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap] tracking-[0.16em] uppercase" data-node="4766">назад</p>
          <div className="w-25 min-h-[19px] flex flex-row gap-space-s items-center relative" data-node="4767">
            <div className="w-full max-w-[14px] min-h-[14px] flex flex-row gap-[1.43px] justify-center items-center relative" data-node="4768">
              <div className="w-[11.88px] h-[9.65px] rotate-[-180deg] origin-top-left relative" data-node="4769">
                <div className="absolute left-0 top-[3.34px] w-[5.54px] h-[2.96px] border-[1.5px] border-accent" data-node="4770"></div>
                <div className="absolute left-[6.97px] top-0 w-[4.91px] h-[9.65px] rounded-[0.71px] border-[3px] border-accent" data-node="4771"></div>
              </div>
            </div>
            <p className="text-accent font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap]" data-node="4772">Код 1. Боль</p>
          </div>
        </a>
        <a className="flex-1 min-h-[43px] w-full max-w-[628px] flex flex-col gap-space-xs items-end relative" data-node="4773" data-m3-link href={href('/library/book-chapter-story.html')} aria-current={isCurrent(route, '/library/book-chapter-story.html') ? 'page' : undefined}>
          <p className="text-accent-muted font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap] tracking-[0.16em] text-right uppercase" data-node="4774">далее</p>
          <div className="w-[121px] min-h-[19px] flex flex-row gap-space-s items-center relative" data-node="4775">
            <p className="text-accent font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap] text-right" data-node="4776">История Анны</p>
            <div className="w-full max-w-[14px] min-h-[14px] flex flex-row gap-[1.43px] justify-center items-center relative" data-node="4777">
              <div className="w-[11.88px] h-[9.65px] relative" data-node="4778">
                <div className="absolute left-0 top-[3.34px] w-[5.54px] h-[2.96px] border-[1.5px] border-accent" data-node="4779"></div>
                <div className="absolute left-[6.97px] top-0 w-[4.91px] h-[9.65px] rounded-[0.71px] border-[3px] border-accent" data-node="4780"></div>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
