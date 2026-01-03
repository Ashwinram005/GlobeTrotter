import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, DollarSign, PieChart as PieChartIcon, BarChart3, TrendingUp, AlertCircle, Wallet } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { supabase } from '../services/supabase'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'

interface Trip {
    id: string
    name: string
    budget_total: number
    start_date: string
    end_date: string
}

interface ItineraryItem {
    id: string
    activity_type: string
    cost: number
    date: string
}

const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe']

const TripBudget: React.FC = () => {
    const navigate = useNavigate()
    const { tripId } = useParams<{ tripId: string }>()
    const [trip, setTrip] = useState<Trip | null>(null)
    const [items, setItems] = useState<ItineraryItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (tripId) fetchData()
    }, [tripId])

    const fetchData = async () => {
        const { data: tripData } = await supabase.from('trips').select('*').eq('id', tripId).single()
        const { data: itemsData } = await supabase.from('itinerary_items').select('*').eq('trip_id', tripId)

        if (tripData) setTrip(tripData)
        if (itemsData) setItems(itemsData)
        setLoading(false)
    }

    if (loading || !trip) return <div className="min-h-screen bg-slate-50"><Navbar /><div className="pt-24 px-6">Loading budget...</div></div>

    // Calculations
    const totalSpent = items.reduce((sum, item) => sum + (item.cost || 0), 0)
    const budgetRemaining = (trip.budget_total || 0) - totalSpent
    const percentageUsed = trip.budget_total > 0 ? (totalSpent / trip.budget_total) * 100 : 0

    const startDate = new Date(trip.start_date)
    const endDate = new Date(trip.end_date)
    const dayCount = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1)
    const avgDailySpend = totalSpent / dayCount

    // Category data for Pie Chart
    const categoryMap: { [key: string]: number } = {}
    items.forEach(item => {
        const cat = item.activity_type || 'Other'
        categoryMap[cat] = (categoryMap[cat] || 0) + (item.cost || 0)
    })
    const pieData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }))

    // Daily spending for Bar Chart
    const dailyMap: { [key: string]: number } = {}
    items.forEach(item => {
        const d = new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        dailyMap[d] = (dailyMap[d] || 0) + (item.cost || 0)
    })
    const barData = Object.entries(dailyMap).sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()).map(([name, amount]) => ({ name, amount }))

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-6xl mx-auto px-6 pt-24 pb-12 space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(`/trip/${tripId}`)}
                        className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-display font-bold text-slate-900">Budget Analysis</h1>
                        <p className="text-slate-500">Financial breakdown for {trip.name}</p>
                    </div>
                </div>

                {/* Top Level Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 flex flex-col justify-between">
                        <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 mb-4">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Budget</p>
                            <p className="text-2xl font-bold text-slate-900">${trip.budget_total?.toLocaleString()}</p>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 flex flex-col justify-between">
                        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Spent</p>
                            <p className="text-2xl font-bold text-slate-900">${totalSpent.toLocaleString()}</p>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 flex flex-col justify-between">
                        <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-4">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Daily Average</p>
                            <p className="text-2xl font-bold text-slate-900">${avgDailySpend.toFixed(2)}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className={`p-6 rounded-3xl shadow-lg border flex flex-col justify-between ${budgetRemaining < 0 ? 'bg-rose-50 border-rose-100' : 'bg-white border-slate-100'}`}
                    >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${budgetRemaining < 0 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
                            {budgetRemaining < 0 ? <AlertCircle className="w-6 h-6" /> : <BarChart3 className="w-6 h-6" />}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Remaining</p>
                            <p className={`text-2xl font-bold ${budgetRemaining < 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                                ${budgetRemaining.toLocaleString()}
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Overbudget Alerts */}
                {barData.some(d => d.amount > (trip.budget_total / dayCount) * 1.2) && (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-rose-50 border border-rose-100 rounded-3xl p-6 flex items-start gap-4">
                        <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-rose-900">Budget Warning</h3>
                            <p className="text-rose-700 text-sm mt-1">
                                Some days are exceeding your target daily budget of <strong>${(trip.budget_total / dayCount).toFixed(0)}</strong>.
                                Consider adjusting your plans for those peak spending days.
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Progress Bar */}
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 space-y-4">
                    <div className="flex justify-between items-center text-sm font-bold">
                        <span className="text-slate-700">Budget Utilization</span>
                        <span className={percentageUsed > 100 ? 'text-rose-600' : 'text-primary-600'}>{percentageUsed.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, percentageUsed)}%` }}
                            className={`h-full transition-all ${percentageUsed > 100 ? 'bg-rose-500' : 'bg-primary-600'}`}
                        />
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Category Pie Chart */}
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
                        <div className="flex items-center gap-2 mb-8">
                            <PieChartIcon className="w-5 h-5 text-primary-600" />
                            <h2 className="text-xl font-bold text-slate-900">Spending by Category</h2>
                        </div>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Daily Spending Bar Chart */}
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
                        <div className="flex items-center gap-2 mb-8">
                            <BarChart3 className="w-5 h-5 text-emerald-600" />
                            <h2 className="text-xl font-bold text-slate-900">Daily Spending Trend</h2>
                        </div>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData}>
                                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        cursor={{ fill: '#f8fafc' }}
                                    />
                                    <Bar dataKey="amount" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default TripBudget
