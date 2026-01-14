// src/app/api/users/[nip]/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// PATCH: Update Data User
export async function PATCH(
  request: Request,
  { params }: { params: { nip: string } }
) {
  try {
    const body = await request.json();
    const { nama_guru, mata_pelajaran, password, role } = body;
    const { nip } = params;

    // Siapkan data yang mau diupdate
    const updates: any = {
      nama_guru,
      mata_pelajaran,
      role
    };

    // Hanya update password jika user mengisinya (tidak kosong)
    if (password && password !== '') {
      updates.password = password;
    }

    // Lakukan Update berdasarkan NIP
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('nip', nip);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Data berhasil diperbarui' });

  } catch (err) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Hapus User
export async function DELETE(
  request: Request,
  { params }: { params: { nip: string } }
) {
  try {
    const { nip } = params;

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('nip', nip);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'User berhasil dihapus' });

  } catch (err) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}