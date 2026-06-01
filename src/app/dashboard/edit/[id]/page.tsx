import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { EventForm } from '@/components/EventForm'

export default async function EditEventPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/auth/login')

  const clubId = (session.user as any).id

  const event = await prisma.event.findUnique({
    where: { id: params.id },
  })

  if (!event || event.clubId !== clubId) {
    notFound()
  }

  // Format date for datetime-local input
  const dateLocal = new Date(event.date.getTime() - event.date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-yellow-400">Upraviť turnaj</h1>
        <p className="text-green-300 mt-1">{event.title}</p>
      </div>
      <EventForm
        mode="edit"
        eventId={event.id}
        defaultValues={{
          title: event.title,
          description: event.description,
          date: dateLocal,
          location: event.location,
          maxParticipants: event.maxParticipants?.toString() ?? '',
          contactInfo: event.contactInfo,
        }}
      />
    </div>
  )
}
