import Header from "../../components/Header";

export default function Dashboard() {
    return (
        <>
            <Header title="Daily Logistics KPI Dashboard" />

            {/* Content Body */}
            <div className="p-4 md:p-8 flex flex-col gap-6 md:gap-8">
                {/* KPI Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">OTIF Rate</span>
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <span className="material-symbols-outlined">timer</span>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">94.2%</h3>
                            <span className="text-red-500 dark:text-red-400 text-sm font-bold flex items-center">
                                <span className="material-symbols-outlined text-xs">arrow_downward</span> 0.8%
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">vs. last week target (95%)</p>
                    </div>

                    <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Product Rejection</span>
                            <div className="p-2 bg-red-50 dark:bg-red-500/10 rounded-lg text-red-500 dark:text-red-400">
                                <span className="material-symbols-outlined">error</span>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">1.2%</h3>
                            <span className="text-red-500 dark:text-red-400 text-sm font-bold flex items-center">
                                <span className="material-symbols-outlined text-xs">arrow_downward</span> 0.4%
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Reduction in returns</p>
                    </div>

                    <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Shipments</span>
                            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-500 dark:text-blue-400">
                                <span className="material-symbols-outlined">package</span>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">214</h3>
                            <span className="text-slate-400 text-sm font-medium uppercase">orders</span>
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">+12 since last update</p>
                    </div>

                    <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Avg. Loading Time</span>
                            <div className="p-2 bg-orange-50 dark:bg-orange-500/10 rounded-lg text-orange-500 dark:text-orange-400">
                                <span className="material-symbols-outlined">forklift</span>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">35 <span className="text-xl">mins</span></h3>
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Optimizing loading bay 4</p>
                    </div>
                </div>

                {/* Middle Section Charts */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Large Bar Chart */}
                    <div className="w-full lg:w-[70%] bg-white dark:bg-[#1a1a1a] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Hourly Delivery Volume</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Peak: 240 orders/hr at 18:00</p>
                            </div>
                            <select className="text-xs font-bold bg-slate-50 dark:bg-[#222] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg focus:ring-primary p-2 outline-none">
                                <option>Last 24 Hours</option>
                                <option>Last 7 Days</option>
                            </select>
                        </div>
                        <div className="h-[250px] flex items-end gap-4 px-4">
                            <div className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="w-full bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/20 rounded-t-md transition-all relative" style={{ height: "40%" }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">96</div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">08:00</span>
                            </div>
                            <div className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="w-full bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/20 rounded-t-md transition-all relative" style={{ height: "65%" }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">156</div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">10:00</span>
                            </div>
                            <div className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="w-full bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/20 rounded-t-md transition-all relative" style={{ height: "50%" }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">120</div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">12:00</span>
                            </div>
                            <div className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="w-full bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/20 rounded-t-md transition-all relative" style={{ height: "35%" }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">84</div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">14:00</span>
                            </div>
                            <div className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="w-full bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/20 rounded-t-md transition-all relative" style={{ height: "45%" }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">108</div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">16:00</span>
                            </div>
                            <div className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="w-full bg-primary rounded-t-md transition-all relative" style={{ height: "100%" }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">240</div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-900">18:00</span>
                            </div>
                            <div className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="w-full bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/20 rounded-t-md transition-all relative" style={{ height: "30%" }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">72</div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">20:00</span>
                            </div>
                        </div>
                    </div>

                    {/* Circular Gauge Chart */}
                    <div className="w-full lg:w-[30%] bg-white dark:bg-[#1a1a1a] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col transition-colors">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Fleet Utilization</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Daily average across 450 vehicles</p>
                        <div className="relative flex-1 flex items-center justify-center">
                            <div className="size-48 rounded-full border-[12px] border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center relative">
                                <div className="absolute inset-0 rounded-full border-[12px] border-primary border-r-transparent border-b-transparent rotate-[45deg]"></div>
                                <span className="text-4xl font-black text-slate-900 dark:text-white">100%</span>
                                <span className="text-xs font-bold text-primary uppercase tracking-widest mt-1">Full Capacity</span>
                            </div>
                        </div>
                        <div className="mt-6 space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500 dark:text-slate-400">Active Trucks</span>
                                <span className="font-bold text-slate-900 dark:text-white">7 Base + ON CALL</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: "100%" }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Rejection Reasons */}
                    <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Top Rejection Reasons</h3>
                            <span className="text-xs text-slate-400 font-medium">Month to Date</span>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Damaged Goods</span>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">60%</span>
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-500" style={{ width: "60%" }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Wrong Item</span>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">25%</span>
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-400" style={{ width: "25%" }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Customer Not Home</span>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">15%</span>
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-slate-400 dark:bg-slate-600" style={{ width: "15%" }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Real-time Alerts Feed */}
                    <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[320px] transition-colors">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-[#222]/50 rounded-t-xl">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Real-time Alerts</h3>
                            <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-black rounded uppercase">Live</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-2">
                            <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-500/10 border-l-4 border-primary flex gap-4">
                                <span className="material-symbols-outlined text-primary">warning</span>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">B 9517 JXS Delayed</p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">Heavy traffic detected in Bogor/Depok zone. ETA +45m.</p>
                                    <span className="text-[10px] text-slate-400 mt-1 block">2 mins ago</span>
                                </div>
                            </div>
                            <div className="p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-4 border-l-4 border-transparent">
                                <span className="material-symbols-outlined text-green-500">check_circle</span>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">OTIF Target Reached</p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">Serpong zone has reached the daily target of 94% OTIF.</p>
                                    <span className="text-[10px] text-slate-400 mt-1 block">15 mins ago</span>
                                </div>
                            </div>
                            <div className="p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-4 border-l-4 border-transparent">
                                <span className="material-symbols-outlined text-blue-500">info</span>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">New Driver Assigned</p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">Eko Prasetyo has been assigned to ON CALL 1 truck.</p>
                                    <span className="text-[10px] text-slate-400 mt-1 block">45 mins ago</span>
                                </div>
                            </div>
                            <div className="p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-4 border-l-4 border-transparent">
                                <span className="material-symbols-outlined text-slate-400">speed</span>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Route Re-optimized</p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">Bekasi/Cikarang route optimized saving 12 KM total distance.</p>
                                    <span className="text-[10px] text-slate-400 mt-1 block">1 hour ago</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
