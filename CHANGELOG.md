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
