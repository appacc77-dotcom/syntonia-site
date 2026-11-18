# Changelog

## v0.1.0 — prepublication import
- Импортирован итоговый сайт из m2 (`179a800f9fbf-907ef0790ce7-darwin-arm64`).
- Заморожен reference m2; рабочая копия создана из него.
- Подготовлены постраничные промты, preview и publish-pipeline.

## v0.1.1 — Pages base patch
- Бандл пропатчен для project Pages `/syntonia-site/`; прямые URL страниц снова открывают нужный маршрут.
- `scripts/patch-base.mjs` — идемпотентный шаг после импорта m2 перед публикацией.

## v0.2.0 — optimized publication
- Рабочая копия заменена на SSG-пакет m3 из reference ref-179a800f9fbf-2607d3a4.
- 24 страницы, 259 файлов, ~14.9 МБ; WebP, dedupe, без QA-страниц.

## v0.3.0 — image quality
- WebP q95, сохранение ICC, smartSubsample/alphaQuality.
- Publish ~29.4 МБ; pixel 24/24, mean 0.48, over24 0.

## v0.4.0 — lossless images
- WebP lossless + ICC; publish 96.0 МБ.
- Pixel 24/24, mean 0.07, over24 0; hydration 24/24.

## v0.5.0 — near-lossless images
- WebP near-lossless 80 + ICC; publish 75.3 МБ.
- Pixel 24/24, mean 0.17, over24 0; hydration 24/24.

## v0.6.0 — m3 React interactions
- FAQ accordion, format chooser, quiz option selection.
- Active nav, CTA links, reveal/reduced-motion.
- Full pixel 24/24, hydration 24/24; publish 75.3 МБ.

## v0.7.0 — voices, formats, links
- 12-отзывный слайдер с тенями, стрелками и точками.
- Форматы: выбранная карточка раскрывается, данные из Figma.
- CTA-ссылки и светлый footer.

## v0.8.0 — interactive Stage 3 in m2
- Публикация переведена на m3 publish-pack нового reference `ref-179a800f9fbf-31a2eb65`
  (интерактив построен в m2 через mount-слой, ADR-0017; 13 override: formats/voices/FAQ/quiz + CTA/навигация).
- Интерактивные компоненты больше не форкаются в репозитории сайта: сборка m2 отдаёт готовый SSG-комплект.
- 24 страницы, 145 ассетов, publish 75.3 МБ; publish-pixel 24/24 (maxMean 0.17), publish-hydration 24/24,
  staging-smoke 24/24. Профиль публикации: noindex (staging), basePath `/syntonia-site`.
- Источник: pipeline v1.4.0 (`studio-pipeline-v2`), reference `31a2eb65`; предыдущая версия — v0.7.0.

## v0.10.4 — иконки: восстановлены 483 SVG-слепка, vector-extra для стрелок
- **Восстановлены 431 отсутствовавших** snapshot-SVG иконок (`assets/snap-*.svg`) — в репозитории
  лежало только 52 из 483, из-за чего часть иконок в CSS-override не отрисовывалась.
- Экспортированы из Figma 20 базовых глифов (arrow-quiet, radio, burger, play, nav-icon, quote-mark,
  slider-arrow, watch, gift, accordeon, cancel, time-logo, player-time, player-play, play-button,
  faq-icon, arrow, logo) + повернутые/белые варианты: `site/public/icons/vec/`.
- Новый генератор `scripts/build-icon-overrides.mjs`: `site/data/icon-overrides.json` → override-правила
  `src/generated/vector-extra.css` для узлов, которым в codegen-слепке не хватило SVG
  (аппроксимация div+border выглядит «толще»). Сейчас включены 89 узлов arrow-quiet (акцент/90°),
  где экспорт проверен по golden: настоящий тонкий органический контур вместо «жирной» аппроксимации.
- Проверка по golden: contract 24/24 PASS (0 нарушений), golden 24/24 PASS;
  home mean 2.53/0.64 % (принятый baseline 2.80/0.80 %), masters 1.66/0.58 % (2.18/0.84 %),
  legal-privacy 2.09/0.79 % (3.00/1.17 %), practice 2.80/1.16 % (2.83/1.19 %).
- Диагностика для остальных 20 глифов: у части инстансов поворот/цвет берутся из инстанса,
  поэтому автоматическая подстановка одного глифа даёт ложные варианты — включаем только после
  сверки с golden по каждому узлу (следующий шаг M4b).

## v0.10.3 — качество ассетов: фото авторов lossless/original, −19.5 МБ мусора
- Фото и обложки: JPG-оригиналы Figma отдаются байт-в-байт (`asset-map` identity: hero home,
  founder-баннер, автор-фото, обложки masters), PNG-портреты авторов перекодированы в **lossless WebP**
  из исходников (Екатерина Лебедева/основатель, Наталья Уолс, Ангелина Гебо + about-founder home).
- Декоративные фоны/текстуры остались near-lossless q80 (визуально неотличимо) — сравнение
  показало, что на пиксельную сверку они не влияют, а весят +2.4 МБ.
- Удалены неиспользуемые файлы ассетов: 20 шт / 19.47 МБ (устаревшие webp-версии JPG-оригиналов и др.).
  Итог: `assets/` 76 МБ → 58 МБ при более высоком качестве фото.
- Ворота после изменений: contract 24/24 PASS (0 нарушений), golden 24/24 PASS;
  home mean 2.50/0.64 %, masters 1.66/0.58 % — ниже принятого базлайна m2 (2.80/0.80 %).

## v0.10.2 — rich text m2 (списки/абзацы/боксы), контракт 0 нарушений
- Rich-text из Figma: 42 маркированных списка (bullet + висячий отступ, жёсткие переносы) и
  17 многоабзацных блоков (`paragraphSpacing`) теперь рендерятся как в макете; карта —
  `site/data/rich-text.json` (из Figma через мост), применяется идемпотентно.
- Финальные фикс-боксы текста (`site/data/box-fixes.json`): script-нумерация bio 01–05 получает
  бокс 20 px как в Figma (было 32 → каскадный сдвиг 3 px по странице masters).
- FAQ: убран лишний flex-gap 24 px между вопросом и иконкой (в Figma gap = 0; текст переносился),
  стрелка заменена настоящим SVG-вектором из Figma (`site/public/icons/arrow-right.svg`, поворот),
  вместо аппроксимации div+border — иконка больше не выглядит «квадратом».
- Ворота m2: **contract 24/24 PASS, 0 нарушений геометрии/типографики** (было 80);
  golden 24/24 PASS: home mean 2.80→2.53, masters 2.18→1.68, legal-privacy 3.00→2.09,
  booking 2.12→1.48; Δh = 0 кроме −1 px на трёх страницах и +1 на quiz.

## v0.10.1 — геометрия по эталону m2 (контракт 80 → 41)
- Исправлена шапка на всех 24 страницах: у header-inner убран лишний `gap-[10px]` (сжимал навигацию
  и группу действий на 10 px), на floating-шапке book-chapter* убраны компенсирующие `left:-19.98px`.
- Страница story: `gap-[430px]`-хак схлопывал иконку «назад» в 0 px и кнопку выбора главы — заменён
  на `gap-0` в этом ряду (скоуп — только story).
- Контракт-ворота m2-методики: было 80 нарушений геометрии → 41; все 24 маршрута PASS,
  типографика 100 %. Остались: FAQ (+39 px), masters bio (абзацный интервал 16 px),
  practice (29 фиксированных текстовых боксов), legal-privacy (маркированный список) — этап rich text.
- Golden-ворота после правок: 24/24 PASS, Δh = 0 у всех маршрутов (кроме −1 px на трёх, +1 на quiz).

## v0.10.0 — навигация, семантика, гольден-ворота
- Сайт стал source-репозиторием: `site/` (React + Vite + Tailwind + SSG), сборка `npm run deploy`
  раскладывает результат в корень; ассеты публикации не пересобираются (`site/asset-map.json`).
  Сборка воспроизводит live v0.9.0 один-в-один: 24/24 маршрута, 0 пиксельной разницы.
- Навигация: шапка/подвал — настоящие ссылки на всех страницах, перелинковка по аффордансам макета
  (masters → quiz/method, библиотека → главы, TOC и «назад/далее», practice «Пройти тест»/«Купить»,
  thanks-* и 404, кредит основателя → masters). Достижимо 16/24 страниц (было 9/24).
- Семантика: `h1` на каждой странице, `header/nav/main/footer`, skip-link, focus-visible.
- Исправлен дефект публикации: ссылки шапки/подвала рендерились тёмными на тёмном
  (unlayered `a{color:inherit}` перебивал `@layer utilities`).
- Ворота: `npm run golden` — пиксельная сверка с эталоном m2 (`M2_GOLDEN`, 140 гольденов);
  `scripts/apply-site-patches.mjs` — идемпотентные патчи React-исходников.
- Известные отклонения от макета (в работе): quiz +28 px, checkout-confirm +200 px по высоте;
  проглочены абзацные разрывы (masters) и mixed-font rich text (practice, «Практика» — Great Vibes).

## v0.9.0 — production indexing
- Публикационный профиль `production`: `robots: index, follow`, `robots.txt` с `Allow: /` и `Sitemap:`.
- Canonical/OG/sitemap пересобраны на `https://appacc77-dotcom.github.io/syntonia-site`; QA-страницы по-прежнему вне публикации.
- Контент/дизайн не менялись: pixel 24/24 (maxMean 0.17), hydration 24/24; 24 страницы, 145 ассетов, 75.3 МБ.
- Источник: pipeline v1.4.1 (`studio-pipeline-v2`), reference `31a2eb65` (не менялся).
