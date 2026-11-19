// faq as React + Tailwind CSS v4. Theme: variable.export {format: "tailwind"}.
import { useHref } from '../../interactive/links.jsx'
import { Accordion } from '../../interactive/components/Accordion.jsx'
import { FAQ_ITEMS } from '../../interactive/content/faq.js'

export function Section13() {
  const href = useHref()
  return (
    <div id="faq" className="relative w-full min-h-[807px] flex flex-col py-space-5xl px-6 items-center [background:url(/assets/filt-b0fb60371c-0371c61-4d7e86b1.png)_center_/_cover] [overflow:hidden]" data-node="1273">
      <div className="self-stretch mx-auto min-h-[511px] w-full max-w-[1280px] flex flex-row gap-space-2xl items-start relative" data-node="1274">
        <div className="self-stretch w-full max-w-[397px] min-h-[511px] flex flex-col gap-16 items-start relative" data-node="1275">
          <div className="self-stretch min-h-[402px] w-full max-w-[397px] flex flex-col gap-12 items-start relative" data-node="1276">
            <div className="w-84 min-h-[286px] flex flex-col items-start relative" data-node="1277">
              <h2 className="w-full max-w-[208px] text-text-heading font-['Literata'] text-[48px] font-light leading-[60px] flex flex-col justify-end" data-node="1278">То, что важно ПОНЯТЬ</h2>
              <div className="w-84 min-h-[106px] flex flex-row pl-40 items-center relative" data-node="1279">
                <h2 className="w-full max-w-[176px] text-text-heading font-['Literata'] text-[42px] font-light leading-[53px] flex flex-col justify-end" data-node="1280">перед началом</h2>
              </div>
            </div>
            <p className="self-stretch w-full max-w-[397px] text-text-deep font-['Golos_Text'] text-[20px] font-normal leading-[34px] flex flex-col justify-end" data-node="1281">О том, как внутренняя работа начинает менять состояние и саму жизнь</p>
          </div>
          <a className="block no-underline w-[182px] min-h-[45px] flex flex-row gap-space-s py-space-s px-space-m justify-center items-center rounded-(--radius-s) [background:url(/assets/img-dcecf0bcc4.png)_center_/_cover] relative" data-node="1282" data-m3-link href={href('/booking.html')}>
            <p className="text-text-on-image font-['Golos_Text'] text-[17px] font-normal leading-[29px] [white-space:nowrap] tracking-[0.03em]" data-node="1283">Задать вопрос</p>
            <div className="w-full max-w-[14px] min-h-[14px] flex flex-row gap-[1.43px] justify-center items-center relative" data-node="1284">
              <div className="w-[11.88px] h-[9.65px] relative" data-node="1285">
                <div className="absolute left-0 top-[3.34px] w-[5.54px] h-[2.96px] border-[1.5px] border-text-on-image" data-node="1286"></div>
                <div className="absolute left-[6.97px] top-0 w-[4.91px] h-[9.65px] rounded-[0.71px] border-[3px] border-text-on-image" data-node="1287"></div>
              </div>
            </div>
          </a>
        </div>
        <div className="flex-1 min-h-[511px] w-full max-w-[835px] flex flex-col gap-space-m items-start relative" data-node="1288">
          <Accordion items={FAQ_ITEMS} />
        </div>
      </div>
    </div>
  );
}
