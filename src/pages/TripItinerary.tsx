import React, { useEffect, useState } from 'react'
import { Reorder } from 'framer-motion'
import { Plus, Trash2, Save, ArrowLeft, GripVertical } from 'lucide-react'
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
        console.log('🔍 [TripItinerary] Fetching trip data for:', tripId)

        // Fetch trip
        const { data: tripData, error: tripError } = await supabase
            .from('trips')
            .select('*')
            .eq('id', tripId)
            .single()

        if (tripError) {
            console.error('❌ [TripItinerary] Trip fetch error:', tripError)
        } else if (tripData) {
            console.log('✅ [TripItinerary] Trip loaded:', tripData.name)
            setTrip(tripData)
        }

        // Fetch sections
        const { data: sectionsData, error: sectionsError } = await supabase
            .from('itinerary_items')
            .select('*')
            .eq('trip_id', tripId)
            .order('date', { ascending: true })

        if (sectionsError) {
            console.error('❌ [TripItinerary] Sections fetch error:', sectionsError)
        } else if (sectionsData && sectionsData.length > 0) {
            console.log('✅ [TripItinerary] Loaded sections:', sectionsData.length)
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
        } else {
            console.log('ℹ️ [TripItinerary] No sections found. Adding initial one.')
            addSection()
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
        setSections(sections.map((s: ItinerarySection) => s.id === id ? { ...s, [field]: value } : s))
    }

    const deleteSection = (id: string) => {
        setSections(sections.filter((s: ItinerarySection) => s.id !== id))
    }

    const saveSections = async () => {
        setLoading(true)
        console.log('💾 [TripItinerary] Saving sections...')

        // Delete all existing sections for this trip
        await supabase.from('itinerary_items').delete().eq('trip_id', tripId)

        // Filter valid sections
        const validSections = sections.filter((s: ItinerarySection) => {
            const hasCity = s.city_name && s.city_name.trim() !== ''
            const hasDate = s.date_start && s.date_start !== ''
            const hasNotes = s.notes && s.notes.trim() !== ''
            return (hasCity || hasNotes) && hasDate
        })

        console.log(`📝 [TripItinerary] Valid sections: ${validSections.length}/${sections.length}`)

        if (validSections.length === 0) {
            alert('Please add at least one section with a city/activity name and date.')
            setLoading(false)
            return
        }

        // Insert sections with updated dates if reordered (simulated for now by maintaining date)
        // In a real app, we might update the dates based on the new order if they are chronological
        const itemsToInsert = validSections.map((section: ItinerarySection) => ({
            trip_id: tripId,
            city_name: section.city_name || 'Unnamed City',
            date: section.date_start,
            activity_name: section.notes || 'No description',
            cost: section.budget || 0,
            activity_type: 'section'
        }))

        const { error: insertError } = await supabase
            .from('itinerary_items')
            .insert(itemsToInsert)

        if (insertError) {
            console.error('❌ [TripItinerary] Insert error:', insertError)
            alert('Error saving itinerary: ' + insertError.message)
            setLoading(false)
        } else {
            console.log('✅ [TripItinerary] Saved successfully!')
            navigate(`/trip/${tripId}`)
        }
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
                            onClick={() => navigate(`/trip/${tripId}`)}
                            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-display font-bold text-slate-900">Build Itinerary</h1>
                            <p className="text-slate-500">{trip?.name}</p>
                        </div>
                    </div>
                    <Button onClick={saveSections} isLoading={loading} className="rounded-2xl px-6 font-bold shadow-lg shadow-primary-500/20">
                        <Save className="w-5 h-5 mr-2" /> Save & View
                    </Button>
                </div>

                {/* Trip Info */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex justify-between items-center">
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Trip Duration</p>
                        <p className="text-lg font-bold text-slate-900">
                            {trip && new Date(trip.start_date).toLocaleDateString()} - {trip && new Date(trip.end_date).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-slate-500 font-medium">Planned Total</p>
                        <p className="text-2xl font-bold text-primary-600">${sections.reduce((sum: number, s: ItinerarySection) => sum + (Number(s.budget) || 0), 0).toLocaleString()}</p>
                    </div>
                </div>

                {/* Reorderable List */}
                <Reorder.Group axis="y" values={sections} onReorder={setSections} className="space-y-6">
                    {sections.map((section: ItinerarySection, index: number) => (
                        <Reorder.Item
                            key={section.id}
                            value={section}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-lg hover:shadow-xl transition-shadow relative group"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="cursor-grab active:cursor-grabbing p-2 hover:bg-slate-50 rounded-lg text-slate-400 group-hover:text-primary-400 transition-colors">
                                        <GripVertical className="w-5 h-5" />
                                    </div>
                                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-primary-500/20">
                                        {index + 1}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">Day Phase</h3>
                                </div>
                                <button
                                    onClick={() => deleteSection(section.id)}
                                    className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="City / Location"
                                    placeholder="Where are you heading?"
                                    value={section.city_name}
                                    onChange={(e) => updateSection(section.id, 'city_name', e.target.value)}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Date"
                                        type="date"
                                        value={section.date_start}
                                        onChange={(e) => updateSection(section.id, 'date_start', e.target.value)}
                                    />
                                    <Input
                                        label="Est. Cost"
                                        type="number"
                                        placeholder="0"
                                        value={section.budget || ''}
                                        onChange={(e) => updateSection(section.id, 'budget', parseFloat(e.target.value) || 0)}
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700 ml-1">Activities & Notes</label>
                                    <textarea
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400 min-h-[120px] text-slate-700"
                                        placeholder="What's the plan? Landmark visits, hotel names, or meal ideas..."
                                        value={section.notes}
                                        onChange={(e) => updateSection(section.id, 'notes', e.target.value)}
                                    />
                                </div>
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>

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
