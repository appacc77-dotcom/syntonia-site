import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { hrefFor, useRoute } from '../links.jsx'
import { MENU_HEAD, MENU_LINK, MENU_SURFACE } from './headerMenuStyles.js'

// Пункты выпадашки «О проекте» — как в прошлой версии сайта (принцип оттуда),
// оформление — из нашей дизайн-системы (токены bg-header / text-on-image / line-on-dark).
const MENU_ITEMS = [
  { href: '/masters.html', label: 'Мастера' },
  { href: '/method.html', label: 'Метод' },
  { href: '/library.html', label: 'Библиотека' },
]

/**
 * Выпадающее меню «О проекте» в шапке.
 * Принцип: click по подписи открывает меню, шеврон поворачивается, закрытие — клик вне/Escape.
 * Меню рендерится порталом (шапка имеет overflow-hidden и не должна обрезать панель).
 * Закрытое состояние разметки совпадает с прежним, поэтому пиксельная сверка не меняется.
 */
export function HeaderDropdown({ nodes = [] }) {
  const route = useRoute()
  const [open, setOpen] = useState(false)
  const buttonRef = useRef(null)
  const menuRef = useRef(null)
  const [rect, setRect] = useState(null)
  const [wrap, labelNode, chevNode, chevInnerNode, chevANode, chevBNode] = nodes

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) return
    const update = () => {
      const r = buttonRef.current.getBoundingClientRect()
      setRect({ left: r.left, top: r.bottom + 8 })
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
      if (menuRef.current && menuRef.current.contains(event.target)) return
      if (buttonRef.current && buttonRef.current.contains(event.target)) return
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
    <div className="w-[119px] min-h-[34px] flex flex-row gap-space-xs items-center relative" data-node={wrap}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
        className="p-0 m-0 bg-transparent border-0 flex flex-row gap-space-xs items-center cursor-pointer text-text-on-image font-['Golos_Text'] text-[20px] font-normal leading-[34px] [white-space:nowrap]"
      >
        <span data-node={labelNode} className="block no-underline text-text-on-image font-['Golos_Text'] text-[20px] font-normal leading-[34px] [white-space:nowrap]">О проекте</span>
        <div
          data-node={chevNode}
          aria-hidden="true"
          className={`w-[14px] h-[14px] shrink-0 flex flex-row gap-[1.43px] justify-center items-center relative transition-transform duration-150 ease-out ${open ? 'rotate-180' : ''}`}
        >
          <div className="w-[11.88px] h-[9.65px] rotate-[90deg] origin-top-left relative" data-node={chevInnerNode}>
            <div className="absolute left-0 top-[3.34px] w-[5.54px] h-[2.96px] border-[1.5px] border-text-on-image" data-node={chevANode}></div>
            <div className="absolute left-[6.97px] top-0 w-[4.91px] h-[9.65px] rounded-[0.71px] border-[3px] border-text-on-image" data-node={chevBNode}></div>
          </div>
        </div>
      </button>
      {open && rect && typeof document !== 'undefined'
        ? createPortal(
            <ul
              ref={menuRef}
              role="menu"
              aria-label="О проекте"
              style={{ position: 'fixed', left: rect.left, top: rect.top }}
              className={`dropdown-rise z-[100] min-w-[220px] m-0 list-none ${MENU_SURFACE}`}
            >
              <li key="menu-head" role="none" className="px-2 pb-1">
                <p className={MENU_HEAD}>о проекте</p>
              </li>
              {MENU_ITEMS.map((item) => (
                <li key={item.href} role="none">
                  <a role="menuitem" href={hrefFor(route, item.href)} className={MENU_LINK}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>,
            document.body,
          )
        : null}
    </div>
  )
}
