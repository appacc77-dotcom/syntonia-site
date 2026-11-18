import { isCurrent, useHref, useRoute } from '../../links.jsx'
// thanks-booking-section as React + Tailwind CSS v4. Theme: variable.export {format: "tailwind"}.
export function Section01() {
  const href = useHref()
  const route = useRoute()
  return (
    <div className="relative min-h-[963px] w-full flex flex-col pt-40 pr-space-l pb-24 pl-space-l justify-center items-center [overflow:hidden]" data-node="9565">
      <div className="min-h-[707px] w-full max-w-[640px] flex flex-col gap-space-xl items-center relative" data-node="9566">
        <div className="self-stretch min-h-[180px] w-full max-w-[640px] flex flex-col gap-space-m items-center relative" data-node="9567">
          <p className="self-stretch w-full max-w-[640px] text-accent font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap] tracking-[0.16em] text-center uppercase" data-node="9568">заявка отправлена</p>
          <p className="self-stretch w-full max-w-[640px] text-text-heading font-['Literata'] text-[48px] font-light leading-[60px] [white-space:nowrap] text-center" data-node="9569">Спасибо, заявка принята</p>
          <p className="self-stretch w-full max-w-[640px] text-text-primary font-['Golos_Text'] text-[20px] font-normal leading-[34px] text-center" data-node="9570">Мы получили вашу заявку и скоро свяжемся с вами, чтобы согласовать удобное время встречи.</p>
        </div>
        <div className="self-stretch min-h-[100px] w-full max-w-[640px] flex flex-col gap-space-m p-space-l items-start rounded-m bg-bg-surface relative" data-node="9571">
          <div className="self-stretch min-h-[52px] w-full max-w-[592px] flex flex-col gap-space-xs items-start relative" data-node="9572">
            <p className="self-stretch w-full max-w-[592px] text-text-secondary font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap] tracking-[0.16em] uppercase" data-node="9573">выбранный формат</p>
            <p className="self-stretch w-full max-w-[592px] text-text-heading font-['Literata'] text-[22px] font-light leading-[28px] [white-space:nowrap]" data-node="9574">Точка входа · 30 минут · $50</p>
          </div>
        </div>
        <div className="self-stretch min-h-[218px] w-full max-w-[640px] flex flex-col gap-space-m items-start relative" data-node="9575">
          <p className="self-stretch w-full max-w-[640px] text-text-secondary font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap] tracking-[0.16em] uppercase" data-node="9576">что дальше</p>
          <div className="self-stretch min-h-[50px] w-full max-w-[640px] flex flex-row gap-space-m items-start relative" data-node="9577">
            <p className="text-accent font-['Literata'] text-[22px] font-light leading-[28px] [white-space:nowrap]" data-node="9578">01</p>
            <div className="flex-1 min-h-[50px] w-full max-w-[602px] flex flex-col gap-space-xs items-start relative" data-node="9579">
              <p className="self-stretch w-full max-w-[602px] text-text-heading font-['Golos_Text'] text-[20px] font-normal leading-[27px] [white-space:nowrap]" data-node="9580">Согласуем время</p>
              <p className="self-stretch w-full max-w-[602px] text-text-secondary font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap]" data-node="9581">Напишем на email или позвоним по телефону из заявки.</p>
            </div>
          </div>
          <div className="self-stretch min-h-[50px] w-full max-w-[640px] flex flex-row gap-space-m items-start relative" data-node="9582">
            <p className="text-accent font-['Literata'] text-[22px] font-light leading-[28px] [white-space:nowrap]" data-node="9583">02</p>
            <div className="flex-1 min-h-[50px] w-full max-w-[600px] flex flex-col gap-space-xs items-start relative" data-node="9584">
              <p className="self-stretch w-full max-w-[600px] text-text-heading font-['Golos_Text'] text-[20px] font-normal leading-[27px] [white-space:nowrap]" data-node="9585">Оплата</p>
              <p className="self-stretch w-full max-w-[600px] text-text-secondary font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap]" data-node="9586">После согласования пришлём ссылку на оплату.</p>
            </div>
          </div>
          <div className="self-stretch min-h-[50px] w-full max-w-[640px] flex flex-row gap-space-m items-start relative" data-node="9587">
            <p className="text-accent font-['Literata'] text-[22px] font-light leading-[28px] [white-space:nowrap]" data-node="9588">03</p>
            <div className="flex-1 min-h-[50px] w-full max-w-[600px] flex flex-col gap-space-xs items-start relative" data-node="9589">
              <p className="self-stretch w-full max-w-[600px] text-text-heading font-['Golos_Text'] text-[20px] font-normal leading-[27px] [white-space:nowrap]" data-node="9590">Встреча</p>
              <p className="self-stretch w-full max-w-[600px] text-text-secondary font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap]" data-node="9591">Подтверждение и детали встречи придут на email.</p>
            </div>
          </div>
        </div>
        <div className="self-stretch min-h-[61px] w-full max-w-[640px] flex flex-row gap-space-l justify-center items-center relative" data-node="9592">
          <a className="w-[171px] min-h-[61px] flex flex-row gap-space-s py-space-m px-space-l justify-center items-center rounded-(--radius-s) [background:url(/assets/img-dcecf0bcc4.png)_center_/_cover] relative" data-node="9593" data-m3-link href={href('/')} aria-current={isCurrent(route, '/') ? 'page' : undefined}>
            <p className="text-text-on-image font-['Golos_Text'] text-[17px] font-normal leading-[29px] [white-space:nowrap] tracking-[0.03em]" data-node="9594">На главную</p>
            <div className="w-full max-w-[14px] min-h-[14px] flex flex-row gap-[1.43px] justify-center items-center relative" data-node="9595">
              <div className="w-[11.88px] h-[9.65px] relative" data-node="9596">
                <div className="absolute left-0 top-[3.34px] w-[5.54px] h-[2.96px] border-[1.5px] border-text-on-image" data-node="9597"></div>
                <div className="absolute left-[6.97px] top-0 w-[4.91px] h-[9.65px] rounded-[0.71px] border-[3px] border-text-on-image" data-node="9598"></div>
              </div>
            </div>
          </a>
          <div className="w-[154.86px] min-h-[29px] flex flex-row gap-space-s justify-center items-center shadow-[inset_0_-1px_0_0_var(--color-accent,_#5A5A36)] relative" data-node="9599">
            <a className="block no-underline text-accent font-['Golos_Text'] text-[17px] font-normal leading-[29px] [white-space:nowrap] tracking-[0.03em] flex flex-col justify-end" data-node="9600" data-m3-link href="booking.html">Задать вопрос</a>
            <div className="w-full max-w-[18.86px] min-h-[18.86px] flex flex-row gap-[1.93px] justify-end items-center relative" data-node="9601">
              <div className="w-[16.01px] h-[13px] relative" data-node="9602">
                <div className="absolute left-0 top-[4.5px] w-[7.46px] h-[3.99px] border-[2.02px] border-accent" data-node="9603"></div>
                <div className="absolute left-[9.39px] top-0 w-[6.62px] h-[13px] rounded-[0.96px] border-[4.04px] border-accent" data-node="9604"></div>
              </div>
            </div>
          </div>
        </div>
        <p className="self-stretch w-full max-w-[640px] text-text-secondary font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap] text-center" data-node="9605">Не видите письма? Проверьте папку «Спам» или напишите нам: hello@syntonia.com</p>
      </div>
    </div>
  );
}
