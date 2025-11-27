import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

export default async function ParticipantDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  
  // Check if user is authenticated and is a participant
  if (!session?.user || (session.user as any).role !== 'participant') {
    redirect('/participant/login')
  }

  return <>{children}</>
}

