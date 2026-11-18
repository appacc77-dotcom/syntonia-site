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
