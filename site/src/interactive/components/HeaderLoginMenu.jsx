import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { hrefFor, useRoute } from '../links.jsx'
import { MENU_HEAD, MENU_LINK, MENU_SURFACE } from './headerMenuStyles.js'

// Временно (по просьбе владельца) сюда перенесены блоки «личное», «запись и оплата», «документы»
// из бургер-меню — кнопка кабинета (btn-login) теперь открывает это меню.
const GROUPS = [
  {
    title: 'личное',
    items: [
      { href: '/login.html', label: 'Вход' },
      { href: '/account-practices.html', label: 'Мои практики' },
      { href: '/account-history.html', label: 'История' },
      { href: '/account-profile.html', label: 'Профиль' },
    ],
  },
  {
    title: 'запись и оплата',
    items: [
      { href: '/thanks-booking.html', label: 'Спасибо за запись' },
      { href: '/thanks-purchase.html', label: 'Спасибо за покупку' },
      { href: '/checkout-confirm.html', label: 'Подтверждение оплаты' },
    ],
  },
  {
    title: 'документы',
    items: [
      { href: '/legal-terms.html', label: 'Условия' },
      { href: '/legal-privacy.html', label: 'Конфиденциальность' },
      { href: '/legal-refund.html', label: 'Возврат' },
      { href: '/legal-consent.html', label: 'Согласие' },
      { href: '/not-found.html', label: 'Страница не найдена' },
    ],
  },
]

const PERSON = 'site-header-person p-0 m-0 w-full max-w-[45px] min-h-[45px] flex flex-row justify-center items-center rounded-[4px] [outline:1.5px_solid_var(--color-text-on-image,_#FFFFFF)] [outline-offset:-1.5px] relative cursor-pointer bg-transparent border-0'

/** Кнопка кабинета в шапке: открывает меню «личное / запись и оплата / документы». */
export function HeaderLoginMenu({ nodes = [] }) {
  const route = useRoute()
  const [open, setOpen] = useState(false)
  const buttonRef = useRef(null)
  const menuRef = useRef(null)
  const [pos, setPos] = useState(null)
  const [wrap, inner, iconBody, iconLegs] = nodes

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) return
    const update = () => {
      const r = buttonRef.current.getBoundingClientRect()
      setPos({ top: r.bottom + 12, right: Math.max(8, window.innerWidth - r.right) })
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event) => {
      if (menuRef.current?.contains(event.target)) return
      if (buttonRef.current?.contains(event.target)) return
      setOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      buttonRef.current?.focus()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label="Личный кабинет"
      aria-haspopup="true"
      aria-expanded={open}
      onClick={() => setOpen((value) => !value)}
      className={PERSON}
      style={open ? { backgroundImage: `url(${hrefFor(route, '/icons/vec/cancel.svg')})`, backgroundSize: '22px 22px' } : undefined}
      data-node={wrap}
    >
      <div className="min-h-[20px] w-full max-w-[16.68px] flex flex-col gap-[3.04px] justify-center items-center relative" data-node={inner}>
        <div className="w-[10.13px] h-[10.13px] border-[1.57px] border-text-on-image" data-node={iconBody}></div>
        <div className="w-[16.68px] h-[6.83px] border-[1.74px] border-text-on-image" data-node={iconLegs}></div>
      </div>
      {open && pos && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={menuRef}
              role="menu"
              aria-label="Личный кабинет и документы"
              style={{ position: 'fixed', top: pos.top, right: pos.right }}
              className={`dropdown-rise z-[100] w-[280px] max-w-[calc(100vw-24px)] max-h-[calc(100vh-140px)] overflow-y-auto ${MENU_SURFACE} flex flex-col gap-4 items-start`}
            >
              {GROUPS.map((group) => (
                <div key={group.title} className="w-full flex flex-col gap-1 items-start">
                  <p className={MENU_HEAD}>{group.title}</p>
                  {group.items.map((item) => (
                    <a key={item.href} role="menuitem" href={hrefFor(route, item.href)} className={MENU_LINK}>
                      {item.label}
                    </a>
                  ))}
                </div>
              ))}
            </div>,
            document.body,
          )
        : null}
    </button>
  )
}
