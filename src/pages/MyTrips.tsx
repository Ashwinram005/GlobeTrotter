import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Calendar, MapPin, Edit, Trash2, Eye, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Button } from '../components/common/UI'
import { supabase } from '../services/supabase'
import { useAuth } from '../context/AuthContext'

interface Trip {
    id: string
    name: string
    description: string
    start_date: string
    end_date: string
    budget_total: number
    cover_image: string
    created_at: string
}

const MyTrips: React.FC = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [trips, setTrips] = useState<Trip[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

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

    const deleteTrip = async (id: string) => {
        if (!confirm('Are you sure you want to delete this trip?')) return

        const { error } = await supabase
            .from('trips')
            .delete()
            .eq('id', id)

        if (!error) {
            setTrips(trips.filter(t => t.id !== id))
        }
    }

    const categorizeTrips = () => {
        const today = new Date()
        const ongoing: Trip[] = []
        const upcoming: Trip[] = []
        const completed: Trip[] = []

        trips.filter(trip => trip.name.toLowerCase().includes(searchQuery.toLowerCase())).forEach(trip => {
            const start = new Date(trip.start_date)
            const end = new Date(trip.end_date)

            if (today >= start && today <= end) {
                ongoing.push(trip)
            } else if (today < start) {
                upcoming.push(trip)
            } else {
                completed.push(trip)
            }
        })

        return { ongoing, upcoming, completed }
    }

    const { ongoing, upcoming, completed } = categorizeTrips()

    const TripCard: React.FC<{ trip: Trip }> = ({ trip }) => (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 space-y-4"
        >
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{trip.name}</h3>
                    <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-primary-500" />
                            {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-primary-500" />
                            Multi-city
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-lg font-bold text-primary-600">${trip.budget_total || 0}</p>
                    <p className="text-xs text-slate-500">budget</p>
                </div>
            </div>

            {trip.description && (
                <p className="text-sm text-slate-600 line-clamp-2">{trip.description}</p>
            )}

            <div className="flex gap-2 pt-2">
                <Button
                    variant="outline"
                    className="flex-1 rounded-2xl py-2.5 text-sm"
                    onClick={() => navigate(`/trip/${trip.id}`)}
                >
                    <Eye className="w-4 h-4 mr-2" /> View
                </Button>
                <Button
                    variant="outline"
                    className="flex-1 rounded-2xl py-2.5 text-sm"
                    onClick={() => navigate(`/trip/${trip.id}/edit`)}
                >
                    <Edit className="w-4 h-4 mr-2" /> Edit
                </Button>
                <button
                    onClick={() => deleteTrip(trip.id)}
                    className="px-4 py-2.5 rounded-2xl text-red-600 hover:bg-red-50 transition-colors border border-slate-200"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    )

    const TripSection: React.FC<{ title: string; trips: Trip[]; count: number }> = ({ title, trips, count }) => (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-900">{title}</h2>
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-bold">{count}</span>
            </div>

            {trips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trips.map(trip => <TripCard key={trip.id} trip={trip} />)}
                </div>
            ) : (
                <div className="bg-slate-50 rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
                    <p className="text-slate-500">No {title.toLowerCase()} trips</p>
                </div>
            )}
        </div>
    )

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-24 pb-12 space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-slate-900">My Trips</h1>
                        <p className="text-slate-500 mt-1">Manage all your travel plans in one place</p>
                    </div>
                    <Button onClick={() => navigate('/create-trip')} className="rounded-2xl px-6 py-3">
                        <Plus className="w-5 h-5 mr-2" /> New Trip
                    </Button>
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search trips..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all shadow-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="px-6 py-4 rounded-2xl flex items-center gap-2">
                            Group by
                        </Button>
                        <Button variant="outline" className="px-6 py-4 rounded-2xl flex items-center gap-2">
                            <Filter className="w-5 h-5" /> Filter
                        </Button>
                        <select className="px-6 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 font-medium outline-none focus:ring-4 focus:ring-primary-500/10 shadow-sm cursor-pointer">
                            <option>Sort by: Newest</option>
                            <option>Sort by: Date</option>
                            <option>Sort by: Name</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 bg-slate-200 animate-pulse rounded-3xl" />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-12">
                        <TripSection title="Ongoing" trips={ongoing} count={ongoing.length} />
                        <TripSection title="Upcoming" trips={upcoming} count={upcoming.length} />
                        <TripSection title="Completed" trips={completed} count={completed.length} />
                    </div>
                )}
            </main>
        </div>
    )
}

export default MyTrips
