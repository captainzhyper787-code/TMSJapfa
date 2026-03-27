import React, { useState, useEffect } from "react";
import Header from "../../components/Header";

// ==========================================
// 🌟 INTERFACE DATA
// ==========================================
interface FuelLog {
    id: string;
    date: string;
    kmAwal: number;
    kmAkhir: number;
    liters: number;
    cost: number;
    station: string;
}

interface FleetData {
    id: string;
    plateNumber: string;
    model: string;
    capacity: number;       // Kapasitas Maksimal Truk
    currentLoad?: number;   // 🌟 DATA BARU: Muatan Bawaan Hari Ini
    kmAwalHariIni: number | null;
    kmAkhirHariIni: number | null;
    status: string;
    is_internal: boolean;
    history: FuelLog[];
}

const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
};

export default function FleetManagement() {
    const [fleetList, setFleetList] = useState<FleetData[]>([]);
    const [selectedTruckId, setSelectedTruckId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [showOnCallModal, setShowOnCallModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showFuelModal, setShowFuelModal] = useState(false);

    const [onCallForm, setOnCallForm] = useState({ plateNumber: '', type: 'L300 Box', capacity: 1000 });
    const [statusForm, setStatusForm] = useState('Available');
    const [fuelForm, setFuelForm] = useState({ kmAwal: 0, kmAkhir: 0, liters: 0, cost: 0, station: '' });

    const fetchFleetData = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/fleet');
            if (res.ok) {
                const data = await res.json();
                setFleetList(data);
                if (data.length > 0 && !selectedTruckId) {
                    setSelectedTruckId(data[0].id);
                }
            }
        } catch (err) {
            console.error("Gagal narik data fleet:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFleetData();
    }, []);

    const handleAddOnCall = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:8000/api/fleet/oncall', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    plate_number: onCallForm.plateNumber,
                    vehicle_type: onCallForm.type,
                    capacity_kg: onCallForm.capacity
                })
            });
            if (res.ok) {
                alert("Armada On-Call sukses ditambah!");
                setShowOnCallModal(false);
                setOnCallForm({ plateNumber: '', type: 'L300 Box', capacity: 1000 });
                fetchFleetData(); 
            } else {
                const err = await res.json();
                alert(`Gagal: ${err.detail}`);
            }
        } catch (err) {
            alert("Gagal konek ke server!");
        }
    };

    const handleUpdateStatus = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTruckId) return;
        try {
            const res = await fetch(`http://localhost:8000/api/fleet/${selectedTruckId}/status?status=${statusForm}`, {
                method: 'PUT'
            });
            if (res.ok) {
                alert("Status sukses diubah!");
                setShowStatusModal(false);
                fetchFleetData();
            }
        } catch (err) {
            alert("Gagal update status!");
        }
    };

    const handleAddFuelLog = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTruckId) return;
        try {
            const res = await fetch(`http://localhost:8000/api/fleet/${selectedTruckId}/fuel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    km_awal: fuelForm.kmAwal,
                    km_akhir: fuelForm.kmAkhir,
                    liters: fuelForm.liters,
                    cost_rp: fuelForm.cost,
                    station_name: fuelForm.station
                })
            });
            if (res.ok) {
                alert("Bon Bensin & KM berhasil dicatat!");
                setShowFuelModal(false);
                setFuelForm({ kmAwal: 0, kmAkhir: 0, liters: 0, cost: 0, station: '' });
                fetchFleetData();
            } else {
                alert("Gagal nyatet bensin!");
            }
        } catch (err) {
            alert("Gagal konek ke server!");
        }
    };

    const selectedTruck = fleetList.find(t => t.id === selectedTruckId);

    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'Available': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400';
            case 'In Route': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
            case 'Maintenance': return 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400';
            case 'On-Call Active': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400';
            default: return 'bg-slate-100 text-slate-700 dark:bg-[#1A1A1A] dark:text-slate-400';
        }
    };

    // 🌟 KALKULASI KPI
    const totalInternal = fleetList.filter(t => t.is_internal).length;
    const totalOnCall = fleetList.filter(t => !t.is_internal).length;
    const totalMaintenance = fleetList.filter(t => t.status === 'Maintenance').length;
    
    // 🌟 TOTAL MUATAN HARI INI (Semua truk yang lagi jalan/bawa barang)
    const totalMuatanHariIni = fleetList.reduce((sum, truck) => sum + (truck.currentLoad || 0), 0);

    return (
        <>
            <Header title="Fleet Management" />

            {/* MODAL ON CALL */}
            {showOnCallModal && (
                <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <form onSubmit={handleAddOnCall} className="bg-white dark:bg-[#1F1F1F] rounded-2xl w-full max-w-md p-6 border border-slate-200 dark:border-[#333] shadow-2xl">
                        <h3 className="text-xl font-bold mb-4 dark:text-white">Tambah Armada On-Call</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1">Plat Nomor Kendaraan</label>
                                <input required type="text" value={onCallForm.plateNumber} onChange={e => setOnCallForm({...onCallForm, plateNumber: e.target.value.toUpperCase()})} placeholder="Contoh: B 1234 XYZ" className="w-full p-3 bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-[#333] rounded-lg font-bold uppercase dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1">Tipe Kendaraan</label>
                                <select value={onCallForm.type} onChange={e => setOnCallForm({...onCallForm, type: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-[#333] rounded-lg font-bold dark:text-white">
                                    <option value="L300 Box">L300 Box</option>
                                    <option value="Blind Van">Blind Van</option>
                                    <option value="Engkel Box">Engkel Box</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1">Kapasitas Maksimal (KG)</label>
                                <input required type="number" value={onCallForm.capacity} onChange={e => setOnCallForm({...onCallForm, capacity: Number(e.target.value)})} className="w-full p-3 bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-[#333] rounded-lg font-bold dark:text-white" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-[#333]">
                            <button type="button" onClick={() => setShowOnCallModal(false)} className="px-4 py-2 font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-[#333] rounded-lg">Batal</button>
                            <button type="submit" className="px-6 py-2 font-bold bg-primary text-white rounded-lg shadow-lg hover:brightness-110">Simpan Truk</button>
                        </div>
                    </form>
                </div>
            )}

            {/* MODAL STATUS */}
            {showStatusModal && selectedTruck && (
                <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <form onSubmit={handleUpdateStatus} className="bg-white dark:bg-[#1F1F1F] rounded-2xl w-full max-w-sm p-6 border border-slate-200 dark:border-[#333] shadow-2xl">
                        <h3 className="text-xl font-bold mb-4 dark:text-white">Ubah Status {selectedTruck.plateNumber}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1">Pilih Status Baru</label>
                                <select value={statusForm} onChange={e => setStatusForm(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-[#333] rounded-lg font-bold dark:text-white">
                                    <option value="Available">Available (Siap Jalan)</option>
                                    <option value="Maintenance">Maintenance (Ke Bengkel)</option>
                                    <option value="Idle">Idle (Nganggur)</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-[#333]">
                            <button type="button" onClick={() => setShowStatusModal(false)} className="px-4 py-2 font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-[#333] rounded-lg">Batal</button>
                            <button type="submit" className="px-6 py-2 font-bold bg-primary text-white rounded-lg shadow-lg hover:brightness-110">Update</button>
                        </div>
                    </form>
                </div>
            )}

            {/* MODAL FUEL */}
            {showFuelModal && selectedTruck && (
                <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <form onSubmit={handleAddFuelLog} className="bg-white dark:bg-[#1F1F1F] rounded-2xl w-full max-w-md p-6 border border-slate-200 dark:border-[#333] shadow-2xl">
                        <h3 className="text-xl font-bold mb-4 dark:text-white">Catat Bon Bensin {selectedTruck.plateNumber}</h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1">KM Awal (Berangkat)</label>
                                <input required type="number" value={fuelForm.kmAwal} onChange={e => setFuelForm({...fuelForm, kmAwal: Number(e.target.value)})} className="w-full p-3 bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-[#333] rounded-lg font-mono font-bold dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1">KM Akhir (Pulang)</label>
                                <input required type="number" value={fuelForm.kmAkhir} onChange={e => setFuelForm({...fuelForm, kmAkhir: Number(e.target.value)})} className="w-full p-3 bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-[#333] rounded-lg font-mono font-bold dark:text-white" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1">Total Liter</label>
                                <input required type="number" step="0.1" value={fuelForm.liters} onChange={e => setFuelForm({...fuelForm, liters: Number(e.target.value)})} className="w-full p-3 bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-[#333] rounded-lg font-bold text-primary" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1">Total Harga (Rp)</label>
                                <input required type="number" value={fuelForm.cost} onChange={e => setFuelForm({...fuelForm, cost: Number(e.target.value)})} className="w-full p-3 bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-[#333] rounded-lg font-bold text-emerald-600" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1">Nama SPBU / Lokasi</label>
                            <input required type="text" value={fuelForm.station} onChange={e => setFuelForm({...fuelForm, station: e.target.value})} placeholder="Contoh: Pertamina KM 13" className="w-full p-3 bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-[#333] rounded-lg font-medium dark:text-white" />
                        </div>
                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-[#333]">
                            <button type="button" onClick={() => setShowFuelModal(false)} className="px-4 py-2 font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-[#333] rounded-lg">Batal</button>
                            <button type="submit" className="px-6 py-2 font-bold bg-primary text-white rounded-lg shadow-lg hover:brightness-110">Simpan Data</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8">
                    
                    {/* 🌟 4 KOTAK KPI (DENGAN JUDUL BARU) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        <div className="bg-white dark:bg-[#111111] p-6 rounded-xl border border-slate-200 dark:border-[#333] shadow-sm">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Muatan Hari Ini</p>
                            <h3 className="text-2xl font-bold text-primary mt-2">{totalMuatanHariIni.toLocaleString('id-ID')} <span className="text-base font-normal text-slate-500">KG</span></h3>
                        </div>
                        <div className="bg-white dark:bg-[#111111] p-6 rounded-xl border border-slate-200 dark:border-[#333] shadow-sm">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Internal Fleet</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{totalInternal} <span className="text-base font-normal text-slate-500">Truk</span></h3>
                        </div>
                        <div className="bg-white dark:bg-[#111111] p-6 rounded-xl border border-slate-200 dark:border-[#333] shadow-sm">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active On-Call</p>
                            <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-500 mt-2">{totalOnCall} <span className="text-base font-normal text-slate-500">Vendor</span></h3>
                        </div>
                        <div className="bg-white dark:bg-[#111111] p-6 rounded-xl border border-slate-200 dark:border-[#333] shadow-sm">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">In Maintenance</p>
                            <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-500 mt-2">{totalMaintenance} <span className="text-base font-normal text-slate-500">Truk</span></h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#111111] rounded-xl border border-slate-200 dark:border-[#333] shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-[#333] flex items-center justify-between bg-slate-50 dark:bg-[#0a0a0a]">
                            <h3 className="font-bold text-lg dark:text-white">Daftar Kendaraan Operasional</h3>
                            <button onClick={() => setShowOnCallModal(true)} className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg shadow-sm hover:brightness-110 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">add</span> Tambah On-Call
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            {isLoading ? (
                                <div className="p-10 text-center text-slate-500 font-bold animate-pulse">Menarik data armada...</div>
                            ) : (
                                <table className="w-full text-left min-w-[1000px]">
                                    <thead className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-[#333]">
                                        <tr>
                                            <th className="px-6 py-4 w-12 text-center">No.</th>
                                            <th className="px-6 py-4">Nomor Plat</th>
                                            <th className="px-6 py-4">Tipe Kendaraan</th>
                                            {/* 🌟 KOLOM BARU (KAPASITAS MAKS & MUATAN HARI INI) */}
                                            <th className="px-6 py-4 text-right">Kapasitas Maks</th>
                                            <th className="px-6 py-4 text-right text-primary">Muatan Hari Ini</th>
                                            
                                            <th className="px-6 py-4 text-right">KM Awal</th>
                                            <th className="px-6 py-4 text-right">KM Akhir</th>
                                            <th className="px-6 py-4 text-right text-emerald-600 dark:text-emerald-400">Total Tempuh</th>
                                            <th className="px-6 py-4 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-[#222]">
                                        {fleetList.map((truck, idx) => {
                                            const latestLog = truck.history.length > 0 ? truck.history[0] : null;
                                            const totalTempuh = latestLog ? (latestLog.kmAkhir - latestLog.kmAwal) : null;

                                            return (
                                                <tr 
                                                    key={truck.id} 
                                                    onClick={() => setSelectedTruckId(truck.id)}
                                                    className={`transition-colors cursor-pointer ${selectedTruckId === truck.id ? 'bg-primary/5 dark:bg-primary/10' : 'hover:bg-slate-50 dark:hover:bg-[#1A1A1A]'}`}
                                                >
                                                    <td className="px-6 py-4 text-center text-sm font-bold text-slate-400">{idx + 1}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-black text-slate-800 dark:text-white flex items-center gap-2">
                                                            {truck.plateNumber}
                                                            {selectedTruckId === truck.id && <span className="w-2 h-2 rounded-full bg-primary"></span>}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-300">{truck.model}</td>
                                                    
                                                    {/* 🌟 SEL KAPASITAS MAKSIMAL (TIDAK BERUBAH) */}
                                                    <td className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400 text-right">
                                                        {truck.capacity ? truck.capacity.toLocaleString('id-ID') : '-'}
                                                    </td>

                                                    {/* 🌟 SEL MUATAN HARI INI (AKTUAL) */}
                                                    <td className="px-6 py-4 text-sm font-bold text-right text-primary bg-primary/5 dark:bg-primary/10">
                                                        {truck.currentLoad ? `${truck.currentLoad.toLocaleString('id-ID')} KG` : '0 KG'}
                                                    </td>

                                                    <td className="px-6 py-4 text-sm font-mono text-slate-700 dark:text-slate-400 text-right">
                                                        {latestLog ? latestLog.kmAwal.toLocaleString('id-ID') : truck.kmAwalHariIni?.toLocaleString('id-ID')}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-mono text-slate-700 dark:text-slate-400 text-right">
                                                        {latestLog ? latestLog.kmAkhir.toLocaleString('id-ID') : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <span className={`text-sm font-black ${totalTempuh !== null ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/50' : 'text-slate-300 dark:text-slate-600'}`}>
                                                            {totalTempuh !== null ? `${totalTempuh.toLocaleString('id-ID')} KM` : '-'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full tracking-wide ${getStatusStyle(truck.status)}`}>
                                                            {truck.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>

                {selectedTruck && (
                    <aside className="w-full lg:w-96 bg-white dark:bg-[#111111] border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-[#333] p-6 overflow-y-auto shrink-0 flex flex-col gap-6">
                        <div className="pb-4 border-b border-slate-200 dark:border-[#333]">
                            <h4 className="text-2xl font-black text-slate-900 dark:text-white">{selectedTruck.plateNumber}</h4>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">{selectedTruck.model} • <span className={`font-bold ${selectedTruck.status === 'Available' ? 'text-emerald-600' : 'text-amber-600'}`}>{selectedTruck.status}</span></p>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="flex items-center justify-between">
                                <h5 className="text-sm font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Riwayat Konsumsi BBM</h5>
                                <button onClick={() => {
                                    setFuelForm(prev => ({...prev, kmAwal: selectedTruck.kmAwalHariIni || 0}));
                                    setShowFuelModal(true);
                                }} className="text-primary hover:text-primary/80 text-sm font-bold flex items-center">
                                    <span className="material-symbols-outlined text-sm mr-1">add</span> Isi Bensin
                                </button>
                            </div>

                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                {selectedTruck.history.length > 0 ? (
                                    selectedTruck.history.map((log) => {
                                        const jarakTempuh = log.kmAkhir - log.kmAwal;
                                        const efisiensi = (jarakTempuh / log.liters).toFixed(1);

                                        return (
                                            <div key={log.id} className="bg-slate-50 dark:bg-[#1A1A1A] p-4 rounded-xl border border-slate-200 dark:border-[#333] space-y-3 relative overflow-hidden">
                                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${parseFloat(efisiensi) >= 10 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                                
                                                <div className="flex justify-between items-start pl-2">
                                                    <div>
                                                        <p className="font-bold text-slate-800 dark:text-white">{log.date}</p>
                                                        <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mt-1">
                                                            <span className="material-symbols-outlined text-[12px]">local_gas_station</span> {log.station}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-black text-slate-900 dark:text-white">{formatRupiah(log.cost)}</p>
                                                        <p className="text-xs font-bold text-primary">{log.liters} L</p>
                                                    </div>
                                                </div>

                                                <div className="pl-2 pt-3 border-t border-slate-200 dark:border-[#333] flex justify-between items-end">
                                                    <div>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Jarak Tempuh</p>
                                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-0.5">{jarakTempuh} KM</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Efisiensi (KM/L)</p>
                                                        <p className={`text-lg font-black mt-0.5 ${parseFloat(efisiensi) >= 10 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                                            {efisiensi}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-[#333] rounded-xl">
                                        <span className="material-symbols-outlined text-slate-300 text-4xl mb-2">receipt_long</span>
                                        <p className="text-sm text-slate-500 font-medium">Belum ada riwayat isi bensin.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-200 dark:border-[#333] space-y-3">
                            <button onClick={() => {
                                setStatusForm(selectedTruck.status);
                                setShowStatusModal(true);
                            }} className="w-full py-3 bg-white dark:bg-[#1A1A1A] border border-slate-300 dark:border-[#444] text-slate-700 dark:text-white font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-[#222] transition-colors flex justify-center items-center gap-2">
                                <span className="material-symbols-outlined text-lg">edit_note</span> Ubah Status Truk
                            </button>
                        </div>
                    </aside>
                )}
            </div>
        </>
    );
}