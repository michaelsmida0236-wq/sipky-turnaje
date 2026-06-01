import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('sk-SK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export default async function HomePage() {
  const events = await prisma.event.findMany({
    where: {
      date: {
        gte: new Date(),
      },
    },
    orderBy: { date: 'asc' },
    include: { club: { select: { name: true } } },
  })

  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-12 py-10">
        <div className="text-6xl mb-4">🎯</div>
        <h1 className="text-4xl font-bold text-yellow-400 mb-3">
          Šípkové turnaje
        </h1>
        <p className="text-green-300 text-lg max-w-xl mx-auto">
          Prehľad všetkých nadchádzajúcich turnajov a podujatí šípkových klubov na Slovensku.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-xl">Momentálne nie sú naplánované žiadne turnaje.</p>
          <p className="mt-2 text-sm">Skúste sa prihlásiť ako klub a pridajte prvý turnaj!</p>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-semibold text-green-300 mb-6">
            Nadchádzajúce turnaje ({events.length})
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="block bg-green-950 border border-green-800 rounded-xl p-6 hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-900/20 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-medium bg-green-900 text-green-300 px-2 py-1 rounded-full">
                    {event.club.name}
                  </span>
                  {event.maxParticipants && (
                    <span className="text-xs text-gray-500">
                      Max: {event.maxParticipants} hráčov
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors mb-2 line-clamp-2">
                  {event.title}
                </h3>

                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {event.description}
                </p>

                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-green-300">
                    <span>📅</span>
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-300">
                    <span>📍</span>
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="mt-4 text-yellow-500 text-sm font-medium group-hover:text-yellow-400">
                  Zobraziť detail →
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
