import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI News Dashboard',
  description: 'News articles with AI-powered summaries',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}
