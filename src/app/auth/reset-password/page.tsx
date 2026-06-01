'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const passwordConfirm = formData.get('passwordConfirm') as string

    if (password !== passwordConfirm) {
      setError('Heslá sa nezhodujú.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Nastala chyba. Skúste to znova.')
        return
      }

      setDone(true)
    } catch {
      setError('Nastala chyba. Skúste to znova.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎯</div>
          <h1 className="text-3xl font-bold text-yellow-400">Nové heslo</h1>
          <p className="text-green-300 mt-2">Nastavte si nové heslo k vášmu účtu</p>
        </div>

        <div className="bg-green-950 border border-green-800 rounded-2xl p-8">
          {done ? (
            <div className="text-center">
              <div className="text-5xl mb-4">✅</div>
              <p className="text-green-300 mb-2 font-medium">Heslo bolo úspešne zmenené</p>
              <p className="text-gray-400 text-sm mb-6">
                Teraz sa môžete prihlásiť pomocou nového hesla.
              </p>
              <Link
                href="/auth/login"
                className="inline-block bg-yellow-500 hover:bg-yellow-400 text-green-950 font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Prihlásiť sa
              </Link>
            </div>
          ) : !token ? (
            <div className="text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <p className="text-red-300 mb-2 font-medium">Neplatný odkaz</p>
              <p className="text-gray-400 text-sm mb-6">
                Tento odkaz je neúplný alebo neplatný. Požiadajte o nový odkaz na obnovenie hesla.
              </p>
              <Link
                href="/auth/forgot-password"
                className="inline-block text-yellow-400 hover:text-yellow-300 font-medium"
              >
                Požiadať o nový odkaz
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-green-300 mb-2">
                    Nové heslo
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    placeholder="Minimálne 6 znakov"
                    className="w-full bg-green-900/30 border border-green-700 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="passwordConfirm" className="block text-sm font-medium text-green-300 mb-2">
                    Zopakujte nové heslo
                  </label>
                  <input
                    id="passwordConfirm"
                    name="passwordConfirm"
                    type="password"
                    required
                    minLength={6}
                    placeholder="Zopakujte heslo"
                    className="w-full bg-green-900/30 border border-green-700 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-700 disabled:cursor-not-allowed text-green-950 font-bold py-3 rounded-lg transition-colors"
                >
                  {loading ? 'Ukladám...' : 'Nastaviť nové heslo'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center text-green-300">Načítavam...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
