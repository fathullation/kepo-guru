'use client';

import { useState, useEffect } from 'react';
import { Calendar, Users, Layers, LayoutGrid, Clock, Plus, Trash2, Save, GraduationCap } from 'lucide-react';

export default function MasterRosterPage() {
  const [activeTab, setActiveTab] = useState('jadwal');
  
  // --- STATE DATA MASTER ---
  const [mapel, setMapel] = useState<any[]>([]);
  const [ruangan, setRuangan] = useState<any[]>([]);
  const [rombel, setRombel] = useState<any[]>([]);
  const [guru, setGuru] = useState<any[]>([]);
  const [jadwal, setJadwal] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // --- STATE FORM ---
  const [masterForm, setMasterForm] = useState<any>({});
  
  // Form Khusus Jadwal
  const [jadwalForm, setJadwalForm] = useState({
    hari: 'Senin',
    jam_mulai: '07:00',
    jam_selesai: '08:30',
    mapel_id: '',
    ruang_id: '',
    rombel_id: '',
    guru_id: ''
  });

  // --- FETCH DATA ---
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [resMapel, resRuang, resRombel, resGuru, resJadwal] = await Promise.all([
        fetch('/api/master-data?type=mapel').then(r => r.json()),
        fetch('/api/master-data?type=ruangan').then(r => r.json()),
        fetch('/api/master-data?type=rombel').then(r => r.json()),
        fetch('/api/master-data?type=guru').then(r => r.json()),
        fetch('/api/jadwal').then(r => r.json())
      ]);

      setMapel(resMapel);
      setRuangan(resRuang);
      setRombel(resRombel);
      setGuru(resGuru);
      setJadwal(resJadwal);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // --- HANDLER SIMPAN MASTER DATA ---
  const handleSaveMaster = async (type: string) => {
    if (!confirm('Simpan data ini?')) return;
    
    // Validasi sederhana
    if(type === 'guru' && !masterForm.mapel_id) {
        alert("Harap pilih mata pelajaran untuk guru ini.");
        return;
    }

    await fetch('/api/master-data', {
      method: 'POST',
      body: JSON.stringify({ type, ...masterForm }),
      headers: { 'Content-Type': 'application/json' }
    });
    setMasterForm({});
    fetchAllData();
  };

  // --- HANDLER HAPUS MASTER DATA ---
  const handleDeleteMaster = async (type: string, id: number) => {
    if(!confirm('Hapus data?')) return;
    await fetch(`/api/master-data?type=${type}&id=${id}`, { method: 'DELETE' });
    fetchAllData();
  }

  // --- HANDLER SIMPAN JADWAL ---
  const handleSaveJadwal = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/jadwal', {
      method: 'POST',
      body: JSON.stringify(jadwalForm),
      headers: { 'Content-Type': 'application/json' }
    });
    alert('Jadwal Berhasil Disimpan');
    fetchAllData();
  };

   // --- HANDLER HAPUS JADWAL ---
   const handleDeleteJadwal = async (id: number) => {
    if(!confirm('Hapus jadwal?')) return;
    await fetch(`/api/jadwal?id=${id}`, { method: 'DELETE' });
    fetchAllData();
  }

  // --- UI COMPONENTS ---
  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => { setActiveTab(id); setMasterForm({}); }}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
        activeTab === id 
        ? 'border-blue-600 text-blue-600 bg-blue-50' 
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  // --- STYLE CONSTANTS (DIPERBAIKI UNTUK KONTRAS) ---
  // Input: Border lebih gelap (gray-400), Placeholder lebih gelap (gray-600), Teks Hitam
  const InputClass = "border border-gray-400 p-2 rounded text-sm placeholder-gray-600 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
  
  // Header Tabel: Background abu-abu (gray-200) dan Teks Hitam Pekat (text-black/gray-900)
  const TableHeaderClass = "bg-gray-200 border-b border-gray-300 text-gray-900 font-bold p-3 text-left";
  
  // Row Tabel: Hover effect dan teks gelap
  const TableRowClass = "hover:bg-gray-50 border-b border-gray-100 text-gray-800";

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      
      {/* HEADER */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Master Roster & Jadwal</h1>
          <p className="text-sm text-gray-500">Manajemen Guru, Mapel, Ruang, dan Penjadwalan</p>
        </div>
        <button onClick={fetchAllData} className="text-sm text-blue-600 hover:underline">Refresh Data</button>
      </div>

      {/* NAVIGATION TABS */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-200">
          <TabButton id="jadwal" label="Jadwal Pelajaran" icon={Calendar} />
          <TabButton id="guru" label="Data Guru" icon={GraduationCap} />
          <TabButton id="mapel" label="Mata Pelajaran" icon={Layers} />
          <TabButton id="ruangan" label="Ruangan" icon={LayoutGrid} />
          <TabButton id="rombel" label="Rombel" icon={Users} />
        </div>

        <div className="p-6">
          
          {/* --- CONTENT: JADWAL --- */}
          {activeTab === 'jadwal' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form Input Jadwal */}
              <div className="lg:col-span-1 bg-gray-50 p-4 rounded border border-gray-200 h-fit">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Buat Jadwal Baru
                </h3>
                <form onSubmit={handleSaveJadwal} className="space-y-3">
                   <div>
                    <label className="text-xs font-bold text-gray-700">Hari</label>
                    <select className={`${InputClass} w-full`} onChange={e => setJadwalForm({...jadwalForm, hari: e.target.value})}>
                      {['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'].map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-xs font-bold text-gray-700">Jam Mulai</label>
                        <input type="time" className={InputClass} value={jadwalForm.jam_mulai} onChange={e => setJadwalForm({...jadwalForm, jam_mulai: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-700">Jam Selesai</label>
                        <input type="time" className={InputClass} value={jadwalForm.jam_selesai} onChange={e => setJadwalForm({...jadwalForm, jam_selesai: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700">Mata Pelajaran</label>
                    <select required className={InputClass + " w-full"} onChange={e => setJadwalForm({...jadwalForm, mapel_id: e.target.value})}>
                        <option value="">-- Pilih Mapel --</option>
                        {mapel.map(m => <option key={m.id} value={m.id}>{m.nama}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700">Guru Pengampu</label>
                    <select required className={InputClass + " w-full"} onChange={e => setJadwalForm({...jadwalForm, guru_id: e.target.value})}>
                        <option value="">-- Pilih Guru --</option>
                        {guru.map(g => <option key={g.id} value={g.id}>{g.nama_guru} ({g.mapel?.nama || 'Tanpa Mapel'})</option>)}
                    </select>
                  </div>
                   <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-bold text-gray-700">Kelas</label>
                        <select required className={InputClass + " w-full"} onChange={e => setJadwalForm({...jadwalForm, rombel_id: e.target.value})}>
                            <option value="">-- Pilih --</option>
                            {rombel.map(r => <option key={r.id} value={r.id}>{r.nama}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700">Ruang</label>
                        <select required className={InputClass + " w-full"} onChange={e => setJadwalForm({...jadwalForm, ruang_id: e.target.value})}>
                            <option value="">-- Pilih --</option>
                            {ruangan.map(r => <option key={r.id} value={r.id}>{r.nama}</option>)}
                        </select>
                      </div>
                   </div>
                  <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded text-sm font-semibold hover:bg-blue-700 transition shadow-sm mt-4">Simpan Jadwal</button>
                </form>
              </div>

              {/* List Jadwal */}
              <div className="lg:col-span-2">
                <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className={TableHeaderClass}>Waktu</th>
                        <th className={TableHeaderClass}>Kelas & Ruang</th>
                        <th className={TableHeaderClass}>Guru & Mapel</th>
                        <th className={`${TableHeaderClass} text-right`}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {jadwal.map((j) => (
                        <tr key={j.id} className={TableRowClass}>
                          <td className="p-3">
                              <div className="font-bold text-gray-900">{j.hari}</div>
                              <div className="text-xs text-gray-600 font-medium">{j.jam_mulai}-{j.jam_selesai}</div>
                          </td>
                          <td className="p-3">
                              <div className="font-bold text-blue-700">{j.rombel?.nama}</div>
                              <div className="text-xs text-gray-600">{j.ruangan?.nama}</div>
                          </td>
                          <td className="p-3">
                              <div className="font-bold text-gray-800">{j.mapel?.nama}</div>
                              <div className="text-xs text-gray-600">{j.guru?.nama_guru}</div>
                          </td>
                          <td className="p-3 text-right">
                              <button onClick={() => handleDeleteJadwal(j.id)} className="text-red-500 hover:text-red-700 p-1">
                                <Trash2 className="w-5 h-5" />
                              </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* --- CONTENT: GURU (BARU) --- */}
          {activeTab === 'guru' && (
            <div className="space-y-4">
               <div className="flex gap-2 items-center bg-blue-50 p-3 rounded border border-blue-200 mb-4 text-blue-900">
                  <span className="text-sm font-medium">💡 Guru yang ditambahkan akan otomatis memiliki akun dengan Password default sesuai NIP.</span>
               </div>
              <div className="flex gap-2 flex-wrap">
                <input placeholder="NIP" className={`${InputClass} w-40`} onChange={e => setMasterForm({...masterForm, nip: e.target.value})} />
                <input placeholder="Nama Lengkap Guru" className={`${InputClass} flex-1 min-w-[200px]`} onChange={e => setMasterForm({...masterForm, nama_guru: e.target.value})} />
                
                <select className={`${InputClass} w-64`} onChange={e => setMasterForm({...masterForm, mapel_id: e.target.value})}>
                    <option value="">-- Spesialisasi Mapel --</option>
                    {mapel.map(m => (
                        <option key={m.id} value={m.id}>{m.nama} ({m.kode})</option>
                    ))}
                </select>

                <button onClick={() => handleSaveMaster('guru')} className="bg-green-600 text-white px-6 py-2 rounded text-sm font-semibold flex items-center gap-2 hover:bg-green-700 shadow-sm">
                  <Save className="w-4 h-4" /> Simpan
                </button>
              </div>
              
              <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                        <th className={TableHeaderClass}>NIP</th>
                        <th className={TableHeaderClass}>Nama Guru</th>
                        <th className={TableHeaderClass}>Mengampu Mapel</th>
                        <th className={`${TableHeaderClass} text-center`}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {guru.map(g => (
                      <tr key={g.id} className={TableRowClass}>
                        <td className="p-3 font-mono font-semibold text-gray-700">{g.nip}</td>
                        <td className="p-3 font-semibold text-gray-900">{g.nama_guru}</td>
                        <td className="p-3">
                            {g.mapel ? (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold border border-blue-200">{g.mapel.nama}</span>
                            ) : (
                                <span className="text-gray-400 italic text-xs">Belum diatur</span>
                            )}
                        </td>
                        <td className="p-3 text-center"><button onClick={() => handleDeleteMaster('guru', g.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-5 h-5" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- CONTENT: MAPEL --- */}
          {activeTab === 'mapel' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input placeholder="Kode (MTK)" className={`${InputClass} w-32`} onChange={e => setMasterForm({...masterForm, kode: e.target.value})} />
                <input placeholder="Nama Mata Pelajaran" className={`${InputClass} flex-1`} onChange={e => setMasterForm({...masterForm, nama: e.target.value})} />
                 <input placeholder="Beban JP" type="number" className={`${InputClass} w-32`} onChange={e => setMasterForm({...masterForm, beban_jam: e.target.value})} />
                <button onClick={() => handleSaveMaster('mapel')} className="bg-green-600 text-white px-6 py-2 rounded text-sm font-semibold flex items-center gap-2 hover:bg-green-700 shadow-sm">
                  <Save className="w-4 h-4" /> Simpan
                </button>
              </div>
              
              <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr>
                            <th className={TableHeaderClass}>Kode</th>
                            <th className={TableHeaderClass}>Nama Mapel</th>
                            <th className={TableHeaderClass}>Beban</th>
                            <th className={`${TableHeaderClass} text-center`}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                    {mapel.map(m => (
                        <tr key={m.id} className={TableRowClass}>
                        <td className="p-3 font-mono text-blue-700 font-bold">{m.kode}</td>
                        <td className="p-3 font-semibold text-gray-900">{m.nama}</td>
                        <td className="p-3 text-gray-700">{m.beban_jam} JP</td>
                        <td className="p-3 text-center"><button onClick={() => handleDeleteMaster('mapel', m.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-5 h-5" /></button></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- CONTENT: RUANGAN --- */}
          {activeTab === 'ruangan' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input placeholder="Nama Ruang (Contoh: Lab 1)" className={`${InputClass} flex-1`} onChange={e => setMasterForm({...masterForm, nama: e.target.value})} />
                <input placeholder="Kapasitas" type="number" className={`${InputClass} w-32`} onChange={e => setMasterForm({...masterForm, kapasitas: e.target.value})} />
                <button onClick={() => handleSaveMaster('ruangan')} className="bg-green-600 text-white px-6 py-2 rounded text-sm font-semibold flex items-center gap-2 hover:bg-green-700 shadow-sm">
                  <Save className="w-4 h-4" /> Simpan
                </button>
              </div>
              <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr>
                            <th className={TableHeaderClass}>Nama Ruang</th>
                            <th className={TableHeaderClass}>Kapasitas</th>
                            <th className={`${TableHeaderClass} text-center`}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                    {ruangan.map(r => (
                        <tr key={r.id} className={TableRowClass}>
                        <td className="p-3 font-semibold text-gray-900">{r.nama}</td>
                        <td className="p-3 text-gray-700">{r.kapasitas} Kursi</td>
                        <td className="p-3 text-center"><button onClick={() => handleDeleteMaster('ruangan', r.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-5 h-5" /></button></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- CONTENT: ROMBEL --- */}
          {activeTab === 'rombel' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input placeholder="Nama Kelas (X-IPA-1)" className={`${InputClass} flex-1`} onChange={e => setMasterForm({...masterForm, nama: e.target.value})} />
                <select className={`${InputClass} w-40`} onChange={e => setMasterForm({...masterForm, tingkat: e.target.value})}>
                  <option>Tingkat</option>
                  <option value="7">Kelas VII</option>
                  <option value="8">Kelas VIII</option>
                  <option value="9">Kelas IX</option>
                </select>
                <button onClick={() => handleSaveMaster('rombel')} className="bg-green-600 text-white px-6 py-2 rounded text-sm font-semibold flex items-center gap-2 hover:bg-green-700 shadow-sm">
                  <Save className="w-4 h-4" /> Simpan
                </button>
              </div>
              <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr>
                            <th className={TableHeaderClass}>Nama Kelas</th>
                            <th className={TableHeaderClass}>Tingkat</th>
                            <th className={`${TableHeaderClass} text-center`}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                    {rombel.map(r => (
                        <tr key={r.id} className={TableRowClass}>
                        <td className="p-3 font-semibold text-gray-900">{r.nama}</td>
                        <td className="p-3 text-gray-700">Kelas {r.tingkat}</td>
                        <td className="p-3 text-center"><button onClick={() => handleDeleteMaster('rombel', r.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-5 h-5" /></button></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}