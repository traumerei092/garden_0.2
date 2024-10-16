'use client'

import React from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Header from '@/layout/Header/index'
import { useSession } from 'next-auth/react'

const HeaderController: React.FC = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  // 非表示にするパスのリスト
  const hiddenPaths = ['/', '/login', '/signup', '/map']

  // 店舗詳細ページのパターン
  const shopDetailPattern = /^\/shops\/\d+$/

  const showHeader = !hiddenPaths.includes(pathname || '') && !shopDetailPattern.test(pathname || '')

  if (!showHeader) return null

  return <Header userEmail={session?.user?.email} />
}

export default HeaderController