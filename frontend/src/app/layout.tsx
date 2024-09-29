import React from 'react'
import AuthProvider from '@/components/providers/AuthProvider'
import ToastProvider from '@/components/providers/ToastProvider'
import Container from '@/layout/Container/index'
import HeaderController from "@/layout/HeaderController";
import { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'GARDEN',
  description: 'GARDEN Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <title>GARDEN</title>
        <meta name="description" content="GARDEN Application" />
      </head>
      <body style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          margin: 0
      }}>
      <AuthProvider>
          <Container style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <HeaderController/>
              <main style={{ flex: 1}}>
                  {children}
              </main>
          </Container>
          <ToastProvider/>
      </AuthProvider>
      </body>
    </html>
  )
}