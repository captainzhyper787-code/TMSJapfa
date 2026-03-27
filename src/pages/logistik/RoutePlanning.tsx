import React, { useState, useRef, useEffect } from "react";
import Header from "../../components/Header";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet'; // 🌟 TAMBAHAN TOOLTIP
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 🌟 FUNGSI BARU: BIKIN MARKER ANGKA WARNA WARNI
const createNumberedIcon = (number: number | string, color: string, isDepo: boolean = false) => {
    const size = isDepo ? 32 : 24;
    const fontSize = isDepo ? '14px' : '11px';
    const markerHtmlStyles = `
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        color: white;
        font-weight: 900;
        font-size: ${fontSize};
        border: 2px solid white;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.4);
    `;
    return new L.DivIcon({
        className: "custom-leaflet-icon",
        html: `<div style="${markerHtmlStyles}">${number}</div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2],
    });
};

interface RouteProduct { nama_barang: string; qty: string; }
interface RouteDetail { urutan: number; nama_toko: string; latitude: number; longitude: number; berat_kg: number; jam_tiba: string; items: RouteProduct[]; }
interface RouteItem { route_id: string; tanggal: string; driver_name: string; kendaraan: string; jenis: string; destinasi_jumlah: number; total_berat: number; status: string; zone: string; detail_rute: RouteDetail[]; }
interface Truck3DProps { plateNumber: string; driverName: string; truckType: string; zone: string; colorHex: string; percent: number; outerText: string; loadKg: string; colorClass: string; isSelected: boolean; onClick: () => void; }

interface UploadResult { order_id?: string; kode_customer?: string; nama_toko: string; berat?: number; kordinat?: string; alasan?: string; items?: RouteProduct[]; jam_maks?: string; }
interface DroppedNode { nama_toko: string; berat_kg: number; alasan: string; }

const formatTimeWindow = (timeStr: string, weight: number) => {
    if (!timeStr) return "-";
    const cleanedTimeStr = timeStr.substring(0, 5);
    const parts = cleanedTimeStr.split(':');
    if (parts.length < 2) return cleanedTimeStr;
    
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    
    const serviceTime = 15 + (weight / 10);
    const totalMinutes = h * 60 + m + Math.round(serviceTime);
    
    const endH = Math.floor(totalMinutes / 60) % 24;
    const endM = totalMinutes % 60;
    
    const startStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    const endStr = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
    
    return `${startStr} - ${endStr}`;
};

const Truck3D = ({ plateNumber, driverName, truckType, zone, colorHex, percent, outerText, loadKg, colorClass, isSelected, onClick }: Truck3DProps) => {
    return (
        <div onClick={onClick} className={`bg-white dark:bg-[#1F1F1F] p-4 rounded-xl shadow-sm transition-all cursor-pointer ${isSelected ? 'border-2 border-primary ring-4 ring-primary/5 shadow-md scale-[1.02]' : 'border border-slate-200 dark:border-[#333] hover:border-primary/50'}`}>
            <div className="flex justify-between items-start mb-3">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-slate-900 dark:text-white">{plateNumber}</span>
                        {isSelected && <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">SELECTED</span>}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{driverName} | {truckType}</p>
                </div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-300">ZONE: {zone}</span>
            </div>

            <div className="mt-4 bg-[#111111] rounded-2xl p-6 border border-[#333] shadow-[0_4px_20px_rgba(0,0,0,0.5)] relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-${colorClass}-500/10 blur-[40px] rounded-full pointer-events-none`}></div>
                <div className="flex justify-between items-baseline mb-3 relative z-10">
                    <span className="text-sm font-black text-white uppercase tracking-wider">Load Factor</span>
                    <span className={`text-[10px] font-black text-${colorClass}-400 bg-${colorClass}-400/10 px-2 py-1 rounded border border-${colorClass}-400/20 uppercase shadow-[0_0_10px_rgba(0,0,0,0.2)]`}>{outerText}</span>
                </div>
                <div className="flex justify-between text-xs mb-1 relative z-10"><span className="text-slate-400 font-medium uppercase">Current Load</span><span className="font-bold text-white">{loadKg}</span></div>
                
                <div className="relative w-full h-48 flex items-center justify-center mt-6 overflow-visible scale-110" style={{ perspective: '1200px' }}>
                    <div style={{ transform: 'rotateX(60deg) rotateZ(45deg)', transformStyle: 'preserve-3d' }} className="w-[240px] h-[72px] relative flex transition-all duration-700 hover:scale-105 cursor-pointer">
                        <div className="absolute right-0 top-0 w-[180px] h-[72px]" style={{ transformStyle: 'preserve-3d' }}>
                            <div className="absolute inset-0 bg-slate-900 border-[2px] border-slate-700" style={{ transform: 'translateZ(10px)' }}></div>
                            <div className="absolute inset-0 border-[3px] border-slate-200" style={{ transform: 'translateZ(80px)', background: `linear-gradient(to right, ${colorHex} 0%, ${colorHex} ${percent}%, #f1f5f9 ${percent}%, #f1f5f9 100%)` }}>
                                <div className="absolute inset-x-0 top-0 h-full opacity-30" style={{ width: `${percent}%`, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.7) 10px, rgba(255,255,255,0.7) 20px)' }}></div>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full h-[70px] origin-bottom border-[3px] border-r-0 border-slate-200 flex items-center shadow-[-5px_5px_20px_rgba(0,0,0,0.5)]" style={{ transform: 'translateZ(10px) rotateX(-90deg)', background: `linear-gradient(to right, ${colorHex} 0%, ${colorHex} ${percent}%, #e2e8f0 ${percent}%, #e2e8f0 100%)` }}>
                                <div className="absolute inset-y-0 left-0 opacity-30" style={{ width: `${percent}%`, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.7) 10px, rgba(255,255,255,0.7) 20px)' }}></div>
                                <span className="text-white font-black text-4xl drop-shadow-md absolute" style={{ left: `calc(${percent}% / 2)`, transform: 'translate(-50%, 0)' }}>{percent}%</span>
                            </div>
                            <div className="absolute top-0 left-0 w-full h-[70px] origin-top bg-slate-300 border-[3px] border-l-0 border-slate-400" style={{ transform: 'translateZ(10px) rotateX(90deg)' }}></div>
                            <div className="absolute top-0 right-0 w-[70px] h-[72px] origin-right bg-slate-200 border-[3px] border-slate-300 flex flex-col p-[2px] gap-[2px]" style={{ transform: 'translateZ(10px) rotateY(-90deg)' }}>
                                <div className="flex-1 border-2 border-slate-400 bg-slate-100 flex items-center justify-center"><div className="w-1/2 h-full border-b-[2px] border-slate-300"></div></div>
                                <div className="flex-1 border-2 border-slate-400 bg-slate-100 flex items-center justify-center"><div className="w-1/2 h-full border-b-[2px] border-slate-300"></div></div>
                            </div>
                            <div className="absolute right-[20px] bottom-[-2px] w-[30px] h-[30px] origin-bottom bg-slate-900 rounded-full border-[6px] border-[#222] shadow-xl" style={{ transform: 'rotateX(-90deg) translateZ(-15px)' }}><div className="absolute inset-[2px] bg-slate-400 rounded-full"></div></div>
                            <div className="absolute right-[70px] bottom-[-2px] w-[30px] h-[30px] origin-bottom bg-slate-900 rounded-full border-[6px] border-[#222] shadow-xl" style={{ transform: 'rotateX(-90deg) translateZ(-15px)' }}><div className="absolute inset-[2px] bg-slate-400 rounded-full"></div></div>
                        </div>
                        <div className="absolute left-[10px] top-[4px] w-[40px] h-[64px]" style={{ transformStyle: 'preserve-3d' }}>
                            <div className="absolute inset-0 bg-slate-800" style={{ transform: 'translateZ(10px)' }}></div>
                            <div className="absolute inset-0 bg-slate-100 border-[3px] border-slate-300 shadow-inner" style={{ transform: 'translateZ(60px)' }}></div>
                            <div className="absolute bottom-0 left-0 w-full h-[50px] origin-bottom bg-slate-100 border-[3px] border-slate-300 flex items-start" style={{ transform: 'translateZ(10px) rotateX(-90deg)' }}>
                                <div className="w-full h-[30px] mt-2 ml-[2px] bg-slate-200 border-[2px] border-slate-400 rounded-sm overflow-hidden relative">
                                    <div className="w-full h-2/3 bg-slate-800/90 absolute top-0 border-b-2 border-slate-400"></div>
                                    <div className="w-2 h-[2px] bg-slate-500 absolute bottom-1 right-1"></div>
                                </div>
                            </div>
                            <div className="absolute top-0 left-0 w-full h-[50px] origin-top bg-slate-300 border-[3px] border-slate-400" style={{ transform: 'translateZ(10px) rotateX(90deg)' }}></div>
                            <div className="absolute top-0 left-0 w-[50px] h-[64px] origin-left bg-slate-200 border-[3px] border-slate-300" style={{ transform: 'translateZ(10px) rotateY(90deg)' }}>
                                <div className="absolute right-[2px] top-[4px] w-[26px] h-[50px] bg-slate-800/90 rounded-sm border-2 border-slate-700 shadow-inner"></div>
                            </div>
                            <div className="absolute left-[5px] bottom-[-2px] w-[30px] h-[30px] origin-bottom bg-slate-900 rounded-full border-[6px] border-[#222] shadow-xl" style={{ transform: 'rotateX(-90deg) translateZ(-15px)' }}><div className="absolute inset-[2px] bg-slate-400 rounded-full"></div></div>
                        </div>
                        <div className="absolute -bottom-8 -left-4 w-[110%] h-16 bg-black/40 blur-xl rounded-full" style={{ transform: 'rotateX(80deg) translateZ(-20px)' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const getTruckColors = (loadPercent: number) => {
    if (loadPercent > 80) return { hex: '#10b981', class: 'emerald', text: `Optimal • ${loadPercent}%` };
    if (loadPercent > 50) return { hex: '#f59e0b', class: 'amber', text: `Moderate • ${loadPercent}%` };
    return { hex: '#ef4444', class: 'red', text: `Low • ${loadPercent}%` };
};

interface MapComponentProps {
    mapPositions: [number, number][];
    selectedRoute: RouteItem | undefined;
}

const MapComponent = ({ mapPositions, selectedRoute }: MapComponentProps) => {
    const mapRef = useRef<any>(null);

    useEffect(() => {
        if (mapRef.current) {
            setTimeout(() => {
                mapRef.current?.invalidateSize();
            }, 300);
        }
    }, []);

    const routeColor = "#0ea5e9"; // Warna garis untuk tampilan single rute

    return (
        <MapContainer 
            center={mapPositions.length > 0 ? mapPositions[0] : [-6.2000, 106.8166]} 
            zoom={10} 
            scrollWheelZoom={true} 
            style={{ height: '100%', width: '100%', zIndex: 0 }}
            ref={mapRef}
        >
            <TileLayer 
                attribution='&copy; <a href="https://www.tomtom.com/">TomTom</a>' 
                url="https://api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?key=xUy50YsjmbRexLalxX3ThDpmC1lOzElP" 
            />
            {/* 🌟 MARKER DEPO */}
            <Marker position={[-6.207356, 106.479163]} icon={createNumberedIcon('0', '#1e293b', true)}>
                <Tooltip direction="top" offset={[0, -16]} opacity={1}><b>Gudang JAPFA Cikupa</b></Tooltip>
                <Popup><div className="font-bold">Gudang JAPFA Cikupa</div><div className="text-xs text-primary font-bold">START DEPO</div></Popup>
            </Marker>
            
            {/* 🌟 MARKER TOKO */}
            {selectedRoute?.detail_rute.map((stop, idx) => (
                <Marker key={idx} position={[stop.latitude, stop.longitude]} icon={createNumberedIcon(idx + 1, routeColor)}>
                    <Tooltip direction="top" offset={[0, -12]} opacity={1}><b>{stop.nama_toko}</b></Tooltip>
                    <Popup>
                        <div className="font-bold">{stop.nama_toko}</div>
                        <div className="text-xs text-slate-500">Est: {stop.jam_tiba.substring(0, 5)}</div>
                        <div className="text-[10px] mt-1 text-primary">Urutan #{idx + 1} • {stop.berat_kg} KG</div>
                    </Popup>
                </Marker>
            ))}
            <Polyline positions={mapPositions} pathOptions={{ color: routeColor, weight: 4, dashArray: '5, 10' }} />
        </MapContainer>
    );
};

export default function RoutePlanning() {
    const [isUploading, setIsUploading] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [showMapView, setShowMapView] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [routeMessage, setRouteMessage] = useState('');
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [routesData, setRoutesData] = useState<RouteItem[]>([]);
    const [droppedNodes, setDroppedNodes] = useState<DroppedNode[]>([]);
    
    const [previewData, setPreviewData] = useState<any>(null);
    // 🌟 WARNA KHAS UNTUK TRUK BERBEDA
    const truckColors = ['#e11d48', '#0284c7', '#16a34a', '#d97706', '#9333ea', '#0d9488', '#0891b2'];

    const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
    const [activeModal, setActiveModal] = useState<'cost' | 'distance' | 'fleet' | 'stops' | null>(null);
    const [expandedStopIdx, setExpandedStopIdx] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [uploadReport, setUploadReport] = useState<{success: UploadResult[], failed: UploadResult[]} | null>(null);
    const [failedCoords, setFailedCoords] = useState<Record<number, { lat: string, lon: string }>>({});
    const [expandedRows, setExpandedRows] = useState<number[]>([]);
    
    const toggleRow = (idx: number) => {
        if (expandedRows.includes(idx)) {
            setExpandedRows(expandedRows.filter(i => i !== idx)); 
        } else {
            setExpandedRows([...expandedRows, idx]); 
        }
    };

    const fetchRoutes = async (date: string) => {
        try {
            const response = await fetch(`http://localhost:8000/api/routes?date=${date}`);
            if (response.ok) {
                const data = await response.json();
                if (data.routes) {
                    setRoutesData(data.routes);
                    setDroppedNodes(data.dropped_nodes || []);
                    if (data.routes.length > 0) setSelectedRouteId(data.routes[0].route_id);
                    else setSelectedRouteId(null);
                } else {
                    setRoutesData(data);
                    if (data.length > 0) setSelectedRouteId(data[0].route_id);
                    else setSelectedRouteId(null);
                }
            }
        } catch (error) { console.error("Gagal:", error); }
    };

    useEffect(() => { fetchRoutes(selectedDate); }, [selectedDate]);

    const handleUploadClick = () => fileInputRef.current?.click();
    
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);

        try {
            const response = await fetch('http://localhost:8000/api/orders/upload', { method: 'POST', body: formData });
            if (response.ok) {
                const data = await response.json();
                setUploadReport({ success: data.success_list || [], failed: data.failed_list || [] });
                setFailedCoords({}); 
                setShowVerificationModal(true); 
            } else {
                alert(`Gagal upload.`);
            }
        } catch (error) {
            alert(`Server Error! Pastikan Uvicorn menyala.`);
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = '';
            setIsUploading(false); 
        }
    };

    const handleTimeChange = async (orderId: string | undefined, newTime: string) => {
        if (!orderId) return; 
        try {
            const response = await fetch(`http://localhost:8000/api/orders/${orderId}/time`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jam_maksimal: newTime })
            });
            if (!response.ok) console.error("Gagal simpan waktu ke database!");
        } catch (error) {
            console.error("Error API Time Update:", error);
        }
    };

    const handleSaveCoordinate = async (idx: any, item: any) => {
        const coords = failedCoords[idx];
        if (!coords || !coords.lat || !coords.lon) {
            return alert("Isi Latitude dan Longitude dulu Bos!");
        }

        try {
            const payload = {
                latitude: parseFloat(coords.lat),
                longitude: parseFloat(coords.lon),
                kode_customer: item.kode_customer || item.nama_toko, 
                nama_customer: item.nama_toko
            };

            const response = await fetch(`http://localhost:8000/api/orders/DRAFT-${idx}/coordinate`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const currentSuccess = uploadReport ? [...uploadReport.success] : [];
                const recoveredItem = {
                    ...item,
                    kordinat: `${coords.lat}, ${coords.lon}` 
                };
                currentSuccess.push(recoveredItem);

                const currentFailed = uploadReport ? [...uploadReport.failed] : [];
                const newFailed = currentFailed.filter((_, currentIdx) => currentIdx !== idx);

                setUploadReport({
                    success: currentSuccess,
                    failed: newFailed
                });

                const newFailedCoords = { ...failedCoords };
                delete newFailedCoords[idx];
                setFailedCoords(newFailedCoords);

            } else {
                alert("Gagal menyimpan koordinat!");
            }
        } catch (error) {
            console.error("Gagal save:", error);
        }
    };

    const handleOptimizeRoute = async () => {
        setShowVerificationModal(false); 
        setIsOptimizing(true); 
        try {
            const response = await fetch('http://localhost:8000/optimize-routes?preview=true', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
            
            if (response.ok) {
                const data = await response.json();
                setPreviewData(data);
            } else { 
                const errData = await response.json();
                alert(`Gagal optimasi VRP: ${errData.detail ? JSON.stringify(errData.detail) : 'Server Error'}`); 
            }
        } catch (error) { 
            alert('Gagal konek ke server Backend!'); 
        } finally { 
            setIsOptimizing(false); 
        }
    };

    const handleConfirmSaveRoute = async () => {
        setPreviewData(null);
        setIsOptimizing(true); 
        try {
            const response = await fetch('http://localhost:8000/optimize-routes', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
            
            if (response.ok) {
                const data = await response.json();
                setRouteMessage(String(data.info_text || 'Rute berhasil dioptimasi & disimpan ke Database!'));
                const todayStr = new Date().toISOString().split('T')[0];
                setSelectedDate(todayStr); 
                await fetchRoutes(todayStr); 
            } else { 
                alert(`Gagal menyimpan VRP.`); 
            }
        } catch (error) { 
            alert('Gagal konek ke server Backend!'); 
        } finally { 
            setIsOptimizing(false); 
            setTimeout(() => setRouteMessage(''), 15000); 
        }
    };

    const totalFleet = routesData.length;
    const totalOrders = routesData.reduce((sum, route) => sum + (route.destinasi_jumlah || 0), 0);
    
    const totalCost = totalFleet > 0 ? (totalFleet * 1250000).toLocaleString('id-ID') : "0";
    const totalDistance = totalFleet > 0 ? (totalFleet * 45.5).toFixed(1) : "0";
    const selectedRoute = routesData.find(r => r.route_id === selectedRouteId);
    
    const mapPositions: [number, number][] = [];
    if (selectedRoute) {
        mapPositions.push([-6.207356, 106.479163]); 
        selectedRoute.detail_rute.forEach(stop => {
            if (stop.latitude && stop.longitude) mapPositions.push([stop.latitude, stop.longitude]);
        });
    }

    return (
        <>
            <Header title="Route Planning Dashboard" />

            {previewData && (
                <div className="fixed inset-0 z-[999999] bg-slate-900/90 backdrop-blur-sm flex flex-col p-4 md:p-8">
                    <div className="bg-white dark:bg-[#111] flex-1 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
                        <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-[#1A1A1A]">
                            <div>
                                <h2 className="text-xl md:text-2xl font-black uppercase text-slate-800 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">route</span> Peta Preview Rute AI
                                </h2>
                                <p className="text-slate-500 text-sm mt-1">Review jalur pengiriman setiap truk sebelum disimpan permanen.</p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => { setPreviewData(null); setShowVerificationModal(true); }} className="px-4 py-2 border-2 border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">edit</span> Batal & Edit Waktu
                                </button>
                                <button onClick={handleConfirmSaveRoute} className="px-6 py-2 bg-primary text-white font-black rounded-xl hover:brightness-110 flex items-center gap-2 shadow-lg shadow-primary/30 transition-all">
                                    <span className="material-symbols-outlined">save</span> SIMPAN RUTE PERMANEN
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 relative bg-slate-100 dark:bg-slate-900">
                            <MapContainer 
                                center={[-6.207356, 106.479163]} 
                                zoom={10} 
                                style={{ height: '100%', width: '100%' }}
                                whenReady={() => {
                                    setTimeout(() => {
                                        window.dispatchEvent(new Event('resize'));
                                    }, 400);
                                }}
                            >
                                <TileLayer attribution='&copy; <a href="https://www.tomtom.com/">TomTom</a>' url="https://api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?key=xUy50YsjmbRexLalxX3ThDpmC1lOzElP" />
                                
                                {/* 🌟 DEPO ICON GLOBAL */}
                                <Marker position={[-6.207356, 106.479163]} icon={createNumberedIcon('0', '#1e293b', true)} zIndexOffset={1000}>
                                    <Tooltip direction="top" offset={[0, -16]} opacity={1}><b>Gudang JAPFA Cikupa</b></Tooltip>
                                </Marker>

                                {previewData.jadwal_truk_internal.map((truk: any, i: number) => {
                                    const color = truckColors[i % truckColors.length];
                                    const positions = truk.detail_perjalanan.map((stop: any) => [stop.lat, stop.lon]);
                                    
                                    return (
                                        <React.Fragment key={i}>
                                            <Polyline positions={positions} pathOptions={{ color: color, weight: 4, opacity: 0.8, dashArray: '8, 8' }} />
                                            {truk.detail_perjalanan.map((stop: any, j: number) => {
                                                if (stop.urutan === 0) return null; // Skip drawing depo again for each truck
                                                return (
                                                <Marker key={`${i}-${j}`} position={[stop.lat, stop.lon]} icon={createNumberedIcon(stop.urutan, color)}>
                                                    <Tooltip direction="top" offset={[0, -12]} opacity={1}><b>{stop.nama_toko || stop.lokasi}</b></Tooltip>
                                                    <Popup>
                                                        <b style={{color: color}} className="text-sm font-black uppercase tracking-wider mb-1 block">🚚 {truk.armada}</b>
                                                        <span className="font-bold text-slate-800">{stop.nama_toko || stop.lokasi}</span><br/>
                                                        <span className="text-xs text-slate-500">Jam Tiba: {stop.jam_tiba?.substring(0,5) || stop.jam?.substring(0,5)}</span>
                                                    </Popup>
                                                </Marker>
                                            )})}
                                        </React.Fragment>
                                    )
                                })}
                            </MapContainer>

                            {/* 🌟 LEGENDA PETA */}
                            <div className="absolute bottom-6 right-6 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[250px] overflow-y-auto">
                                <h4 className="text-[10px] font-black uppercase text-slate-500 mb-3 tracking-wider">Keterangan Truk</h4>
                                <div className="space-y-2.5">
                                    {previewData.jadwal_truk_internal.map((truk: any, i: number) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-4 h-4 rounded-full shadow-inner border border-white" style={{ backgroundColor: truckColors[i % truckColors.length] }}></div>
                                            <div>
                                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block leading-none">{truk.armada}</span>
                                                <span className="text-[9px] font-medium text-slate-500">{truk.total_muatan_kg} KG</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeModal && (
                <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setActiveModal(null)}>
                    <div className="bg-white dark:bg-[#1F1F1F] rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 dark:border-[#333] overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
                        <div className="p-5 border-b border-slate-200 dark:border-[#333] flex justify-between items-center bg-slate-50 dark:bg-[#1A1A1A]">
                            <h3 className="font-bold text-lg dark:text-white flex items-center gap-2">
                                {activeModal === 'cost' && <><span className="material-symbols-outlined text-primary">payments</span> Rincian Cost Estimation</>}
                                {activeModal === 'distance' && <><span className="material-symbols-outlined text-primary">route</span> Rincian Total Distance</>}
                                {activeModal === 'fleet' && <><span className="material-symbols-outlined text-primary">local_shipping</span> Rincian Active Fleet</>}
                                {activeModal === 'stops' && <><span className="material-symbols-outlined text-primary">inventory_2</span> Rincian Total Stops</>}
                            </h3>
                            <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-slate-200 dark:hover:bg-[#333] rounded-lg text-slate-500">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-5 overflow-y-auto flex-1">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-[#333] text-slate-500 text-sm">
                                        <th className="pb-3 font-semibold">Truk (Nopol)</th>
                                        <th className="pb-3 font-semibold">Driver</th>
                                        {activeModal === 'cost' && <th className="pb-3 font-semibold text-right">Estimasi Biaya</th>}
                                        {activeModal === 'distance' && <th className="pb-3 font-semibold text-right">Jarak Tempuh</th>}
                                        {activeModal === 'fleet' && <th className="pb-3 font-semibold text-right">Tipe Armada</th>}
                                        {activeModal === 'stops' && <th className="pb-3 font-semibold text-right">Jumlah Toko</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {routesData.map((route, i) => (
                                        <tr key={i} className="border-b border-slate-100 dark:border-[#222] last:border-0 hover:bg-slate-50 dark:hover:bg-[#2A2A2A]">
                                            <td className="py-3 font-bold dark:text-white">{route.kendaraan}</td>
                                            <td className="py-3 text-slate-600 dark:text-slate-300">{route.driver_name}</td>
                                            {activeModal === 'cost' && <td className="py-3 text-right font-mono text-emerald-600">Rp 1.250.000</td>}
                                            {activeModal === 'distance' && <td className="py-3 text-right font-mono text-blue-500">45.5 KM</td>}
                                            {activeModal === 'fleet' && <td className="py-3 text-right text-slate-500">{route.jenis}</td>}
                                            {activeModal === 'stops' && <td className="py-3 text-right font-bold text-primary">{route.destinasi_jumlah} Toko</td>}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {(isUploading || isOptimizing) && (
                <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mb-6"></div>
                    <h3 className="text-xl font-bold text-white tracking-widest uppercase">
                        {isUploading ? 'MENGUNGGAH SAP KE DATABASE...' : 'MESIN VRP SEDANG BEKERJA...'}
                    </h3>
                </div>
            )}

            {showVerificationModal && uploadReport && (
                <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1F1F1F] rounded-2xl shadow-2xl w-full max-w-[95vw] h-[90vh] flex flex-col border border-slate-200 dark:border-[#333] overflow-hidden animate-in zoom-in-95">
                        <div className="p-6 border-b border-slate-200 dark:border-[#333] flex justify-between items-center bg-slate-50 dark:bg-[#111]">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase">Validasi Pre-Routing VRP</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Harap cek daftar pelanggan, muatan, dan <b className="text-primary">Batas Waktu</b> sebelum memproses rute Bos Ihsan.</p>
                            </div>
                            <button onClick={() => setShowVerificationModal(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-[#333] rounded-xl text-slate-500">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-6 flex-1 overflow-y-auto space-y-8 bg-slate-50 dark:bg-[#1A1A1A]">
                            <div className="bg-white dark:bg-[#1F1F1F] border border-emerald-200 dark:border-emerald-900/50 rounded-xl overflow-hidden shadow-sm">
                                <div className="bg-emerald-50 dark:bg-emerald-900/20 px-5 py-3 border-b border-emerald-200 dark:border-emerald-900/50 flex justify-between items-center">
                                    <h3 className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                                        <span className="material-symbols-outlined">check_circle</span>
                                        Toko Siap Routing ({uploadReport.success.length})
                                    </h3>
                                </div>
                                <div className="max-h-[500px] overflow-y-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="sticky top-0 bg-slate-50 dark:bg-[#111] shadow-sm z-10 border-b border-slate-200 dark:border-[#333]">
                                            <tr className="text-slate-500 dark:text-slate-400">
                                                <th className="px-5 py-3 font-semibold">No. & Nama Toko</th>
                                                <th className="px-5 py-3 font-semibold w-32">Total Berat</th>
                                                <th className="px-5 py-3 font-semibold w-48">Kordinat GPS</th>
                                                <th className="px-5 py-3 font-semibold w-40 text-center text-primary">Batas Jam (Bisa Edit)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-[#333]">
                                            {uploadReport.success.map((item, idx) => (
                                                <React.Fragment key={idx}>
                                                    <tr className="bg-white dark:bg-[#1F1F1F] hover:bg-slate-50 dark:hover:bg-[#2A2A2A] transition-colors">
                                                        <td className="px-5 py-3">
                                                            <div className="flex items-center gap-3">
                                                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 font-black text-xs border border-emerald-200 dark:border-emerald-800 shrink-0">
                                                                    {idx + 1}
                                                                </span>
                                                                <div>
                                                                    <p className="font-bold text-slate-800 dark:text-white">{item.nama_toko}</p>
                                                                    {item.items && item.items.length > 0 && (
                                                                        <button 
                                                                            onClick={() => toggleRow(idx)}
                                                                            className="text-[10px] font-bold text-primary flex items-center gap-1 mt-1 hover:underline outline-none"
                                                                        >
                                                                            <span className="material-symbols-outlined text-[12px]">
                                                                                {expandedRows.includes(idx) ? 'expand_less' : 'expand_more'}
                                                                            </span>
                                                                            {expandedRows.includes(idx) ? 'Sembunyikan Rincian' : `Lihat ${item.items.length} Rincian Muatan`}
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-3 text-slate-600 dark:text-slate-300 font-bold">{item.berat} KG</td>
                                                        <td className="px-5 py-3 font-mono text-xs text-slate-500">{item.kordinat}</td>
                                                        
                                                        <td className="px-5 py-3 text-center">
                                                            <div className="flex justify-center items-center gap-2">
                                                                <input 
                                                                    type="time" 
                                                                    defaultValue={item.jam_maks || "20:00"}
                                                                    onChange={(e) => handleTimeChange(item.order_id, e.target.value)}
                                                                    className="border border-slate-300 dark:border-slate-600 dark:bg-[#111] dark:text-white rounded-lg px-2 py-1.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm w-full transition-all"
                                                                    title="Ganti jam kalau ada intervensi manual"
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    
                                                    {expandedRows.includes(idx) && item.items && item.items.length > 0 && (
                                                        <tr className="bg-slate-50/80 dark:bg-[#1A1A1A] animate-in fade-in slide-in-from-top-2 duration-200">
                                                            <td colSpan={4} className="px-5 pb-4 pt-3 border-t border-dashed border-slate-200 dark:border-[#333]">
                                                                <div className="pl-[44px]"> 
                                                                    <h5 className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                                                                        <span className="material-symbols-outlined text-[12px]">receipt_long</span> Rincian Item ({item.berat} KG)
                                                                    </h5>
                                                                    <ul className="grid grid-cols-2 gap-2">
                                                                        {item.items.map((product, prodIdx) => (
                                                                            <li key={prodIdx} className="flex justify-between items-center text-xs bg-white dark:bg-[#222] p-2 rounded-md border border-slate-200 dark:border-[#444] shadow-sm">
                                                                                <span className="text-slate-600 dark:text-slate-300 font-medium truncate pr-2">{String(product.nama_barang)}</span>
                                                                                <span className="font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-[#111] px-2 py-0.5 rounded shrink-0">{String(product.qty)}</span>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {uploadReport.failed.length > 0 && (
                                <div className="bg-white dark:bg-[#1F1F1F] border border-red-200 dark:border-red-900/50 rounded-xl overflow-hidden shadow-sm mt-4">
                                    <div className="bg-red-50 dark:bg-red-900/20 px-5 py-3 border-b border-red-200 dark:border-red-900/50 flex justify-between items-center">
                                        <h3 className="font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
                                            <span className="material-symbols-outlined">warning</span>
                                            Error / Tanpa Koordinat ({uploadReport.failed.length})
                                        </h3>
                                    </div>
                                    <div className="max-h-[300px] overflow-y-auto">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-slate-50 dark:bg-[#111] sticky top-0 border-b border-slate-200 dark:border-[#333]">
                                                <tr className="text-slate-500 dark:text-slate-400">
                                                    <th className="px-5 py-3 font-bold">Nama Toko</th>
                                                    <th className="px-5 py-3 font-bold">Berat</th>
                                                    <th className="px-5 py-3 font-bold">Alasan Drop</th>
                                                    <th className="px-5 py-3 font-bold text-center w-72">Aksi (Input Koordinat)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-[#222]">
                                                {uploadReport.failed.map((item, idx) => (
                                                    <tr key={idx} className="hover:bg-red-50/30 dark:hover:bg-red-900/10">
                                                        <td className="px-5 py-3 font-bold text-slate-800 dark:text-slate-200">{item.nama_toko}</td>
                                                        <td className="px-5 py-3 font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-[#1A1A1A] w-32">{item.berat} KG</td>
                                                        <td className="px-5 py-3 text-red-600 dark:text-red-400 font-medium italic">{item.alasan}</td>
                                                        <td className="px-5 py-3">
                                                            <div className="flex gap-2">
                                                                <input 
                                                                    type="text" 
                                                                    placeholder="Lat (e.g. -6.2)" 
                                                                    className="w-24 text-xs border border-slate-300 dark:border-slate-600 dark:bg-[#111] dark:text-white rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                                                                    onChange={(e) => setFailedCoords({
                                                                        ...failedCoords, 
                                                                        [idx]: { ...failedCoords[idx], lat: e.target.value }
                                                                    })}
                                                                />
                                                                <input 
                                                                    type="text" 
                                                                    placeholder="Lon (e.g. 106.8)" 
                                                                    className="w-24 text-xs border border-slate-300 dark:border-slate-600 dark:bg-[#111] dark:text-white rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                                                                    onChange={(e) => setFailedCoords({
                                                                        ...failedCoords, 
                                                                        [idx]: { ...failedCoords[idx], lon: e.target.value }
                                                                    })}
                                                                />
                                                                <button 
                                                                    onClick={() => handleSaveCoordinate(idx, item)}
                                                                    className="bg-slate-800 dark:bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded hover:bg-primary transition-colors"
                                                                >
                                                                    SAVE
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-slate-200 dark:border-[#333] flex justify-end gap-4 bg-white dark:bg-[#111]">
                            <button onClick={() => setShowVerificationModal(false)} className="px-6 py-3 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#222] rounded-xl transition-all">
                                Batal & Edit Excel
                            </button>
                            <button onClick={handleOptimizeRoute} className="px-8 py-3 font-black text-white bg-primary hover:brightness-110 rounded-xl shadow-xl shadow-primary/30 flex items-center gap-2 transition-all">
                                <span className="material-symbols-outlined">rocket_launch</span>
                                GAS PREVIEW RUTE AI SEKARANG!
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
                
                {routeMessage && (
                    <div className={`px-5 py-3 rounded-xl text-sm font-bold border flex items-center gap-3 shadow-sm ${String(routeMessage).includes('PERHATIAN') ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-emerald-50 text-emerald-700 border-emerald-300'}`}>
                        <span className="material-symbols-outlined text-xl">{String(routeMessage).includes('PERHATIAN') ? 'warning' : 'check_circle'}</span>
                        {String(routeMessage)}
                    </div>
                )}

                <div className="flex justify-between items-center bg-white dark:bg-[#1F1F1F] p-4 rounded-xl border border-slate-200 dark:border-[#333] shadow-sm">
                    <div className="flex items-center gap-4">
                        <h3 className="font-bold text-slate-800 dark:text-white">Filter Jadwal:</h3>
                        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="px-3 py-2 bg-slate-50 dark:bg-[#111] border border-slate-300 dark:border-[#444] rounded-lg text-sm text-slate-700 dark:text-white outline-none focus:border-primary" />
                    </div>
                    <div className="flex items-center gap-3">
                        <button type="button" className="px-5 py-2.5 bg-white dark:bg-[#1F1F1F] border border-slate-300 dark:border-[#333] text-slate-700 dark:text-white font-bold rounded-lg hover:bg-slate-50 transition-all text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg text-emerald-600">download</span> Download Delivery Order
                        </button>
                        <button type="button" onClick={handleUploadClick} disabled={isUploading} className="px-5 py-2.5 bg-primary text-white font-bold rounded-lg hover:brightness-110 transition-all text-sm flex items-center gap-2 shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-lg">upload_file</span> Upload SAP Excel
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" accept=".csv,.xlsx" onChange={handleFileUpload} />
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-6">
                    <div onClick={() => setActiveModal('cost')} className="bg-white dark:bg-[#1F1F1F] p-5 rounded-xl border border-slate-200 dark:border-[#333] shadow-sm cursor-pointer hover:border-primary transition-all">
                        <div className="flex justify-between items-start mb-2"><span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cost Estimation</span><span className="material-symbols-outlined text-slate-300">payments</span></div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">Rp {totalCost}</div><div className="mt-2 text-[10px] text-primary">Klik untuk rincian ↗</div>
                    </div>
                    <div onClick={() => setActiveModal('distance')} className="bg-white dark:bg-[#1F1F1F] p-5 rounded-xl border border-slate-200 dark:border-[#333] shadow-sm cursor-pointer hover:border-primary transition-all">
                        <div className="flex justify-between items-start mb-2"><span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Distance</span><span className="material-symbols-outlined text-slate-300">route</span></div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalDistance} KM</div><div className="mt-2 text-[10px] text-primary">Klik untuk rincian ↗</div>
                    </div>
                    <div onClick={() => setActiveModal('fleet')} className="bg-white dark:bg-[#1F1F1F] p-5 rounded-xl border border-slate-200 dark:border-[#333] shadow-sm cursor-pointer hover:border-primary transition-all">
                        <div className="flex justify-between items-start mb-2"><span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Fleet</span><span className="material-symbols-outlined text-slate-300">local_shipping</span></div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalFleet} Trucks</div><div className="mt-2 text-[10px] text-primary">Klik untuk rincian ↗</div>
                    </div>
                    <div onClick={() => setActiveModal('stops')} className="bg-white dark:bg-[#1F1F1F] p-5 rounded-xl border border-slate-200 dark:border-[#333] shadow-sm cursor-pointer hover:border-primary transition-all">
                        <div className="flex justify-between items-start mb-2"><span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Stops</span><span className="material-symbols-outlined text-slate-300">inventory_2</span></div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalOrders} Destinations</div><div className="mt-2 text-[10px] text-primary">Klik untuk rincian ↗</div>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-8 items-start pb-12">
                    
                    {!isFocusMode && (
                        <div className="col-span-3 space-y-4 transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><span className="material-symbols-outlined text-slate-400">local_shipping</span> Today's Fleet</h3>
                            </div>
                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 pb-10">
                                {routesData.length > 0 ? (
                                    routesData.map((route) => {
                                        const maxCap = 2000; 
                                        const loadPercent = Math.min(Math.round((route.total_berat / maxCap) * 100), 100);
                                        const colors = getTruckColors(loadPercent);
                                        return (
                                            <Truck3D key={route.route_id} plateNumber={route.kendaraan} driverName={route.driver_name} truckType={route.jenis} zone={route.zone} colorHex={colors.hex} percent={loadPercent} outerText={colors.text} loadKg={`${route.total_berat} / ${maxCap} Kg`} colorClass={colors.class} isSelected={selectedRouteId === route.route_id} onClick={() => { setSelectedRouteId(route.route_id); setExpandedStopIdx(null); }} />
                                        );
                                    })
                                ) : (
                                    <div className="p-10 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-300 dark:border-[#333] rounded-2xl text-slate-500">
                                        <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">manage_search</span>
                                        <p className="font-bold">Belum ada rute.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className={`${isFocusMode ? 'col-span-12' : 'col-span-9'} space-y-4 transition-all duration-300`}>
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><span className="material-symbols-outlined text-slate-400">timeline</span> Route Sequence {selectedRoute && `- ${selectedRoute.kendaraan}`}</h3>
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setIsFocusMode(!isFocusMode)} className={`px-3 py-1.5 border rounded-lg text-sm font-bold transition-colors flex items-center gap-1 ${isFocusMode ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20' : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:hover:bg-[#1A1A1A] dark:text-slate-300 dark:border-[#333]'}`}>
                                    <span className="material-symbols-outlined text-base">{isFocusMode ? 'fullscreen_exit' : 'fullscreen'}</span>
                                    {isFocusMode ? 'Normal View' : 'Focus Mode'}
                                </button>
                                <button type="button" onClick={() => setShowMapView(!showMapView)} className={`px-4 py-2 border rounded-lg text-sm font-bold transition-colors ${showMapView ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:hover:bg-[#1A1A1A] dark:text-slate-300 dark:border-[#333]'}`}>
                                    {showMapView ? 'List View' : 'Map View'}
                                </button>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#1F1F1F] border border-slate-200 dark:border-[#333] rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                            {selectedRoute ? (
                                showMapView ? (
                                    <div className="flex-1 bg-slate-100 dark:bg-[#1A1A1A] flex flex-col relative w-full h-[500px] z-0">
                                        <MapComponent mapPositions={mapPositions} selectedRoute={selectedRoute} />
                                    </div>
                                ) : (
                                    <div className="p-8 flex-1 overflow-y-auto max-h-[600px]">
                                        <div className="space-y-0 relative">
                                            <div className="absolute left-[9px] top-2 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-700 border-l-2 border-dashed border-slate-200 dark:border-[#333] -z-10"></div>
                                            
                                            <div className="relative pl-10 pb-10">
                                                <div className="absolute left-[-11px] top-0 w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center ring-4 ring-white dark:ring-[#1F1F1F]"><span className="text-[10px] text-white font-bold">0</span></div>
                                                <div className="flex justify-between items-start">
                                                    <div><h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-tight">Main Distribution Center</h4><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Gudang JAPFA Cikupa</p>
                                                    <div className="mt-3 inline-flex items-center gap-2 px-2.5 py-1 bg-slate-100 dark:bg-[#1A1A1A] text-slate-600 dark:text-slate-300 text-[11px] font-bold rounded"><span className="material-symbols-outlined text-xs">inventory</span> TOTAL MUATAN: {selectedRoute.total_berat} KG</div></div>
                                                    <div className="text-right"><span className="text-sm font-bold text-slate-900 dark:text-white">06:00 AM</span><p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Berangkat</p></div>
                                                </div>
                                            </div>

                                            {selectedRoute.detail_rute.map((stop, idx) => (
                                                <div key={idx} className="relative pl-10 pb-10">
                                                    <div 
                                                        className="absolute left-[-11px] top-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 ring-4 ring-white dark:ring-[#1F1F1F] cursor-pointer hover:scale-110 transition-transform"
                                                        onClick={() => setExpandedStopIdx(expandedStopIdx === idx ? null : idx)}
                                                    >
                                                        <span className="text-[10px] text-white font-bold">{idx + 1}</span>
                                                    </div>
                                                    
                                                    <div className="flex justify-between items-start cursor-pointer group" onClick={() => setExpandedStopIdx(expandedStopIdx === idx ? null : idx)}>
                                                        <div>
                                                            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-primary transition-colors flex items-center gap-2">
                                                                {stop.nama_toko}
                                                                <span className={`material-symbols-outlined text-lg transition-transform ${expandedStopIdx === idx ? 'rotate-180' : ''}`}>expand_more</span>
                                                            </h4>
                                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-mono text-[11px]">📍 GPS: {stop.latitude}, {stop.longitude}</p>
                                                            <div className="mt-3 flex gap-3">
                                                                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                                                    <span className="material-symbols-outlined text-xs">package_2</span> {stop.berat_kg} KG Total Turun
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-sm font-bold text-primary">{formatTimeWindow(stop.jam_tiba, stop.berat_kg)}</span>
                                                            <p className="text-[10px] text-primary font-bold uppercase mt-1">Est. Time Window</p>
                                                        </div>
                                                    </div>

                                                    {expandedStopIdx === idx && stop.items && stop.items.length > 0 && (
                                                        <div className="mt-4 bg-slate-50 dark:bg-[#1A1A1A] rounded-xl border border-slate-200 dark:border-[#333] p-4 animate-in slide-in-from-top-2 fade-in duration-200">
                                                            <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2 uppercase">
                                                                <span className="material-symbols-outlined text-sm">receipt_long</span> Rincian Produk Dikirim:
                                                            </h5>
                                                            <ul className={`grid gap-2 ${isFocusMode ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                                                {stop.items.map((product, prodIdx) => (
                                                                    <li key={prodIdx} className="flex justify-between items-center text-sm border-b border-slate-200 dark:border-[#333] pb-2">
                                                                        <span className="text-slate-600 dark:text-slate-300 font-medium">{String(product.nama_barang)}</span>
                                                                        <span className="font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-[#111] px-2 py-1 rounded">{String(product.qty)}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ) : (
                                <div className="p-8 flex-1 flex items-center justify-center text-slate-500"><h4>Pilih Truk di sebelah kiri untuk melihat urutan</h4></div>
                            )}
                            
                            <div className="bg-slate-50 dark:bg-[#1A1A1A] p-6 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-[#333]">
                                <button type="button" onClick={() => window.print()} className="px-6 py-2.5 bg-white dark:bg-[#1F1F1F] border border-slate-300 dark:border-[#333] text-slate-700 dark:text-white font-bold rounded-lg hover:bg-slate-100 dark:hover:bg-[#2A2A2A] text-sm flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">picture_as_pdf</span> Cetak Surat Jalan (PDF)
                                </button>
                                <button type="button" onClick={() => alert(`Jadwal berhasil dikirim ke HP Supir: ${selectedRoute?.driver_name}!`)} className="px-8 py-2.5 bg-primary text-white font-bold rounded-lg hover:brightness-110 text-sm shadow-lg shadow-primary/25 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">done_all</span> Kirim ke HP Supir
                                </button>
                            </div>
                        </div>

                        {droppedNodes.length > 0 && (
                            <div className="mt-6 border-2 border-red-200 dark:border-red-900/50 bg-white dark:bg-[#1F1F1F] rounded-xl overflow-hidden shadow-sm animate-in slide-in-from-bottom-4">
                                <div className="bg-red-50 dark:bg-red-900/20 px-5 py-4 border-b border-red-200 dark:border-red-900/50 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-red-600 text-2xl">warning</span>
                                    <div>
                                        <h3 className="font-black text-red-700 dark:text-red-400 uppercase tracking-tight">Toko Gagal Routing (Di-drop AI)</h3>
                                        <p className="text-xs text-red-600/80 dark:text-red-400/80 font-medium mt-0.5">Ada {droppedNodes.length} toko yang ditinggal di gudang karena kapasitas armada penuh.</p>
                                    </div>
                                </div>
                                <div className="p-0 overflow-x-auto max-h-[300px]">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-50 dark:bg-[#111] sticky top-0 border-b border-slate-200 dark:border-[#333]">
                                            <tr className="text-slate-500 dark:text-slate-400">
                                                <th className="px-5 py-3 font-bold">Nama Toko</th>
                                                <th className="px-5 py-3 font-bold">Berat</th>
                                                <th className="px-5 py-3 font-bold">Alasan Drop</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-[#222]">
                                            {droppedNodes.map((node, i) => (
                                                <tr key={i} className="hover:bg-red-50/30 dark:hover:bg-red-900/10">
                                                    <td className="px-5 py-3 font-bold text-slate-800 dark:text-slate-200">{node.nama_toko}</td>
                                                    <td className="px-5 py-3 font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-[#1A1A1A] w-32">{node.berat_kg} KG</td>
                                                    <td className="px-5 py-3 text-red-600 dark:text-red-400 font-medium italic">{node.alasan}</td>
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
        </>
    );
}