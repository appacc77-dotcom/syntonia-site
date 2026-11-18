import { renderToString } from 'react-dom/server'
import App from './App.jsx'

// SSG: статическая разметка одного маршрута. Клиентская гидратация — main.jsx.
export function render(route) {
  return renderToString(<App route={route} />)
}
