# Syntonia — сайт

**Live:** <https://appacc77-dotcom.github.io/syntonia-site/> — GitHub Pages, публикуется из ветки `main` (корень репозитория).

Репозиторий содержит **исходники сайта (React + Vite + Tailwind + SSG) и опубликованную сборку**.
Правки делаются в исходниках, сборка раскладывается в корень репозитория и коммитится.

## Структура

```
site/                 исходники: React-страницы и секции (SSG), интерактив, шрифты, HTML-оболочки
  src/generated/        страницы/секции, сгенерированные из Figma (FigCraft)
  src/interactive/      интерактив: quiz, слайдеры, FAQ, reveal, ссылки
  src/App.jsx, main.jsx, entry-server.jsx, base.css, fonts.css
  data/routes.json      24 маршрута; data/seo.json — title/description/OG
  scripts/ssg.mjs       пререндер маршрутов в HTML (SSG)
  scripts/publish.mjs   сборка → корень репозитория (переименование ассетов, SEO-слой, 404)
  public/fonts/         локальные шрифты (без @fontsource на клиенте)
  asset-map.json        карта имён ассетов: raw-имя из исходников → оптимизированное имя в assets/
assets/               опубликованные изображения (WebP near-lossless, дедуплицированы)
fonts/                опубликованные шрифты
*.html, 404.html      опубликованные страницы (результат сборки)
robots.txt, sitemap.xml, .nojekyll
```

## Сборка и публикация

```bash
cd site
npm ci                 # один раз
npm run deploy         # build (vite + SSG + ворота) + publish в корень репозитория
```

Ворота сборки: 24/24 маршрута с SSG-разметкой, title/description/OG на каждой странице,
один бандл CSS/JS, переносимость (никаких корневых URL), бюджет main-js gzip < 300 КБ.
Публикация проверяет, что все ссылки на ассеты существуют, и что в опубликованных файлах нет
корневых URL (кроме `404.html`, где пути абсолютные `/syntonia-site/...`).

Форма заявки на `/booking.html` — настоящие `input`/`textarea` с валидацией и honeypot.
Канал доставки задаётся в `site/data/form-config.json`: `endpoint` (POST JSON:
Formspree/Getform, Telegram-бот через Worker, Apps Script или свой сервис) либо, пока канал
не выбран, `fallbackEmail` — форма открывает почтовый клиент с готовым письмом.

## Приёмка против эталона m2 (golden reference + Figma)

Гейты воспроизводят методику конвейера m2 и сверяются с immutable-эталоном
`studio-pipeline-v2/artifacts/reference/179a800f9fbf` через `M2_REFERENCE`:

```bash
cd site
M2_REFERENCE=/abs/path/artifacts/reference/179a800f9fbf npm run gate            # все три ворот
M2_REFERENCE=… npm run gate:golden      # golden 24/24: 1440@2x, pixelmatch Δ>24 ≤2 %, mean ≤5/255
M2_REFERENCE=… npm run gate:contract    # contract 24/24: DOM-геометрия/типографика против live-nodes
M2_REFERENCE=… npm run gate:a11y        # a11y 24/24: aria-hidden/вложенный интерактив/alt/заголовки
M2_REFERENCE=… node scripts/gates/fixtures.mjs   # fixtures 116/116: 54 состояния + 62 DS-компонента
M2_REFERENCE=… node scripts/gates/live.mjs       # live-приёмка опубликованного GitHub Pages
```

Текущее состояние (v0.11.7): golden 24/24 (Δh = 0; home mean **2.44/255** против baseline 2.80,
legal-refund 1.26, library 1.13), contract 24/24 — **0 нарушений** геометрии/типографики,
a11y 24/24 — **0 нарушений**, fixtures 116/116 (state mean 1.4 %, design-system 1.47 %),
live-приёмка 24/24 PASS без ошибок страницы.

Патч-слой (`site/scripts/apply-site-patches.mjs`) идемпотентно правит сгенерированную из Figma
разметку: ссылки/aria-current, ориентиры/landmarks, h1, h2/h3 и порядок заголовков, rich-text
(списки, абзацы, mixed-font), переносы строк, точечные геометрические фиксы
(`data/geometry-fixes.json`), семантику изображений, иконные оверрайды, форму booking.
Правила и измеренные отклонения — `docs/ACCEPTANCE.md`.

`src/generated/fixtures/**` и `FixturesPage.jsx` — эталонные QA-компоненты для fixtures-ворот:
из патч-слоя исключены, в публикуемую сборку не попадают (lazy-чанк только для `/fixtures.html`).

Публикация Pages: закоммитить `main` → GitHub Pages (source `main` / root) пересобирает сам.
`.nojekyll`, `404.html`, `robots.txt`, `sitemap.xml` не удалять.

## Правила

- Визуал 1440 — пиксель-точная копия Figma; правки разметки не должны менять пиксели
  (проверка: скриншоты страниц до/после при 1440×900, pixelmatch = 0).
- Ассеты: новые изображения оптимизируются заранее (WebP near-lossless) и добавляются в `assets/`
  с записью в `site/asset-map.json`; исходники `public/assets` в репозитории не хранятся.
- `site/src/generated/**` — Figma-кодогенерация: правится точечно; при перегенерации из конвейера
  правки переносятся вручную (реестр решений — `_analysis/syntonia-site-audit-2026-11-18/DECISIONS.md`
  в рабочей области).
- Шрифты — `site/public/fonts` (86 файлов), публикуются в `fonts/`.

## Версии

История — `CHANGELOG.md`; текущая версия — `v0.9.0` (production-индексация).
