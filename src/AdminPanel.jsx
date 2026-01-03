import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import {
    Search, Filter, ArrowUpRight, Users, MapPin, Activity, TrendingUp, LayoutGrid, Shield
} from 'lucide-react';

// --- ANIMATED GRID SYSTEM ---
const FrameworkGrid = () => (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden h-full opacity-30">
        <motion.div
            initial={{ height: 0 }} animate={{ height: "100%" }} transition={{ duration: 1.5, ease: "easeInOut" }}
            className="w-px bg-[#0061FE]/20 absolute left-[40px] hidden md:block"
        />
        <motion.div
            initial={{ height: 0 }} animate={{ height: "100%" }} transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
            className="w-px bg-[#0061FE]/20 absolute left-[40px] md:left-[260px]"
        />
        <motion.div
            initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.5, delay: 0.1, ease: "easeInOut" }}
            className="absolute top-[180px] left-0 h-px bg-[#0061FE]/10"
        />
    </div>
);

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState("analytics");

    return (
        <div className="min-h-screen bg-[#F7F5F2] text-[#1E1E1E] font-sans selection:bg-[#C2E812] selection:text-black overflow-x-hidden relative">
            <Navbar />
            <FrameworkGrid />

            {/* --- HERO SECTION --- */}
            <div className="pt-32 pb-8 px-6 relative z-10">
                <div className="w-full max-w-7xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-[#1E1E1E] rounded-2xl">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#1E1E1E]">
                                Admin Command
                            </h1>
                        </div>
                    </motion.div>

                    {/* Controls Bar */}
                    <div className="flex flex-col md:flex-row justify-between gap-6 mt-8 p-6 bg-white border-[3px] border-[#1E1E1E] rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search system database..."
                                className="w-full pl-12 pr-4 py-3 bg-[#F7F5F2] border-[2px] border-[#1E1E1E] rounded-xl font-bold outline-none focus:ring-4 focus:ring-[#C2E812]/50 transition-all"
                            />
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0">
                            {['Group By', 'Filter', 'Sort'].map((action) => (
                                <button key={action} className="px-6 py-3 border-[2px] border-[#1E1E1E] rounded-xl font-bold hover:bg-[#1E1E1E] hover:text-white transition-all whitespace-nowrap active:translate-y-1">
                                    {action}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 pb-24 relative z-10 space-y-8">
                {/* Tabs */}
                <div className="flex flex-wrap gap-2">
                    {['Analytics', 'Manage Users', 'Popular Cities', 'Popular Activities'].map((tab) => {
                        const tabKey = tab.toLowerCase().replace(' ', '-');
                        const isActive = activeTab === tabKey || (tab === 'Analytics' && activeTab === 'analytics');

                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tabKey)}
                                className={`px-6 py-3 rounded-xl font-black uppercase tracking-wider transition-all border-[2px] ${isActive
                                        ? 'bg-[#1E1E1E] text-white border-[#1E1E1E] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1'
                                        : 'bg-white text-gray-500 border-transparent hover:border-[#1E1E1E]'
                                    }`}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>

                {/* --- CONTENT AREA --- */}
                <div className="min-h-[60vh]">
                    {activeTab === 'analytics' && <AnalyticsDashboard />}
                    {activeTab === 'manage-users' && <UsersTable />}
                    {activeTab === 'popular-cities' && <PopularCities />}
                    {activeTab === 'popular-activities' && <PopularActivities />}
                </div>

                {/* Legend Box */}
                <div className="hidden xl:block fixed bottom-8 right-8 w-72 bg-[#1E1E1E] p-6 rounded-2xl shadow-2xl border-[3px] border-[#C2E812] text-white z-50">
                    <h3 className="font-black text-[#C2E812] mb-4 flex items-center gap-2">
                        <LayoutGrid className="w-5 h-5" /> SYSTEM STATUS
                    </h3>
                    <div className="space-y-4 text-xs font-mono text-gray-300">
                        <div className="flex justify-between border-b border-gray-700 pb-2">
                            <span>Server Uptime</span>
                            <span className="text-white">99.9%</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-700 pb-2">
                            <span>Active Sessions</span>
                            <span className="text-white">1,245</span>
                        </div>
                        <p className="opacity-60 leading-relaxed">
                            System operating within normal parameters. Real-time data sync enabled.
                        </p>
                    </div>
                </div>

            </main>
        </div>
    );
};

// --- SUB-COMPONENTS ---

const AnalyticsDashboard = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Regional Dist */}
        <div className="bg-white p-8 rounded-[2.5rem] border-[3px] border-[#1E1E1E] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-black text-2xl mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6" /> REGIONAL DATA
            </h3>
            <div className="space-y-6">
                {[
                    { label: "Asia", value: "35%", width: "35%", color: "bg-[#1E1E1E]" },
                    { label: "Europe", value: "30%", width: "30%", color: "bg-[#0061FE]" },
                    { label: "Americas", value: "20%", width: "20%", color: "bg-[#C2E812]" },
                    { label: "Other", value: "15%", width: "15%", color: "bg-gray-300" }
                ].map((item, i) => (
                    <div key={i}>
                        <div className="flex justify-between text-sm font-bold mb-2 uppercase tracking-wide">
                            <span>{item.label}</span>
                            <span>{item.value}</span>
                        </div>
                        <div className="h-4 bg-[#F7F5F2] rounded-full border border-gray-200 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }} animate={{ width: item.width }} transition={{ duration: 1, delay: i * 0.1 }}
                                className={`h-full ${item.color}`}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* User Demographics */}
        <div className="bg-[#1E1E1E] p-8 rounded-[2.5rem] border-[3px] border-[#1E1E1E] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] text-white flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-[#0061FE]/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="relative z-10 text-center">
                <h3 className="font-black text-2xl mb-8">USER BASE</h3>
                <div className="w-48 h-48 rounded-full border-[12px] border-[#333] border-t-[#C2E812] border-r-[#0061FE] relative flex items-center justify-center shadow-xl">
                    <div className="text-center">
                        <span className="block text-4xl font-black">12.5k</span>
                        <span className="text-sm text-gray-400 font-bold uppercase">Total Users</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Activity Growth */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border-[3px] border-[#1E1E1E] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-black text-2xl mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" /> GROWTH METRICS
            </h3>
            <div className="h-48 flex items-end gap-4">
                {[40, 65, 45, 90, 60, 85, 95].map((h, i) => (
                    <motion.div
                        key={i}
                        initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="flex-1 bg-[#1E1E1E] hover:bg-[#0061FE] transition-colors rounded-t-xl relative group min-w-[20px]"
                    >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {h}%
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </motion.div>
);

const UsersTable = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[2rem] border-[3px] border-[#1E1E1E] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-[#1E1E1E] text-white">
                    <tr>
                        {['User', 'Role', 'Status', 'Last Active', 'Action'].map((h, i) => (
                            <th key={i} className="p-6 font-black uppercase text-xs tracking-wider">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y-[2px] divide-[#F7F5F2]">
                    {[
                        { name: "John Doe", email: "john@example.com", role: "Admin", status: "Active", time: "2 mins ago" },
                        { name: "Sarah Smith", email: "sarah@travel.com", role: "Editor", status: "Active", time: "1 hour ago" },
                        { name: "Michael Brown", email: "m.brown@mail.com", role: "User", status: "Inactive", time: "3 days ago" },
                        { name: "Emily White", email: "emily.w@design.co", role: "User", status: "Active", time: "5 hours ago" },
                    ].map((user, i) => (
                        <tr key={i} className="hover:bg-blue-50 transition-colors group">
                            <td className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#1E1E1E] text-white flex items-center justify-center font-bold">{user.name[0]}</div>
                                    <div>
                                        <p className="font-bold text-[#1E1E1E]">{user.name}</p>
                                        <p className="text-gray-500 text-xs font-mono">{user.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="p-6">
                                <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase border border-black ${user.role === 'Admin' ? 'bg-[#C2E812]' : 'bg-white'}`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="p-6">
                                <span className={`flex items-center gap-2 text-sm font-bold ${user.status === 'Active' ? 'text-green-600' : 'text-gray-400'}`}>
                                    <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                                    {user.status}
                                </span>
                            </td>
                            <td className="p-6 text-gray-500 font-mono text-sm">{user.time}</td>
                            <td className="p-6">
                                <button className="font-bold text-[#1E1E1E] hover:text-[#0061FE] hover:underline underline-offset-4 decoration-2">Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </motion.div>
);

const PopularCities = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
            { city: "Paris, France", visitors: "2.4M", trend: "+12%", color: "bg-[#0061FE]" },
            { city: "Kyoto, Japan", visitors: "1.8M", trend: "+8%", color: "bg-[#1E1E1E]" },
            { city: "New York, USA", visitors: "3.1M", trend: "+5%", color: "bg-[#C2E812] text-black" },
        ].map((place, i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`group relative p-8 rounded-[2.5rem] ${place.color} ${place.color.includes('text-black') ? 'text-[#1E1E1E]' : 'text-white'} border-[3px] border-[#1E1E1E] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden cursor-pointer hover:-translate-y-2 transition-transform`}
            >
                <h3 className="text-3xl font-black mb-2 relative z-10">{place.city}</h3>
                <div className="flex items-end gap-2 mb-8 relative z-10">
                    <span className="text-5xl font-black tracking-tighter">{place.visitors}</span>
                    <span className="text-sm font-bold opacity-80 mb-2">/ year</span>
                </div>
                <div className="inline-block bg-white text-black px-3 py-1 rounded-lg font-mono font-bold text-sm border-2 border-black">
                    Trending {place.trend} ↗
                </div>
            </motion.div>
        ))}
    </div>
);

const PopularActivities = () => (
    <div className="grid grid-cols-1 gap-6">
        {[
            { name: "Scuba Diving", category: "Adventure", bookings: 12450, growth: 85, color: "bg-[#0061FE]" },
            { name: "City Walking Tours", category: "Culture", bookings: 8300, growth: 60, color: "bg-[#C2E812]" },
            { name: "Safari Expeditions", category: "Nature", bookings: 5600, growth: 45, color: "bg-[#1E1E1E]" },
        ].map((activity, i) => (
            <motion.div
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-[2rem] border-[3px] border-[#1E1E1E] shadow-sm flex items-center pr-12 group hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
                <div className={`w-16 h-16 rounded-2xl ${activity.color} flex items-center justify-center text-white text-2xl font-bold mr-6 border-2 border-[#1E1E1E]`}>
                    {activity.name[0]}
                </div>
                <div className="flex-1">
                    <div className="flex justify-between mb-2">
                        <h4 className="font-black text-xl text-[#1E1E1E]">{activity.name}</h4>
                        <span className="font-mono font-bold text-gray-500">{activity.bookings.toLocaleString()} bookings</span>
                    </div>
                    <div className="w-full bg-[#F7F5F2] h-4 rounded-full border border-gray-300 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }} animate={{ width: `${activity.growth}%` }} transition={{ duration: 1 }}
                            className={`h-full ${activity.color}`}
                        />
                    </div>
                </div>
            </motion.div>
        ))}
    </div>
);

export default AdminPanel;
