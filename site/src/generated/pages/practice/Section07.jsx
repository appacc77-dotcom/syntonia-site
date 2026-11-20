// info-section as React + Tailwind CSS v4. Theme: variable.export {format: "tailwind"}.
import { useState } from 'react'

export function Section07() {
  // «С заботой о тебе»: заголовок сворачивает/разворачивает список рекомендаций (full-list)
  const [open, setOpen] = useState(true)
  return (
    <div className="relative min-h-[952px] w-full flex flex-col gap-space-2xl py-space-3xl items-center [background:url(/assets/img-2ccc5d8c32.png)_-2653.63px_-106.3px_/_4184.36px_1406.95px] [overflow:hidden]" data-node="5790">
      <div className="min-h-[197px] w-full max-w-[1280px] flex flex-col gap-4 py-space-m items-center relative" data-node="5791">
        <h2 className="text-bg-inverse font-['Literata'] text-[65px] font-light leading-[81px] [white-space:nowrap]" data-node="5792">Бережная практика</h2>
        <p className="text-bg-inverse font-['Golos_Text'] text-[20px] font-normal leading-[34px]" data-node="5793">Перед началом уделите минуту своему состоянию. Практику можно остановить в любой момент — ориентируйтесь <br />на своё самочувствие и не продолжайте через сильное напряжение.</p>
      </div>
      <div className="self-stretch mx-auto w-full max-w-[1280px] flex flex-col p-[1px] items-start rounded-(--radius-s) relative [overflow:hidden] transition-[min-height] duration-300 ease-out motion-reduce:transition-none" style={{ minHeight: open ? '579px' : '253px' }} data-node="5794">
        <div
          className="self-stretch min-h-[119px] w-full max-w-[1278px] flex flex-row gap-4 pt-6 pr-6 pb-[25px] pl-6 justify-between items-center bg-bg-practice shadow-[inset_0_-1px_0_0_var(--color-accent-muted,_#8A8560)] relative cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
          data-node="5795"
          role="button"
          tabIndex={0}
          aria-expanded={open}
          aria-controls="practice-info-full-list"
          aria-label={open ? 'Свернуть рекомендации «С заботой о тебе»' : 'Развернуть рекомендации «С заботой о тебе»'}
          onClick={() => setOpen((value) => !value)}
          onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setOpen((value) => !value) } }}
        >
          <div className="w-[349px] min-h-[70px] flex flex-row gap-4 items-center relative" data-node="5796">
            <p className="w-full max-w-[42px] h-[55px] text-accent font-['Great_Vibes'] text-[55px] font-normal leading-[69px] [white-space:nowrap]" data-node="5797">01</p>
            <div className="w-[1px] h-[70px] bg-accent-muted" data-node="5798"></div>
            <p className="text-text-primary font-['Literata'] text-[35px] font-light leading-[41px] [white-space:nowrap]" data-node="5799">С заботой о тебе</p>
          </div>
          <div className="w-[25.18px] min-h-[25.18px] flex flex-col items-start relative" data-node="5800">
            <div className={`w-[25.18px] min-h-[25.18px] flex flex-col items-start origin-top-left relative transition-transform duration-300 ease-out motion-reduce:transition-none ${open ? 'rotate-[-180deg]' : 'rotate-0'}`} data-node="5801">
              <div className="w-full max-w-[25.18px] min-h-[25.18px] flex flex-row gap-[2.57px] justify-center items-center rotate-[90deg] origin-top-left relative" data-node="5802">
                <div className="w-[21.37px] h-[17.35px] relative" data-node="5803">
                  <div className="absolute left-0 top-[6.01px] w-[9.96px] h-[5.33px] border-[2.7px] border-accent" data-node="5804"></div>
                  <div className="absolute left-[12.53px] top-0 w-[8.84px] h-[17.35px] rounded-[1.29px] border-[5.4px] border-accent" data-node="5805"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          id="practice-info-full-list"
          aria-hidden={!open}
          className="self-stretch w-full max-w-[1278px] grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none"
          style={{ gridTemplateRows: open ? '1fr' : '0fr', opacity: open ? 1 : 0 }}
        >
        <div className="min-h-0 [overflow:hidden]"><div className="self-stretch min-h-[326px] w-full max-w-[1278px] flex flex-col p-space-l items-start bg-[rgba(251,_248,_241,_0.55)] relative" data-node="5806">
          <div className="w-[1163px] min-h-[278px] flex flex-col gap-[10px] items-start relative" data-node="5807">
            <div className="text-text-primary font-['Golos_Text'] text-[20px] font-normal leading-[34px]" data-node="5808" style={{ width: '1163px', boxSizing: 'border-box' }}><ul style={{ listStyle: 'none', margin: 0, padding: 0 }}><li style={{ position: 'relative', paddingLeft: '31.6px' }}><span aria-hidden="true" style={{ position: 'absolute', left: '12.6px' }}>•</span><span style={{ whiteSpace: 'nowrap' }}>{"Перед началом оцени своё состояние по шкале 0–10. Если напряжение выше 6/10 — отложи практику или сделай "}</span><br /><span style={{ whiteSpace: 'nowrap' }}>{"её с поддержкой."}</span></li></ul></div>
            <div className="text-text-primary font-['Golos_Text'] text-[20px] font-normal leading-[34px] [white-space:nowrap]" data-node="5809" style={{ width: '683px', boxSizing: 'border-box' }}><ul style={{ listStyle: 'none', margin: 0, padding: 0 }}><li style={{ position: 'relative', paddingLeft: '31.6px' }}><span aria-hidden="true" style={{ position: 'absolute', left: '12.6px' }}>•</span><span style={{ whiteSpace: 'nowrap' }}>{"Поставь мягкий таймер на 10–15 минут, держи рядом воду и плед."}</span></li></ul></div>
            <div className="text-text-primary font-['Golos_Text'] text-[20px] font-normal leading-[34px] [white-space:nowrap]" data-node="5810" style={{ width: '779px', boxSizing: 'border-box' }}><ul style={{ listStyle: 'none', margin: 0, padding: 0 }}><li style={{ position: 'relative', paddingLeft: '31.6px' }}><span aria-hidden="true" style={{ position: 'absolute', left: '12.6px' }}>•</span><span style={{ whiteSpace: 'nowrap' }}>{"Сообщи близкому, что ты в практике, или договорись о «якоре поддержки»"}</span></li></ul></div>
            <div className="text-text-primary font-['Golos_Text'] text-[20px] font-normal leading-[34px] [white-space:nowrap]" data-node="5811" style={{ width: '1084px', boxSizing: 'border-box' }}><ul style={{ listStyle: 'none', margin: 0, padding: 0 }}><li style={{ position: 'relative', paddingLeft: '31.6px' }}><span aria-hidden="true" style={{ position: 'absolute', left: '12.6px' }}>•</span><span style={{ whiteSpace: 'nowrap' }}>{"Если в процессе становится хуже — остановись, открой глаза, сделай три длинных выдоха и сделай паузу."}</span></li></ul></div>
            <div className="text-text-primary font-['Golos_Text'] text-[20px] font-normal leading-[34px]" data-node="5812" style={{ width: '1110px', boxSizing: 'border-box' }}><ul style={{ listStyle: 'none', margin: 0, padding: 0 }}><li style={{ position: 'relative', paddingLeft: '31.6px' }}><span aria-hidden="true" style={{ position: 'absolute', left: '12.6px' }}>•</span><span style={{ whiteSpace: 'nowrap' }}>{"Если у тебя есть диагнозы, влияющие на психику, выраженная тревога/депрессия, частые флэшбэки или ты "}</span><br /><span style={{ whiteSpace: 'nowrap' }}>{"принимаешь психотропные препараты — выполняй практики только с поддержкой специалиста."}</span></li></ul></div>
          </div>
        </div>
        </div>
        </div>
        <div className="self-stretch min-h-[132px] w-full max-w-[1278px] flex flex-row gap-4 pt-[25px] pr-6 pb-6 pl-6 justify-between items-center shadow-[inset_0_1px_0_0_var(--color-accent-muted,_#8A8560)] relative" data-node="5813">
          <div className="w-[861px] min-h-[83px] flex flex-row gap-4 items-center relative" data-node="5814">
            <p className="w-full max-w-[51px] h-[55px] text-accent font-['Great_Vibes'] text-[55px] font-normal leading-[69px] [white-space:nowrap]" data-node="5815">02</p>
            <div className="w-[1px] h-[70px] bg-accent-muted" data-node="5816"></div>
            <div className="w-[777px] min-h-[83px] flex flex-col gap-space-s justify-center items-start relative" data-node="5817">
              <p className="text-text-primary font-['Literata'] text-[35px] font-light leading-[41px] [white-space:nowrap]" data-node="5818">SOS-алгоритм</p>
              <p className="text-text-primary font-['Golos_Text'] text-[20px] font-normal leading-[34px] [white-space:nowrap]" data-node="5819">Короткий SOS-алгоритм, чтобы вернуться в контакт с собой и пространством.</p>
            </div>
          </div>
          <div className="w-[25.61px] min-h-[25.61px] flex flex-row items-start relative" data-node="5820">
            <div className="w-full max-w-[25.61px] min-h-[25.61px] flex flex-row gap-[2.61px] justify-center items-center rotate-[90deg] origin-top-left relative" data-node="5821">
              <div className="w-[21.73px] h-[17.65px] relative" data-node="5822">
                <div className="absolute left-0 top-[6.12px] w-[10.13px] h-[5.42px] border-[2.74px] border-accent" data-node="5823"></div>
                <div className="absolute left-[12.75px] top-0 w-[8.99px] h-[17.65px] rounded-[1.31px] border-[5.49px] border-accent" data-node="5824"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute [inset:0] rounded-[inherit] [pointer-events:none] shadow-[inset_0_0_0_1px_#8A8560]"></div>
      </div>
    </div>
  );
}
