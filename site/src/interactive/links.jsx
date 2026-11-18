import { createContext, useContext } from 'react'

export const RouteContext = createContext('/')

/** Относительный href с учётом глубины текущего SSG-маршрута. */
export function hrefFor(currentRoute, target) {
  if (!target || target.startsWith('http') || target.startsWith('mailto:') || target.startsWith('tel:')) return target
  const route = currentRoute || '/'
  const dirs = route === '/' ? 0 : Math.max(0, route.split('/').filter(Boolean).length - 1)
  const prefix = '../'.repeat(dirs)
  if (target.startsWith('/#')) return `${prefix || './'}#${target.slice(2)}`
  if (target === '/') return `${prefix}index.html`
  return `${prefix}${target.replace(/^\//, '')}`
}

export function useHref() {
  const route = useContext(RouteContext)
  return (target) => hrefFor(route, target)
}

export function useRoute() {
  return useContext(RouteContext)
}

export function isCurrent(route, target) {
  if (target === '/') return route === '/'
  return route === target
}
