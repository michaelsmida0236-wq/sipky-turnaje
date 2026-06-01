'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export function NavBar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-green-950 border-b border-green-800 shadow-lg">
      <div className="container mx-auto px-4 max-w-6xl flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 text-yellow-400 font-bold text-xl hover:text-yellow-300 transition-colors">
          <span className="text-2xl">🎯</span>
          <span>Šípkové turnaje</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-green-200 hover:text-yellow-400 transition-colors font-medium"
          >
            Turnaje
          </Link>

          {session ? (
            <>
              <Link
                href="/dashboard"
                className="text-green-200 hover:text-yellow-400 transition-colors font-medium"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-green-400 text-sm">{session.user?.name}</span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="bg-red-800 hover:bg-red-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
                >
                  Odhlásiť
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="text-green-200 hover:text-yellow-400 transition-colors font-medium"
              >
                Prihlásenie
              </Link>
              <Link
                href="/auth/register"
                className="bg-yellow-500 hover:bg-yellow-400 text-green-950 px-4 py-1.5 rounded-md text-sm font-bold transition-colors"
              >
                Registrácia
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
