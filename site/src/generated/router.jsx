import { Page } from './Page.jsx'
import { MastersPage } from './pages/masters.jsx'
import { LibraryPage } from './pages/library.jsx'
import { LibraryBookChapterPage } from './pages/library-book-chapter.jsx'
import { LibraryBookChapterIntroPage } from './pages/library-book-chapter-intro.jsx'
import { LibraryBookChapterTechniquePage } from './pages/library-book-chapter-technique.jsx'
import { LibraryBookChapterStoryPage } from './pages/library-book-chapter-story.jsx'
import { PracticePage } from './pages/practice.jsx'
import { QuizPage } from './pages/quiz.jsx'
import { BookingPage } from './pages/booking.jsx'
import { MethodPage } from './pages/method.jsx'
import { LoginPage } from './pages/login.jsx'
import { AccountPracticesPage } from './pages/account-practices.jsx'
import { AccountHistoryPage } from './pages/account-history.jsx'
import { AccountProfilePage } from './pages/account-profile.jsx'
import { PracticeDetailPage } from './pages/practice-detail.jsx'
import { ThanksBookingPage } from './pages/thanks-booking.jsx'
import { ThanksPurchasePage } from './pages/thanks-purchase.jsx'
import { NotFoundPage } from './pages/not-found.jsx'
import { LegalTermsPage } from './pages/legal-terms.jsx'
import { LegalPrivacyPage } from './pages/legal-privacy.jsx'
import { LegalRefundPage } from './pages/legal-refund.jsx'
import { LegalConsentPage } from './pages/legal-consent.jsx'
import { CheckoutConfirmPage } from './pages/checkout-confirm.jsx'

export const ROUTES = {
  '/': Page,
  '/index.html': Page,
  '/masters.html': MastersPage,
  '/library.html': LibraryPage,
  '/library/book-chapter.html': LibraryBookChapterPage,
  '/library/book-chapter-intro.html': LibraryBookChapterIntroPage,
  '/library/book-chapter-technique.html': LibraryBookChapterTechniquePage,
  '/library/book-chapter-story.html': LibraryBookChapterStoryPage,
  '/practice.html': PracticePage,
  '/quiz.html': QuizPage,
  '/booking.html': BookingPage,
  '/method.html': MethodPage,
  '/login.html': LoginPage,
  '/account-practices.html': AccountPracticesPage,
  '/account-history.html': AccountHistoryPage,
  '/account-profile.html': AccountProfilePage,
  '/practice-detail.html': PracticeDetailPage,
  '/thanks-booking.html': ThanksBookingPage,
  '/thanks-purchase.html': ThanksPurchasePage,
  '/not-found.html': NotFoundPage,
  '/legal-terms.html': LegalTermsPage,
  '/legal-privacy.html': LegalPrivacyPage,
  '/legal-refund.html': LegalRefundPage,
  '/legal-consent.html': LegalConsentPage,
  '/checkout-confirm.html': CheckoutConfirmPage,
}
