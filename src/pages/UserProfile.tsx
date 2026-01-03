import React, { useEffect, useState } from 'react'
import { Navbar } from '../components/layout/Navbar'
import { supabase } from '../services/supabase'
import { User, MapPin, Phone, Mail, Edit2, Save, Calendar, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { Input, Button } from '../components/common/UI'
import { Link } from 'react-router-dom'

interface Profile {
    id: string
    first_name: string
    last_name: string
    email?: string // Derived from auth user if not in profile
    city: string
    phone: string
    avatar_url?: string
}

interface Trip {
    id: string
    name: string
    cover_image: string
    start_date: string
    end_date: string
    budget_total: number
}

const UserProfile: React.FC = () => {
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [trips, setTrips] = useState<Trip[]>([])

    // Form state
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        city: ''
    })

    useEffect(() => {
        fetchProfileData()
    }, [])

    const fetchProfileData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Fetch Profile
            let { data: profileData, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (error && error.code === 'PGRST116') {
                // Profile might not create automatically if trigger failed, create one?
                // For now assuming profile exists or is handled
                console.warn("Profile not found")
            }

            if (profileData) {
                setProfile({ ...profileData, email: user.email })
                setFormData({
                    first_name: profileData.first_name || '',
                    last_name: profileData.last_name || '',
                    phone: profileData.phone || '',
                    city: profileData.city || ''
                })
            }

            // Fetch Trips
            const { data: tripsData } = await supabase
                .from('trips')
                .select('*')
                .eq('user_id', user.id)
                .order('start_date', { ascending: false })

            if (tripsData) setTrips(tripsData)

        } catch (error) {
            console.error('Error fetching profile:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateProfile = async () => {
        if (!profile) return
        setLoading(true)

        const { error } = await supabase
            .from('profiles')
            .update({
                first_name: formData.first_name,
                last_name: formData.last_name,
                phone: formData.phone,
                city: formData.city
            })
            .eq('id', profile.id)

        if (!error) {
            setProfile({ ...profile, ...formData })
            setIsEditing(false)
        } else {
            console.error('Error updating profile:', error)
            alert('Failed to update profile')
        }
        setLoading(false)
    }

    const upcomingTrips = trips.filter(t => new Date(t.end_date) >= new Date())
    const pastTrips = trips.filter(t => new Date(t.end_date) < new Date())

    if (loading && !profile) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="pt-24 px-6 flex justify-center">
                    <div className="animate-pulse w-full max-w-4xl space-y-8">
                        <div className="h-64 bg-slate-200 rounded-3xl"></div>
                        <div className="h-96 bg-slate-200 rounded-3xl"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-5xl mx-auto px-6 pt-24 pb-12 space-y-12">

                {/* Profile Header Card */}
                <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 to-indigo-500" />

                    {/* Avatar Side */}
                    <div className="flex-shrink-0 mx-auto md:mx-0">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-slate-100 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden relative group">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-16 h-16 text-slate-300" />
                            )}
                            {/* Hover overlay for future upload feature */}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Edit2 className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Details Side */}
                    <div className="flex-grow w-full space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-display font-bold text-slate-900">
                                    {isEditing ? 'Edit Profile' : `${profile?.first_name} ${profile?.last_name}`}
                                </h1>
                                {!isEditing && (
                                    <div className="flex flex-wrap gap-4 mt-2 text-slate-500">
                                        <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {profile?.email}</span>
                                        {profile?.city && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {profile?.city}</span>}
                                        {profile?.phone && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {profile?.phone}</span>}
                                    </div>
                                )}
                            </div>
                            <Button
                                onClick={() => isEditing ? handleUpdateProfile() : setIsEditing(true)}
                                className={`rounded-xl px-5 ${isEditing ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-transparent'}`}
                            >
                                {isEditing ? <><Save className="w-4 h-4 mr-2" /> Save Changes</> : <><Edit2 className="w-4 h-4 mr-2" /> Edit Profile</>}
                            </Button>
                        </div>

                        {isEditing && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100"
                            >
                                <Input
                                    label="First Name"
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                />
                                <Input
                                    label="Last Name"
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                />
                                <Input
                                    label="City / Location"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                />
                                <Input
                                    label="Phone Number"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </motion.div>
                        )}

                        {!isEditing && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                                    <p className="text-2xl font-bold text-primary-600">{trips.length}</p>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Trips</p>
                                </div>
                                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                                    <p className="text-2xl font-bold text-emerald-600">{pastTrips.length}</p>
                                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Places Visited</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Preplanned Trips Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-display font-bold text-slate-900">Upcoming Adventures</h2>
                    </div>

                    {upcomingTrips.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcomingTrips.map(trip => (
                                <TripCard key={trip.id} trip={trip} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
                            <p className="text-slate-400 font-medium">No upcoming trips planned yet.</p>
                            <Link to="/create-trip" className="mt-4 inline-block text-primary-600 font-bold hover:underline">Start planning now &rarr;</Link>
                        </div>
                    )}
                </div>

                {/* Previous Trips Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                            <Clock className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-display font-bold text-slate-900">Travel History</h2>
                    </div>

                    {pastTrips.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pastTrips.map(trip => (
                                <TripCard key={trip.id} trip={trip} isPast />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-slate-400 text-sm">Your travel history is empty.</p>
                        </div>
                    )}
                </div>

            </main>
        </div>
    )
}

// Inline simple trip card for profile view
const TripCard = ({ trip, isPast }: { trip: Trip, isPast?: boolean }) => (
    <Link to={`/trip/${trip.id}`} className="group block bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
        <div className="h-48 bg-slate-200 relative overflow-hidden">
            {trip.cover_image ? (
                <img src={trip.cover_image} alt={trip.name} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-400 to-indigo-500" />
            )}
            {isPast && (
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                    COMPLETED
                </div>
            )}
        </div>
        <div className="p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">{trip.name}</h3>
            <p className="text-sm text-slate-500 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(trip.start_date).toLocaleDateString()}
            </p>
        </div>
    </Link>
)

export default UserProfile
