import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('sk-SK', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export default async function EventDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: { club: { select: { name: true, email: true } } },
  })

  if (!event) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-green-400 hover:text-yellow-400 transition-colors mb-6 text-sm"
      >
        ← Späť na zoznam turnajov
      </Link>

      <div className="bg-green-950 border border-green-800 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-900 to-green-950 p-8 border-b border-green-800">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium bg-green-800 text-green-300 px-3 py-1 rounded-full">
              {event.club.name}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">{event.title}</h1>
        </div>

        {/* Details */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-900/40 rounded-xl p-4">
              <div className="text-green-400 text-sm font-medium mb-1">📅 Dátum a čas</div>
              <div className="text-gray-100 font-semibold capitalize">{formatDate(event.date)}</div>
            </div>

            <div className="bg-green-900/40 rounded-xl p-4">
              <div className="text-green-400 text-sm font-medium mb-1">📍 Miesto konania</div>
              <div className="text-gray-100 font-semibold">{event.location}</div>
            </div>

            {event.maxParticipants && (
              <div className="bg-green-900/40 rounded-xl p-4">
                <div className="text-green-400 text-sm font-medium mb-1">👥 Max. účastníkov</div>
                <div className="text-gray-100 font-semibold">{event.maxParticipants} hráčov</div>
              </div>
            )}

            <div className="bg-green-900/40 rounded-xl p-4">
              <div className="text-green-400 text-sm font-medium mb-1">📞 Kontakt</div>
              <div className="text-gray-100 font-semibold">{event.contactInfo}</div>
            </div>
          </div>

          <div>
            <h2 className="text-green-400 text-sm font-medium mb-2">📋 Popis turnaja</h2>
            <div className="bg-green-900/20 rounded-xl p-4 text-gray-200 leading-relaxed whitespace-pre-wrap">
              {event.description}
            </div>
          </div>

          <div className="pt-4 border-t border-green-800 text-sm text-gray-500">
            Organizátor: <span className="text-green-400">{event.club.name}</span>
            {' · '}
            Pridané: {new Intl.DateTimeFormat('sk-SK').format(new Date(event.createdAt))}
          </div>
        </div>
      </div>
    </div>
  )
}
