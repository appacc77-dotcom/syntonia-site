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
