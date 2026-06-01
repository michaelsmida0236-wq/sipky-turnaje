'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function DeleteEventButton({ eventId }: { eventId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('Naozaj chcete vymazať tento turnaj?')) return

    setLoading(true)
    try {
      const res = await fetch(`/api/events/${eventId}`, { method: 'DELETE' })
      if (res.ok) {
        router.refresh()
      } else {
        alert('Chyba pri mazaní turnaja.')
      }
    } catch {
      alert('Nastala chyba.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-400 hover:text-red-300 disabled:opacity-50 text-sm px-3 py-1.5 border border-red-900 rounded-lg transition-colors"
    >
      {loading ? '...' : 'Vymazať'}
    </button>
  )
}
