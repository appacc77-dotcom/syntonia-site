# Changelog

## v0.1.0 — prepublication import
- Импортирован итоговый сайт из m2 (`179a800f9fbf-907ef0790ce7-darwin-arm64`).
- Заморожен reference m2; рабочая копия создана из него.
- Подготовлены постраничные промты, preview и publish-pipeline.

## v0.1.1 — Pages base patch
- Бандл пропатчен для project Pages `/syntonia-site/`; прямые URL страниц снова открывают нужный маршрут.
- `scripts/patch-base.mjs` — идемпотентный шаг после импорта m2 перед публикацией.
