import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  let query;

  if (type === 'guru') {
    // JOIN ke tabel mapel untuk mengambil nama mapel
    query = supabase
      .from('users')
      .select('*, mapel(nama, kode)')
      .eq('role', 'guru')
      .order('nama_guru', { ascending: true });
  } else if (['mapel', 'ruangan', 'rombel'].includes(type!)) {
    query = supabase.from(type!).select('*').order('id', { ascending: true });
  } else {
    return NextResponse.json({ message: 'Invalid type' }, { status: 400 });
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { type, ...payload } = body;

  let table = type;
  let dataPayload = payload;

  // Khusus Guru: Masuk ke tabel users
  if (type === 'guru') {
    table = 'users';
    // Set default data untuk user baru
    dataPayload = {
      ...payload,
      role: 'guru',
      password: payload.nip // Default password = NIP (bisa diubah nanti)
    };
  }

  if (!['mapel', 'ruangan', 'rombel', 'users'].includes(table)) {
    return NextResponse.json({ message: 'Invalid type' }, { status: 400 });
  }

  const { data, error } = await supabase.from(table).insert([dataPayload]).select();

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');

  if (!type || !id) return NextResponse.json({ message: 'Missing params' }, { status: 400 });

  // Jika hapus guru, hapus dari tabel users
  const table = type === 'guru' ? 'users' : type;

  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  
  return NextResponse.json({ message: 'Deleted' });
}