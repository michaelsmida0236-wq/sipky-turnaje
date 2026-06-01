'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface EventFormProps {
  mode: 'create' | 'edit'
  eventId?: string
  defaultValues?: {
    title: string
    description: string
    date: string
    location: string
    maxParticipants: string
    contactInfo: string
  }
}

export function EventForm({ mode, eventId, defaultValues }: EventFormProps) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const body = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      date: formData.get('date') as string,
      location: formData.get('location') as string,
      maxParticipants: formData.get('maxParticipants')
        ? parseInt(formData.get('maxParticipants') as string)
        : null,
      contactInfo: formData.get('contactInfo') as string,
    }

    try {
      const url = mode === 'create' ? '/api/events' : `/api/events/${eventId}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Nastala chyba.')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Nastala chyba. Skúste to znova.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-green-950 border border-green-800 rounded-2xl p-8">
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-green-300 mb-2">
            Názov turnaja *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={defaultValues?.title}
            placeholder="napr. Jesenný šípkový turnaj 2024"
            className="w-full bg-green-900/30 border border-green-700 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-green-300 mb-2">
            Popis turnaja *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={5}
            defaultValue={defaultValues?.description}
            placeholder="Podrobný popis turnaja, pravidlá, ceny..."
            className="w-full bg-green-900/30 border border-green-700 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors resize-y"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-green-300 mb-2">
              Dátum a čas *
            </label>
            <input
              id="date"
              name="date"
              type="datetime-local"
              required
              defaultValue={defaultValues?.date}
              className="w-full bg-green-900/30 border border-green-700 rounded-lg px-4 py-2.5 text-gray-100 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="maxParticipants" className="block text-sm font-medium text-green-300 mb-2">
              Max. účastníkov (voliteľné)
            </label>
            <input
              id="maxParticipants"
              name="maxParticipants"
              type="number"
              min="1"
              defaultValue={defaultValues?.maxParticipants}
              placeholder="napr. 32"
              className="w-full bg-green-900/30 border border-green-700 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-green-300 mb-2">
            Miesto konania *
          </label>
          <input
            id="location"
            name="location"
            type="text"
            required
            defaultValue={defaultValues?.location}
            placeholder="napr. Hospoda U Šípkara, Bratislava"
            className="w-full bg-green-900/30 border border-green-700 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="contactInfo" className="block text-sm font-medium text-green-300 mb-2">
            Kontaktné informácie *
          </label>
          <input
            id="contactInfo"
            name="contactInfo"
            type="text"
            required
            defaultValue={defaultValues?.contactInfo}
            placeholder="napr. +421 900 000 000 alebo info@klub.sk"
            className="w-full bg-green-900/30 border border-green-700 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
          />
        </div>

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-700 disabled:cursor-not-allowed text-green-950 font-bold py-3 rounded-lg transition-colors"
          >
            {loading
              ? mode === 'create' ? 'Ukladám...' : 'Aktualizujem...'
              : mode === 'create' ? 'Pridať turnaj' : 'Uložiť zmeny'}
          </button>
          <Link
            href="/dashboard"
            className="px-6 py-3 border border-green-700 text-green-300 hover:border-green-500 hover:text-green-200 rounded-lg transition-colors font-medium text-center"
          >
            Zrušiť
          </Link>
        </div>
      </form>
    </div>
  )
}
