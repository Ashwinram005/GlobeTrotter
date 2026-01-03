import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, MapPin, Loader, CheckCircle2, Plus } from 'lucide-react'
import { supabase } from '../../services/supabase'
import { Button } from './UI'

interface AddToTripModalProps {
    isOpen: boolean
    onClose: () => void
    item: {
        name: string
        type: 'city' | 'activity'
        city?: string
        cost?: number
    }
}

interface Trip {
    id: string
    name: string
    start_date: string
    end_date: string
}

export const AddToTripModal: React.FC<AddToTripModalProps> = ({ isOpen, onClose, item }) => {
    const [trips, setTrips] = useState<Trip[]>([])
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [selectedTripId, setSelectedTripId] = useState('')
    const [selectedDate, setSelectedDate] = useState('')
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (isOpen) {
            fetchTrips()
            setSuccess(false)
            setError('')
            setSelectedTripId('')
            setSelectedDate('')
        }
    }, [isOpen])

    const fetchTrips = async () => {
        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data, error } = await supabase
                .from('trips')
                .select('id, name, start_date, end_date')
                .eq('user_id', user.id)
                .order('start_date', { ascending: false })

            if (error) throw error
            setTrips(data || [])
        } catch (err: any) {
            console.error('Error fetching trips:', err)
            setError('Failed to load trips')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!selectedTripId || !selectedDate) return

        setSaving(true)
        try {
            const { error: insertError } = await supabase
                .from('itinerary_items')
                .insert({
                    trip_id: selectedTripId,
                    city_name: item.type === 'city' ? item.name : (item.city || 'Unknown'),
                    activity_name: item.type === 'activity' ? item.name : 'Visit Destination',
                    activity_type: item.type,
                    date: selectedDate,
                    cost: item.cost || 0,
                    start_time: '09:00:00',
                    end_time: '18:00:00'
                })

            if (insertError) throw insertError

            // Update trip total budget
            const { data: items } = await supabase
                .from('itinerary_items')
                .select('cost')
                .eq('trip_id', selectedTripId)

            const totalBudget = (items || []).reduce((sum: number, i: any) => sum + Number(i.cost), 0)

            await supabase
                .from('trips')
                .update({ budget_total: totalBudget })
                .eq('id', selectedTripId)

            setSuccess(true)
            setTimeout(() => {
                onClose()
            }, 2000)
        } catch (err: any) {
            console.error('Error saving item:', err)
            setError(err.message || 'Failed to add to trip')
        } finally {
            setSaving(false)
        }
    }

    const selectedTrip = trips.find(t => t.id === selectedTripId)

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
                                    <Plus className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">Add to Trip</h2>
                                    <p className="text-sm text-slate-500 font-medium">{item.name}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-50 rounded-full transition-colors group"
                            >
                                <X className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-6">
                            {success ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="py-12 flex flex-col items-center text-center space-y-4"
                                >
                                    <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900">Success!</h3>
                                        <p className="text-slate-500">Item has been added to your itinerary.</p>
                                    </div>
                                </motion.div>
                            ) : (
                                <>
                                    {/* Trip Selection */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-primary-500" />
                                            Select Trip
                                        </label>
                                        {loading ? (
                                            <div className="h-12 bg-slate-50 rounded-2xl animate-pulse" />
                                        ) : trips.length > 0 ? (
                                            <select
                                                value={selectedTripId}
                                                onChange={(e) => setSelectedTripId(e.target.value)}
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium text-slate-700"
                                            >
                                                <option value="">Choose a trip...</option>
                                                {trips.map(trip => (
                                                    <option key={trip.id} value={trip.id}>
                                                        {trip.name} ({new Date(trip.start_date).toLocaleDateString()})
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-slate-200">
                                                No trips found. Create one first!
                                            </p>
                                        )}
                                    </div>

                                    {/* Date Selection */}
                                    <div className={`space-y-2 transition-opacity duration-300 ${!selectedTripId ? 'opacity-50 pointer-events-none' : ''}`}>
                                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-primary-500" />
                                            Select Date
                                        </label>
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            min={selectedTrip?.start_date}
                                            max={selectedTrip?.end_date}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium text-slate-700"
                                        />
                                        {selectedTrip && (
                                            <p className="text-xs text-slate-500 mt-1 pl-1">
                                                Must be between {new Date(selectedTrip.start_date).toLocaleDateString()} and {new Date(selectedTrip.end_date).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100">
                                            {error}
                                        </div>
                                    )}

                                    {/* Footer Action */}
                                    <div className="pt-4">
                                        <Button
                                            onClick={handleSave}
                                            disabled={!selectedTripId || !selectedDate || saving}
                                            className="w-full py-4 rounded-2xl text-lg relative font-bold"
                                        >
                                            {saving ? (
                                                <Loader className="w-6 h-6 animate-spin mx-auto text-white" />
                                            ) : (
                                                'Confirm & Add'
                                            )}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
