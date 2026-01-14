import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardRoot() {
  const supabase = await createClient()

  // 1. Cek Session
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Cek Role User
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // 3. Arahkan sesuai Role
  const role = profile?.role

  if (role === 'admin') {
    redirect('/dashboard/admin')
  } else if (role === 'guru' || role === 'wali_kelas' || role === 'guru_bk') {
    redirect('/dashboard/guru')
  } else {
    // Fallback jika role tidak dikenali (atau user baru)
    redirect('/dashboard/guru')
  }
  
  // Halaman ini tidak me-render UI apa-apa, hanya logic redirect.
  return null
}