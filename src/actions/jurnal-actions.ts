'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

// 1. Schema Validasi dengan Zod
const JurnalSchema = z.object({
  mapel: z.string().min(3, { message: "Mata pelajaran minimal 3 karakter" }),
  kelas: z.string().min(1, { message: "Kelas harus diisi" }),
  materi: z.string().min(5, { message: "Materi minimal 5 karakter" }),
  catatan: z.string().optional(),
})

export async function createJurnal(prevState: any, formData: FormData) {
  const supabase = await createClient()

  // 2. Cek Auth User
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 3. Validasi Input Form
  const validatedFields = JurnalSchema.safeParse({
    mapel: formData.get('mapel'),
    kelas: formData.get('kelas'),
    materi: formData.get('materi'),
    catatan: formData.get('catatan'),
  })

  // Jika validasi gagal, kembalikan error ke UI
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Gagal menyimpan. Periksa input anda.',
    }
  }

  // 4. Insert ke Supabase
  const { error } = await supabase.from('jurnal').insert({
    user_id: user.id,
    mapel: validatedFields.data.mapel,
    kelas: validatedFields.data.kelas,
    materi: validatedFields.data.materi,
    catatan: validatedFields.data.catatan,
  })

  if (error) {
    return { message: 'Database Error: Gagal membuat jurnal.' }
  }

  // 5. Update Cache & Redirect
  revalidatePath('/dashboard/guru') 
  return { message: 'success' } // Sinyal sukses ke Client Component
}

export async function deleteJurnal(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('jurnal')
    .delete()
    .eq('id', id)

  if (error) throw new Error('Gagal menghapus jurnal')

  revalidatePath('/dashboard/guru')
}