'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Nastala chyba. Skúste to znova.')
        return
      }

      setSent(true)
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
          <h1 className="text-3xl font-bold text-yellow-400">Zabudnuté heslo</h1>
          <p className="text-green-300 mt-2">Pošleme vám odkaz na obnovenie hesla</p>
        </div>

        <div className="bg-green-950 border border-green-800 rounded-2xl p-8">
          {sent ? (
            <div className="text-center">
              <div className="text-5xl mb-4">📧</div>
              <p className="text-green-300 mb-2 font-medium">Skontrolujte svoju e-mailovú schránku</p>
              <p className="text-gray-400 text-sm">
                Ak je zadaný email registrovaný, poslali sme naň odkaz na obnovenie hesla.
                Odkaz je platný 1 hodinu. Nezabudnite skontrolovať aj priečinok so spamom.
              </p>
              <Link
                href="/auth/login"
                className="inline-block mt-6 text-yellow-400 hover:text-yellow-300 font-medium"
              >
                ← Späť na prihlásenie
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">
                  {error}
                </div>
              )}

              <p className="text-gray-400 text-sm mb-6">
                Zadajte email, ktorým ste zaregistrovali svoj klub. Pošleme vám naň odkaz
                na nastavenie nového hesla.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-green-300 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="klub@example.com"
                    className="w-full bg-green-900/30 border border-green-700 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-700 disabled:cursor-not-allowed text-green-950 font-bold py-3 rounded-lg transition-colors"
                >
                  {loading ? 'Odosielam...' : 'Poslať odkaz na obnovenie'}
                </button>
              </form>

              <p className="text-center text-gray-500 text-sm mt-6">
                Spomenuli ste si?{' '}
                <Link href="/auth/login" className="text-yellow-400 hover:text-yellow-300 font-medium">
                  Späť na prihlásenie
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
