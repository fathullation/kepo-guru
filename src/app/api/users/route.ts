// src/app/api/users/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Ambil Semua User
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false }); // Urutkan dari yang terbaru

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Tambah User Baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nip, nama_guru, mata_pelajaran, password, role } = body;

    // 1. Cek apakah NIP sudah ada (Validasi Unik)
    const { data: existingUser } = await supabase
      .from('users')
      .select('nip')
      .eq('nip', nip)
      .single();

    if (existingUser) {
      return NextResponse.json({ message: 'NIP/Username sudah digunakan!' }, { status: 400 });
    }

    // 2. Simpan ke Database
    const { data, error } = await supabase
      .from('users')
      .insert([
        { nip, nama_guru, mata_pelajaran, password, role }
      ])
      .select();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'User berhasil dibuat', data }, { status: 201 });

  } catch (err) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}