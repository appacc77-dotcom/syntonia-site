import { isCurrent, useHref, useRoute } from '../../../interactive/links.jsx'
import { HeaderDropdown } from '../../../interactive/components/HeaderDropdown.jsx'
import { HeaderBurgerMenu } from '../../../interactive/components/HeaderBurgerMenu.jsx'
// header as React + Tailwind CSS v4. Theme: variable.export {format: "tailwind"}.
export function Section03() {
  const href = useHref()
  const route = useRoute()
  return (
    <header className="site-header relative min-h-[92px] w-full flex flex-row justify-center items-center rounded-(--radius-l) [overflow:hidden]" data-node="10581">
      <div className="site-header-inner flex-1 min-h-[92px] w-full flex flex-row gap-0 py-space-m px-space-xl justify-between items-center bg-bg-header backdrop-blur-[5px] relative" data-node="10582">
        <div className="site-header-nav flex-1 min-h-[34px] w-full max-w-[596.17px] flex flex-row gap-space-l items-center relative" data-node="10583">
          <HeaderDropdown route={route} nodes={['10584', '10585', '10586', '10587', '10588', '10589']} />
          <a className="text-text-on-image font-['Golos_Text'] text-[20px] font-normal leading-[34px] [white-space:nowrap]" data-node="10590" data-m3-link href={href('/quiz.html')} aria-current={isCurrent(route, '/quiz.html') ? 'page' : undefined}>Понять себя</a>
          <a className="text-text-on-image font-['Golos_Text'] text-[20px] font-normal leading-[34px] [white-space:nowrap]" data-node="10591" data-m3-link href={href('/practice.html')} aria-current={isCurrent(route, '/practice.html') ? 'page' : undefined}>Пространство практики</a>
        </div>
        <div className="site-header-logo w-[167.66px] h-15 relative" data-node="10592">
          <div className="absolute left-0 top-0 w-[167.83px] h-15 bg-[linear-gradient(70.33deg,_rgba(184,_134,_11,_1)_0%,_rgba(192,_144,_28,_1)_6.25%,_rgba(200,_155,_45,_1)_12.5%,_rgba(208,_165,_62,_1)_18.75%,_rgba(216,_175,_79,_1)_25%,_rgba(223,_186,_96,_1)_31.25%,_rgba(231,_196,_113,_1)_37.5%,_rgba(237,_209,_135,_1)_43.75%,_rgba(243,_222,_158,_1)_50%,_rgba(246,_230,_173,_1)_56.25%,_rgba(242,_221,_156,_1)_62.5%,_rgba(238,_211,_139,_1)_68.75%,_rgba(234,_202,_122,_1)_75%,_rgba(229,_194,_105,_1)_81.25%,_rgba(223,_188,_89,_1)_87.5%,_rgba(218,_181,_72,_1)_93.75%,_rgba(212,_175,_55,_1)_100%)]" data-node="10593"></div>
        </div>
        <div className="site-header-actions flex-1 min-h-[45px] w-full max-w-[596.17px] flex flex-row gap-space-m justify-end items-center relative" data-node="10594">
          <div className="site-header-tools w-67 min-h-[45px] flex flex-row gap-space-s items-center relative" data-node="10595">
            <div className="site-header-cta w-[215px] min-h-[45px] flex flex-row gap-space-s py-space-s px-space-m justify-center items-center rounded-(--radius-s) [background:url(/assets/img-dcecf0bcc4-430x90.webp)_center_/_cover] relative" data-node="10596">
              <a className="text-text-on-image font-['Golos_Text'] text-[17px] font-normal leading-[29px] [white-space:nowrap] tracking-[0.03em] uppercase" data-node="10597" data-m3-link href={href('/booking.html')} aria-current={isCurrent(route, '/booking.html') ? 'page' : undefined}>ЛИЧНАЯ ВСТРЕЧА</a>
              <div className="w-full max-w-[14px] min-h-[14px] flex flex-row gap-[1.43px] justify-center items-center relative" data-node="10598">
                <div className="w-[11.88px] h-[9.65px] relative" data-node="10599">
                  <div className="absolute left-0 top-[3.34px] w-[5.54px] h-[2.96px] border-[1.5px] border-text-on-image" data-node="10600"></div>
                  <div className="absolute left-[6.97px] top-0 w-[4.91px] h-[9.65px] rounded-[0.71px] border-[3px] border-text-on-image" data-node="10601"></div>
                </div>
              </div>
            </div>
            <div className="site-header-person w-full max-w-[45px] min-h-[45px] flex flex-row justify-center items-center rounded-[4px] [outline:1.5px_solid_var(--color-text-on-image,_#FFFFFF)] [outline-offset:-1.5px] relative" data-node="10602">
              <div className="min-h-[20px] w-full max-w-[16.68px] flex flex-col gap-[3.04px] justify-center items-center relative" data-node="10603">
                <div className="w-[10.13px] h-[10.13px] border-[1.57px] border-text-on-image" data-node="10604"></div>
                <div className="w-[16.68px] h-[6.83px] border-[1.74px] border-text-on-image" data-node="10605"></div>
              </div>
            </div>
          </div>
          <HeaderBurgerMenu nodes={['10606', '10607', '10608', '10609']} />
        </div>
      </div>
      <div className="absolute [inset:0] rounded-[inherit] [pointer-events:none] shadow-[inset_0_0_0_0.5px_#8A8560]"></div>
    </header>
  );
}
