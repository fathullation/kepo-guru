import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { signOutAction } from '@/actions/auth-actions'
import { NavLink } from '@/components/dashboard/nav-link'
import { 
  LayoutDashboard, 
  BookOpen, 
  UserCircle, 
  LogOut, 
  Settings, 
  Users, 
  GraduationCap, 
  CalendarClock, 
  ArrowUpCircle, 
  ArchiveRestore, 
  CalendarDays 
} from 'lucide-react'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  
  // 1. Cek User
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Cek Profile & Role
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 3. Definisi Menu Berdasarkan Role
  const role = profile?.role || 'guru'

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-[#0f172a] text-gray-300 flex flex-col border-r border-gray-800 z-50 shadow-xl">
        
        {/* Brand */}
        <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-800 bg-[#0f172a]">
           <div className="bg-blue-600 p-1.5 rounded-lg">
             <GraduationCap size={20} className="text-white" />
           </div>
           <span className="text-lg font-bold text-white tracking-wide">Kepo Guru</span>
        </div>

        {/* Navigation Wrapper */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          
          {/* === MENU KHUSUS ADMIN === */}
          {role === 'admin' && (
            <>
              {/* Dashboard Utama */}
              <NavLink href="/dashboard/admin" icon={<LayoutDashboard size={18} />}>
                Statistik & Overview
              </NavLink>

              <NavLink href="/dashboard/admin/manajemen-user" icon={<Users size={18} />}>
                Manajemen User
              </NavLink>

              {/* Group Akademik */}
              <div className="mt-6 mb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Kontrol Akademik
              </div>

              <NavLink href="/dashboard/admin/akademik/tahun-ajaran" icon={<CalendarClock size={18} />}>
                Set Tahun Ajaran
              </NavLink>
              
              <NavLink href="/dashboard/admin/akademik/promosi-siswa" icon={<ArrowUpCircle size={18} />}>
                Promosi / Naik Kelas
              </NavLink>

              <NavLink href="/dashboard/admin/akademik/reset-roster" icon={<ArchiveRestore size={18} />}>
                Reset & Arsip
              </NavLink>

              {/* Group Jadwal */}
              <div className="mt-6 mb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Master Data
              </div>

              <NavLink href="/dashboard/admin/roster" icon={<CalendarDays size={18} />}>
                Master Roster
              </NavLink>

              <div className="my-4 border-t border-gray-800/50" />
            </>
          )}

          {/* === MENU KHUSUS GURU === */}
          {(role === 'guru' || role === 'wali_kelas') && (
            <>
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Akademik</p>
              <NavLink href="/dashboard/guru" icon={<LayoutDashboard size={18} />}>Dashboard</NavLink>
              <NavLink href="/dashboard/guru/jurnal" icon={<BookOpen size={18} />}>Jurnal Mengajar</NavLink>
              {/* Tambahkan menu lain seperti Absensi di sini nanti */}
            </>
          )}

           {/* === MENU UMUM (Semua Role Punya) === */}
           <div className="mt-8">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Pengaturan</p>
            <NavLink href="/dashboard/profile" icon={<UserCircle size={18} />}>Profil Saya</NavLink>
           </div>

        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-gray-800 bg-[#0b1120]">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold shadow-lg">
              {profile?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{profile?.full_name}</p>
              <p className="text-xs text-gray-500 truncate capitalize">{role.replace('_', ' ')}</p>
            </div>
          </div>
          <form action={signOutAction}>
            <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-md transition-colors group">
              <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> 
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="pl-64 w-full flex flex-col min-h-screen transition-all duration-300">
        
        {/* Header Sticky */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 px-8 flex items-center justify-between shadow-sm">
           <div className="flex items-center gap-4">
              <h2 className="text-sm text-gray-500">
                <span className="font-medium text-gray-900 capitalize">{role.replace('_', ' ')} Panel</span> / Overview
              </h2>
           </div>
           
           <div className="flex items-center gap-4">
             {/* Contoh Notifikasi Bell bisa ditaruh sini */}
             <div className="text-sm font-medium text-gray-700">
               Hi, {profile?.full_name?.split(' ')[0]}
             </div>
           </div>
        </header>

        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}