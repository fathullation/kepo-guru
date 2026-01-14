// src/actions/auth-actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// --- LOGIN ACTION ---
export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect('/login?error=' + encodeURIComponent(error.message))
  }

  return redirect('/dashboard')
}

// --- SIGN OUT ACTION (YANG HILANG TADI) ---
export async function signOutAction() {
  const supabase = await createClient()
  
  // Proses Logout dari Supabase
  await supabase.auth.signOut()
  
  // Kembalikan ke halaman login
  return redirect('/login')
}