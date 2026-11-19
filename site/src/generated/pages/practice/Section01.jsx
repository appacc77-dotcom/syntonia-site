import { isCurrent, useHref, useRoute } from '../../../interactive/links.jsx'
import { HeaderDropdown } from '../../../interactive/components/HeaderDropdown.jsx'
import { HeaderBurgerMenu } from '../../../interactive/components/HeaderBurgerMenu.jsx'
// hero as React + Tailwind CSS v4. Theme: variable.export {format: "tailwind"}.
export function Section01() {
  const href = useHref()
  const route = useRoute()
  return (
    <header className="relative w-full min-h-[900px] flex flex-col py-space-4xl px-space-3xl justify-end items-start [background:url(/assets/img-009f32b962.png)_center_/_cover]" data-node="5009">
      <div className="w-[830px] min-h-[312px] flex flex-col gap-10 items-start relative" data-node="5010">
        <h1 className="text-text-on-image font-['Cormorant_Garamond'] text-[85px] font-light leading-[85px]" data-node="5011">Пространство практики<br />Syntonia</h1>
        <p className="w-full max-w-[520px] text-text-on-image font-['Golos_Text'] text-[20px] font-normal leading-[34px]" data-node="5012">Практики для самостоятельной внутренней работы, восстановления состояния и бережного движения в глубину.</p>
      </div>
      <div className="absolute left-2 top-[10px] min-h-[92px] w-full max-w-[1424px] flex flex-row justify-center items-center rounded-(--radius-l) [overflow:hidden]" data-node="5013">
        <div className="flex-1 min-h-[92px] w-full max-w-[1424px] flex flex-row gap-0 py-space-m px-space-xl justify-between items-center bg-bg-header backdrop-blur-[5px] relative" data-node="5014">
          <div className="flex-1 min-h-[34px] w-full max-w-[596.17px] flex flex-row gap-space-l items-center relative" data-node="5015">
            <HeaderDropdown route={route} nodes={['5016', '5017', '5018', '5019', '5020', '5021']} />
            <a className="text-text-on-image font-['Golos_Text'] text-[20px] font-normal leading-[34px] [white-space:nowrap]" data-node="5022" data-m3-link href={href('/quiz.html')} aria-current={isCurrent(route, '/quiz.html') ? 'page' : undefined}>Понять себя</a>
            <a className="text-text-on-image font-['Golos_Text'] text-[20px] font-normal leading-[34px] [white-space:nowrap]" data-node="5023" data-m3-link href={href('/practice.html')} aria-current={isCurrent(route, '/practice.html') ? 'page' : undefined}>Пространство практики</a>
          </div>
          <div className="w-[167.66px] h-15 relative" data-node="5024">
            <div className="absolute left-0 top-0 w-[167.83px] h-15 bg-[linear-gradient(70.33deg,_rgba(184,_134,_11,_1)_0%,_rgba(192,_144,_28,_1)_6.25%,_rgba(200,_155,_45,_1)_12.5%,_rgba(208,_165,_62,_1)_18.75%,_rgba(216,_175,_79,_1)_25%,_rgba(223,_186,_96,_1)_31.25%,_rgba(231,_196,_113,_1)_37.5%,_rgba(237,_209,_135,_1)_43.75%,_rgba(243,_222,_158,_1)_50%,_rgba(246,_230,_173,_1)_56.25%,_rgba(242,_221,_156,_1)_62.5%,_rgba(238,_211,_139,_1)_68.75%,_rgba(234,_202,_122,_1)_75%,_rgba(229,_194,_105,_1)_81.25%,_rgba(223,_188,_89,_1)_87.5%,_rgba(218,_181,_72,_1)_93.75%,_rgba(212,_175,_55,_1)_100%)]" data-node="5025"></div>
          </div>
          <div className="flex-1 min-h-[45px] w-full max-w-[596.17px] flex flex-row gap-space-m justify-end items-center relative" data-node="5026">
            <div className="w-67 min-h-[45px] flex flex-row gap-space-s items-center relative" data-node="5027">
              <div className="w-[215px] min-h-[45px] flex flex-row gap-space-s py-space-s px-space-m justify-center items-center rounded-(--radius-s) [background:url(/assets/img-dcecf0bcc4-430x90.webp)_center_/_cover] relative" data-node="5028">
                <a className="text-text-on-image font-['Golos_Text'] text-[17px] font-normal leading-[29px] [white-space:nowrap] tracking-[0.03em] uppercase" data-node="5029" data-m3-link href={href('/booking.html')} aria-current={isCurrent(route, '/booking.html') ? 'page' : undefined}>ЛИЧНАЯ ВСТРЕЧА</a>
                <div className="w-full max-w-[14px] min-h-[14px] flex flex-row gap-[1.43px] justify-center items-center relative" data-node="5030">
                  <div className="w-[11.88px] h-[9.65px] relative" data-node="5031">
                    <div className="absolute left-0 top-[3.34px] w-[5.54px] h-[2.96px] border-[1.5px] border-text-on-image" data-node="5032"></div>
                    <div className="absolute left-[6.97px] top-0 w-[4.91px] h-[9.65px] rounded-[0.71px] border-[3px] border-text-on-image" data-node="5033"></div>
                  </div>
                </div>
              </div>
              <div className="w-full max-w-[45px] min-h-[45px] flex flex-row justify-center items-center rounded-[4px] [outline:1.5px_solid_var(--color-text-on-image,_#FFFFFF)] [outline-offset:-1.5px] relative" data-node="5034">
                <div className="min-h-[20px] w-full max-w-[16.68px] flex flex-col gap-[3.04px] justify-center items-center relative" data-node="5035">
                  <div className="w-[10.13px] h-[10.13px] border-[1.57px] border-text-on-image" data-node="5036"></div>
                  <div className="w-[16.68px] h-[6.83px] border-[1.74px] border-text-on-image" data-node="5037"></div>
                </div>
              </div>
            </div>
            <HeaderBurgerMenu nodes={['5038', '5039', '5040', '5041']} />
          </div>
        </div>
        <div className="absolute [inset:0] rounded-[inherit] [pointer-events:none] shadow-[inset_0_0_0_0.5px_#8A8560]"></div>
      </div>
    </header>
  );
}
