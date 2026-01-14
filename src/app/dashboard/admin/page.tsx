import { createClient } from '@/lib/supabase/server'
import { Users, School, BookOpen, ServerCrash } from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // CONTOH: Mengambil data real count dari database
  // (Pastikan RLS policy mengizinkan admin membaca tabel ini)
  const { count: guruCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'guru')
  const { count: siswaCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'siswa') // Asumsi ada role siswa nanti

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrator</h1>
        <p className="text-gray-500 mt-2">Monitoring status sistem dan statistik akademik.</p>
      </div>

      {/* Grid Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Guru" 
          value={guruCount || 0} 
          desc="Guru aktif terdaftar"
          icon={<Users className="text-blue-600" />} 
          bg="bg-blue-100"
        />
        <StatCard 
          title="Total Siswa" 
          value={siswaCount || 0} // Placeholder jika belum ada data siswa
          desc="Siswa dalam sistem"
          icon={<School className="text-emerald-600" />} 
          bg="bg-emerald-100"
        />
        <StatCard 
          title="Tahun Ajaran" 
          value="2023/2024" 
          desc="Semester Genap"
          icon={<BookOpen className="text-purple-600" />} 
          bg="bg-purple-100"
        />
        <StatCard 
          title="Status Sistem" 
          value="Online" 
          desc="Database Connected"
          icon={<ServerCrash className="text-orange-600" />} 
          bg="bg-orange-100"
        />
      </div>

      {/* Quick Actions Area */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Aktivitas Sistem Terbaru</h3>
          <div className="space-y-4">
             {/* Mockup Data Log */}
             {[1, 2, 3].map((i) => (
               <div key={i} className="flex items-center gap-3 text-sm border-b pb-3 last:border-0">
                 <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                 <span className="text-gray-500">10:0{i} AM</span>
                 <span className="font-medium text-gray-700">User baru ditambahkan oleh Admin</span>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <h3 className="font-bold text-lg mb-2">Perlu Bantuan?</h3>
          <p className="text-slate-300 text-sm mb-6">
            Pastikan melakukan backup data roster sebelum melakukan reset tahun ajaran baru.
          </p>
          <button className="px-4 py-2 bg-white text-slate-900 text-sm font-bold rounded-lg hover:bg-slate-100 transition-colors">
            Lihat Dokumentasi Teknis
          </button>
        </div>
      </div>
    </div>
  )
}

// Component Kecil untuk Card
function StatCard({ title, value, desc, icon, bg }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${bg}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      <p className="font-medium text-gray-700">{title}</p>
      <p className="text-xs text-gray-400 mt-1">{desc}</p>
    </div>
  )
}