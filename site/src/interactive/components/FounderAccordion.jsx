import { useState } from 'react'

// Аккордеон основателя (masters, founder-hero): 5 тем, в каждом состоянии раскрыт один пункт.
// Переключение — как у форматов на главной: заранее разложенные состояния кроссфейдятся
// (opacity 500 мс), поэтому текст не «перерисовывается» и не дёргается.
const ITEMS = [
  {
    num: '01',
    title: 'Видеть глубже',
    width: 'w-47',
    height: 218,
    paragraphs: [
      { text: 'Меня всегда интересовала глубина человеческой природы: как в одной личности переплетаются сила и уязвимость, осознанность и запутанность, желание жить и при этом разрушать себя.', top: 0 },
      { text: 'Почему человек может искренне хотеть перемен, стараться, искать, пробовать — и всё равно снова упираться в ту же невозможность что-то изменить.', top: 16 },
    ],
  },
  {
    num: '02',
    title: 'Путь в профессию',
    width: 'w-[235px]',
    height: 198,
    paragraphs: [
      { text: 'Я пришла в эту работу не просто из интереса.\nЯ всегда видела человека глубже его внешней истории, глубже слов и действий. Игнорировать это в себе не имело смысла, и я пошла учиться. Так я стала психологом. А позже, практикуя, я всё яснее понимала: именно то, что я вижу на уровне внутренних причин, часто и оказывается самым важным.', top: 0 },
    ],
  },
  {
    num: '03',
    title: 'Суть моего взгляда',
    width: 'w-[243px]',
    height: 274,
    paragraphs: [
      { text: 'Я знаю, как часто за сильным, собранным, разумным человеком живёт уставшая внутренняя часть, которая слишком долго несла то, что уже невозможно нести.', top: 0 },
      { text: 'И как часто за внешне разными трудностями стоит одна и та же настоящая внутренняя причина. Моя работа никогда не была для меня просто профессией.', top: 16 },
      { text: 'Это способ идти вместе с человеком туда, где становится ясно, что на самом деле с ним происходит, почему это повторяется и где начинается выход.', top: 16 },
    ],
  },
  {
    num: '04',
    title: 'Ясность рядом',
    width: 'w-[191px]',
    height: 218,
    paragraphs: [
      { text: 'Я не смотрю на человека как на набор проблем. Мне важно видеть в нём основание. Ту глубину, которая часто остаётся нетронутой под слоями напряжения, вины, страха, защиты или внутренней пустоты.\nИменно это люди чаще всего чувствуют рядом со мной: желанную ясность и точное внимание к тому, что в них действительно главное.', top: 0 },
    ],
  },
  {
    num: '05',
    title: 'Пространство Syntonia',
    width: 'w-[294px]',
    height: 214,
    paragraphs: [
      { text: 'Для меня это работа о возвращении человека к себе. К возможности жить не только из прошлого опыта, но и из чего-то более живого, свободного и настоящего.\nПоэтому я и создала Syntonia. Как пространство, в котором можно идти.\nТочно. Бережно. По-настоящему.', top: 0 },
    ],
  },
]

// узлы Figma для состояния по умолчанию (пункт 01 раскрыт) — их меряет приёмка
const DEFAULT_NODES = [
  { wrap: '2717', row: '2718', barWrap: '2719', bar: '2720', title: '2721', num: '2722', body: '2723', divider: '2724' },
  { wrap: '2725', row: '2726', barWrap: '2727', bar: '2728', title: '2729', num: '2730', divider: '2732' },
  { wrap: '2733', row: '2734', barWrap: '2735', bar: '2736', title: '2737', num: '2738', divider: '2740' },
  { wrap: '2741', row: '2742', barWrap: '2743', bar: '2744', title: '2745', num: '2746', divider: '2748' },
  { wrap: '2749', row: '2750', barWrap: '2751', bar: '2752', title: '2753', num: '2754', divider: '2756' },
]

const BODY = "self-stretch w-full max-w-[452px] text-text-on-image font-['Golos_Text'] text-[14px] font-normal leading-[20px]"
const TITLE = "text-text-on-image font-['Literata'] text-[25px] font-light leading-[29px] [white-space:nowrap]"

/** Кроссфейд-аккордеон: 5 состояний, каждое — один раскрытый пункт. */
export function FounderAccordion() {
  const [active, setActive] = useState(0)
  return (
    <div className="w-[452px] min-h-[530px] flex flex-col gap-6 items-start relative" data-node="2716">
      {ITEMS.map((item, stateIndex) => {
        const isLayerActive = stateIndex === active
        const nodes = stateIndex === 0 ? DEFAULT_NODES : null
        return (
          <div
            key={item.num}
            inert={isLayerActive ? undefined : ''}
            className={`absolute left-0 top-0 w-full flex flex-col gap-6 items-start transition-opacity duration-500 ease-out motion-reduce:transition-none ${isLayerActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            {ITEMS.map((row, rowIndex) => (
              <div
                key={row.num}
                className={`w-full max-w-[452px] flex flex-col gap-4 items-start relative ${rowIndex === stateIndex ? '' : 'min-h-[46px]'}`}
                style={rowIndex === stateIndex ? { minHeight: `${ITEMS[stateIndex].height}px` } : undefined}
                data-node={nodes?.[rowIndex]?.wrap}
              >
                <div
                  className="self-stretch min-h-[29px] w-full max-w-[452px] flex flex-row gap-[10px] justify-between items-center relative cursor-pointer"
                  role="button"
                  tabIndex={isLayerActive ? 0 : -1}
                  aria-label={row.title}
                  onClick={() => setActive(rowIndex)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setActive(rowIndex)
                    }
                  }}
                >
                  <div className={`${row.width} min-h-[29px] flex flex-row gap-2 items-center relative`} data-node={nodes?.[rowIndex]?.barWrap}>
                    <div className="w-[3px] h-6 bg-accent-muted" data-node={nodes?.[rowIndex]?.bar}></div>
                    {rowIndex === 0
                      ? <h2 className={TITLE} data-node={nodes?.[rowIndex]?.title}>{row.title}</h2>
                      : <h3 className={TITLE} data-node={nodes?.[rowIndex]?.title}>{row.title}</h3>}
                  </div>
                  <p
                    style={{ width: row.num === '01' ? '21px' : row.num === '04' ? '24px' : '23px', height: '20px' }}
                    className="text-text-on-image font-['Great_Vibes'] text-[27px] font-normal leading-[32px] [white-space:nowrap] text-right flex flex-col justify-center [text-box:trim-both_cap_alphabetic]"
                    data-node={nodes?.[rowIndex]?.num}
                  >
                    {row.num}
                  </p>
                </div>
                {rowIndex === stateIndex ? (
                  <div className={BODY} data-node={nodes?.[rowIndex]?.body} style={rowIndex === 0 ? { boxSizing: 'border-box', minWidth: 0, flexShrink: 0, flex: '0 0 auto', width: '452px' } : undefined}>
                    {row.paragraphs.map((paragraph, index) => (
                      <p key={index} style={{ margin: 0, marginTop: `${paragraph.top}px` }}>
                        {paragraph.text.split('\n').map((line, lineIndex) => (
                          <span key={lineIndex}>
                            {lineIndex > 0 ? <br /> : null}
                            {line}
                          </span>
                        ))}
                      </p>
                    ))}
                  </div>
                ) : null}
                <div className="self-stretch w-[452px] h-[1px] bg-border mt-auto" data-node={nodes?.[rowIndex]?.divider}></div>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
