'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils' // Pastikan Anda punya utility class, atau hapus dan pakai string biasa
// Jika tidak punya cn(), pakai template literal biasa: `classA ${kondisi ? 'active' : ''}`

interface NavLinkProps {
  href: string
  children: React.ReactNode
  icon: React.ReactNode
}

export function NavLink({ href, children, icon }: NavLinkProps) {
  const pathname = usePathname()
  
  // Cek apakah URL saat ini diawali dengan href menu ini
  // Contoh: href="/dashboard/guru" akan aktif jika user ada di "/dashboard/guru/jurnal" juga
  const isActive = pathname === href || (pathname.startsWith(href) && href !== '/dashboard')

  return (
    <Link 
      href={href} 
      className={`
        flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all group
        ${isActive 
          ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' // Style saat Aktif
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'   // Style saat Tidak Aktif
        }
      `}
    >
      <span className={`${isActive ? 'text-blue-200' : 'text-gray-400 group-hover:text-blue-400'} transition-colors`}>
        {icon}
      </span>
      {children}
    </Link>
  )
}