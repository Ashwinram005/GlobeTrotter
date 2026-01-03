import React, { useEffect, useState } from 'react'
import { Navbar } from '../components/layout/Navbar'
import { supabase } from '../services/supabase'
import { Users, Map, TrendingUp, Activity, Search, ShieldAlert } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { motion } from 'framer-motion'
import { Input } from '../components/common/UI'
import { useAuth } from '../context/AuthContext'

// --- Mock Data for Analytics (aggregated data usually requires backend functions) ---
const ACTIVITY_DATA = [
    { name: 'Sightseeing', value: 45, color: '#6366f1' },
    { name: 'Food & Dining', value: 30, color: '#10b981' },
    { name: 'Adventure', value: 15, color: '#f59e0b' },
    { name: 'Shopping', value: 10, color: '#ec4899' },
]

const TRENDS_DATA = [
    { name: 'Jan', users: 4, trips: 2 },
    { name: 'Feb', users: 10, trips: 8 },
    { name: 'Mar', users: 18, trips: 15 },
    { name: 'Apr', users: 25, trips: 28 },
    { name: 'May', users: 40, trips: 45 },
    { name: 'Jun', users: 55, trips: 60 },
]

const POPULAR_CITIES = [
    { city: 'Paris', visitors: 120 },
    { city: 'Tokyo', visitors: 98 },
    { city: 'New York', visitors: 86 },
    { city: 'London', visitors: 74 },
    { city: 'Dubai', visitors: 65 },
]

const AdminDashboard: React.FC = () => {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState<'users' | 'analytics'>('analytics')
    const [profiles, setProfiles] = useState<any[]>([])
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    // --- Access Control Check ---
    // For Hackathon: We'll allow access, but show a badge. 
    // In production, checking a specific email or DB role is best.
    const isAdmin = true // user?.email === 'admin@globetrotter.com'

    useEffect(() => {
        fetchAdminData()
    }, [])

    const fetchAdminData = async () => {
        // 1. Fetch Users
        const { data: userData } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50)

        if (userData) setProfiles(userData)

        // 2. Fetch Aggregated Stats (Real Data)
        const { data: rpcData, error } = await supabase.rpc('get_admin_stats')

        if (rpcData) {
            console.log('✅ Real Admin Stats:', rpcData)
            setStats(rpcData)
        } else {
            console.warn('⚠️ Could not fetch real stats (RPC missing?), using mocks.', error)
        }

        setLoading(false)
    }

    const filteredUsers = profiles.filter(p =>
        p.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.city?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Use Real Data if available, otherwise MOCK
    const displayCities = stats?.popular_cities?.length > 0 ? stats.popular_cities : POPULAR_CITIES
    const displayActivities = stats?.activity_types?.length > 0 ? stats.activity_types : ACTIVITY_DATA
    const totalUsers = stats?.total_users || profiles.length || 0
    const totalTrips = stats?.total_trips || 142
    const totalBudget = stats?.total_budget || 2450

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-24 pb-12 space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-display font-bold text-slate-900">Admin Dashboard</h1>
                            <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full border border-red-200 flex items-center gap-1">
                                <ShieldAlert className="w-3 h-3" /> Admin Mode
                            </span>
                        </div>
                        <p className="text-slate-500">Platform overview and user management</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
                        <button
                            onClick={() => setActiveTab('analytics')}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <TrendingUp className="w-4 h-4" /> Analytics
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'users' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <Users className="w-4 h-4" /> Manage Users
                        </button>
                    </div>
                </div>

                {activeTab === 'analytics' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">

                        {/* KPI Cards */}
                        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-lg shadow-slate-200/50">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider">Total Users</h3>
                                <div className="p-2 bg-primary-100 text-primary-600 rounded-lg"><Users className="w-5 h-5" /></div>
                            </div>
                            <p className="text-4xl font-display font-bold text-slate-900">{totalUsers}</p>
                            <p className="text-emerald-500 text-sm font-bold mt-2 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> All time
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-lg shadow-slate-200/50">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider">Total Trips</h3>
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Map className="w-5 h-5" /></div>
                            </div>
                            <p className="text-4xl font-display font-bold text-slate-900">{totalTrips}</p>
                            <p className="text-emerald-500 text-sm font-bold mt-2 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> Global Platform
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-lg shadow-slate-200/50">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider">Total Budget</h3>
                                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Activity className="w-5 h-5" /></div>
                            </div>
                            <p className="text-4xl font-display font-bold text-slate-900">${totalBudget.toLocaleString()}</p>
                            <p className="text-slate-400 text-sm font-medium mt-2">
                                Planned Spending
                            </p>
                        </div>

                        {/* Charts Row 1 */}
                        <div className="md:col-span-2 bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h3 className="text-xl font-bold text-slate-900 mb-6">User & Trip Growth</h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={TRENDS_DATA}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                        />
                                        <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={4} dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} />
                                        <Line type="monotone" dataKey="trips" stroke="#10b981" strokeWidth={4} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h3 className="text-xl font-bold text-slate-900 mb-6">Activity Preferences</h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={ACTIVITY_DATA}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {ACTIVITY_DATA.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: '12px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="mt-4 flex flex-wrap gap-3 justify-center">
                                    {ACTIVITY_DATA.map((item) => (
                                        <div key={item.name} className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                            {item.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Popular Cities */}
                        <div className="md:col-span-3 bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h3 className="text-xl font-bold text-slate-900 mb-6">Top Trending Destinations</h3>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={POPULAR_CITIES}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="city" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} hide />
                                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                        <Bar dataKey="visitors" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={60} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                    </div>
                ) : (
                    // USER MANAGEMENT TAB
                    <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-fade-in-up">
                        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900">Registered Users</h3>
                            <div className="relative w-full sm:w-72">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm font-medium"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
                                        <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Location</th>
                                        <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Joined</th>
                                        <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((profile) => (
                                            <tr key={profile.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-8 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold overflow-hidden">
                                                            {profile.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : <UserIcon />}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900">{profile.first_name || 'Unknown'} {profile.last_name || ''}</p>
                                                            <p className="text-xs text-slate-500">{profile.id.slice(0, 8)}...</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-4">
                                                    <span className="text-slate-600 font-medium flex items-center gap-2">
                                                        {profile.city ? <><MapPinIcon /> {profile.city}</> : '-'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-4">
                                                    <span className="text-slate-500 text-sm">
                                                        {new Date(profile.updated_at || Date.now()).toLocaleDateString()}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-4 text-right">
                                                    <button className="text-primary-600 hover:text-primary-700 font-bold text-xs bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors">
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-12 text-center text-slate-400">
                                                No users found matching your search.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </main>
        </div>
    )
}

const UserIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
)

const MapPinIcon = () => (
    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
)

export default AdminDashboard
