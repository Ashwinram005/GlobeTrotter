import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Calendar, DollarSign, Trash2, Save, ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Button, Input } from '../components/common/UI'
import { supabase } from '../services/supabase'

interface ItinerarySection {
    id: string
    trip_id: string
    city_name: string
    date_start: string
    date_end: string
    budget: number
    notes: string
    order: number
}

const TripItinerary: React.FC = () => {
    const navigate = useNavigate()
    const { tripId } = useParams<{ tripId: string }>()
    const [trip, setTrip] = useState<any>(null)
    const [sections, setSections] = useState<ItinerarySection[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (tripId) {
            fetchTripData()
        }
    }, [tripId])

    const fetchTripData = async () => {
        // Fetch trip
        const { data: tripData } = await supabase
            .from('trips')
            .select('*')
            .eq('id', tripId)
            .single()

        if (tripData) {
            setTrip(tripData)
        }

        // Fetch sections (using itinerary_items as sections for now)
        const { data: sectionsData } = await supabase
            .from('itinerary_items')
            .select('*')
            .eq('trip_id', tripId)
            .order('created_at', { ascending: true })

        if (sectionsData) {
            setSections(sectionsData.map((item, idx) => ({
                id: item.id,
                trip_id: item.trip_id,
                city_name: item.city_name,
                date_start: item.date,
                date_end: item.date,
                budget: item.cost || 0,
                notes: item.activity_name,
                order: idx
            })))
        }

        setLoading(false)
    }

    const addSection = () => {
        const newSection: ItinerarySection = {
            id: `temp-${Date.now()}`,
            trip_id: tripId!,
            city_name: '',
            date_start: '',
            date_end: '',
            budget: 0,
            notes: '',
            order: sections.length
        }
        setSections([...sections, newSection])
    }

    const updateSection = (id: string, field: keyof ItinerarySection, value: any) => {
        setSections(sections.map(s => s.id === id ? { ...s, [field]: value } : s))
    }

    const deleteSection = (id: string) => {
        setSections(sections.filter(s => s.id !== id))
    }

    const saveSections = async () => {
        setLoading(true)

        // Delete all existing sections
        await supabase.from('itinerary_items').delete().eq('trip_id', tripId)

        // Insert new sections
        const itemsToInsert = sections.filter(s => s.city_name || s.notes).map(section => ({
            trip_id: tripId,
            city_name: section.city_name || 'Unnamed City',
            date: section.date_start,
            activity_name: section.notes || 'No description',
            cost: section.budget,
            activity_type: 'section'
        }))

        if (itemsToInsert.length > 0) {
            await supabase.from('itinerary_items').insert(itemsToInsert)
        }

        alert('Itinerary saved successfully!')
        setLoading(false)
    }

    if (loading && !trip) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="max-w-4xl mx-auto px-6 pt-24">
                    <div className="h-96 bg-slate-200 animate-pulse rounded-3xl" />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 pt-24 pb-12 space-y-8">
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
                            <h1 className="text-3xl font-display font-bold text-slate-900">Build Itinerary</h1>
                            <p className="text-slate-500">{trip?.name}</p>
                        </div>
                    </div>
                    <Button onClick={saveSections} isLoading={loading} className="rounded-2xl px-6">
                        <Save className="w-5 h-5 mr-2" /> Save
                    </Button>
                </div>

                {/* Trip Info */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 space-y-2">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-slate-500">Trip Duration</p>
                            <p className="text-lg font-bold text-slate-900">
                                {new Date(trip?.start_date).toLocaleDateString()} - {new Date(trip?.end_date).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-500">Total Budget</p>
                            <p className="text-lg font-bold text-primary-600">${sections.reduce((sum, s) => sum + (s.budget || 0), 0)}</p>
                        </div>
                    </div>
                </div>

                {/* Sections */}
                <div className="space-y-6">
                    {sections.map((section, index) => (
                        <motion.div
                            key={section.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl p-6 border border-slate-100 space-y-4"
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-900">Section {index + 1}</h3>
                                <button
                                    onClick={() => deleteSection(section.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <Input
                                    label="City / Location"
                                    placeholder="e.g., Paris, France"
                                    value={section.city_name}
                                    onChange={(e) => updateSection(section.id, 'city_name', e.target.value)}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Start Date"
                                        type="date"
                                        value={section.date_start}
                                        onChange={(e) => updateSection(section.id, 'date_start', e.target.value)}
                                    />
                                    <Input
                                        label="End Date"
                                        type="date"
                                        value={section.date_end}
                                        onChange={(e) => updateSection(section.id, 'date_end', e.target.value)}
                                    />
                                </div>

                                <Input
                                    label="Budget for this section"
                                    type="number"
                                    placeholder="0"
                                    value={section.budget || ''}
                                    onChange={(e) => updateSection(section.id, 'budget', parseFloat(e.target.value) || 0)}
                                />

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700 ml-1">Notes / Activities</label>
                                    <textarea
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400 min-h-[100px]"
                                        placeholder="Describe activities, hotels, or any important info for this section..."
                                        value={section.notes}
                                        onChange={(e) => updateSection(section.id, 'notes', e.target.value)}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Add Section Button */}
                <button
                    onClick={addSection}
                    className="w-full py-4 bg-white border-2 border-dashed border-slate-300 rounded-3xl text-slate-600 font-bold hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Add another Section
                </button>
            </main>
        </div>
    )
}

export default TripItinerary
