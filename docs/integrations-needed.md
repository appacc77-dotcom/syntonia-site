# Integrations needed

| Интеграция | Где | Что требуется | Кто даёт | Статус | Безопасное поведение |
|---|---|---|---|---|---|
| Booking form | `/booking.html` | endpoint, поля, получатель | владелец | blocked | demo-режим, без «заявка отправлена» |
| Checkout/payment | `/checkout-confirm.html` | провайдер, URLs, вебхуки | владелец | blocked | «оплата не подключена» |
| Auth/account | login/account pages | backend/session | владелец | blocked | demo-данные, без имитации защиты |
| Quiz result | `/quiz.html` | 9 вопросов + алгоритм результата | владелец/Figma | partial | показывать только шаги, результат не выдумывать |
| Email | footer | подтверждённый адрес | владелец | published | `mailto:hello@syntonia.com` |
| Telegram/Instagram/YouTube | footer | подтверждённые URL | владелец | blocked | текст без ссылок |
| Video/audio | media blocks | источники | владелец | blocked | без автозапуска и выдуманных роликов |
| Analytics/cookie | legal/cookie | политика, consent | владелец | blocked | без трекеров |
