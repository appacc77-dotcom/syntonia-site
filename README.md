# Syntonia — prepublication site

Отдельный репозиторий сайта, вышедшего из m1 → m2. m1/m2 — конвейер, сюда приходит
**готовый итоговый сайт**; здесь он публикуется через GitHub Pages и дорабатывается
постранично.

```
m1-export → m2-layout → site/dist ──export──▶ этот репозиторий
                                               ├─ reference/<id>/site   замороженный выход m2
                                               └─ *.html + assets/**    рабочая копия сайта
```

- **reference/** — точная копия сборки m2, не редактируется. Нужна как эталон для
  визуального сравнения и истории.
- **Корень репозитория** — рабочая копия: страницы и ассеты, которые правятся вручную
  и публикуются через Pages.
- **site.json** — ID сайта, версия, источник (figSha/packId), список страниц.
- **VERSIONS.md / CHANGELOG.md** — история выходов из m2 и изменений сайта.
- **prompts/** — стандартные промты для постраничной работы.
- **scripts/** — preview и подготовка publish-артефакта.

## Быстрый старт

```bash
node scripts/serve.mjs          # http://127.0.0.1:4300
node scripts/patch-base.mjs     # Pages project base /syntonia-site
node scripts/prepare-pages.mjs  # .pages/ — только рабочая версия для Pages
```

## Публикация

Pages публикуется из ветки `gh-pages` (содержимое `.pages/`). Рабочая ветка `main` содержит reference и исходную рабочую копию.

## Цикл по странице

1. `prompts/01-inspect-page.md` — сравнить reference и рабочую страницу, получить список правок.
2. `prompts/02-rework-page.md` — внести правки только в рабочую копию.
3. `prompts/03-accept-page.md` — принять страницу, обновить `site.json`/CHANGELOG.
4. `prompts/05-release.md` — версия, тег, публикация Pages.

Новый выход из m2 — `prompts/04-sync-m2.md`: новая папка reference, рабочая копия не
перезаписывается автоматически.
