import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { DeleteEventButton } from '@/components/DeleteEventButton'

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('sk-SK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/login')
  }

  const clubId = (session.user as any).id

  const [club, events] = await Promise.all([
    prisma.club.findUnique({ where: { id: clubId }, select: { name: true } }),
    prisma.event.findMany({
      where: { clubId },
      orderBy: { date: 'asc' },
    }),
  ])

  const now = new Date()
  const upcomingEvents = events.filter((e) => new Date(e.date) >= now)
  const pastEvents = events.filter((e) => new Date(e.date) < now)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-yellow-400">Dashboard</h1>
          <p className="text-green-300 mt-1">{club?.name}</p>
        </div>
        <Link
          href="/dashboard/new"
          className="bg-yellow-500 hover:bg-yellow-400 text-green-950 font-bold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2"
        >
          <span>+</span> Pridať turnaj
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-green-950 border border-green-800 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-yellow-400">{events.length}</div>
          <div className="text-green-400 text-sm mt-1">Celkom turnajov</div>
        </div>
        <div className="bg-green-950 border border-green-800 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-yellow-400">{upcomingEvents.length}</div>
          <div className="text-green-400 text-sm mt-1">Nadchádzajúce</div>
        </div>
        <div className="bg-green-950 border border-green-800 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-yellow-400">{pastEvents.length}</div>
          <div className="text-green-400 text-sm mt-1">Odohraté</div>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20 bg-green-950 border border-green-800 rounded-2xl">
          <div className="text-5xl mb-4">🎯</div>
          <p className="text-xl text-gray-400">Zatiaľ nemáte žiadne turnaje.</p>
          <p className="text-gray-600 mt-2 mb-6">Pridajte prvý turnaj pre váš klub!</p>
          <Link
            href="/dashboard/new"
            className="bg-yellow-500 hover:bg-yellow-400 text-green-950 font-bold px-8 py-3 rounded-lg transition-colors"
          >
            Pridať prvý turnaj
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-green-300">Vaše turnaje</h2>
          {events.map((event) => {
            const isPast = new Date(event.date) < now
            return (
              <div
                key={event.id}
                className={`bg-green-950 border rounded-xl p-6 flex items-start justify-between gap-4 ${
                  isPast ? 'border-gray-800 opacity-60' : 'border-green-800'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-yellow-400 truncate">{event.title}</h3>
                    {isPast && (
                      <span className="text-xs bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full shrink-0">
                        Ukončené
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-green-400">
                    <span>📅 {formatDate(event.date)}</span>
                    <span>📍 {event.location}</span>
                    {event.maxParticipants && <span>👥 {event.maxParticipants}</span>}
                  </div>
                  <p className="text-gray-500 text-sm mt-2 line-clamp-1">{event.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/events/${event.id}`}
                    className="text-green-400 hover:text-green-300 text-sm px-3 py-1.5 border border-green-800 rounded-lg transition-colors"
                  >
                    Detail
                  </Link>
                  <Link
                    href={`/dashboard/edit/${event.id}`}
                    className="text-yellow-400 hover:text-yellow-300 text-sm px-3 py-1.5 border border-yellow-800 rounded-lg transition-colors"
                  >
                    Upraviť
                  </Link>
                  <DeleteEventButton eventId={event.id} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
