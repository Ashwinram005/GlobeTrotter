import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Plus, Calendar, Clock, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Button } from '../components/common/UI'
import { supabase } from '../services/supabase'
import { useAuth } from '../context/AuthContext'

const Dashboard: React.FC = () => {
    const navigate = useNavigate()
    useAuth()
    const [trips, setTrips] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchTrips()
    }, [])

    const fetchTrips = async () => {
        const { data, error } = await supabase
            .from('trips')
            .select('*')
            .order('created_at', { ascending: false })

        if (!error && data) {
            setTrips(data)
        }
        setLoading(false)
    }

    const recommendations = [
        { city: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=400', price: '$850' },
        { city: 'Santorini', country: 'Greece', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=400', price: '$1200' },
        { city: 'Kyoto', country: 'Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=400', price: '$950' },
        { city: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=400', price: '$1100' },
    ]

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-24 pb-12 space-y-12">
                {/* Banner Section (Screen 3) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative h-[400px] rounded-[32px] overflow-hidden shadow-2xl group"
                >
                    <img
                        src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200"
                        alt="Adventure Hero"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-12 left-12 right-12 space-y-4">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-5xl font-display font-bold text-white max-w-2xl leading-tight"
                        >
                            Where do you want to <br />
                            <span className="text-primary-400">escape</span> to next?
                        </motion.h2>
                        <p className="text-primary-50/80 text-xl font-light">Plan your next adventure with GlobeTrotter's professional tools.</p>
                    </div>
                </motion.div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search destinations, trips, or activities..."
                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all shadow-sm font-medium"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="px-6 py-4 rounded-2xl flex items-center gap-2">
                            <Filter className="w-5 h-5" /> Filter
                        </Button>
                        <select className="px-6 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 font-medium outline-none focus:ring-4 focus:ring-primary-500/10 shadow-sm cursor-pointer appearance-none pr-10 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%221.66667%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px_20px] bg-[right_1rem_center] bg-no-repeat">
                            <option>Sort by: Newest</option>
                            <option>Sort by: Budget</option>
                            <option>Sort by: Date</option>
                        </select>
                    </div>
                </div>

                {/* Top Regional Selections */}
                <section className="space-y-6">
                    <div className="flex justify-between items-end px-1">
                        <h3 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Top Regional Selections</h3>
                        <button className="text-primary-600 font-bold text-sm hover:underline flex items-center gap-1">View All <ChevronRight className="w-4 h-4" /></button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {recommendations.map((item, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -8 }}
                                className="group relative h-[300px] rounded-3xl overflow-hidden shadow-lg cursor-pointer"
                            >
                                <img src={item.image} alt={item.city} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <p className="text-white font-bold text-xl">{item.city}</p>
                                    <p className="text-white/70 text-sm mb-2">{item.country}</p>
                                    <p className="text-primary-400 font-bold">from {item.price}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Previous Trips Section */}
                <section className="space-y-6">
                    <h3 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Your Previous Trips</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            [1, 2, 3].map((i) => (
                                <div key={i} className="h-[280px] bg-white rounded-[32px] animate-pulse" />
                            ))
                        ) : trips.length > 0 ? (
                            trips.map((trip) => (
                                <motion.div
                                    key={trip.id}
                                    whileHover={{ y: -5 }}
                                    className="bg-white rounded-[32px] p-2 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col group cursor-pointer"
                                    onClick={() => navigate(`/trip/${trip.id}`)}
                                >
                                    <div className="h-48 rounded-[24px] overflow-hidden relative">
                                        <img
                                            src={trip.cover_image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80"}
                                            alt={trip.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-primary-600 shadow-sm">
                                            {trip.budget_total ? `$${trip.budget_total}` : 'No Budget'}
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <h4 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{trip.name}</h4>
                                        <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-medium">
                                            <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary-500" /> {new Date(trip.start_date).toLocaleDateString()}</div>
                                            <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary-500" /> Planned</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center space-y-6 bg-white rounded-[32px] border-2 border-dashed border-slate-200 overflow-hidden relative">
                                <div className="absolute inset-0 bg-primary-50/30 -z-1" />
                                <div className="w-20 h-20 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center mx-auto text-primary-600">
                                    <Plus className="w-10 h-10" />
                                </div>
                                <div className="max-w-xs mx-auto space-y-2">
                                    <h4 className="text-xl font-bold text-slate-900">Start your first adventure</h4>
                                    <p className="text-slate-500">Create a personalized itinerary and discover the world with GlobeTrotter.</p>
                                </div>
                                <Button onClick={() => navigate('/create-trip')} className="px-8 py-4 rounded-2xl shadow-primary-500/30">
                                    Plan a new trip
                                </Button>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Floating Action Button */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/create-trip')}
                className="fixed bottom-10 right-10 w-16 h-16 bg-primary-600 text-white rounded-2xl shadow-2xl shadow-primary-600/50 flex items-center justify-center z-50 group hover:bg-primary-700 transition-all border border-primary-500"
            >
                <Plus className="w-8 h-8" />
                <div className="absolute right-full mr-4 px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-all translate-x-4 group-hover:translate-x-0 shadow-xl">
                    Plan a new trip
                </div>
            </motion.button>
        </div>
    )
}

export default Dashboard
