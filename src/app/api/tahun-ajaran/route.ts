import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Ambil Semua Data
export async function GET() {
  const { data, error } = await supabase
    .from('tahun_ajaran')
    .select('*')
    .order('nama', { ascending: false }) // Tahun terbaru di atas
    .order('semester', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST: Tambah Tahun Ajaran Baru
export async function POST(request: Request) {
  const body = await request.json();
  const { nama, semester } = body;

  // Insert data (default tidak aktif agar aman)
  const { data, error } = await supabase
    .from('tahun_ajaran')
    .insert([{ nama, semester, is_active: false }])
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: 'Berhasil disimpan', data }, { status: 201 });
}