import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight, X, MapPin, Calendar as CalendarIcon, Edit } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Button } from '../components/common/UI'
import { supabase } from '../services/supabase'

interface Trip {
    id: string
    name: string
    start_date: string
    end_date: string
}

interface ItineraryItem {
    id: string
    activity_name: string
    date: string
    city_name: string
}

const TripCalendar: React.FC = () => {
    const navigate = useNavigate()
    const { tripId } = useParams<{ tripId: string }>()
    const [trip, setTrip] = useState<Trip | null>(null)
    const [items, setItems] = useState<ItineraryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [currentMonth, setCurrentMonth] = useState(new Date())

    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    useEffect(() => {
        if (tripId) fetchData()
    }, [tripId])

    const fetchData = async () => {
        const { data: tripData } = await supabase.from('trips').select('*').eq('id', tripId).single()
        const { data: itemsData } = await supabase.from('itinerary_items').select('*').eq('trip_id', tripId)

        if (tripData) {
            setTrip(tripData)
            setCurrentMonth(new Date(tripData.start_date))
        }
        if (itemsData) setItems(itemsData)
        setLoading(false)
    }

    // Calendar Helper functions
    const toLocalDateString = (date: Date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()

        const days = []
        // Add empty days from previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(null)
        }
        // Add actual days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i))
        }
        return days
    }

    const isDateInTripRange = (date: Date | null) => {
        if (!date || !trip) return false
        const targetDate = toLocalDateString(date)
        return targetDate >= trip.start_date && targetDate <= trip.end_date
    }

    const getActivitiesForDate = (date: Date | null) => {
        if (!date) return []
        const dateStr = toLocalDateString(date)
        return items.filter((item: ItineraryItem) => item.date === dateStr)
    }

    const changeMonth = (offset: number) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1))
    }

    if (loading || !trip) return <div className="min-h-screen bg-slate-50"><Navbar /><div className="pt-24 px-6">Loading calendar...</div></div>

    const days = getDaysInMonth(currentMonth)
    const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-6xl mx-auto px-6 pt-24 pb-12 space-y-8">
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
                            <h1 className="text-3xl font-display font-bold text-slate-900">Trip Calendar</h1>
                            <p className="text-slate-500">Timeline for {trip.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center bg-white rounded-2xl border border-slate-200 p-1 shadow-sm">
                        <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                            <ChevronLeft className="w-5 h-5 text-slate-600" />
                        </button>
                        <span className="px-4 font-bold text-slate-900 min-w-[150px] text-center">
                            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                        <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                            <ChevronRight className="w-5 h-5 text-slate-600" />
                        </button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden">
                    {/* Month Day Names */}
                    <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
                        {weekDays.map(day => (
                            <div key={day} className="py-4 text-center text-xs font-bold text-slate-400 tracking-widest">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Actual Grid */}
                    <div className="grid grid-cols-7 auto-rows-[140px]">
                        {days.map((day, idx) => {
                            const isInRange = isDateInTripRange(day)
                            const dateActivities = getActivitiesForDate(day)

                            return (
                                <button
                                    key={idx}
                                    disabled={!day}
                                    onClick={() => setSelectedDate(day)}
                                    className={`relative border-r border-b border-slate-100 p-3 group transition-all text-left ${!day ? 'bg-slate-50/30' : 'hover:bg-primary-50/30 cursor-pointer'}`}
                                >
                                    {day && (
                                        <>
                                            <span className={`text-sm font-bold ${isInRange ? 'text-primary-600' : 'text-slate-400'}`}>
                                                {day.getDate()}
                                            </span>

                                            <div className="mt-2 space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                                                {dateActivities.length > 0 ? (
                                                    dateActivities.map((act: ItineraryItem) => (
                                                        <div key={act.id} className="text-[10px] bg-primary-600 text-white p-1.5 rounded-lg truncate shadow-sm font-medium">
                                                            {act.activity_name}
                                                        </div>
                                                    ))
                                                ) : (
                                                    isInRange && <div className="h-2 w-full bg-primary-100 rounded-full mt-2" title="Trip Day" />
                                                )}
                                            </div>
                                        </>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Day Detail Overlay */}
                <AnimatePresence>
                    {selectedDate && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedDate(null)}
                                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl relative overflow-hidden"
                            >
                                <div className="p-8 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-primary-600 font-bold mb-1">
                                                {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
                                            </p>
                                            <h2 className="text-3xl font-display font-bold text-slate-900">
                                                {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                                            </h2>
                                        </div>
                                        <button
                                            onClick={() => setSelectedDate(null)}
                                            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-500 transition-colors"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {getActivitiesForDate(selectedDate).length > 0 ? (
                                            getActivitiesForDate(selectedDate).map((act, i) => (
                                                <motion.div
                                                    key={act.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center"
                                                >
                                                    <div>
                                                        <h4 className="font-bold text-slate-900">{act.activity_name}</h4>
                                                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                                            <MapPin className="w-3 h-3" /> {act.city_name}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ))
                                        ) : (
                                            <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
                                                <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                                <p>No activities scheduled for this day</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-6 border-t border-slate-100 flex gap-3">
                                        <Button
                                            onClick={() => navigate(`/trip/${tripId}/edit`)}
                                            className="w-full rounded-2xl font-bold"
                                        >
                                            <Edit className="w-5 h-5 mr-2" /> Modify Plans
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Legend / Upcoming Features */}
                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-primary-600 rounded-full" />
                        <span className="text-sm font-medium text-slate-600">Trip Duration</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-slate-300 rounded-full" />
                        <span className="text-sm font-medium text-slate-600">Standard Day</span>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default TripCalendar
