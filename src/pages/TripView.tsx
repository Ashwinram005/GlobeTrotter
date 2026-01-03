import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Edit, ArrowLeft, CalendarDays, DollarSign } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Button } from '../components/common/UI'
import { supabase } from '../services/supabase'

interface Trip {
    id: string
    name: string
    description: string
    start_date: string
    end_date: string
    budget_total: number
}

interface ItineraryItem {
    id: string
    city_name: string
    date: string
    activity_name: string
    cost: number
    activity_type: string
}

const TripView: React.FC = () => {
    const navigate = useNavigate()
    const { tripId } = useParams<{ tripId: string }>()
    const [trip, setTrip] = useState<Trip | null>(null)
    const [items, setItems] = useState<ItineraryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useState<'day' | 'city'>('day')

    useEffect(() => {
        if (tripId) {
            fetchData()
        }
    }, [tripId])

    const fetchData = async () => {
        console.log('🔍 [TripView] Loading trip:', tripId)

        // Fetch trip details
        const { data: tripData, error: tripError } = await supabase
            .from('trips')
            .select('*')
            .eq('id', tripId)
            .single()

        if (tripError) {
            console.error('❌ [TripView] Trip error:', tripError)
        } else {
            console.log('✅ [TripView] Trip loaded:', tripData?.name)
            setTrip(tripData)
        }

        // Fetch itinerary items
        const { data: itemsData, error: itemsError } = await supabase
            .from('itinerary_items')
            .select('*')
            .eq('trip_id', tripId)
            .order('date', { ascending: true })

        if (itemsError) {
            console.error('❌ [TripView] Items error:', itemsError)
        } else {
            console.log('✅ [TripView] Loaded items:', itemsData?.length || 0)
            setItems(itemsData || [])
        }

        setLoading(false)
    }

    // Group items by date
    const groupByDate = () => {
        const grouped: { [key: string]: ItineraryItem[] } = {}
        items.forEach(item => {
            if (!grouped[item.date]) {
                grouped[item.date] = []
            }
            grouped[item.date].push(item)
        })
        return grouped
    }

    // Group items by city
    const groupByCity = () => {
        const grouped: { [key: string]: ItineraryItem[] } = {}
        items.forEach(item => {
            if (!grouped[item.city_name]) {
                grouped[item.city_name] = []
            }
            grouped[item.city_name].push(item)
        })
        return grouped
    }

    const totalBudget = items.reduce((sum, item) => sum + (item.cost || 0), 0)

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="max-w-5xl mx-auto px-6 pt-24 space-y-4">
                    <div className="h-64 bg-slate-200 animate-pulse rounded-3xl" />
                    <div className="h-96 bg-slate-200 animate-pulse rounded-3xl" />
                </div>
            </div>
        )
    }

    if (!trip) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="max-w-5xl mx-auto px-6 pt-24 text-center">
                    <h1 className="text-2xl font-bold text-slate-900">Trip not found</h1>
                </div>
            </div>
        )
    }

    const groupedByDate = groupByDate()
    const groupedByCity = groupByCity()

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-5xl mx-auto px-6 pt-24 pb-12 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/my-trips')}
                            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-display font-bold text-slate-900">{trip.name}</h1>
                            <p className="text-slate-500">{trip.description}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => navigate(`/trip/${tripId}/calendar`)}
                            className="rounded-2xl px-6"
                        >
                            <CalendarDays className="w-5 h-5 mr-2" /> Calendar
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate(`/trip/${tripId}/budget`)}
                            className="rounded-2xl px-6"
                        >
                            <DollarSign className="w-5 h-5 mr-2" /> Budget
                        </Button>
                        <Button
                            onClick={() => navigate(`/trip/${tripId}/edit`)}
                            className="rounded-2xl px-6"
                        >
                            <Edit className="w-5 h-5 mr-2" /> Edit Plan
                        </Button>
                    </div>
                </div>

                {/* Trip Summary Card */}
                <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 text-white shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1">
                            <p className="text-primary-200 text-sm font-medium">Duration</p>
                            <p className="text-2xl font-bold">
                                {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-primary-200 text-sm font-medium">Total Budget</p>
                            <p className="text-2xl font-bold">${totalBudget.toFixed(2)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-primary-200 text-sm font-medium">Cities</p>
                            <p className="text-2xl font-bold">{Object.keys(groupedByCity).length}</p>
                        </div>
                    </div>
                </div>

                {/* View Toggle */}
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-900">Itinerary Details</h2>
                    <div className="bg-white rounded-2xl p-1 flex gap-1 border border-slate-200">
                        <button
                            onClick={() => setViewMode('day')}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${viewMode === 'day'
                                ? 'bg-primary-600 text-white shadow-md'
                                : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <CalendarDays className="w-4 h-4 inline mr-2" />
                            Day View
                        </button>
                        <button
                            onClick={() => setViewMode('city')}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${viewMode === 'city'
                                ? 'bg-primary-600 text-white shadow-md'
                                : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <MapPin className="w-4 h-4 inline mr-2" />
                            City View
                        </button>
                    </div>
                </div>

                {/* Itinerary Content */}
                {items.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
                        <p className="text-slate-500 mb-4">No itinerary items yet</p>
                        <Button onClick={() => navigate(`/trip/${tripId}/edit`)}>
                            Start Planning
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {viewMode === 'day' ? (
                            // Day-wise view
                            Object.entries(groupedByDate).map(([date, dayItems], idx) => (
                                <motion.div
                                    key={date}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-lg"
                                >
                                    <div className="bg-gradient-to-r from-primary-50 to-slate-50 px-8 py-4 border-b border-slate-100">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-bold">
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500 font-medium">Day {idx + 1}</p>
                                                    <p className="text-lg font-bold text-slate-900">
                                                        {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-slate-500">Daily Budget</p>
                                                <p className="text-xl font-bold text-primary-600">
                                                    ${dayItems.reduce((sum, item) => sum + (item.cost || 0), 0).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-4">
                                        {dayItems.map((item, itemIdx) => (
                                            <div key={item.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                                                <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center text-primary-600 font-bold border-2 border-primary-200">
                                                    {itemIdx + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h4 className="font-bold text-slate-900">{item.activity_name}</h4>
                                                            <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                                                                <MapPin className="w-4 h-4" /> {item.city_name}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold text-primary-600">${item.cost?.toFixed(2) || '0.00'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            // City-wise view
                            Object.entries(groupedByCity).map(([city, cityItems], idx) => (
                                <motion.div
                                    key={city}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-lg"
                                >
                                    <div className="bg-gradient-to-r from-emerald-50 to-slate-50 px-8 py-4 border-b border-slate-100">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <MapPin className="w-8 h-8 text-emerald-600" />
                                                <h3 className="text-2xl font-bold text-slate-900">{city}</h3>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-slate-500">City Budget</p>
                                                <p className="text-xl font-bold text-emerald-600">
                                                    ${cityItems.reduce((sum, item) => sum + (item.cost || 0), 0).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-3">
                                        {cityItems.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                                <div>
                                                    <h4 className="font-bold text-slate-900">{item.activity_name}</h4>
                                                    <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                                                        <Calendar className="w-4 h-4" /> {new Date(item.date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <p className="font-bold text-primary-600">${item.cost?.toFixed(2) || '0.00'}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}

export default TripView
