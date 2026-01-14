import { createClient } from '@/lib/supabase/server'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Profil Saya</h2>
      <div className="space-y-4">
        <div>
            <label className="text-sm text-gray-500">Nama Lengkap</label>
            <p className="font-medium">{profile?.full_name}</p>
        </div>
        <div>
            <label className="text-sm text-gray-500">Email</label>
            <p className="font-medium">{profile?.email}</p>
        </div>
        <div>
            <label className="text-sm text-gray-500">Role Akses</label>
            <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
                {profile?.role}
            </span>
        </div>
      </div>
    </div>
  )
}