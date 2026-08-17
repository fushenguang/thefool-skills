import { RootProvider } from 'fumadocs-ui/provider/next'
import './global.css'
import type { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProvider
          i18n={{
            locale: 'en',
            locales: [
              { locale: 'en', name: 'English' },
              { locale: 'zh', name: '中文' },
            ],
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  )
}
