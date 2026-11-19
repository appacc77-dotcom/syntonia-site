import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { hrefFor, useRoute } from '../links.jsx'
import { MENU_HEAD, MENU_LINK, MENU_SURFACE } from './headerMenuStyles.js'

// Все страницы сайта (кроме главной — она в меню «О проекте»), сгруппированы по смыслу.
const GROUPS = [
  {
    title: 'о проекте',
    items: [
      { href: '/', label: 'Главная' },
      { href: '/masters.html', label: 'Мастера' },
      { href: '/method.html', label: 'Метод' },
      { href: '/library.html', label: 'Библиотека' },
    ],
  },
  {
    title: 'практика',
    items: [
      { href: '/quiz.html', label: 'Понять себя' },
      { href: '/practice.html', label: 'Пространство практики' },
      { href: '/booking.html', label: 'Личная встреча' },
      { href: '/practice-detail.html', label: 'Детали практики' },
    ],
  },
  {
    title: 'библиотека',
    items: [
      { href: '/library/book-chapter.html', label: 'Глава' },
      { href: '/library/book-chapter-intro.html', label: 'Вступление' },
      { href: '/library/book-chapter-technique.html', label: 'Техника' },
      { href: '/library/book-chapter-story.html', label: 'История' },
    ],
  },
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

const LINK = 'block py-1 px-2 rounded-[2px] text-text-on-image font-[\'Golos_Text\'] text-[14px] font-normal leading-[19px] [white-space:nowrap] no-underline hover:bg-line-on-dark'
const HEAD = "text-accent-muted font-['Golos_Text'] text-[13px] font-normal leading-[20px] tracking-[0.16em] uppercase"

/** Бургер-меню в шапке: открывает список всех страниц сайта (принцип — от прежней версии, оформление — наше). */
export function HeaderBurgerMenu({ nodes = [] }) {
  const route = useRoute()
  const [open, setOpen] = useState(false)
  const buttonRef = useRef(null)
  const menuRef = useRef(null)
  const [pos, setPos] = useState(null)
  const [wrap, bar1, bar2, bar3] = nodes

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

  const half = Math.ceil(GROUPS.length / 2)
  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label="Меню сайта"
      style={open ? { backgroundImage: `url(${hrefFor(route, '/icons/vec/cancel.svg')})` } : undefined}
      aria-haspopup="true"
      aria-expanded={open}
      onClick={() => setOpen((value) => !value)}
      className="p-0 m-0 bg-transparent border-0 w-[38px] min-h-[25px] flex flex-col gap-2 justify-center items-center relative cursor-pointer"
      data-node={wrap}
    >
      <span
        aria-hidden="true"
        className={`w-[38px] h-[3px] rounded-(--radius-s) bg-text-on-image transition-transform duration-200 ease-out ${open ? 'translate-y-[11px] rotate-45' : ''}`}
        data-node={bar1}
      />
      <span
        aria-hidden="true"
        className={`w-[38px] h-[3px] rounded-(--radius-s) bg-text-on-image transition-opacity duration-200 ease-out ${open ? 'opacity-0' : 'opacity-100'}`}
        data-node={bar2}
      />
      <span
        aria-hidden="true"
        className={`w-[38px] h-[3px] rounded-(--radius-s) bg-text-on-image transition-transform duration-200 ease-out ${open ? '-translate-y-[11px] -rotate-45' : ''}`}
        data-node={bar3}
      />
      {open && pos && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={menuRef}
              role="menu"
              aria-label="Все страницы сайта"
              style={{ position: 'fixed', top: pos.top, right: pos.right }}
              className={`dropdown-rise z-[100] w-[600px] max-w-[calc(100vw-24px)] max-h-[calc(100vh-140px)] overflow-y-auto ${MENU_SURFACE} flex flex-row gap-6 items-start`}
            >
              {[GROUPS.slice(0, half), GROUPS.slice(half)].map((column, index) => (
                <div key={index} className="flex-1 flex flex-col gap-4 items-start min-w-0">
                  {column.map((group) => (
                    <div key={group.title} className="w-full flex flex-col gap-1 items-start">
                      <p className={MENU_HEAD}>{group.title}</p>
                      {group.items.map((item) => (
                        <a
                          key={item.href}
                          role="menuitem"
                          href={hrefFor(route, item.href)}
                          className={MENU_LINK}
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
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
