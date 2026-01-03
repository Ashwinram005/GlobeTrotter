import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Plus, Clock, DollarSign, Tag, Loader } from 'lucide-react'
import { Navbar } from '../components/layout/Navbar'
import { Button } from '../components/common/UI'
import { AddToTripModal } from '../components/common/AddToTripModal'
import { getActivities, type Activity } from '../services/travelApi'

const ActivitySearch: React.FC = () => {
    const [activities, setActivities] = useState<Activity[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [maxCost, setMaxCost] = useState(200)
    const [sortBy, setSortBy] = useState('rating')
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        loadActivities()
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery) {
                handleSearch()
            } else {
                loadActivities()
            }
        }, 500) // Debounce search
        return () => clearTimeout(timer)
    }, [searchQuery])

    const loadActivities = () => {
        setLoading(true)
        setActivities(getActivities())
        setLoading(false)
    }

    const handleSearch = async () => {
        setLoading(true)
        const { searchActivities } = await import('../services/travelApi')
        const data = await searchActivities(searchQuery)
        setActivities(data)
        setLoading(false)
    }

    const categories = ['all', ...Array.from(new Set(activities.map(a => a.category)))]

    const filteredActivities = activities
        .filter(activity => {
            // If we have a query, the API result is already filtered by name
            if (searchQuery) return true

            const matchesSearch = activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                activity.description.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = selectedCategory === 'all' || activity.category === selectedCategory
            const matchesCost = activity.cost <= maxCost
            return matchesSearch && matchesCategory && matchesCost
        })
        .sort((a, b) => {
            if (sortBy === 'rating') return b.rating - a.rating
            if (sortBy === 'cost-low') return a.cost - b.cost
            if (sortBy === 'cost-high') return b.cost - a.cost
            return 0
        })

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-24 pb-12 space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-4xl font-display font-bold text-slate-900">Discover Activities</h1>
                    <p className="text-slate-500 mt-1">Find amazing experiences to add to your itinerary</p>
                </div>

                {/* Search & Filters */}
                <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="lg:col-span-2 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search activities..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                            />
                        </div>

                        {/* Category Filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-medium outline-none focus:ring-4 focus:ring-primary-500/10 cursor-pointer"
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category === 'all' ? 'All Categories' : category}
                                </option>
                            ))}
                        </select>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-medium outline-none focus:ring-4 focus:ring-primary-500/10 cursor-pointer"
                        >
                            <option value="rating">Sort: Rating</option>
                            <option value="cost-low">Sort: Cost (Low)</option>
                            <option value="cost-high">Sort: Cost (High)</option>
                        </select>
                    </div>

                    {/* Cost Range Slider */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-slate-700">Max Budget: ${maxCost}</label>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="500"
                            step="10"
                            value={maxCost}
                            onChange={(e) => setMaxCost(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                        />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-500 pt-2 border-t border-slate-100">
                        <Filter className="w-4 h-4" />
                        <span>{filteredActivities.length} activities found</span>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader className="w-8 h-8 animate-spin text-primary-600" />
                        <span className="ml-3 text-slate-600">Finding experiences for you...</span>
                    </div>
                )}

                {/* Results */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredActivities.map((activity, idx) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 flex flex-col md:flex-row group hover:shadow-2xl transition-all"
                            >
                                {/* Image */}
                                <div className="md:w-2/5 h-64 md:h-auto overflow-hidden relative">
                                    <img
                                        src={activity.image}
                                        alt={activity.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-primary-600">
                                        ⭐ {activity.rating.toFixed(1)}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="md:w-3/5 p-6 flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-1">{activity.name}</h3>
                                            <p className="text-sm text-slate-500">{activity.city}</p>
                                        </div>

                                        <p className="text-sm text-slate-600 line-clamp-2">{activity.description}</p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-bold flex items-center gap-1">
                                                <Tag className="w-3 h-3" /> {activity.category}
                                            </span>
                                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {activity.duration}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4">
                                        <div className="flex items-center gap-1.5">
                                            <DollarSign className="w-5 h-5 text-primary-600" />
                                            <span className="text-2xl font-bold text-slate-900">${activity.cost}</span>
                                            <span className="text-sm text-slate-500">per person</span>
                                        </div>
                                        <Button
                                            onClick={() => {
                                                setSelectedActivity(activity)
                                                setIsModalOpen(true)
                                            }}
                                            className="rounded-2xl px-6"
                                        >
                                            <Plus className="w-4 h-4 mr-1" /> Add
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {!loading && filteredActivities.length === 0 && (
                    <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
                        <p className="text-slate-500 mb-4">No activities found matching your criteria</p>
                        <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setMaxCost(200) }}>
                            Clear Filters
                        </Button>
                    </div>
                )}
            </main>

            {/* Modal */}
            {selectedActivity && (
                <AddToTripModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    item={{
                        name: selectedActivity.name,
                        city: selectedActivity.city,
                        cost: selectedActivity.cost,
                        type: 'activity'
                    }}
                />
            )}
        </div>
    )
}

export default ActivitySearch
