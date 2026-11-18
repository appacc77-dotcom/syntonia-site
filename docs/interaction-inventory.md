# Interaction inventory

| Компонент | Страница | Реализация | Статус | Проверка |
|---|---|---|---|---|
| FAQ | `/` | React Accordion, 5 вопросов, первый открыт, ответы из Figma | verified | `m3:interactions`, pixel `/` |
| Voices carousel | `/` | 12 отзывов, 2 карточки, arrows/dots/swipe, shadows | implemented | `m3:interactions`, pixel `/` |
| Formats | `/` | 5 карточек, выбранная раскрывается, descriptions/prices из Figma | implemented | `m3:interactions`, pixel `/` |
| Quiz option | `/quiz.html` | 7 radio, aria-checked | implemented | `m3:interactions`, pixel quiz |
| Full quiz | `/quiz.html` | только вопрос 1 из 9 | blocked | нет данных остальных шагов/результата |
| Forms | `/booking.html` | статическая вёрстка | blocked | нет endpoint и полей |
| Modals | — | нет | blocked | нет данных/ассетов |
| Shared header/footer | внутренние страницы | отсутствует | blocked | TD-NAV |
| Reduced motion | весь сайт | CSS/JS media query | implemented | `m3:interactions` |
| Page reveal | весь сайт | React PageReveal | implemented | pixel capture disables animation |

## Правила

- Страница → зона → подпись → действие → назначение → источник → тест.
- Не связывать одинаковые подписи одним глобальным обработчиком.
- Не выдавать `aria-checked`/CSS за завершённый сценарий.
