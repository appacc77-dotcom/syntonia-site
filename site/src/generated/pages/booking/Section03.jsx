import { isCurrent, useHref, useRoute } from '../../../interactive/links.jsx'
// footer as React + Tailwind CSS v4. Theme: variable.export {format: "tailwind"}.
export function Section03() {
  const href = useHref()
  const route = useRoute()
  return (
    <footer className="relative min-h-[361px] w-full flex flex-col pt-16 pb-6 justify-center items-center [background:linear-gradient(0deg,_rgba(58,_51,_35,_0.85),_rgba(58,_51,_35,_0.85)),_url(/assets/img-8bc9d6245a.jpg)_-0.3px_0.17px_/_2777.54px_1090.94px] shadow-[inset_0_1px_0_0_var(--color-thread,_#C9BEA4)]" data-node="8381">
      <div className="self-stretch mx-auto min-h-[273px] w-full max-w-[1280px] flex flex-col gap-space-m px-space-3xl items-start relative" data-node="8382">
        <div className="w-[713px] min-h-[220px] flex flex-row gap-24 pb-4 items-start relative" data-node="8383">
          <div className="w-69 min-h-[111px] flex flex-col gap-space-xl items-start relative" data-node="8384">
            <div className="w-[167.66px] h-15 relative" data-node="8385">
              <div className="absolute left-0 top-0 w-[167.83px] h-15 bg-[linear-gradient(70.33deg,_rgba(184,_134,_11,_1)_0%,_rgba(192,_144,_28,_1)_6.25%,_rgba(200,_155,_45,_1)_12.5%,_rgba(208,_165,_62,_1)_18.75%,_rgba(216,_175,_79,_1)_25%,_rgba(223,_186,_96,_1)_31.25%,_rgba(231,_196,_113,_1)_37.5%,_rgba(237,_209,_135,_1)_43.75%,_rgba(243,_222,_158,_1)_50%,_rgba(246,_230,_173,_1)_56.25%,_rgba(242,_221,_156,_1)_62.5%,_rgba(238,_211,_139,_1)_68.75%,_rgba(234,_202,_122,_1)_75%,_rgba(229,_194,_105,_1)_81.25%,_rgba(223,_188,_89,_1)_87.5%,_rgba(218,_181,_72,_1)_93.75%,_rgba(212,_175,_55,_1)_100%)]" data-node="8386"></div>
            </div>
            <p className="text-text-on-dark font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap]" data-node="8387">Состояние, из которого строится жизнь</p>
          </div>
          <div className="w-29 min-h-[204px] flex flex-col gap-space-l items-start relative" data-node="8388">
            <p className="text-text-on-dark font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap] tracking-[0.16em] uppercase" data-node="8389">навигация</p>
            <div className="w-29 min-h-[160px] flex flex-col gap-space-s items-start relative" data-node="8390">
              <a className="text-text-on-dark font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap]" data-node="8391" data-m3-link href={href('/')} aria-current={isCurrent(route, '/') ? 'page' : undefined}>О проекте</a>
              <a className="text-text-on-dark font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap]" data-node="8392" data-m3-link href={href('/practice.html')} aria-current={isCurrent(route, '/practice.html') ? 'page' : undefined}>Практики</a>
              <a className="text-text-on-dark font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap]" data-node="8393" data-m3-link href={href('/library.html')} aria-current={isCurrent(route, '/library.html') ? 'page' : undefined}>Библиотека</a>
              <a className="text-text-on-dark font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap]" data-node="8394" data-m3-link href={href('/#formats')}>Форматы работы</a>
              <a className="text-text-on-dark font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap]" data-node="8395" data-m3-link href={href('/#voices')} aria-current={isCurrent(route, '/#voices') ? 'page' : undefined}>Отзывы</a>
              <a className="text-text-on-dark font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap]" data-node="8396" data-m3-link href={href('/not-found.html')}>Вопросы и ответы</a>
            </div>
          </div>
          <div className="w-[129px] min-h-[148px] flex flex-col gap-space-l items-start relative" data-node="8397">
            <p className="text-text-on-dark font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap] tracking-[0.16em] uppercase" data-node="8398">контакты</p>
            <div className="w-[129px] min-h-[104px] flex flex-col gap-space-s items-start relative" data-node="8399">
              <a className="block no-underline text-text-on-dark font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap]" data-node="8400" data-m3-link href={href('/not-found.html')}>Telegram</a>
              <a className="block no-underline text-text-on-dark font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap]" data-node="8401" data-m3-link href={href('/not-found.html')}>Instagram</a>
              <a className="block no-underline text-text-on-dark font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap]" data-node="8402" data-m3-link href={href('/not-found.html')}>YouTube</a>
              <p className="text-text-on-dark font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap]" data-node="8403">hello@syntonia.com</p>
            </div>
          </div>
        </div>
        <div className="self-stretch w-full max-w-[1152px] h-[1px] bg-thread" data-node="8404"></div>
        <div className="self-stretch min-h-[20px] w-full max-w-[1152px] flex flex-row gap-[10px] justify-between items-start relative" data-node="8405">
          <p className="text-text-on-dark font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap]" data-node="8406">© Syntonia, 2026</p>
          <div className="w-[833px] min-h-[20px] flex flex-row gap-space-l items-center relative" data-node="8407">
            <a className="text-text-on-dark font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap]" data-node="8408" data-m3-link href={href('/legal-terms.html')} aria-current={isCurrent(route, '/legal-terms.html') ? 'page' : undefined}>Условия использования и продажи</a>
            <a className="text-text-on-dark font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap]" data-node="8409" data-m3-link href={href('/legal-privacy.html')} aria-current={isCurrent(route, '/legal-privacy.html') ? 'page' : undefined}>Политика конфиденциальности</a>
            <a className="text-text-on-dark font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap]" data-node="8410" data-m3-link href={href('/legal-refund.html')} aria-current={isCurrent(route, '/legal-refund.html') ? 'page' : undefined}>Политика возвратов</a>
            <a className="text-text-on-dark font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap]" data-node="8411" data-m3-link href={href('/legal-consent.html')} aria-current={isCurrent(route, '/legal-consent.html') ? 'page' : undefined}>Согласия</a>
            <p className="text-text-on-dark font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap]" data-node="8412">Настройки cookie</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
