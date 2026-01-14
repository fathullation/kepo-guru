import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Ambil Jadwal dengan Relasi (Join)
export async function GET() {
  const { data, error } = await supabase
    .from('jadwal')
    .select(`
      *,
      mapel:mapel_id(nama),
      ruangan:ruang_id(nama),
      rombel:rombel_id(nama),
      guru:guru_id(nama_guru)
    `)
    .order('hari');

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST: Tambah Jadwal
export async function POST(request: Request) {
  const body = await request.json();
  
  // Validasi tabrakan jadwal (Opsional: bisa dikembangkan nanti)
  // Misalnya cek apakah ruangan dipakai di jam yang sama

  const { error } = await supabase.from('jadwal').insert([body]);
  
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ message: 'Jadwal berhasil dibuat' });
}

// DELETE: Hapus Jadwal
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const { error } = await supabase.from('jadwal').delete().eq('id', id);
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ message: 'Deleted' });
}