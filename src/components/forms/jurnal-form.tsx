'use client'

import { createJurnal } from '@/actions/jurnal-actions'
import { useFormStatus } from 'react-dom' // Untuk loading state
import { useActionState } from 'react' // Gunakan useFormState jika Next.js versi lama
import { useEffect, useRef } from 'react'
import { toast } from 'sonner' // Opsional: library notifikasi (install: npm i sonner)

// Komponen Tombol Submit dengan Loading State
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 flex justify-center"
    >
      {pending ? (
        <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
      ) : null}
      {pending ? 'Menyimpan...' : 'Simpan Jurnal'}
    </button>
  )
}

export function JurnalForm() {
  // State untuk menampung respon dari Server Action
  const [state, action] = useActionState(createJurnal, null)
  const formRef = useRef<HTMLFormElement>(null)

  // Reset form jika sukses
  useEffect(() => {
    if (state?.message === 'success') {
      formRef.current?.reset()
      // toast.success("Jurnal berhasil disimpan!") // Jika pakai library toast
      alert("Jurnal Berhasil Disimpan!") 
    }
  }, [state])

  return (
    <form ref={formRef} action={action} className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Input Jurnal Mengajar</h2>
      
      {/* Tampilkan Error Global */}
      {state?.message && state.message !== 'success' && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md mb-4">
          {state.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mata Pelajaran */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Mata Pelajaran</label>
          <input
            name="mapel"
            type="text"
            placeholder="Contoh: Matematika"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {state?.errors?.mapel && <p className="text-xs text-red-500">{state.errors.mapel[0]}</p>}
        </div>

        {/* Kelas */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Kelas</label>
          <select name="kelas" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white">
            <option value="">Pilih Kelas...</option>
            <option value="X-A">X-A</option>
            <option value="X-B">X-B</option>
            <option value="XI-IPA">XI-IPA</option>
            <option value="XII-IPS">XII-IPS</option>
          </select>
          {state?.errors?.kelas && <p className="text-xs text-red-500">{state.errors.kelas[0]}</p>}
        </div>
      </div>

      {/* Materi */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Materi Pembahasan</label>
        <input
          name="materi"
          type="text"
          placeholder="Pokok bahasan hari ini..."
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {state?.errors?.materi && <p className="text-xs text-red-500">{state.errors.materi[0]}</p>}
      </div>

      {/* Catatan */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Catatan Tambahan (Opsional)</label>
        <textarea
          name="catatan"
          rows={3}
          placeholder="Siswa yang izin, kendala teknis, dll..."
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div className="pt-2">
        <SubmitButton />
      </div>
    </form>
  )
}