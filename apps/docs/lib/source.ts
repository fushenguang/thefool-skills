import { docs } from 'collections/server'
import { loader } from 'fumadocs-core/source'

// i18n: English is the default language and is not prefixed in the URL (`/docs/...`);
// Chinese is served under `/zh/docs/...`. See proxy.ts for the request-time rewrite that makes
// the unprefixed default work, and content/docs/{en,zh}/ for the per-language content tree
// (`parser: 'dir'` — one subdirectory per language, matching this repo's Language Policy in
// AGENTS.md: full pages must never mix English and Chinese in the same file).
export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  i18n: {
    languages: ['en', 'zh'],
    defaultLanguage: 'en',
    hideLocale: 'default-locale',
    parser: 'dir',
  },
})
