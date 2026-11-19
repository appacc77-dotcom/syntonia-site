import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { hrefFor, useRoute } from '../links.jsx'
import { BookingForm } from './BookingForm.jsx'
import { PANELS, PROMO } from './bookingPanels.jsx'

// Форматы записи (booking): 5 карточек + панель «Выбранный формат».
// Переключение — в одном стиле с форматами на главной: состояния заранее разложены слоями
// и кроссфейдятся (500 мс), текст не перерисовывается.
const FORMATS = [
  {
    num: '01',
    title: 'Точка входа',
    subtitle: 'Короткая встреча для прояснения запроса и понимания направления.',
    duration: '30 минут',
    price: '$50',
    metaWidth: 102,
    nodes: { wrap: '8244', num: '8245', outer: '8246', inner: '8247', title: '8248', subtitle: '8249', meta: '8250', duration: '8251', dot: '8252', price: '8253', indicator: '8254', indicatorInner: '8255' },
  },
  {
    num: '02',
    title: 'Индивидуальная мастер-сессия',
    subtitle: 'Глубокая индивидуальная работа с одним запросом или конкретной темой.',
    duration: '2 часа',
    price: '$230',
    metaWidth: 91,
    nodes: { wrap: '8257', num: '8258', outer: '8259', inner: '8260', title: '8261', subtitle: '8262', meta: '8263', duration: '8264', dot: '8265', price: '8266' },
  },
  {
    num: '03',
    title: 'Программа 3 встречи',
    subtitle: 'Последовательная работа с запросом в трёх индивидуальных встречах.',
    duration: '3 × 2 часа',
    price: '$560',
    metaWidth: 113,
    nodes: { wrap: '8270', num: '8271', outer: '8272', inner: '8273', title: '8274', subtitle: '8275', meta: '8276', duration: '8277', dot: '8278', price: '8279', divider: '8282' },
  },
  {
    num: '04',
    title: 'Программа 5 встреч',
    subtitle: 'Более глубокий цикл для системной работы и интеграции изменений.',
    duration: '5 × 2 часа',
    price: '$1050',
    metaWidth: 119,
    nodes: { wrap: '8283', num: '8284', outer: '8285', inner: '8286', title: '8287', subtitle: '8288', meta: '8289', duration: '8290', dot: '8291', price: '8292', divider: '8295' },
  },
  {
    num: '05',
    title: 'Сопровождение',
    subtitle: 'Поддерживающая встреча для продолжения процесса и текущих изменений.',
    duration: '60 минут',
    price: '$110',
    metaWidth: 107,
    nodes: { wrap: '8296', num: '8297', outer: '8298', inner: '8299', title: '8300', subtitle: '8301', meta: '8302', duration: '8303', dot: '8304', price: '8305', divider: '8308' },
  },
]

const CARD = 'self-stretch min-h-[209px] w-full max-w-[607.5px] flex flex-row gap-2 p-space-xl items-start rounded-(--radius-l) relative cursor-pointer transition-colors duration-300'
const NUMBER = "w-full max-w-[60px] text-accent font-['Literata'] text-[48px] font-light leading-[60px] [white-space:nowrap]"
const INNER = 'flex-1 min-h-[145px] w-full flex flex-col gap-space-m justify-center items-start'
const TITLE = "text-text-primary font-['Literata'] text-[29px] font-light leading-[39px] [white-space:nowrap]"
const SUBTITLE = "text-text-deep font-['Golos_Text'] text-[20px] font-normal leading-[27px]"
const META_TEXT = "text-text-deep font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap]"

function CardContent({ item, active, nodes, className, headingTag = 'h3' }) {
  return (
    <div className={`absolute left-0 top-0 min-h-[145px] ${className}`}>
      <div className={INNER} style={{ maxWidth: active ? '420.5px' : '475.5px' }} data-node={nodes?.inner}>
        {headingTag === 'h2'
          ? <h2 className={TITLE} data-node={nodes?.title}>{item.title}</h2>
          : <h3 className={TITLE} data-node={nodes?.title}>{item.title}</h3>}
        <p className={`self-stretch w-full ${SUBTITLE}`} style={{ maxWidth: active ? '420.5px' : '475.5px' }} data-node={nodes?.subtitle}>
          {item.subtitle}
        </p>
        <div
          className="min-h-[20px] flex flex-row gap-space-s justify-center items-center relative"
          style={{ width: `${item.metaWidth}px` }}
          data-node={nodes?.meta}
        >
          <p className={META_TEXT} data-node={nodes?.duration}>{item.duration}</p>
          <div className="w-[3px] h-[3px] rounded-full bg-text-deep" data-node={nodes?.dot}></div>
          <p className={META_TEXT} data-node={nodes?.price}>{item.price}</p>
        </div>
      </div>
    </div>
  )
}

function FormatCard({ item, index, active, onSelect }) {
  const route = useRoute()
  const nodes = item.nodes
  const showDivider = index > 0 && index !== active && index !== active + 1
  return (
    <div
      className={`${CARD} ${active ? 'bg-bg-selected' : ''}`}
      role="button"
      tabIndex={0}
      aria-pressed={active}
      aria-label={`${item.num} ${item.title}`}
      onClick={() => onSelect(index)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(index)
        }
      }}
      data-node={nodes.wrap}
    >
      <p className={NUMBER} data-node={nodes.num}>{item.num}</p>
      <div
        className="flex-1 min-h-[145px] w-full max-w-[475.5px] flex flex-row gap-4 items-center relative"
        data-node={nodes.outer}
      >
        <CardContent
          item={item}
          active={false}
          nodes={active ? undefined : nodes}
          headingTag={index === 0 ? 'h2' : 'h3'}
          className={`w-full max-w-[475.5px] transition-opacity duration-300 ${active ? 'opacity-0' : 'opacity-100'}`}
        />
        <CardContent
          item={item}
          active
          nodes={active ? nodes : undefined}
          headingTag={index === 0 ? 'h2' : 'h3'}
          className={`w-full max-w-[420.5px] transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        />
        <div
          className={`absolute right-0 top-1/2 -translate-y-1/2 w-[39px] h-[39px] transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0'}`}
          data-node={index === 0 ? nodes.indicator : undefined}
          aria-hidden="true"
          style={{ backgroundImage: `url(${hrefFor(route, '/assets/snap-e60e7a2c67-option-check.svg')})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'contain' }}
        >
          <div
            className="absolute left-0 top-0 w-[39px] h-[39px] border-[1.18px] border-text-on-dark"
            data-node={index === 0 ? nodes.indicatorInner : undefined}
          ></div>
        </div>
      </div>
      {showDivider ? <div className="absolute left-0 top-0 w-[608px] h-[1px] bg-border" data-node={nodes.divider}></div> : null}
    </div>
  )
}

/** Интерактивные форматы записи: карточки слева, «Выбранный формат» + форма справа. */
export function BookingFormats() {
  const [active, setActive] = useState(0)
  const [height, setHeight] = useState(487)
  const layerRefs = useRef([])
  const infoRef = useRef(null)

  useLayoutEffect(() => {
    const layer = layerRefs.current[active]
    if (layer) setHeight(layer.offsetHeight)
  }, [active])

  useEffect(() => {
    const onResize = () => {
      const layer = layerRefs.current[active]
      if (layer) setHeight(layer.offsetHeight)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [active])

  return (
    <div className="self-stretch min-h-[1350px] w-full max-w-[1280px] flex flex-row gap-space-xl items-start relative" data-node="8242">
      <div className="flex-1 min-h-[1280px] w-full max-w-[607.5px] flex flex-col gap-space-m items-start relative" data-node="8243">
        {FORMATS.map((item, index) => (
          <FormatCard key={item.num} item={item} index={index} active={index === active} onSelect={setActive} />
        ))}
        {PROMO}
      </div>
      <div className="self-stretch w-[1px] min-h-[1350px] bg-border" data-node="8319"></div>
      <div className="flex-1 self-stretch w-full max-w-[607.5px] min-h-[1350px] flex flex-col gap-space-l items-start relative" data-node="8320">
        <div
          ref={infoRef}
          className="self-stretch w-full max-w-[607.5px] relative transition-[height] duration-500 ease-out motion-reduce:transition-none"
          style={{ height: `${height}px` }}
        >
          {PANELS.map((panel, index) => (
            <div
              key={index}
              ref={(node) => { layerRefs.current[index] = node }}
              inert={index === active ? undefined : ''}
              className={`absolute left-0 top-0 w-full transition-opacity duration-500 ease-out motion-reduce:transition-none ${index === active ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              {panel}
            </div>
          ))}
        </div>
        <div className="self-stretch w-[607.5px] h-[1px] bg-border" data-node="8336"></div>
        <BookingForm formatOverride={FORMATS[active].title} />
      </div>
    </div>
  )
}
