# Implementation audit — 2026-11-18

| Область | Найденная реализация | Проблема | Действие |
|---|---|---|---|
| Редактируемые исходники | `studio-pipeline-v2/modules/m3-prepublish/site/**` | В `syntonia-site/m3` только `.gitkeep`; самостоятельная сборка сайта не завершена | Перенести src/scripts/configs в site repo, m3 оставить публикатором |
| Роутинг/basePath | `src/App.jsx`: `resolveRoute()` по longest suffix | Неизвестный маршрут падает в `/`; ошибки маскируются главной | Явный not-found, тест заголовков страниц |
| Навигация/CTA | React links в Section08/09/11/13/14/15; часть CTA исправлена | Header/footer только на главной (`TD-NAV`); часть кнопок ещё `<p>` | Полная карта CTA и shared layout |
| FAQ/выборы/квиз | FAQ, formats, voices, quiz-option реализованы | Quiz только 1 из 9; нет результата; forms/modal отсутствуют | Достроить сценарии, недостающее — demo |
| Формы/интеграции | нет реального endpoint/полей | Нельзя выдавать за готовые заявки/оплату | `integrations-needed.md`, demo-режим |
| Motion | PageReveal, transitions, reduced-motion | Часть смен состояния без единых токенов; возможен jank | Токены, transition только по нужным свойствам |
| Сборка/публикация | m3 build/vite/ssg → publish → site repo → gh-pages | Исходники и публикация в разных репо; нет clean-clone теста | Вынести source в site repo, проверить clean clone |
| Site metadata | `site.json` v0.6.0, `stage3: faq/formats/quiz-option/motion` | `published` читается как «всё готово» | Разделить publication/behavior/integration статусы |

## Границы

- `reference/**` не редактируется.
- Минифицированные бандлы вручную не правятся.
- M2-final (`v1.1.0` / site `v0.5.0`) не меняется.
- Текущий live: `v0.6.0`; кандидат v0.7 (voices/formats/links) ещё не опубликован.
