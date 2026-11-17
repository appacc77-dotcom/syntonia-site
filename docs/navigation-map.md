# Navigation map

## Маршруты

| ID | Путь | Статус |
|---|---|---|
| home | `/` | published |
| method | `/method.html` | published |
| masters | `/masters.html` | published |
| practices | `/practice.html` | published |
| practice-detail | `/practice-detail.html` | published, без practiceId |
| library | `/library.html` | published |
| library-book | `/library/book-chapter.html` | published |
| library-intro | `/library/book-chapter-intro.html` | published |
| library-technique | `/library/book-chapter-technique.html` | published |
| library-story | `/library/book-chapter-story.html` | published |
| quiz | `/quiz.html` | published, только 1 вопрос |
| booking | `/booking.html` | published, форма demo |
| checkout | `/checkout-confirm.html` | published, оплата не подключена |
| login | `/login.html` | published, auth demo |
| account-practices | `/account-practices.html` | published, demo |
| account-history | `/account-history.html` | published, demo |
| account-profile | `/account-profile.html` | published, demo |
| thanks-booking | `/thanks-booking.html` | published |
| thanks-purchase | `/thanks-purchase.html` | published |
| not-found | `/not-found.html` | published |
| legal-terms | `/legal-terms.html` | published |
| legal-privacy | `/legal-privacy.html` | published |
| legal-refund | `/legal-refund.html` | published |
| legal-consent | `/legal-consent.html` | published |

## CTA

| Зона | Куда | Статус |
|---|---|---|
| Header nav | `/`, `/quiz.html`, `/practice.html` | real links on home only |
| Header CTA | `/booking.html` | link |
| Footer nav | home/practice/library/legal | links; footer только на главной |
| Section08 «Начать с точки входа» | `/booking.html` | link |
| Section09 «Перейти к записи» | `/booking.html` | selected format CTA |
| Section11 «Открыть библиотеку» | `/library.html` | link |
| Section13 «Задать вопрос» | `/booking.html` | link |
| Method CTA | `/booking.html` | link |
| Booking CTA | `/booking.html` | link |
| Masters / not-found library CTA | `/library.html` | link |
| Footer email | `mailto:hello@syntonia.com` | link |

## Проблемы

- `resolveRoute()` неизвестный путь отдаёт главную — исправить на not-found.
- Header/footer отсутствуют на внутренних страницах.
- Нет подтверждённых внешних URL соцсетей/видео.
- `practice-detail` не принимает/валидирует `practiceId`.
