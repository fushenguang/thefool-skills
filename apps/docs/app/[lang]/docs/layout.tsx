import { source } from '@/lib/source'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import type { ReactNode } from 'react'

interface LayoutParams {
  lang: string
}

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<LayoutParams>
}) {
  const { lang } = await params

  return (
    <DocsLayout tree={source.getPageTree(lang)} i18n nav={{ title: 'Docs' }}>
      {children}
    </DocsLayout>
  )
}
