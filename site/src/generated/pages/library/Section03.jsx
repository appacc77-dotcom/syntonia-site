import { useHref } from '../../../interactive/links.jsx'
// library-journal as React + Tailwind CSS v4. Theme: variable.export {format: "tailwind"}.
export function Section03() {
  const href = useHref()
  return (
    <div className="relative min-h-[570px] w-full flex flex-col py-16 px-6 items-center bg-bg-dark shadow-[inset_0_1px_0_0_var(--color-thread,_#C9BEA4),_inset_0_-1px_0_0_var(--color-thread,_#C9BEA4)] [overflow:hidden]" data-node="3225">
      <div className="self-stretch mx-auto min-h-[442px] w-full max-w-[1280px] flex flex-row gap-space-3xl items-start relative [overflow:hidden]" data-node="3226">
        <div className="w-full max-w-[493px] min-h-[442px] flex flex-col gap-space-xl items-start relative [overflow:hidden]" data-node="3227">
          <p className="text-accent-muted font-['Golos_Text'] text-[20px] font-normal leading-[30px] [white-space:nowrap] tracking-[0.16em] uppercase" data-node="3228">журнал</p>
          <h2 className="self-stretch w-full max-w-[493px] text-thread font-['Literata'] text-[48px] font-light leading-[60px] [white-space:nowrap]" data-node="3229">Syntonia.Life</h2>
          <p className="self-stretch w-full max-w-[493px] text-text-on-dark font-['Golos_Text'] text-[20px] font-normal leading-[34px]" data-node="3230">Выпуски, собранные вокруг того, что действительно волнует и сопровождает жизнь: внутренние состояния, отношения, выбор, опора, перемены, практика и смысл.</p>
        </div>
        <div className="flex-1 w-full max-w-[723px] min-h-[442px] flex flex-row items-end rounded-m [background:url(/assets/img-c8d2f1f321.jpg)_center_/_cover] relative [overflow:hidden]" data-node="3231">
          <div className="absolute left-4 top-[311px] w-[217px] min-h-[115px] flex flex-col gap-space-s p-space-m items-start rounded-m bg-bg-page [overflow:hidden]" data-node="3232">
            <p className="text-accent-muted font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap] tracking-[0.16em] uppercase" data-node="3233">актуальный выпуск</p>
            <div className="w-[175px] min-h-[20px] flex flex-row gap-1 justify-center items-center relative" data-node="3234">
              <p className="text-text-primary font-['Literata'] text-[16px] font-light leading-[20px] [white-space:nowrap]" data-node="3235">№02</p>
              <p className="text-text-primary font-['Literata'] text-[16px] font-light leading-[20px] [white-space:nowrap]" data-node="3236">Тело и состояние</p>
            </div>
            <a className="w-[131px] min-h-[27px] flex flex-row gap-1 py-1 px-2 justify-center items-center rounded-[2px] [background:url(/assets/img-dcecf0bcc4-262x54.webp)_center_/_cover] relative no-underline" data-node="3237" href={href('/library/book-chapter.html')}>
              <p className="text-text-on-image font-['Golos_Text'] text-[11px] font-normal leading-[19px] [white-space:nowrap] tracking-[0.03em] uppercase" data-node="3238">читать выпуск</p>
              <div className="w-full max-w-[14px] min-h-[14px] flex flex-row gap-[1.43px] justify-center items-center relative" data-node="3239">
                <div className="w-[11.88px] h-[9.65px] relative" data-node="3240">
                  <div className="absolute left-0 top-[3.34px] w-[5.54px] h-[2.96px] border-[1.5px] border-text-on-image" data-node="3241"></div>
                  <div className="absolute left-[6.97px] top-0 w-[4.91px] h-[9.65px] rounded-[0.71px] border-[3px] border-text-on-image" data-node="3242"></div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
