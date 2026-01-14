'use client';

import { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Edit, CheckCircle, XCircle, Power } from 'lucide-react';

type TahunAjaran = {
  id: number;
  nama: string; // Contoh: 2023/2024
  semester: string; // Ganjil / Genap
  is_active: boolean;
};

export default function TahunAjaranPage() {
  const [dataList, setDataList] = useState<TahunAjaran[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<TahunAjaran | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nama: '',
    semester: 'Ganjil'
  });

  // --- 1. FETCH DATA ---
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/tahun-ajaran');
      const data = await res.json();
      if (res.ok) setDataList(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. HANDLER FORM ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editData) {
        // Mode Edit (Nama/Semester)
        await fetch(`/api/tahun-ajaran/${editData.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        // Mode Tambah
        await fetch('/api/tahun-ajaran', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      
      setIsModalOpen(false);
      setEditData(null);
      setFormData({ nama: '', semester: 'Ganjil' });
      fetchData(); // Refresh table
    } catch (error) {
      alert('Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 3. AKTIVASI TAHUN AJARAN ---
  const handleActivate = async (id: number) => {
    if (!confirm('Aktifkan tahun ajaran ini? Tahun ajaran lain akan otomatis non-aktif.')) return;
    
    setIsLoading(true); // Biar kerasa loadingnya saat switch
    try {
      await fetch(`/api/tahun-ajaran/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'activate' }), // Flag khusus untuk backend
      });
      fetchData();
    } catch (error) {
      alert('Gagal mengaktifkan');
    }
  };

  // --- 4. HAPUS ---
  const handleDelete = async (id: number, isActive: boolean) => {
    if (isActive) {
      alert('Tidak boleh menghapus Tahun Ajaran yang sedang AKTIF!');
      return;
    }
    if (!confirm('Yakin hapus data ini?')) return;

    await fetch(`/api/tahun-ajaran/${id}`, { method: 'DELETE' });
    fetchData();
  };

  // Helper untuk buka modal edit
  const openEdit = (item: TahunAjaran) => {
    setEditData(item);
    setFormData({ nama: item.nama, semester: item.semester });
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditData(null);
    setFormData({ nama: '', semester: 'Ganjil' });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 text-slate-800">
          <Calendar className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold">Tahun Ajaran & Semester</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Card */}
        <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-semibold text-gray-700">Daftar Tahun Ajaran</h2>
            <button 
              onClick={openAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" /> Tambah Baru
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-800 text-white uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Tahun Ajaran</th>
                  <th className="px-6 py-3">Semester</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr><td colSpan={4} className="p-4 text-center">Memuat data...</td></tr>
                ) : dataList.map((item) => (
                  <tr key={item.id} className={`hover:bg-gray-50 transition ${item.is_active ? 'bg-blue-50/50' : ''}`}>
                    <td className="px-6 py-4 font-medium text-gray-900">{item.nama}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs border ${
                        item.semester === 'Ganjil' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-purple-50 text-purple-700 border-purple-200'
                      }`}>
                        {item.semester}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.is_active ? (
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200 shadow-sm">
                          <CheckCircle className="w-3 h-3" /> AKTIF
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-gray-400 text-xs">
                          <XCircle className="w-3 h-3" /> Non-Aktif
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 flex justify-center gap-2">
                      {/* Tombol Aktivasi */}
                      {!item.is_active && (
                        <button 
                          onClick={() => handleActivate(item.id)}
                          title="Aktifkan Tahun Ajaran Ini"
                          className="bg-green-500 hover:bg-green-600 text-white p-1.5 rounded transition shadow-sm"
                        >
                          <Power className="w-4 h-4" />
                        </button>
                      )}

                      <button 
                        onClick={() => openEdit(item)}
                        className="bg-amber-500 hover:bg-amber-600 text-white p-1.5 rounded transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={() => handleDelete(item.id, item.is_active)}
                        className={`p-1.5 rounded transition text-white ${item.is_active ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {dataList.length === 0 && !isLoading && (
               <div className="p-6 text-center text-gray-500 italic">Belum ada data tahun ajaran.</div>
            )}
          </div>
        </div>
      </div>

      {/* --- MODAL FORM --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden">
            <div className="bg-slate-800 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold">{editData ? 'Edit Data' : 'Tambah Tahun Ajaran'}</h3>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Ajaran</label>
                <input 
                  required 
                  type="text" 
                  placeholder="Contoh: 2024/2025" 
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                <select 
                  value={formData.semester}
                  onChange={(e) => setFormData({...formData, semester: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Batal</button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}