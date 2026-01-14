import { createClient } from '@/lib/supabase/server'
import { JurnalForm } from '@/components/forms/jurnal-form'
import { deleteJurnal } from '@/actions/jurnal-actions'
import { redirect } from 'next/navigation'
import { Trash2, Calendar, Book, Clock } from 'lucide-react'

export default async function GuruPage() {
  const supabase = await createClient()

  // 1. Cek User Session
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Fetch Data Jurnal (Hanya milik user yang sedang login)
  const { data: journals, error } = await supabase
    .from('jurnal')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Helper untuk format tanggal Indonesia
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Area Kerja Guru</h1>
          <p className="text-gray-500 text-sm">Kelola jurnal harian dan aktivitas mengajar Anda.</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium border border-blue-100 flex items-center gap-2">
            <Calendar size={16} />
            {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* BAGIAN KIRI: Form Input (1/3 Lebar Layar di Desktop) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
             <JurnalForm />
          </div>
        </div>

        {/* BAGIAN KANAN: Tabel Data (2/3 Lebar Layar di Desktop) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Book size={18} className="text-blue-600"/>
                    Riwayat Jurnal Mengajar
                </h3>
                <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded text-gray-600">
                    Total: {journals?.length || 0}
                </span>
            </div>
            
            <div className="overflow-x-auto">
              {journals && journals.length > 0 ? (
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3">Waktu & Kelas</th>
                      <th className="px-6 py-3">Materi & Mapel</th>
                      <th className="px-6 py-3">Catatan</th>
                      <th className="px-6 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {journals.map((jurnal) => (
                      <tr key={jurnal.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 align-top w-40">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-gray-900">{jurnal.kelas}</span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock size={12} />
                                {formatDate(jurnal.created_at)}
                                <br />
                                {formatTime(jurnal.created_at)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-blue-600">{jurnal.mapel}</span>
                            <p className="text-gray-600 line-clamp-2">{jurnal.materi}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top">
                           {jurnal.catatan ? (
                               <p className="text-gray-500 italic text-xs bg-yellow-50 p-2 rounded border border-yellow-100">
                                   "{jurnal.catatan}"
                               </p>
                           ) : (
                               <span className="text-gray-300">-</span>
                           )}
                        </td>
                        <td className="px-6 py-4 text-right align-top">
                          {/* Tombol Delete menggunakan Server Action */}
                          <form action={deleteJurnal.bind(null, jurnal.id)}>
                            <button 
                                type="submit" 
                                className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded transition-colors"
                                title="Hapus Jurnal"
                            >
                                <Trash2 size={16} />
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                // Empty State jika belum ada data
                <div className="p-12 text-center flex flex-col items-center justify-center text-gray-400">
                    <div className="bg-gray-50 p-4 rounded-full mb-3">
                        <Book size={32} className="text-gray-300" />
                    </div>
                    <p className="text-lg font-medium text-gray-600">Belum ada jurnal</p>
                    <p className="text-sm max-w-xs mx-auto mt-1">
                        Data jurnal yang Anda isi di formulir samping akan muncul di sini.
                    </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}