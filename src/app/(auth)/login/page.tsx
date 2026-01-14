'use client' // 1. Wajib ada di baris paling atas untuk fitur interaktif

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { loginAction } from '@/actions/auth-actions'
import { 
  GraduationCap, 
  AlertCircle, 
  Lock, 
  Eye, 
  EyeOff, 
  Mail 
} from 'lucide-react'

export default function LoginPage() {
  // 2. Gunakan hook untuk menangani state
  const searchParams = useSearchParams()
  const errorMessage = searchParams.get('error')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
      {/* Dekorasi Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      
      <div className="w-full max-w-md z-10 p-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 p-8 space-y-6">
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-2">
              <GraduationCap size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Kepo Guru</h1>
            <p className="text-sm text-gray-500">Masuk untuk mengelola aktivitas akademik</p>
          </div>

          {/* --- AREA ALERT ERROR --- */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 animate-in fade-in slide-in-from-top-2">
               <AlertCircle size={18} />
               <p className="text-sm font-medium">{errorMessage}</p>
            </div>
          )}

          <form action={loginAction} className="space-y-4">
            
            {/* 3. INPUT EMAIL (Saya tambahkan karena sebelumnya hilang) */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                name="email" 
                type="email" 
                required 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900 placeholder-gray-400"
                placeholder="email@sekolah.id"
              />
            </div>

            {/* 4. INPUT PASSWORD (Dengan fitur Show/Hide) */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>

              <input 
                name="password" 
                // Logic ubah type text <-> password
                type={showPassword ? "text" : "password"} 
                required 
                className="w-full pl-10 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900 placeholder-gray-400"
                placeholder="Password Anda"
              />

              {/* Tombol Mata (Kanan) */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all shadow-lg shadow-blue-600/30 active:scale-95">
              Masuk ke Dashboard
            </button>
          </form>

          <div className="text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Kepo Guru Academic System
          </div>
        </div>
      </div>
    </div>
  )
}