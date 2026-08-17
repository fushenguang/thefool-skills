import { I18nProvider } from 'fumadocs-ui/contexts/i18n'
import type { ReactNode } from 'react'

interface LayoutParams {
  lang: string
}

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<LayoutParams>
}) {
  const { lang } = await params

  return (
    <I18nProvider
      locale={lang}
      locales={[
        { locale: 'en', name: 'English' },
        { locale: 'zh', name: '中文' },
      ]}
    >
      {children}
    </I18nProvider>
  )
}
