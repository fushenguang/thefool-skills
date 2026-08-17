import { createI18nMiddleware } from 'fumadocs-core/i18n/middleware'

// Rewrites incoming requests so the `app/[lang]/...` routes always receive an explicit locale
// segment, while `hideLocale: 'default-locale'` (see lib/source.ts) keeps English unprefixed in
// the URL bar (`/docs/...`) and only prefixes the secondary locale (`/zh/docs/...`). Must stay
// in sync with the `languages` / `defaultLanguage` in lib/source.ts.
export default createI18nMiddleware({
  languages: ['en', 'zh'],
  defaultLanguage: 'en',
  hideLocale: 'default-locale',
})

// Scope the rewrite to the docs routes only — the home page ("/") lives outside
// `app/[lang]/...` (see app/(home)/page.tsx) and must not be swallowed by the locale rewrite.
export const config = {
  matcher: ['/docs', '/docs/:path*', '/zh', '/zh/:path*'],
}
