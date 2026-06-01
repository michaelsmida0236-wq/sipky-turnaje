import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { EventForm } from '@/components/EventForm'

export default async function NewEventPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/auth/login')

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-yellow-400">Nový turnaj</h1>
        <p className="text-green-300 mt-1">Pridajte nový turnaj pre váš klub</p>
      </div>
      <EventForm mode="create" />
    </div>
  )
}
