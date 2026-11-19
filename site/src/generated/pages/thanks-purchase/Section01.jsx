import { isCurrent, useHref, useRoute } from '../../../interactive/links.jsx'
// thanks-purchase-section as React + Tailwind CSS v4. Theme: variable.export {format: "tailwind"}.
export function Section01() {
  const href = useHref()
  const route = useRoute()
  return (
    <div className="relative min-h-[900px] w-full flex flex-col pt-40 pr-space-l pb-24 pl-space-l justify-center items-center [overflow:hidden]" data-node="9757">
      <div className="min-h-[525px] w-full max-w-[640px] flex flex-col gap-space-xl items-center relative" data-node="9758">
        <div className="self-stretch min-h-[180px] w-full max-w-[640px] flex flex-col gap-space-m items-center relative" data-node="9759">
          <p className="self-stretch w-full max-w-[640px] text-accent font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap] tracking-[0.16em] text-center uppercase" data-node="9760">покупка прошла</p>
          <h1 className="self-stretch w-full max-w-[640px] text-text-heading font-['Literata'] text-[48px] font-light leading-[60px] [white-space:nowrap] text-center" data-node="9761">Спасибо за покупку</h1>
          <p className="self-stretch w-full max-w-[640px] text-text-primary font-['Golos_Text'] text-[20px] font-normal leading-[34px] text-center" data-node="9762">Практика уже в вашем личном кабинете. Слушать её можно в любое время, пока действует доступ.</p>
        </div>
        <div className="self-stretch min-h-[168px] w-full max-w-[640px] flex flex-col gap-space-m p-space-l items-start rounded-m bg-bg-surface relative" data-node="9763">
          <div className="self-stretch min-h-[52px] w-full max-w-[592px] flex flex-col gap-space-xs items-start relative" data-node="9764">
            <p className="self-stretch w-full max-w-[592px] text-text-secondary font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap] tracking-[0.16em] uppercase" data-node="9765">практика</p>
            <p className="self-stretch w-full max-w-[592px] text-text-heading font-['Literata'] text-[22px] font-light leading-[28px] [white-space:nowrap]" data-node="9766">Код Боли. Возвращение к себе</p>
          </div>
          <div className="self-stretch min-h-[52px] w-full max-w-[592px] flex flex-col gap-space-xs items-start relative" data-node="9767">
            <p className="self-stretch w-full max-w-[592px] text-text-secondary font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap] tracking-[0.16em] uppercase" data-node="9768">доступ</p>
            <p className="self-stretch w-full max-w-[592px] text-text-heading font-['Literata'] text-[22px] font-light leading-[28px] [white-space:nowrap]" data-node="9769">до 14 ноября 2027</p>
          </div>
        </div>
        <div className="self-stretch min-h-[61px] w-full max-w-[640px] flex flex-row gap-space-l justify-center items-center relative" data-node="9770">
          <a className="w-62 min-h-[61px] flex flex-row gap-space-s py-space-m px-space-l justify-center items-center rounded-(--radius-s) [background:url(/assets/img-dcecf0bcc4-496x122.webp)_center_/_cover] relative" data-node="9771" data-m3-link href={href('/practice.html')} aria-current={isCurrent(route, '/practice.html') ? 'page' : undefined}>
            <p className="text-text-on-image font-['Golos_Text'] text-[17px] font-normal leading-[29px] [white-space:nowrap] tracking-[0.03em]" data-node="9772">Перейти к практике</p>
            <div className="w-full max-w-[14px] min-h-[14px] flex flex-row gap-[1.43px] justify-center items-center relative" data-node="9773">
              <div className="w-[11.88px] h-[9.65px] relative" data-node="9774">
                <div className="absolute left-0 top-[3.34px] w-[5.54px] h-[2.96px] border-[1.5px] border-text-on-image" data-node="9775"></div>
                <div className="absolute left-[6.97px] top-0 w-[4.91px] h-[9.65px] rounded-[0.71px] border-[3px] border-text-on-image" data-node="9776"></div>
              </div>
            </div>
          </a>
          <div className="w-[185.86px] min-h-[29px] flex flex-row gap-space-s justify-center items-center shadow-[inset_0_-1px_0_0_var(--color-accent,_#5A5A36)] relative" data-node="9777">
            <p className="text-accent font-['Golos_Text'] text-[17px] font-normal leading-[29px] [white-space:nowrap] tracking-[0.03em] flex flex-col justify-end" data-node="9778">В личный кабинет</p>
            <div className="w-full max-w-[18.86px] min-h-[18.86px] flex flex-row gap-[1.93px] justify-end items-center relative" data-node="9779">
              <div className="w-[16.01px] h-[13px] relative" data-node="9780">
                <div className="absolute left-0 top-[4.5px] w-[7.46px] h-[3.99px] border-[2.02px] border-accent" data-node="9781"></div>
                <div className="absolute left-[9.39px] top-0 w-[6.62px] h-[13px] rounded-[0.96px] border-[4.04px] border-accent" data-node="9782"></div>
              </div>
            </div>
          </div>
        </div>
        <p className="self-stretch w-full max-w-[640px] text-text-secondary font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap] text-center" data-node="9783">Чек мы отправили на ваш email.</p>
      </div>
    </div>
  );
}
