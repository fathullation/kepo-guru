'use client';

import { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, Users } from 'lucide-react';

// Tipe data User sesuai dengan database
type User = {
  nip: string;
  nama_guru: string;
  mata_pelajaran: string;
  role: 'administrator' | 'superuser' | 'user';
  password?: string;
};

export default function UserManagement() {
  // State Data
  const [users, setUsers] = useState<User[]>([]);
  
  // State UI & Loading
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // Agar tombol tidak bisa diklik 2x
  const [error, setError] = useState('');

  // State Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Form State
  const [formData, setFormData] = useState<User>({
    nip: '',
    nama_guru: '',
    mata_pelajaran: '',
    role: 'user',
    password: ''
  });

  // --- 1. FETCH DATA (READ) ---
  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Gagal mengambil data');
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Ambil data saat halaman pertama kali dibuka
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handler Input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 2. TAMBAH USER (CREATE) ---
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || 'Gagal menambah user');

      // Sukses
      alert('Berhasil menambah user!');
      setIsAddOpen(false);
      resetForm();
      fetchUsers(); // Refresh tabel
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Persiapan Edit
  const openEditModal = (user: User) => {
    setCurrentUser(user);
    // Password dikosongkan agar tidak menimpa hash password lama jika tidak diisi
    setFormData({ ...user, password: '' });
    setIsEditOpen(true);
  };

  // --- 3. UPDATE USER (UPDATE) ---
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSubmitting(true);

    try {
      // Kita kirim request ke /api/users/[nip]
      const res = await fetch(`/api/users/${currentUser.nip}`, {
        method: 'PATCH', // Sesuai dengan route.ts yang kita buat (PATCH/PUT)
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || 'Gagal update user');

      alert('Data berhasil diperbarui!');
      setIsEditOpen(false);
      resetForm();
      fetchUsers(); // Refresh tabel
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 4. HAPUS USER (DELETE) ---
  const handleDelete = async (nip: string) => {
    // Validasi sederhana (sebaiknya validasi sesi asli dilakukan di backend juga)
    if (nip === 'admin') { 
      alert('User default admin tidak boleh dihapus demi keamanan demo ini.');
      return;
    }

    if (!confirm('Yakin hapus? Data jadwal terkait user ini akan hilang permanen!')) return;

    try {
      const res = await fetch(`/api/users/${nip}`, {
        method: 'DELETE',
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Gagal menghapus user');

      alert('User berhasil dihapus.');
      fetchUsers(); // Refresh tabel
    } catch (err: any) {
      alert(err.message);
    }
  };

  const resetForm = () => {
    setFormData({ nip: '', nama_guru: '', mata_pelajaran: '', role: 'user', password: '' });
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 text-slate-800">
          <Users className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold">User & Mapel Management</h1>
        </div>
        <button className="text-sm text-gray-500 hover:text-blue-600 font-medium">
          &larr; Kembali ke Dashboard
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        {/* Card Container */}
        <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
          {/* Card Header */}
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
            <h2 className="font-semibold text-gray-700">Daftar Pengguna</h2>
            <button 
              onClick={() => { resetForm(); setIsAddOpen(true); }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" /> Tambah User
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">Memuat data...</div>
            ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-800 text-white uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">No</th>
                  <th className="px-6 py-3">NIP / Username</th>
                  <th className="px-6 py-3">Nama Lengkap</th>
                  <th className="px-6 py-3">Mata Pelajaran</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-400 italic">
                            Belum ada data user. Silakan tambah data.
                        </td>
                    </tr>
                ) : (
                    users.map((user, index) => (
                    <tr key={user.nip} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{user.nip}</td>
                        <td className="px-6 py-4 text-gray-700">{user.nama_guru}</td>
                        <td className="px-6 py-4">
                        {user.mata_pelajaran && user.mata_pelajaran !== '-' ? (
                            <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs border border-slate-200">
                            {user.mata_pelajaran}
                            </span>
                        ) : (
                            <span className="text-gray-400 text-xs italic">- Tidak Ada -</span>
                        )}
                        </td>
                        <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            user.role === 'administrator' ? 'bg-red-100 text-red-700' :
                            user.role === 'superuser' ? 'bg-amber-100 text-amber-700' :
                            'bg-blue-100 text-blue-700'
                        }`}>
                            {user.role === 'administrator' ? 'Administrator' : 
                            user.role === 'superuser' ? 'Super User' : 'Guru'}
                        </span>
                        </td>
                        <td className="px-6 py-4 flex justify-center gap-2">
                        <button 
                            onClick={() => openEditModal(user)}
                            className="bg-amber-500 hover:bg-amber-600 text-white p-1.5 rounded transition"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => handleDelete(user.nip)}
                            className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded transition"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        </td>
                    </tr>
                    ))
                )}
              </tbody>
            </table>
            )}
          </div>
        </div>
      </div>

      {/* --- MODAL TAMBAH --- */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-blue-600 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2"><Plus className="w-5 h-5"/> Tambah User Baru</h3>
              <button onClick={() => setIsAddOpen(false)} className="hover:opacity-75">✕</button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIP / Username</label>
                <input required name="nip" onChange={handleChange} value={formData.nip} type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input required name="nama_guru" onChange={handleChange} value={formData.nama_guru} type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mata Pelajaran</label>
                <input name="mata_pelajaran" onChange={handleChange} value={formData.mata_pelajaran} type="text" placeholder="Contoh: Bahasa Inggris" className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input required name="password" onChange={handleChange} value={formData.password} type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select name="role" onChange={handleChange} value={formData.role} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option value="user">Guru (User)</option>
                  <option value="superuser">Super User</option>
                  <option value="administrator">Administrator</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Batal</button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium disabled:bg-blue-400"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL EDIT --- */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-amber-500 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2"><Edit className="w-5 h-5"/> Edit Data User</h3>
              <button onClick={() => setIsEditOpen(false)} className="hover:opacity-75">✕</button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIP (Tidak dapat diubah)</label>
                <input disabled value={formData.nip} type="text" className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input required name="nama_guru" onChange={handleChange} value={formData.nama_guru} type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mata Pelajaran</label>
                <input name="mata_pelajaran" onChange={handleChange} value={formData.mata_pelajaran} type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                <input name="password" onChange={handleChange} value={formData.password} placeholder="Kosongkan jika tetap" type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select name="role" onChange={handleChange} value={formData.role} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none">
                  <option value="user">Guru (User)</option>
                  <option value="superuser">Super User</option>
                  <option value="administrator">Administrator</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Batal</button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 font-medium disabled:bg-amber-300"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}