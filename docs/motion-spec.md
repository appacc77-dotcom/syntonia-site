# Motion spec

## Токены

```css
:root {
  --motion-fast: 150ms;
  --motion-ui: 240ms;
  --motion-panel: 320ms;
  --motion-reveal: 440ms;
  --ease-ui: cubic-bezier(.2, 0, .2, 1);
  --ease-out-soft: cubic-bezier(.22, 1, .36, 1);
  --motion-reveal-distance: 12px;
}
```

## Реализовано

- PageReveal: opacity + translateY, 420ms.
- Links: color/opacity 160ms.
- FAQ: CSS grid rows, 300ms.
- Format cards: width/background/outline, 300ms.
- Voices: transform track 500ms, dots/buttons 160ms.
- Voice cards: soft shadow.
- `prefers-reduced-motion`: анимации/переходы отключены.

## Правила

- не использовать `transition: all`;
- не перезаписывать transform кодогена;
- не анимировать `top/left`;
- reveal не должен скрывать первый экран;
- `transitionend` не обязателен для логики;
- reduced-motion сохраняет функционал;
- снимки отключают motion, но не поведение.

## Следующие шаги

- вынести токены в CSS variables вместо магических чисел;
- проверить jank на слайдерах при быстрых кликах;
- добавить `?motion=off` для воспроизводимых снимков;
- прервать/перенаправить анимацию слайдера при повторном переключении;
- проверить focus/scroll при смене формата и отзыва.
