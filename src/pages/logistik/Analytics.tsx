

export default function Analytics() {
    return (
        <>
            <header className="sticky top-0 z-10 bg-white dark:bg-[#111111] border-b border-slate-200 dark:border-[#333] px-4 md:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                    <h2 className="text-xl font-bold">Monthly Analytics</h2>
                    <div className="flex items-center bg-slate-100 dark:bg-[#1A1A1A] rounded-lg px-3 py-1.5 gap-2 border border-slate-200 dark:border-[#333]">
                        <span className="material-symbols-outlined text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">calendar_today</span>
                        <span className="text-sm font-medium">October 1 - October 31, 2023</span>
                        <span className="material-symbols-outlined text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">expand_more</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm whitespace-nowrap">
                        <span className="material-symbols-outlined text-sm">download</span>
                        Export PDF/Excel
                    </button>
                    <div className="hidden sm:block w-px h-6 bg-slate-200 mx-2"></div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="flex flex-col items-end hidden sm:flex">
                            <span className="text-sm font-semibold">Admin Panel</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">Super Admin</span>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-slate-200 border-2 border-primary/20 overflow-hidden shrink-0">
                            <img className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOVwE6D5skjcA0kdB1Vkbt8PHjFNDhe83XgKDgfzJV23AUHoF1k7RqBV0lasCPs0tW8-U61sPBkk3XNEVlo4Pr9pRr-CmjRUB6jrOeV5GEW58Sj0MQkbIbGXnd8KHZrbxu_TQ_dCcRsBScHB6bVdu6QxJmV7N5zyT798CRXW5PlI16sOxkl5FInv80r4g7WBNepeHG18KzJ6ybv6wjTaKatLnLy_CgbhWKjrzGpOh2D1wcpWtUEJD3P0nbYAlwaIy9kdCn4tiPRjw" />
                        </div>
                    </div>
                </div>
            </header>

            <div className="p-4 md:p-8 space-y-6">
                {/* KPI Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-[#111111] p-6 rounded-xl border border-slate-200 dark:border-[#333] shadow-sm">
                        <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm font-medium">Total Logistics Cost</p>
                        <div className="flex items-end justify-between mt-2">
                            <h3 className="text-2xl font-bold">Rp 45.2M</h3>
                            <span className="text-emerald-500 text-sm font-medium flex items-center">
                                <span className="material-symbols-outlined text-sm">arrow_downward</span>
                                5%
                            </span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#111111] p-6 rounded-xl border border-slate-200 dark:border-[#333] shadow-sm">
                        <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm font-medium">Avg. Delivery Time</p>
                        <div className="flex items-end justify-between mt-2">
                            <h3 className="text-2xl font-bold">4.2 hrs</h3>
                            <span className="text-slate-400 dark:text-slate-500 text-sm font-medium">vs 4.5 last mo.</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#111111] p-6 rounded-xl border border-slate-200 dark:border-[#333] shadow-sm">
                        <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm font-medium">Fuel Efficiency</p>
                        <div className="flex items-end justify-between mt-2">
                            <h3 className="text-2xl font-bold">8.5 km/L</h3>
                            <span className="text-rose-500 text-sm font-medium flex items-center">
                                <span className="material-symbols-outlined text-sm">arrow_downward</span>
                                1%
                            </span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#111111] p-6 rounded-xl border border-slate-200 dark:border-[#333] shadow-sm">
                        <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm font-medium">Successful Deliveries (OTIF)</p>
                        <div className="flex items-end justify-between mt-2">
                            <h3 className="text-2xl font-bold">94.2%</h3>
                            <span className="text-emerald-500 text-sm font-medium flex items-center">
                                <span className="material-symbols-outlined text-sm">arrow_upward</span>
                                0.5%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Middle Section: Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                    {/* Line Chart Area */}
                    <div className="lg:col-span-6 bg-white dark:bg-[#111111] p-6 rounded-xl border border-slate-200 dark:border-[#333] shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="font-bold">Cost vs. Distance Trends</h4>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">Cost (IDR)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-slate-400"></div>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">Distance (km)</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-64 relative flex items-end gap-1">
                            {/* Visual placeholder for chart */}
                            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                <path d="M0 80 Q 10 70, 20 75 T 40 50 T 60 60 T 80 30 T 100 40" fill="none" stroke="#ff7b00" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                                <path d="M0 80 Q 10 70, 20 75 T 40 50 T 60 60 T 80 30 T 100 40 V 100 H 0 Z" fill="url(#line-grad)" opacity="0.1"></path>
                                <path d="M0 90 Q 15 85, 30 88 T 50 70 T 70 80 T 100 60" fill="none" stroke="#94a3b8" strokeDasharray="4" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                                <defs>
                                    <linearGradient id="line-grad" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#ff7b00"></stop>
                                        <stop offset="100%" stopColor="#ff7b00" stopOpacity="0"></stop>
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 pt-2 border-t border-slate-100">
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Week 1</span>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Week 2</span>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Week 3</span>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Week 4</span>
                            </div>
                        </div>
                    </div>

                    {/* Donut Chart Area */}
                    <div className="lg:col-span-4 bg-white dark:bg-[#111111] p-6 rounded-xl border border-slate-200 dark:border-[#333] shadow-sm flex flex-col">
                        <h4 className="font-bold mb-6">Delivery Status Distribution</h4>
                        <div className="flex-1 flex flex-col items-center justify-center relative">
                            {/* Simple SVG Donut */}
                            <svg className="h-48 w-48" viewBox="0 0 36 36">
                                <circle className="stroke-slate-100" cx="18" cy="18" fill="none" r="16" strokeWidth="3"></circle>
                                <circle className="stroke-primary" cx="18" cy="18" fill="none" r="16" strokeDasharray="80 100" strokeLinecap="round" strokeWidth="3" transform="rotate(-90 18 18)"></circle>
                                <circle className="stroke-amber-400" cx="18" cy="18" fill="none" r="16" strokeDasharray="15 100" strokeDashoffset="-80" strokeLinecap="round" strokeWidth="3" transform="rotate(-90 18 18)"></circle>
                                <circle className="stroke-rose-500" cx="18" cy="18" fill="none" r="16" strokeDasharray="5 100" strokeDashoffset="-95" strokeLinecap="round" strokeWidth="3" transform="rotate(-90 18 18)"></circle>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold">94.2%</span>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Success Rate</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-6">
                            <div className="text-center">
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Success</p>
                                <p className="text-sm font-bold text-primary">80%</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Delayed</p>
                                <p className="text-sm font-bold text-amber-400">14.2%</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Failed</p>
                                <p className="text-sm font-bold text-rose-500">5.8%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Table */}
                <div className="bg-white dark:bg-[#111111] rounded-xl border border-slate-200 dark:border-[#333] shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-[#333] flex items-center justify-between">
                        <h4 className="font-bold">Top Performing Drivers</h4>
                        <button className="text-sm text-primary font-medium hover:underline">View All Drivers</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-[#0a0a0a]">
                                    <th className="px-6 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-wider">Driver Name</th>
                                    <th className="px-6 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Trips</th>
                                    <th className="px-6 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-wider">On-time Rate (%)</th>
                                    <th className="px-6 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right">Fuel Rating</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-[#333]">
                                <tr className="hover:bg-slate-50 dark:bg-[#0a0a0a] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs">BS</div>
                                            <span className="text-sm font-medium">Budi Santoso</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">142</td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 bg-slate-100 dark:bg-[#1A1A1A] rounded-full overflow-hidden w-24">
                                                <div className="bg-emerald-500 h-full w-[98%]"></div>
                                            </div>
                                            <span className="font-bold">98%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right font-bold text-primary">A+</td>
                                </tr>
                                <tr className="hover:bg-slate-50 dark:bg-[#0a0a0a] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs">JW</div>
                                            <span className="text-sm font-medium">Joko Widodo</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">128</td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 bg-slate-100 dark:bg-[#1A1A1A] rounded-full overflow-hidden w-24">
                                                <div className="bg-emerald-500 h-full w-[96%]"></div>
                                            </div>
                                            <span className="font-bold">96%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right font-bold text-primary">A</td>
                                </tr>
                                <tr className="hover:bg-slate-50 dark:bg-[#0a0a0a] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs">RH</div>
                                            <span className="text-sm font-medium">Rahmat Hidayat</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">115</td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 bg-slate-100 dark:bg-[#1A1A1A] rounded-full overflow-hidden w-24">
                                                <div className="bg-amber-500 h-full w-[92%]"></div>
                                            </div>
                                            <span className="font-bold">92%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right font-bold text-primary">A-</td>
                                </tr>
                                <tr className="hover:bg-slate-50 dark:bg-[#0a0a0a] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs">EP</div>
                                            <span className="text-sm font-medium">Eko Prasetyo</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">109</td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 bg-slate-100 dark:bg-[#1A1A1A] rounded-full overflow-hidden w-24">
                                                <div className="bg-emerald-500 h-full w-[95%]"></div>
                                            </div>
                                            <span className="font-bold">95%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right font-bold text-primary">A</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
