/**
 * Форма заявки на booking: семантические поля, клиентская валидация, honeypot и отправка.
 *
 * Канал доставки задаётся в site/data/form-config.json (endpoint). Пока endpoint не задан,
 * форма валидирует ввод и показывает статус «канал не подключён» — данные никуда не уходят.
 * Компонент заменяет статический блок из кодогенерации (data-node="8337"…"8380"), сохраняя
 * разметку и классы один-в-один, чтобы пиксельная сверка с Figma не менялась.
 */
import { useRef, useState } from 'react'
import { useHref } from '../links.jsx'
import formConfig from '../../../data/form-config.json'

const LABEL = "text-text-primary font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap] tracking-[0.16em] uppercase"
const HINT = "text-text-secondary font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap]"
const FIELD_BOX = 'self-stretch min-h-[54px] w-full max-w-[607.5px] flex flex-row p-[17px] items-start rounded-(--radius-s) relative [overflow:hidden]'
const FIELD_INPUT = "w-full bg-transparent border-0 outline-none p-0 m-0 text-text-primary font-['Golos_Text'] text-[13px] font-normal leading-[20px] placeholder:text-text-secondary"
// input лежит абсолютно поверх видимого placeholder-<p> (его геометрию меряет contract-гейт),
// поэтому паддинг повторяет padding контейнера и совпадает с текстом 1:1, пока поле пустое
const FIELD_OVERLAY = "absolute inset-0 z-[2] w-full h-full bg-transparent border-0 outline-none m-0 text-text-primary font-['Golos_Text'] text-[13px] font-normal leading-[20px] peer focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
const DOT = 'w-[3px] h-[3px] rounded-full bg-text-heading'
const FRAME = 'absolute [inset:0] rounded-[inherit] [pointer-events:none] shadow-[inset_0_0_0_1px_#8A8560]'
const ERROR = 'absolute left-0 -bottom-[21px] text-[12px] leading-[16px] text-[#9B3B2E]'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^[+()\d\s-]{7,25}$/

export function BookingForm() {
  const href = useHref()
  const [values, setValues] = useState({ name: '', email: '', phone: '', comment: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ kind: 'idle', text: '' })
  const formRef = useRef(null)

  const set = (field) => (event) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }))
    setErrors((prev) => (prev[field] ? { ...prev, [field]: '' } : prev))
    if (status.kind !== 'idle') setStatus({ kind: 'idle', text: '' })
  }

  const validate = () => {
    const next = {}
    if (values.name.trim().length < 2) next.name = 'Напишите, как к вам обращаться'
    if (!EMAIL_RE.test(values.email.trim())) next.email = 'Проверьте адрес электронной почты'
    if (values.phone.trim() && !PHONE_RE.test(values.phone.trim())) next.phone = 'Проверьте номер телефона'
    if (values.comment.length > 2000) next.comment = 'Не больше 2000 символов'
    return next
  }

  // выбранный на странице формат (узел «Выбранный формат» меняется карточками/слайдером)
  const selectedFormat = () => {
    if (!formConfig.formatNode) return ''
    const node = document.querySelector(`[data-node="${formConfig.formatNode}"]`)
    return node ? node.textContent.trim() : ''
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length) {
      setStatus({ kind: 'error', text: 'Проверьте выделенные поля' })
      const first = formRef.current?.querySelector('[aria-invalid="true"]')
      if (first) first.focus()
      return
    }
    // honeypot: заполненное скрытое поле — бот; тихо «успех», но ничего не отправляем
    const trap = formRef.current?.querySelector('[name="company"]')
    if (trap && trap.value) {
      setStatus({ kind: 'success', text: '' })
      return
    }
    if (!formConfig.endpoint) {
      // временный канал до согласования: готовое письмо в почтовом клиенте
      const email = formConfig.fallbackEmail || ''
      const subject = encodeURIComponent('Заявка с сайта Syntonia — booking')
      const body = encodeURIComponent([
        `Имя: ${values.name.trim()}`,
        `Email: ${values.email.trim()}`,
        `Телефон: ${values.phone.trim() || '—'}`,
        `Формат: ${selectedFormat() || formConfig.format || '—'}`,
        `Комментарий: ${values.comment.trim() || '—'}`,
        '',
        'Отправлено с формы booking сайта Syntonia.',
      ].join('\n'))
      const mailto = `mailto:${email}?subject=${subject}&body=${body}`
      setStatus({ kind: 'mailto', text: `Открываем почтовый клиент — письмо на ${email}`, mailto, email })
      window.location.href = mailto
      return
    }
    setStatus({ kind: 'sending', text: 'Отправляем…' })
    try {
      const response = await fetch(formConfig.endpoint, {
        method: formConfig.method || 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          comment: values.comment.trim(),
          format: selectedFormat() || formConfig.format || '',
          page: 'booking',
          _subject: 'Заявка с сайта Syntonia',
        }),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      setStatus({ kind: 'success', text: 'Спасибо! Заявка отправлена.' })
      window.location.assign(href(formConfig.successRoute || '/thanks-booking.html'))
    } catch {
      setStatus({ kind: 'error', text: 'Не удалось отправить. Проверьте связь и попробуйте ещё раз.' })
    }
  }

  const invalid = (field) => (errors[field] ? { 'aria-invalid': 'true', 'aria-describedby': `err-${field}` } : {})

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate
      className="self-stretch min-h-[814px] w-full max-w-[607.5px] flex flex-col gap-6 items-start relative" data-node="8337"
      data-m3-form="booking">
      {/* honeypot */}
      <div className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
        <label>Не заполняйте это поле <input name="company" type="text" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div className="self-stretch min-h-[90px] w-full max-w-[607.5px] flex flex-col gap-space-m items-start relative" data-node="8338">
        <div className="w-[46px] min-h-[20px] flex flex-row gap-space-s items-start relative" data-node="8339">
          <label htmlFor="booking-name" className={LABEL} data-node="8340">Имя</label>
          <div className={DOT} data-node="8341"></div>
        </div>
        <div className={FIELD_BOX} data-node="8343">
          <input id="booking-name" name="name" type="text" autoComplete="name" required maxLength={80}
            aria-label="Имя — как к вам обращаться" className={FIELD_OVERLAY}
            value={values.name} onChange={set('name')} {...invalid('name')} />
          <p className={`${HINT} ${values.name ? 'invisible' : ''}`} data-node="8344" aria-hidden="true" data-a11y-dup="1">Как к вам обращаться</p>
          {errors.name ? <span id="err-name" className={ERROR} role="alert">{errors.name}</span> : null}
          <div className={FRAME}></div>
        </div>
      </div>

      <div className="self-stretch min-h-[90px] w-full max-w-[607.5px] flex flex-col gap-space-m items-start relative" data-node="8345">
        <div className="w-[59px] min-h-[20px] flex flex-row gap-space-s items-start relative" data-node="8346">
          <label htmlFor="booking-email" className={LABEL} data-node="8347">Email</label>
          <div className={DOT} data-node="8348"></div>
        </div>
        <div className={FIELD_BOX} data-node="8350">
          <input id="booking-email" name="email" type="email" autoComplete="email" required maxLength={120}
            aria-label="Email" className={FIELD_OVERLAY}
            value={values.email} onChange={set('email')} {...invalid('email')} />
          <p className={`${HINT} ${values.email ? 'invisible' : ''}`} data-node="8351" aria-hidden="true" data-a11y-dup="1">ваш@email.com</p>
          {errors.email ? <span id="err-email" className={ERROR} role="alert">{errors.email}</span> : null}
          <div className={FRAME}></div>
        </div>
      </div>

      <div className="self-stretch min-h-[90px] w-full max-w-[607.5px] flex flex-col gap-space-m items-start relative" data-node="8352">
        <div className="w-22 min-h-[20px] flex flex-row gap-space-s items-start relative" data-node="8353">
          <label htmlFor="booking-phone" className={LABEL} data-node="8354">Телефон</label>
          <div className={DOT} data-node="8355"></div>
        </div>
        <div className={FIELD_BOX} data-node="8357">
          <input id="booking-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={25}
            aria-label="Телефон" className={FIELD_OVERLAY}
            value={values.phone} onChange={set('phone')} {...invalid('phone')} />
          <p className={`${HINT} ${values.phone ? 'invisible' : ''}`} data-node="8358" aria-hidden="true" data-a11y-dup="1">+1 (___) ___ ___ ___</p>
          {errors.phone ? <span id="err-phone" className={ERROR} role="alert">{errors.phone}</span> : null}
          <div className={FRAME}></div>
        </div>
      </div>

      <div className="self-stretch min-h-[122px] w-full max-w-[607.5px] flex flex-col gap-space-m items-start relative" data-node="8359">
        <div className="w-[237px] min-h-[20px] flex flex-row gap-space-s items-start relative" data-node="8360">
          <label htmlFor="booking-comment" className={LABEL} data-node="8361">комментарий</label>
          <p className={HINT} data-node="8363">ОПЦИОНАЛЬНО</p>
        </div>
        <div className="self-stretch min-h-[86px] w-full max-w-[607.5px] flex flex-row pt-[17px] pr-[17px] pb-[49px] pl-[17px] items-start rounded-(--radius-s) relative [overflow:hidden]" data-node="8364">
          <textarea id="booking-comment" name="comment" rows={2} maxLength={2000}
            aria-label="Комментарий — что важно знать заранее" className={`${FIELD_OVERLAY} resize-none`}
            value={values.comment} onChange={set('comment')} {...invalid('comment')} />
          <p className={`${HINT} ${values.comment ? 'invisible' : ''}`} data-node="8365" aria-hidden="true" data-a11y-dup="1">Что важно знать заранее, ваш запрос или вопросы...</p>
          {errors.comment ? <span id="err-comment" className={ERROR} role="alert">{errors.comment}</span> : null}
          <div className={FRAME}></div>
        </div>
      </div>

      <div className="self-stretch min-h-[326px] w-full max-w-[607.5px] flex flex-col gap-space-2xl items-start relative" data-node="8366">
        <div className="self-stretch min-h-[88px] w-full max-w-[607.5px] flex flex-col gap-space-s items-start relative" data-node="8367">
          <div className="self-stretch min-h-[60px] w-full max-w-[607.5px] flex flex-row py-4 justify-center items-center rounded-[4px] bg-accent relative [overflow:hidden]" data-node="8368">
            <button type="submit" disabled={status.kind === 'sending'}
              className="self-stretch flex-1 w-full max-w-[607.5px] py-0 px-0 border-0 bg-transparent cursor-pointer disabled:opacity-70">
              <span className="flex-1 block w-full max-w-[607.5px] text-text-on-image font-['Literata'] text-[22px] font-light leading-[28px] [white-space:nowrap] text-center" data-node="8369">
                {status.kind === 'sending' ? 'Отправляем…' : 'Отправить заявку'}
              </span>
            </button>
          </div>
          <p className="self-stretch w-full max-w-[607.5px] text-text-secondary font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap] text-center" data-node="8370">Нажимая “Отправить заявку”, вы соглашаетесь с условиями обработки данных.</p>
          <p role="status" aria-live="polite" className={`self-stretch w-full max-w-[607.5px] text-[13px] leading-[20px] ${status.kind === 'error' ? 'text-[#9B3B2E]' : 'text-text-primary'} ${status.text ? '' : 'sr-only'}`}>
            {status.text}
            {status.kind === 'mailto' ? (
              <> {' '}
                <a className="underline" href={status.mailto}>Открыть письмо</a>
                {' '}или напишите на <a className="underline" href={`mailto:${status.email}`}>{status.email}</a>
              </>
            ) : null}
          </p>
        </div>
        <div className="self-stretch min-h-[190px] w-full max-w-[607.5px] flex flex-col p-[1px] items-start rounded-(--radius-s) relative [overflow:hidden]" data-node="8371">
          <div className="self-stretch min-h-[52px] w-full max-w-[605.5px] flex flex-row p-space-m items-start bg-bg-surface relative [overflow:hidden]" data-node="8372">
            <h2 className="text-accent font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap] tracking-[0.16em] uppercase" data-node="8373">Правовая информация</h2>
          </div>
          <div className="self-stretch min-h-[136px] w-full max-w-[605.5px] flex flex-col gap-space-m p-space-m items-start relative [overflow:hidden]" data-node="8374">
            <p className="self-stretch w-full max-w-[573.5px] text-text-secondary font-['Golos_Text'] text-[13px] font-normal leading-[20px]" data-node="8375">Материалы и сессии носят консультативный характер и не являются медицинской услугой.</p>
            <div className="self-stretch min-h-[48px] w-full max-w-[573.5px] flex flex-row flex-wrap gap-space-s items-start content-start relative" data-node="8376">
              <a className="text-accent-muted font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap] no-underline" href={href('/legal-terms.html')} data-node="8377">Условия использования и продажи</a>
              <a className="text-accent-muted font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap] no-underline" href={href('/legal-privacy.html')} data-node="8378">Политика конфиденциальности</a>
              <a className="text-accent-muted font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap] no-underline" href={href('/legal-refund.html')} data-node="8379">Политика возвратов</a>
              <a className="text-accent-muted font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap] no-underline" href={href('/legal-consent.html')} data-node="8380">Согласия</a>
            </div>
          </div>
          <div className={FRAME}></div>
        </div>
      </div>
    </form>
  )
}
