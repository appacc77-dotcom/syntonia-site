import { isCurrent, useHref, useRoute } from '../../links.jsx'
// not-found-section as React + Tailwind CSS v4. Theme: variable.export {format: "tailwind"}.
export function Section01() {
  const href = useHref()
  const route = useRoute()
  return (
    <div className="relative min-h-[900px] w-full flex flex-col pt-40 pr-space-l pb-24 pl-space-l justify-center items-center [overflow:hidden]" data-node="9846">
      <div className="min-h-[425.08px] w-full max-w-[640px] flex flex-col gap-space-xl items-center relative" data-node="9847">
        <div className="w-30 h-[120.08px] relative" data-node="9848">
          <div className="absolute left-0 top-0 w-30 h-[120.08px] bg-[#C2AC57]" data-node="9849"></div>
        </div>
        <div className="self-stretch min-h-[180px] w-full max-w-[640px] flex flex-col gap-space-m items-center relative" data-node="9850">
          <p className="self-stretch w-full max-w-[640px] text-accent font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap] tracking-[0.16em] text-center uppercase" data-node="9851">ошибка 404</p>
          <h2 className="self-stretch w-full max-w-[640px] text-text-heading font-['Literata'] text-[48px] font-light leading-[60px] [white-space:nowrap] text-center" data-node="9852">Такой страницы нет</h2>
          <p className="self-stretch w-full max-w-[640px] text-text-primary font-['Golos_Text'] text-[20px] font-normal leading-[34px] text-center" data-node="9853">Возможно, ссылка устарела или в адресе опечатка. Начните с главной или загляните в библиотеку.</p>
        </div>
        <div className="self-stretch min-h-[61px] w-full max-w-[640px] flex flex-row gap-space-l justify-center items-center relative" data-node="9854">
          <a className="w-[171px] min-h-[61px] flex flex-row gap-space-s py-space-m px-space-l justify-center items-center rounded-(--radius-s) [background:url(/assets/img-dcecf0bcc4.png)_center_/_cover] relative" data-node="9855" data-m3-link href={href('/')} aria-current={isCurrent(route, '/') ? 'page' : undefined}>
            <p className="text-text-on-image font-['Golos_Text'] text-[17px] font-normal leading-[29px] [white-space:nowrap] tracking-[0.03em]" data-node="9856">На главную</p>
            <div className="w-full max-w-[14px] min-h-[14px] flex flex-row gap-[1.43px] justify-center items-center relative" data-node="9857">
              <div className="w-[11.88px] h-[9.65px] relative" data-node="9858">
                <div className="absolute left-0 top-[3.34px] w-[5.54px] h-[2.96px] border-[1.5px] border-text-on-image" data-node="9859"></div>
                <div className="absolute left-[6.97px] top-0 w-[4.91px] h-[9.65px] rounded-[0.71px] border-[3px] border-text-on-image" data-node="9860"></div>
              </div>
            </div>
          </a>
          <div className="w-[209.86px] min-h-[29px] flex flex-row gap-space-s justify-center items-center shadow-[inset_0_-1px_0_0_var(--color-accent,_#5A5A36)] relative" data-node="9861">
            <a className="block no-underline text-accent font-['Golos_Text'] text-[17px] font-normal leading-[29px] [white-space:nowrap] tracking-[0.03em] flex flex-col justify-end" data-node="9862" data-m3-link href="library.html">Открыть библиотеку</a>
            <div className="w-full max-w-[18.86px] min-h-[18.86px] flex flex-row gap-[1.93px] justify-end items-center relative" data-node="9863">
              <div className="w-[16.01px] h-[13px] relative" data-node="9864">
                <div className="absolute left-0 top-[4.5px] w-[7.46px] h-[3.99px] border-[2.02px] border-accent" data-node="9865"></div>
                <div className="absolute left-[9.39px] top-0 w-[6.62px] h-[13px] rounded-[0.96px] border-[4.04px] border-accent" data-node="9866"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
