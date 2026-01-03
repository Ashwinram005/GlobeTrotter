import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { Navbar } from '../components/layout/Navbar'
import { Copy, Calendar, MapPin, Share2, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../components/common/UI'

interface PublicTrip {
    id: string
    name: string
    description: string
    start_date: string
    end_date: string
    cover_image: string
    budget_total: number
    profiles: {
        first_name: string
        last_name: string
        avatar_url: string
    }
}

interface PublicItem {
    id: string
    city_name: string
    activity_name: string
    date: string
    cost: number
}

const PublicTripView: React.FC = () => {
    const { tripId } = useParams<{ tripId: string }>()
    const navigate = useNavigate()
    const [trip, setTrip] = useState<PublicTrip | null>(null)
    const [items, setItems] = useState<PublicItem[]>([])
    const [loading, setLoading] = useState(true)
    const [copying, setCopying] = useState(false)

    useEffect(() => {
        if (tripId) fetchPublicTrip()
    }, [tripId])

    const fetchPublicTrip = async () => {
        // Fetch Trip Details
        const { data: tripData, error } = await supabase
            .from('trips')
            .select('*, profiles(first_name, last_name, avatar_url)')
            .eq('id', tripId)
            .single()

        if (error) {
            console.error("Error fetching public trip:", error)
            setLoading(false)
            return
        }

        // Fetch Itinerary Items
        const { data: itemsData } = await supabase
            .from('itinerary_items')
            .select('*')
            .eq('trip_id', tripId)
            .order('date', { ascending: true })

        setTrip(tripData)
        setItems(itemsData || [])
        setLoading(false)
    }

    const handleCopyTrip = async () => {
        setCopying(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                // If not logged in, redirect to login (or show modal)
                alert("Please log in to copy this trip to your account.")
                return
            }

            if (!trip) return

            // 1. Create new trip
            const { data: newTrip, error: tripError } = await supabase
                .from('trips')
                .insert({
                    user_id: user.id,
                    name: `Copy of ${trip.name}`,
                    description: trip.description,
                    start_date: trip.start_date,
                    end_date: trip.end_date,
                    cover_image: trip.cover_image,
                    budget_total: trip.budget_total
                })
                .select()
                .single()

            if (tripError || !newTrip) throw tripError

            // 2. Clone itinerary items
            if (items.length > 0) {
                const newItems = items.map(item => ({
                    trip_id: newTrip.id,
                    city_name: item.city_name,
                    activity_name: item.activity_name,
                    date: item.date,
                    cost: item.cost,
                    activity_type: 'section' // Defaulting for compatibility
                }))

                const { error: itemsError } = await supabase
                    .from('itinerary_items')
                    .insert(newItems)

                if (itemsError) throw itemsError
            }

            // Success! Redirect to the new trip
            navigate(`/trip/${newTrip.id}`)

        } catch (err: any) {
            console.error('Error copying trip:', err)
            alert('Failed to copy trip. Please try again.')
        } finally {
            setCopying(false)
        }
    }

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href)
        alert("Link copied to clipboard!")
    }

    if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="animate-pulse text-slate-400">Loading public trip...</div></div>

    if (!trip) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="text-slate-400">Trip not found or private.</div></div>

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            {/* Hero Banner */}
            <div className="h-[40vh] relative bg-slate-900">
                {trip.cover_image && <img src={trip.cover_image} className="w-full h-full object-cover opacity-60" />}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
                    <div className="max-w-5xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold mb-4 border border-white/30">
                            <Share2 className="w-3 h-3" /> Shared Itinerary
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">{trip.name}</h1>
                        <div className="flex items-center gap-4 text-slate-300 text-sm md:text-base">
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                            </span>
                            <span>•</span>
                            <span>Created by {trip.profiles?.first_name || 'Traveler'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12 -mt-20 relative z-10">

                {/* Left: Itinerary Feed */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Trip Timeline</h2>
                        <div className="space-y-8 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-100">
                            {items.map((item, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    key={item.id}
                                    className="relative pl-12"
                                >
                                    <div className="absolute left-1.5 top-1.5 w-5 h-5 bg-primary-100 rounded-full border-4 border-white shadow-sm z-10" />
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-primary-200 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg text-slate-900">{item.activity_name}</h3>
                                            <span className="text-xs font-bold bg-white px-2 py-1 rounded-lg border border-slate-200 text-slate-500">Day {idx + 1}</span>
                                        </div>
                                        <div className="text-sm text-slate-500 flex items-center gap-4">
                                            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {item.city_name}</span>
                                            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(item.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-24">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Detailed Breakdown</h3>
                        <p className="text-slate-500 text-sm mb-6">Like this itinerary? Copy it to your account to customize dates and details.</p>

                        <div className="space-y-3">
                            <Button onClick={handleCopyTrip} isLoading={copying} className="w-full rounded-xl py-4 font-bold shadow-lg shadow-primary-500/20">
                                <Copy className="w-4 h-4 mr-2" /> Copy to My Trips
                            </Button>
                            <button onClick={handleShare} className="w-full py-4 text-slate-600 font-bold bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center gap-2">
                                <Share2 className="w-4 h-4" /> Share Link
                            </button>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-500">Est. Budget</span>
                                <span className="font-bold text-slate-900">${trip.budget_total?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Cities</span>
                                <span className="font-bold text-slate-900">{[...new Set(items.map(i => i.city_name))].length}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    )
}

export default PublicTripView
