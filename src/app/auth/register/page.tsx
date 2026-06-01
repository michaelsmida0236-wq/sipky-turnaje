'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Nastala chyba pri registrácii.')
        return
      }

      router.push('/auth/login?registered=1')
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
          <h1 className="text-3xl font-bold text-yellow-400">Registrácia klubu</h1>
          <p className="text-green-300 mt-2">Zaregistrujte váš šípkový klub</p>
        </div>

        <div className="bg-green-950 border border-green-800 rounded-2xl p-8">
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-green-300 mb-2">
                Názov klubu
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Šípkový klub Bratislava"
                className="w-full bg-green-900/30 border border-green-700 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
              />
            </div>

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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-green-300 mb-2">
                Heslo
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-700 disabled:cursor-not-allowed text-green-950 font-bold py-3 rounded-lg transition-colors"
            >
              {loading ? 'Registrujem...' : 'Zaregistrovať klub'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Už máte účet?{' '}
            <Link href="/auth/login" className="text-yellow-400 hover:text-yellow-300 font-medium">
              Prihláste sa
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
