import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// PATCH: Update Data (Termasuk Aktivasi)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const { type } = body; // Kita pakai parameter 'type' untuk membedakan aksi
  const id = params.id;

  // SKENARIO 1: Aktivasi Tahun Ajaran (Hanya 1 yang boleh aktif)
  if (type === 'activate') {
    // 1. Matikan semua tahun ajaran dulu
    await supabase.from('tahun_ajaran').update({ is_active: false }).neq('id', 0); // neq id 0 hanya trik agar kena semua baris

    // 2. Aktifkan yang dipilih
    const { error } = await supabase
      .from('tahun_ajaran')
      .update({ is_active: true })
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: 'Tahun ajaran berhasil diaktifkan' });
  }

  // SKENARIO 2: Edit Biasa (Nama/Semester)
  const { nama, semester } = body;
  const { error } = await supabase
    .from('tahun_ajaran')
    .update({ nama, semester })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: 'Data berhasil diupdate' });
}

// DELETE: Hapus Data
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { error } = await supabase
    .from('tahun_ajaran')
    .delete()
    .eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: 'Berhasil dihapus' });
}