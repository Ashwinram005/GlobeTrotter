import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, ArrowRight, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Input, Button, Card } from '../components/common/UI'
import { supabase } from '../services/supabase'
import { useAuth } from '../context/AuthContext'

const CreateTrip: React.FC = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        place: '',
        startDate: '',
        endDate: '',
        description: ''
    })

    const suggestions = [
        { name: 'Eiffel Tower', city: 'Paris', type: 'Sights', image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&q=80' },
        { name: 'Kyoto Temples', city: 'Kyoto', type: 'Culture', image: 'https://images.unsplash.com/photo-1545562083-a600704fa487?auto=format&fit=crop&q=80' },
        { name: 'Uluwatu Temple', city: 'Bali', type: 'Sights', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80' },
        { name: 'Grand Canal', city: 'Venice', type: 'Romance', image: 'https://images.unsplash.com/photo-1514890547357-a9ee2887ad8e?auto=format&fit=crop&q=80' },
        { name: 'Machu Picchu', city: 'Cusco', type: 'Adventure', image: 'https://images.unsplash.com/photo-1587590227264-0ac64ce63ce8?auto=format&fit=crop&q=80' },
        { name: 'Swiss Alps', city: 'Zermatt', type: 'Nature', image: 'https://images.unsplash.com/photo-1531641046557-869d0899c1b2?auto=format&fit=crop&q=80' },
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name || !formData.startDate || !formData.endDate || !user?.id) return

        setLoading(true)

        // Safety check: Ensure profile exists
        const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .maybeSingle()

        // Create profile if it doesn't exist
        if (!profile) {
            await supabase.from('profiles').insert({
                id: user.id,
                first_name: user.user_metadata?.first_name || '',
                last_name: user.user_metadata?.last_name || ''
            })
        }

        // Now create the trip
        const { data, error } = await supabase
            .from('trips')
            .insert({
                user_id: user.id,
                name: formData.name,
                description: formData.description,
                start_date: formData.startDate,
                end_date: formData.endDate,
                budget_total: 0,
            })
            .select()
            .single()

        if (!error && data) {
            navigate(`/trip/${data.id}`)
        } else {
            console.error(error)
            alert('Error creating trip: ' + (error?.message || 'Unknown error'))
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-24 space-y-8">
                {/* Header Section */}
                <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Plan a new trip</h1>
                        <p className="text-slate-500 font-medium">Design your dream journey step by step.</p>
                    </div>
                    <Button variant="outline" onClick={() => navigate('/dashboard')} className="rounded-full">
                        Cancel
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Create Form (Screen 4) */}
                    <div className="lg:col-span-1">
                        <Card className="p-8 sticky top-24">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <Input
                                    label="Trip Name"
                                    placeholder="e.g., Summer in Europe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700 ml-1">Select a Place</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                                            placeholder="Where are you going?"
                                            value={formData.place}
                                            onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Start Date"
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        required
                                    />
                                    <Input
                                        label="End Date"
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700 ml-1">Notes / Description</label>
                                    <textarea
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400 min-h-[100px]"
                                        placeholder="Describe your trip goals..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <Button className="w-full py-4 rounded-2xl" isLoading={loading}>
                                    Save & Continue <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </form>
                        </Card>
                    </div>

                    {/* Right: Suggestions Grid (Screen 4) */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Suggestions for Places to Visit</h3>
                                <p className="text-sm text-slate-500 font-medium">Top activities and sights based on your preferences</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <AnimatePresence>
                                {suggestions.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        whileHover={{ scale: 1.02 }}
                                        className="bg-white rounded-[32px] p-3 shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col group cursor-pointer"
                                    >
                                        <div className="h-44 rounded-[24px] overflow-hidden relative">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-primary-600 uppercase">
                                                {item.type}
                                            </div>
                                        </div>
                                        <div className="p-4 flex justify-between items-center">
                                            <div>
                                                <h4 className="font-bold text-slate-900 leading-tight">{item.name}</h4>
                                                <p className="text-xs text-slate-500 font-medium mt-0.5">{item.city}</p>
                                            </div>
                                            <button className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition-all border border-slate-100">
                                                <Plus className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <div className="bg-primary-900 rounded-[32px] p-10 relative overflow-hidden text-center space-y-6">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-400/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
                            <div className="relative z-10 space-y-2">
                                <h4 className="text-2xl font-bold text-white">Can't decide?</h4>
                                <p className="text-primary-200 font-light max-w-sm mx-auto">Our AI travel assistant can help you curate a specialized itinerary based on your style.</p>
                            </div>
                            <Button className="bg-white text-primary-900 hover:bg-primary-50 rounded-2xl relative z-10">
                                Ask AI Assistant
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

const Plus: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
)

export default CreateTrip
