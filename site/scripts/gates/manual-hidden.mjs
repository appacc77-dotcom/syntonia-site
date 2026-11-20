// Вручную скрытые блоки (без удаления из разметки).
// Если на странице скрыты разделы, её раскладка больше не совпадает с макетом:
// golden-скриншот и contract-геометрия заведомо «красные», поэтому такие маршруты
// исключаются из сверки, но остаются в отчёте со статусом SKIP.
// Вернуть сверку = убрать маршрут отсюда после возврата блоков.
export const MANUAL_HIDDEN = {
  '/masters.html': {
    reason: 'скрыты team-head и карточки мастеров Наталья Уолс / Ангелина Гебо (SHOW_TEAM_HEAD, VISIBLE_MASTERS в masters/Section02.jsx)',
    golden: true,
    contract: true,
  },
  '/practice.html': {
    reason: 'скрыт блок SOS-алгоритм (SHOW_SOS_ALGORITHM в practice/Section07.jsx)',
    golden: true,
    contract: true,
  },
}

export function hiddenFor(route) {
  return MANUAL_HIDDEN[route] || null
}
