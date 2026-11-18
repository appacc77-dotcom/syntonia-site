import { isCurrent, useHref, useRoute } from '../../../interactive/links.jsx'
// library-book as React + Tailwind CSS v4. Theme: variable.export {format: "tailwind"}.
export function Section02() {
  const href = useHref()
  const route = useRoute()
  return (
    <div className="relative min-h-[882px] w-full flex flex-row py-space-5xl px-6 justify-center items-start bg-bg-page [overflow:hidden]" data-node="3210">
      <div className="flex-1 min-h-[626px] w-full max-w-[1280px] flex flex-row gap-space-3xl items-start relative [overflow:hidden]" data-node="3211">
        <div className="flex-1 self-stretch w-full max-w-[662px] min-h-[626px] flex flex-row items-start rounded-m [background:url(/assets/img-f8de616252.jpg)_-90.73px_1.24px_/_787.82px_626px] [overflow:hidden]" data-node="3212"></div>
        <div className="self-stretch w-full max-w-[554px] min-h-[626px] flex flex-col gap-space-xl items-start relative [overflow:hidden]" data-node="3213">
          <p className="text-accent-muted font-['Golos_Text'] text-[20px] font-normal leading-[30px] [white-space:nowrap] tracking-[0.16em] uppercase" data-node="3214">авторская книга</p>
          <div className="self-stretch min-h-[235px] w-full max-w-[554px] flex flex-col gap-4 items-start relative" data-node="3215">
            <p className="self-stretch w-full max-w-[554px] text-text-heading font-['Literata'] text-[48px] font-light leading-[60px]" data-node="3216">Коды построения реальности. 7 состояний жизни</p>
            <p className="text-text-heading font-['Literata'] text-[29px] font-light leading-[39px] [white-space:nowrap]" data-node="3217">Екатерина Лебедева</p>
          </div>
          <p className="self-stretch w-full max-w-[554px] text-text-primary font-['Golos_Text'] text-[20px] font-normal leading-[34px]" data-node="3218">Книга о семи состояниях, которые формируют внутренние сценарии человека и влияют на выбор, отношения и ход жизни. Внутри — авторская система, соединяющая психологию, научные опоры, тонкий план и бережные практики для самостоятельной внутренней работы.</p>
          <a className="w-[221px] min-h-[61px] flex flex-row gap-space-s py-space-m px-space-l justify-center items-center rounded-(--radius-s) [background:url(/assets/img-dcecf0bcc4.png)_center_/_cover] relative" data-node="3219" data-m3-link href={href('/library/book-chapter-intro.html')} aria-current={isCurrent(route, '/library/book-chapter-intro.html') ? 'page' : undefined}>
            <p className="text-text-on-image font-['Golos_Text'] text-[17px] font-normal leading-[29px] [white-space:nowrap] tracking-[0.03em] uppercase" data-node="3220">читать онлайн</p>
            <div className="w-full max-w-[14px] min-h-[14px] flex flex-row gap-[1.43px] justify-center items-center relative" data-node="3221">
              <div className="w-[11.88px] h-[9.65px] relative" data-node="3222">
                <div className="absolute left-0 top-[3.34px] w-[5.54px] h-[2.96px] border-[1.5px] border-text-on-image" data-node="3223"></div>
                <div className="absolute left-[6.97px] top-0 w-[4.91px] h-[9.65px] rounded-[0.71px] border-[3px] border-text-on-image" data-node="3224"></div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
