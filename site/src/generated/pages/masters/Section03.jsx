import { isCurrent, useHref, useRoute } from '../../../interactive/links.jsx'
// masters-more as React + Tailwind CSS v4. Theme: variable.export {format: "tailwind"}.
export function Section03() {
  const href = useHref()
  const route = useRoute()
  return (
    <div className="relative min-h-[620px] w-full flex flex-row py-space-4xl px-6 justify-center items-start bg-[linear-gradient(246.63deg,_rgba(201,_190,_164,_1)_-13.55%,_rgba(203,_192,_167,_1)_-6.45%,_rgba(206,_195,_171,_1)_0.65%,_rgba(208,_198,_175,_1)_7.74%,_rgba(211,_201,_179,_1)_14.84%,_rgba(214,_204,_183,_1)_21.93%,_rgba(217,_207,_187,_1)_29.03%,_rgba(219,_211,_191,_1)_36.13%,_rgba(222,_214,_195,_1)_43.22%,_rgba(225,_217,_199,_1)_50.32%,_rgba(228,_220,_203,_1)_57.41%,_rgba(230,_223,_207,_1)_64.51%,_rgba(233,_226,_211,_1)_71.6%,_rgba(236,_229,_215,_1)_78.7%,_rgba(239,_232,_219,_1)_85.8%,_rgba(241,_235,_223,_1)_92.89%,_rgba(244,_238,_227,_1)_99.99%)] [overflow:hidden]" data-node="2819">
      <div className="flex-1 w-full max-w-[1280px] min-h-[428px] flex flex-row gap-space-xl items-start relative" data-node="2820">
        <div className="self-stretch w-full max-w-[296px] min-h-[428px] flex flex-col gap-space-2xl items-start relative" data-node="2821">
          <h2 className="self-stretch w-full max-w-[296px] text-text-primary font-['Literata'] text-[43px] font-light leading-[54px]" data-node="2822">Продолжить знакомство</h2>
          <div className="flex-1 self-stretch w-full max-w-[296px] h-68 text-text-deep font-['Golos_Text'] text-[17px] font-normal leading-[23px]" data-node="2823" style={{ width: '296px', boxSizing: 'border-box' }}><p style={{ margin: 0, marginTop: '0px' }}>{"Если вы пока не знаете, с чего начать, не обязательно сразу выбирать мастера."}</p><p style={{ margin: 0, marginTop: '16px' }}>{"Можно сначала понять метод, пройти диагностику состояния или познакомиться с текстами Syntonia глубже."}</p></div>
        </div>
        <div className="flex-1 self-stretch w-full max-w-[296px] min-h-[428px] flex flex-col gap-space-m pb-space-m items-start rounded-m bg-bg-page relative [overflow:hidden]" data-node="2824">
          <div className="self-stretch w-full max-w-[296px] min-h-[236px] flex flex-row justify-center items-start rounded-[var(--radius-m,_12px)_var(--radius-m,_12px)_0px_0px] [background:url(/assets/img-0d49458ee5.jpg)_-176.28px_0px_/_566.55px_236px] [overflow:hidden]" data-node="2825" role="img" aria-label="Фотография встречи Syntonia"></div>
          <a className="flex-1 self-stretch w-full max-w-[296px] min-h-[160px] flex flex-col gap-space-m px-space-m items-start relative" data-node="2826" data-m3-link href={href('/quiz.html')} aria-current={isCurrent(route, '/quiz.html') ? 'page' : undefined}>
            <h3 className="self-stretch w-full max-w-[264px] text-text-primary font-['Literata'] text-[22px] font-light leading-[28px] [white-space:nowrap]" data-node="2827">Понять, с чего начать</h3>
            <p className="flex-1 self-stretch w-full max-w-[264px] h-20 text-text-secondary font-['Golos_Text'] text-[13px] font-normal leading-[20px]" data-node="2828">Короткая диагностика поможет увидеть, какое состояние сейчас сильнее всего влияет на ваши реакции, выборы и внутренний маршрут.</p>
            <div className="w-[151px] min-h-[20px] flex flex-row gap-1 justify-center items-center relative" data-node="2829">
              <p className="text-accent font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap]" data-node="2830">Пройти диагностику</p>
              <div className="w-full max-w-[14px] min-h-[14px] flex flex-row gap-[1.43px] justify-end items-center relative" data-node="2831">
                <div className="w-[11.88px] h-[9.65px] relative" data-node="2832">
                  <div className="absolute left-0 top-[3.34px] w-[5.54px] h-[2.96px] border-[1.5px] border-accent" data-node="2833"></div>
                  <div className="absolute left-[6.97px] top-0 w-[4.91px] h-[9.65px] rounded-[0.71px] border-[3px] border-accent" data-node="2834"></div>
                </div>
              </div>
            </div>
          </a>
          <div className="absolute [inset:0] rounded-[inherit] [pointer-events:none] shadow-[inset_0_0_0_1px_#8A8560]"></div>
        </div>
        <div className="flex-1 self-stretch w-full max-w-[296px] min-h-[428px] flex flex-col gap-space-m pb-space-m items-start rounded-m bg-bg-page relative [overflow:hidden]" data-node="2835">
          <div className="self-stretch w-full max-w-[296px] min-h-[236px] flex flex-row justify-center items-start rounded-[var(--radius-m,_12px)_var(--radius-m,_12px)_0px_0px] [background:url(/assets/img-3d23575247.jpg)_center_/_cover] [overflow:hidden]" data-node="2836" role="img" aria-label="Наталья Уолс"></div>
          <a className="flex-1 self-stretch w-full max-w-[296px] min-h-[160px] flex flex-col gap-space-m px-space-m items-start relative" data-node="2837" data-m3-link href={href('/method.html')} aria-current={isCurrent(route, '/method.html') ? 'page' : undefined}>
            <h3 className="self-stretch w-full max-w-[264px] text-text-primary font-['Literata'] text-[22px] font-light leading-[28px] [white-space:nowrap]" data-node="2838">Узнать о методе</h3>
            <p className="flex-1 self-stretch w-full max-w-[264px] h-20 text-text-secondary font-['Golos_Text'] text-[13px] font-normal leading-[20px]" data-node="2839">Если вам важно понять, как работает Syntonia: почему разговор сам по себе не всегда меняет сценарий и что значит идти к источнику состояния.</p>
            <div className="w-[117px] min-h-[20px] flex flex-row gap-1 justify-center items-center relative" data-node="2840">
              <p className="text-accent font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap]" data-node="2841">Метод Syntonia</p>
              <div className="w-full max-w-[14px] min-h-[14px] flex flex-row gap-[1.43px] justify-end items-center relative" data-node="2842">
                <div className="w-[11.88px] h-[9.65px] relative" data-node="2843">
                  <div className="absolute left-0 top-[3.34px] w-[5.54px] h-[2.96px] border-[1.5px] border-accent" data-node="2844"></div>
                  <div className="absolute left-[6.97px] top-0 w-[4.91px] h-[9.65px] rounded-[0.71px] border-[3px] border-accent" data-node="2845"></div>
                </div>
              </div>
            </div>
          </a>
          <div className="absolute [inset:0] rounded-[inherit] [pointer-events:none] shadow-[inset_0_0_0_1px_#8A8560]"></div>
        </div>
        <div className="flex-1 self-stretch w-full max-w-[296px] min-h-[428px] flex flex-col gap-space-m pb-space-m items-start rounded-m bg-bg-page relative [overflow:hidden]" data-node="2846">
          <div className="self-stretch w-full max-w-[296px] min-h-[236px] flex flex-row justify-center items-start rounded-[var(--radius-m,_12px)_var(--radius-m,_12px)_0px_0px] [background:url(/assets/img-58cadf9b4b.jpg)_0.33px_-99.74px_/_296px_669.74px] [overflow:hidden]" data-node="2847" role="img" aria-label="Ангелина Гебо"></div>
          <div className="flex-1 self-stretch w-full max-w-[296px] min-h-[160px] flex flex-col gap-space-m px-space-m items-start relative" data-node="2848">
            <h3 className="self-stretch w-full max-w-[264px] text-text-primary font-['Literata'] text-[22px] font-light leading-[28px] [white-space:nowrap]" data-node="2849">Почитать глубже</h3>
            <p className="flex-1 self-stretch w-full max-w-[264px] h-20 text-text-secondary font-['Golos_Text'] text-[13px] font-normal leading-[20px]" data-node="2850">Книга, журнал и тексты Syntonia — для медленного знакомства с подходом, словами и состояниями, к которым можно возвращаться.</p>
            <div className="w-[151px] min-h-[20px] flex flex-row gap-1 justify-center items-center relative" data-node="2851">
              <a className="block no-underline text-accent font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap]" data-node="2852" data-m3-link href="library.html">Открыть библиотеку</a>
              <div className="w-full max-w-[14px] min-h-[14px] flex flex-row gap-[1.43px] justify-end items-center relative" data-node="2853">
                <div className="w-[11.88px] h-[9.65px] relative" data-node="2854">
                  <div className="absolute left-0 top-[3.34px] w-[5.54px] h-[2.96px] border-[1.5px] border-accent" data-node="2855"></div>
                  <div className="absolute left-[6.97px] top-0 w-[4.91px] h-[9.65px] rounded-[0.71px] border-[3px] border-accent" data-node="2856"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute [inset:0] rounded-[inherit] [pointer-events:none] shadow-[inset_0_0_0_1px_#8A8560]"></div>
        </div>
      </div>
    </div>
  );
}
