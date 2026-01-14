// src/app/(guest)/page.tsx
import Link from "next/link";
import { GraduationCap, ArrowRight, BookOpen, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar Sederhana */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <GraduationCap className="text-blue-600" />
            Kepo Guru
          </div>
          <div className="flex gap-4">
            <Link 
              href="/login" 
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all"
            >
              Masuk
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-20 pb-16 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            KEPO Guru
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Kendali Elektronik </h1>
            <h2 className="text-3xl md:text-4xl font-extrabold text-blue-600">Pelayanan & Operasional</h2>
          
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Platform terintegrasi untuk Guru Mata Pelajaran, Guru Wali, Guru BK, dan Wali Kelas. 
            Pantau jurnal, roster, dan perkembangan siswa dalam satu dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              Mulai Sekarang <ArrowRight size={18} />
            </Link>
            <Link 
              href="/fitur"
              className="inline-block w-full sm:w-auto px-8 py-3.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all text-center"
            >
              Pelajari Fitur
            </Link>
          </div>
        </div> 
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 text-left">
          <FeatureCard 
            icon={<BookOpen className="text-blue-600" />}
            title="Jurnal Digital"
            desc="Catat aktivitas mengajar harian dengan mudah, otomatis terekap dan bisa diakses kapan saja."
          />
          <FeatureCard 
            icon={<Users className="text-emerald-600" />}
            title="Monitoring Siswa"
            desc="Guru BK dan Wali Kelas dapat berkolaborasi memantau perkembangan perilaku dan akademik siswa."
          />
          <FeatureCard 
            icon={<GraduationCap className="text-purple-600" />}
            title="Manajemen Roster"
            desc="Jadwal pelajaran yang terstruktur dan mudah disesuaikan dengan kurikulum sekolah."
          />
        </div>
      </main>

      <footer className="border-t py-8 text-center text-slate-500 text-sm bg-slate-50">
        © {new Date().getFullYear()} Kepo Guru. All rights reserved.
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600">{desc}</p>
    </div>
  )
}