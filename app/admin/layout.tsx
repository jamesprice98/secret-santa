import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { headers } from 'next/headers'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  
  // Don't protect the login page
  if (pathname !== '/admin/login') {
    const session = await getSession()
    if (!session?.user || (session.user as any).role !== 'admin') {
      redirect('/admin/login')
    }
  }

  return <>{children}</>
}

