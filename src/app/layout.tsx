import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'
import { NavBar } from '@/components/NavBar'

export const metadata: Metadata = {
  title: 'Šípkové turnaje',
  description: 'Portál pre šípkové kluby a turnaje',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sk">
      <body className="bg-gray-950 text-gray-100 min-h-screen">
        <Providers>
          <NavBar />
          <main className="container mx-auto px-4 py-8 max-w-6xl">
            {children}
          </main>
          <footer className="border-t border-green-900 mt-16 py-8 text-center text-gray-500 text-sm">
            <p>© 2024 Šípkové turnaje · Portál pre šípkové kluby</p>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
