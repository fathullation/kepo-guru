import Link from 'next/link'
import { 
  ArrowLeft, 
  ClipboardList, 
  Book, 
  Shield, 
  Users, 
  Printer, 
  Smartphone,
  Instagram,
  GraduationCap
} from 'lucide-react'

export default function FiturPage() {
  // Data Fitur disesuaikan dengan layout kotak-kotak di HTML target
  const features = [
    {
      title: "Manajemen Guru Terpusat",
      desc: "Kelola Guru Mata Pelajaran, Guru Wali, dan Wali Kelas dalam satu platform mudah.",
      icon: <ClipboardList className="w-4 h-4" />,
      color: "indigo"
    },
    {
      title: "Jurnal Mengajar Digital",
      desc: "Catat kegiatan harian guru. Terintegrasi langsung dengan laporan kinerja.",
      icon: <Book className="w-4 h-4" />,
      color: "purple"
    },
    {
      title: "E-Roster",
      desc: "Roster pelajaran yang fleksibel dan mudah disesuaikan dengan kebutuhan sekolah.",
      icon: <Shield className="w-4 h-4" />,
      color: "pink"
    },
    {
      title: "Wali Kelas dan Guru Wali",
      desc: "Pengelolaan wali kelas dan guru wali untuk monitoring perkembangan siswa.",
      icon: <Users className="w-4 h-4" />,
      color: "orange"
    },
    {
      title: "Cetak Laporan",
      desc: "Export laporan bulanan & semesteran format PDF siap cetak satu klik.",
      icon: <Printer className="w-4 h-4" />,
      color: "blue"
    },
    {
      title: "Akses Mobile",
      desc: "Desain responsif. Akses data dari HP maupun Laptop dengan nyaman.",
      icon: <Smartphone className="w-4 h-4" />,
      color: "teal"
    },
  ]

  // Helper untuk menangani warna dinamis (karena Tailwind tidak bisa string interpolation sembarangan)
  const getColors = (color: string) => {
    const themes: any = {
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'group-hover:border-indigo-100' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'group-hover:border-purple-100' },
      pink:   { bg: 'bg-pink-50',   text: 'text-pink-600',   border: 'group-hover:border-pink-100' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'group-hover:border-orange-100' },
      blue:   { bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'group-hover:border-blue-100' },
      teal:   { bg: 'bg-teal-50',   text: 'text-teal-600',   border: 'group-hover:border-teal-100' },
    }
    return themes[color] || themes.indigo
  }

  return (
    <div className="bg-slate-50 font-sans antialiased h-screen w-screen overflow-hidden flex flex-col">

      {/* --- HEADER --- */}
      <header className="fixed w-full z-50 top-0 left-0 bg-white/90 backdrop-blur-md border-b border-slate-100 h-16 flex items-center shadow-sm">
        <nav className="container mx-auto px-4 flex justify-between items-center w-full">
          <Link href="/" className="flex items-center space-x-2 group">
            {/* Logo diganti Icon agar tidak error gambar missing */}
            <GraduationCap className="h-8 w-8 text-indigo-600 group-hover:scale-105 transition duration-300" />
            <span className="font-extrabold text-lg text-slate-800 tracking-tight">
              KEPO GURU<span className="text-indigo-600">.</span>
            </span>
          </Link>
          <Link href="/" className="text-slate-500 hover:text-indigo-600 font-bold text-xs md:text-sm transition flex items-center gap-2">
            <ArrowLeft size={16} /> <span className="hidden md:inline">Kembali</span>
          </Link>
        </nav>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 pt-16 h-full overflow-y-auto lg:overflow-hidden flex flex-col justify-center relative">
        
        {/* Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>

        <div className="w-full h-full max-w-[1400px] mx-auto p-4 lg:p-6 flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch">
            
          {/* BAGIAN KIRI: List Fitur */}
          <div className="flex-1 flex flex-col justify-center space-y-4">
            
            <div className="text-left pl-2">
              <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 leading-tight">
                Fitur Unggulan <span className="text-indigo-600">KEPO GURU</span>
              </h1>
              <p className="text-slate-500 text-sm mt-1 max-w-xl">
                Platform administrasi sekolah yang efisien, aman, dan mudah digunakan.
              </p>
            </div>

            {/* Grid Kartu Fitur */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 h-auto lg:h-full lg:max-h-[70vh] overflow-y-auto pr-2 pb-2">
              {features.map((item, index) => {
                const style = getColors(item.color)
                return (
                  <div key={index} className={`bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md ${style.border} transition group cursor-default`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${style.bg} ${style.text} group-hover:scale-110 transition`}>
                        {item.icon}
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm">{item.title}</h3>
                    </div>
                    <p className="text-xs text-slate-500 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* BAGIAN KANAN: Profil Pengembang */}
          <div className="w-full lg:w-[320px] xl:w-[380px] shrink-0 flex flex-col">
            <div className="h-full bg-gradient-to-br from-indigo-600 to-purple-800 rounded-2xl p-6 lg:p-8 shadow-2xl text-white flex flex-col justify-between relative overflow-hidden min-h-[400px]">
              
              {/* Efek Hiasan di Card */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>

              <div className="flex flex-col items-center text-center space-y-4 mt-4">
                <div className="relative">
                  <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full border-4 border-white/20 overflow-hidden shadow-lg bg-white flex items-center justify-center">
                    {/* Placeholder Foto Profil (Ganti tag img jika sudah ada file) */}
                    <Users className="w-12 h-12 text-indigo-300" />
                  </div>
                  <div className="absolute bottom-1 right-1 bg-green-400 w-5 h-5 rounded-full border-2 border-indigo-700" title="Online"></div>
                </div>

                <div>
                  <h2 className="text-xl lg:text-2xl font-bold">Tentang Pengembang</h2>
                  <a href="#" className="text-indigo-200 text-xs font-medium hover:text-white transition underline decoration-indigo-400/50">
                    Fathullah, S.Pd., Gr.
                  </a>
                </div>

                <p className="text-indigo-100 text-xs lg:text-sm leading-relaxed opacity-90">
                  "Mendedikasikan teknologi untuk mempermudah administrasi, agar Guru bisa fokus mendidik siswa sepenuh hati."
                </p>
              </div>

              <div className="flex justify-center gap-3 mt-6">
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/30 flex items-center justify-center transition">
                  <Instagram size={16} />
                </a>
              </div>

              <div className="mt-auto pt-6 text-center border-t border-white/10">
                <p className="text-[10px] text-indigo-200">
                  © {new Date().getFullYear()} Kepo Guru.<br/>All rights reserved.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}