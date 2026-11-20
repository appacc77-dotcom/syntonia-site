import { useState } from 'react'
import { QUIZ } from '../content/quiz.js'

// QuizWizard: интерактив поверх точной разметки Figma-состояния quiz-q1.
// Классы и data-node взяты из codegen (baseline), поэтому default-состояние
// совпадает с golden; интерактив меняет только выбранную опцию/вопрос/прогресс.
const BUTTON_PREV = 'w-[65px] min-h-[19px] flex flex-row gap-2 items-center relative [overflow:hidden] cursor-pointer'
const BUTTON_NEXT = 'w-[129px] min-h-[27px] flex flex-row gap-space-s py-space-xs px-space-xl items-center rounded-(--radius-s) bg-accent relative [overflow:hidden] cursor-pointer'
const OPTION_ROW = 'self-stretch min-h-[36.5px] w-full max-w-[576px] flex flex-row gap-space-s p-[8.75px] items-center rounded-(--radius-s) relative'
const OPTION_INNER = 'flex-1 min-h-[19px] w-full max-w-[558.5px] flex flex-row gap-2 items-center relative'
const RADIO = 'w-[11.583px] h-[11.583px] flex flex-row items-center justify-center rounded-[137.76px] bg-bg-page [border:0.138px_solid_var(--color-accent,_#5A5A36)] relative shrink-0'
const OPTION_TEXT = "flex-1 w-full max-w-[538.92px] text-text-primary font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap]"
// data-node квиз-состояния q1 из codegen (для contract-ворот)
const IDS = {
  rows: [5983, 5988, 5992, 5996, 6000, 6004, 6008],
  inner: [5984, 5989, 5993, 5997, 6001, 6005, 6009],
  dots: [5985, 5990, 5994, 5998, 6002, 6006, 6010],
  texts: [5987, 5991, 5995, 5999, 6003, 6007, 6011],
}

export function QuizWizard() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(() => QUIZ.map(() => 0))
  const [result, setResult] = useState(false)
  const current = QUIZ[step]
  const progress = Math.round((step / QUIZ.length) * 100)
  const select = (index) => setAnswers((prev) => prev.map((value, i) => i === step ? index : value))
  if (result) {
    return (
      <div className="w-[640px] min-h-[618.5px] flex flex-col gap-6 items-center relative [overflow:hidden]">
        <div className="w-[640px] min-h-[618.5px] flex flex-col gap-4 items-center relative">
          <div className="w-72 min-h-[69px] flex flex-col gap-2 items-center relative">
            <p className="text-accent font-['Golos_Text'] text-[24px] font-normal leading-[41px] [white-space:nowrap] uppercase">Тест состояния</p>
            <p className="text-text-primary font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap] text-center">Спасибо, тест пройден. Ответы не отправлены на сервер — это демонстрационный режим.</p>
          </div>
          <div className="min-h-[497.5px] w-full max-w-[640px] flex flex-col p-8 gap-4 items-start rounded-[16px] bg-bg-page relative [overflow:hidden]">
            <p className="text-text-heading font-['Literata'] text-[22px] font-light leading-[28px]">Рекомендация по результату появится после подключения логики подбора.</p>
            <div className={BUTTON_NEXT} role="button" tabIndex={0} onClick={() => { setAnswers(QUIZ.map(() => 0)); setStep(0); setResult(false) }}>
              <p className="text-text-on-image font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap]">Пройти заново</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="w-[640px] min-h-[618.5px] flex flex-col gap-6 items-center relative [overflow:hidden]" data-node="5952">
      <div className="w-[640px] min-h-[618.5px] flex flex-col gap-4 items-center relative" data-node="5953">
        <div className="w-72 min-h-[69px] flex flex-col gap-2 items-center relative" data-node="5954">
          <h1 className="text-accent font-['Golos_Text'] text-[24px] font-normal leading-[41px] [white-space:nowrap] uppercase" data-node="5955">Тест состояния</h1>
          <p className="text-text-primary font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap] text-center" data-node="5956">Отвечай так, как чувствуешь именно сейчас.</p>
        </div>
        <div className="w-[492.19px] min-h-[20px] flex flex-row gap-6 justify-center items-center relative" data-node="5957">
          <div className="w-[74.36px] min-h-[20px] flex flex-row gap-1 items-center relative" data-node="5958">
            <div className="w-[10.36px] h-[11.02px] relative" data-node="5959"><div className="absolute left-0 top-0 w-[10.36px] h-[11.02px] bg-accent" data-node="5960"></div></div>
            <p className="text-text-deep font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap] text-center" data-node="5961">3 минуты</p>
          </div>
          <div className="w-[94.6px] min-h-[20px] flex flex-row gap-1 items-center relative" data-node="5962">
            <div className="w-[17.6px] h-2 relative" data-node="5963"><div className="absolute left-0 top-0 w-[17.6px] h-2 bg-accent" data-node="5964"></div></div>
            <p className="text-text-deep font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap] text-center" data-node="5965">9 вопросов</p>
          </div>
          <div className="w-[275.23px] min-h-[20px] flex flex-row gap-1 items-center relative" data-node="5966">
            <div className="w-[14.23px] h-[14px] relative" data-node="5967"><div className="absolute left-0 top-0 w-[14.23px] h-[14px] bg-accent" data-node="5968"></div></div>
            <p className="text-text-deep font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap] text-center" data-node="5969">твой текущий код и практика в подарок</p>
          </div>
        </div>
        <div className="min-h-[497.5px] w-full max-w-[640px] flex flex-row p-8 justify-center items-start rounded-[16px] bg-bg-page relative [overflow:hidden]" data-node="5970">
          <div className="flex-1 min-h-[433.5px] w-full max-w-[576px] flex flex-col gap-2 items-start relative [overflow:hidden]" data-node="5971">
            <div className="self-stretch min-h-[31px] w-full max-w-[576px] flex flex-row gap-8 items-start relative" data-node="5972">
              <div className="flex-1 min-h-[31px] w-full max-w-[576px] flex flex-col gap-2 items-start relative [overflow:hidden]" data-node="5973">
                <div className="self-stretch min-h-[20px] w-full max-w-[576px] flex flex-row justify-between items-start relative" data-node="5974">
                  <p className="text-text-secondary font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap]" data-node="5975">Вопрос {step + 1} из {QUIZ.length}</p>
                  <p className="text-text-primary font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap]" data-node="5976">{progress}% пройдено</p>
                </div>
                <div className="self-stretch w-[576px] h-[3px] rounded-[16px] bg-border" data-node="5977">
                  {step > 0 ? <div className="h-full rounded-[16px] bg-accent" style={{ width: `${progress}%` }} /> : null}
                </div>
              </div>
            </div>
            <div className="self-stretch min-h-[394.5px] w-full max-w-[576px] flex flex-col gap-4 items-start relative" data-node="5979">
              <div className="self-stretch min-h-[56px] w-full max-w-[576px] flex flex-row justify-center items-center relative" data-node="5980">
                <p className="flex-1 w-full max-w-[576px] text-text-heading font-['Literata'] text-[22px] font-light leading-[28px]" data-node="5981">{current.question}</p>
              </div>
              <div className="self-stretch min-h-[279.5px] w-full max-w-[576px] flex flex-col gap-1 items-start relative" data-node="5982" role="radiogroup" aria-label={`Вопрос ${step + 1}`}>
                {current.options.map((label, index) => {
                  const selected = answers[step] === index
                  return (
                    <div
                      key={label}
                      className={`${OPTION_ROW} ${selected ? 'bg-bg-selected' : ''}`}
                      data-node={String(IDS.rows[index])}
                      role="radio"
                      aria-checked={selected}
                      tabIndex={0}
                      onClick={() => select(index)}
                      onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(index) } }}
                    >
                      <div className={OPTION_INNER} data-node={String(IDS.inner[index])}>
                        <div className={RADIO} data-node={String(IDS.dots[index])}>
                          {selected ? <div className="w-[6.895px] h-[6.895px] rounded-full bg-accent"></div> : null}
                        </div>
                        <p className={OPTION_TEXT} data-node={String(IDS.texts[index])}>{label}</p>
                      </div>
                      <div className="absolute [inset:0] rounded-[inherit] [pointer-events:none] shadow-[inset_0_0_0_0.75px_var(--color-thread,_#C9BEA4)]"></div>
                    </div>
                  )
                })}
              </div>
              <div className="self-stretch min-h-[27px] w-full max-w-[576px] flex flex-row gap-1 justify-between items-center relative" data-node="6012">
                <div className={BUTTON_PREV} role="button" tabIndex={0} aria-label="Назад" onClick={() => setStep((value) => Math.max(0, value - 1))} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setStep((value) => Math.max(0, value - 1)) } }}>
                  <div className="w-full max-w-[14px] min-h-[14px] flex flex-row gap-[1.43px] justify-center items-center relative" data-node="6014" aria-hidden="true">
                    <div className="w-[11.88px] h-[9.65px] rotate-[-180deg] origin-top-left relative" data-node="6015">
                      <div className="absolute left-0 top-[3.34px] w-[5.54px] h-[2.96px] border-[1.5px] border-accent" data-node="6016"></div>
                      <div className="absolute left-[6.97px] top-0 w-[4.91px] h-[9.65px] rounded-[0.71px] border-[3px] border-accent" data-node="6017"></div>
                    </div>
                  </div>
                  <p className="text-accent font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap]" data-node="6018">Назад</p>
                </div>
                <div className={BUTTON_NEXT} role="button" tabIndex={0} aria-label="Далее" data-node="6019" onClick={() => { if (step === QUIZ.length - 1) setResult(true); else setStep((value) => value + 1) }} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); if (step === QUIZ.length - 1) setResult(true); else setStep((value) => value + 1) } }}>
                  <p className="text-text-on-image font-['Golos_Text'] text-[14px] font-normal leading-[19px] [white-space:nowrap]" data-node="6020">Далее</p>
                  <div className="w-full max-w-[14px] min-h-[14px] flex flex-row gap-[1.43px] justify-center items-center relative" data-node="6021" aria-hidden="true">
                    <div className="w-[11.88px] h-[9.65px] relative" data-node="6022">
                      <div className="absolute left-0 top-[3.34px] w-[5.54px] h-[2.96px] border-[1.5px] border-text-on-image" data-node="6023"></div>
                      <div className="absolute left-[6.97px] top-0 w-[4.91px] h-[9.65px] rounded-[0.71px] border-[3px] border-text-on-image" data-node="6024"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
