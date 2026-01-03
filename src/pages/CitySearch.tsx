import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, MapPin, TrendingUp, DollarSign, Plus, Loader } from 'lucide-react'
import { Navbar } from '../components/layout/Navbar'
import { Button } from '../components/common/UI'
import { AddToTripModal } from '../components/common/AddToTripModal'
import { fetchCities, type City } from '../services/travelApi'

const CitySearch: React.FC = () => {
    const [cities, setCities] = useState<City[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedRegion, setSelectedRegion] = useState('all')
    const [sortBy, setSortBy] = useState('popularity')
    const [selectedCity, setSelectedCity] = useState<City | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        loadCities()
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery) {
                handleSearch()
            } else {
                loadCities()
            }
        }, 500) // Debounce search

        return () => clearTimeout(timer)
    }, [searchQuery])

    const loadCities = async () => {
        setLoading(true)
        const data = await fetchCities()
        setCities(data)
        setLoading(false)
    }

    const handleSearch = async () => {
        setLoading(true)
        const { searchCities } = await import('../services/travelApi')
        const data = await searchCities(searchQuery)
        setCities(data)
        setLoading(false)
    }

    const filteredCities = cities
        .filter(city => {
            // If we have a query, the API already filtered it
            if (searchQuery) return true

            const matchesSearch = city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                city.country.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesRegion = selectedRegion === 'all' || city.region === selectedRegion
            return matchesSearch && matchesRegion
        })
        .sort((a, b) => {
            if (sortBy === 'popularity') return b.popularity - a.popularity
            if (sortBy === 'cost-low') return a.costIndex - b.costIndex
            if (sortBy === 'cost-high') return b.costIndex - a.costIndex
            return 0
        })

    const regions = ['all', ...Array.from(new Set(cities.map(c => c.region)))]

    const getCostLabel = (costIndex: number) => {
        if (costIndex < 50) return 'Budget-Friendly'
        if (costIndex < 75) return 'Moderate'
        return 'Premium'
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-24 pb-12 space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-4xl font-display font-bold text-slate-900">Discover Cities</h1>
                    <p className="text-slate-500 mt-1">Find and add amazing destinations to your trip</p>
                </div>

                {/* Search & Filters */}
                <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by city or country..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                            />
                        </div>

                        {/* Region Filter */}
                        <select
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                            className="px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-medium outline-none focus:ring-4 focus:ring-primary-500/10 cursor-pointer"
                        >
                            {regions.map(region => (
                                <option key={region} value={region}>
                                    {region === 'all' ? 'All Regions' : region}
                                </option>
                            ))}
                        </select>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-medium outline-none focus:ring-4 focus:ring-primary-500/10 cursor-pointer"
                        >
                            <option value="popularity">Sort by: Popularity</option>
                            <option value="cost-low">Sort by: Cost (Low)</option>
                            <option value="cost-high">Sort by: Cost (High)</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Filter className="w-4 h-4" />
                        <span>{filteredCities.length} cities found</span>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader className="w-8 h-8 animate-spin text-primary-600" />
                        <span className="ml-3 text-slate-600">Loading cities from around the world...</span>
                    </div>
                )}

                {/* Results */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCities.map((city, idx) => (
                            <motion.div
                                key={city.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 group hover:shadow-2xl transition-all"
                            >
                                {/* Flag Image */}
                                <div className="h-48 overflow-hidden relative bg-slate-100">
                                    <img
                                        src={city.image}
                                        alt={`${city.country} flag`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-primary-600">
                                        {getCostLabel(city.costIndex)}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-1">{city.name}</h3>
                                        <p className="text-sm text-slate-500 flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4" /> {city.country}, {city.region}
                                        </p>
                                    </div>

                                    <p className="text-sm text-slate-600 line-clamp-2">{city.description}</p>

                                    {/* Stats */}
                                    <div className="flex gap-4 pt-2 border-t border-slate-100">
                                        <div className="flex items-center gap-1.5 text-sm">
                                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                                            <span className="text-slate-600">Pop: <span className="font-bold text-emerald-600">{city.popularity}%</span></span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-sm">
                                            <DollarSign className="w-4 h-4 text-orange-600" />
                                            <span className="text-slate-600">Cost: <span className="font-bold text-orange-600">{city.costIndex}</span></span>
                                        </div>
                                    </div>

                                    {/* Add Button */}
                                    <Button
                                        onClick={() => {
                                            setSelectedCity(city)
                                            setIsModalOpen(true)
                                        }}
                                        className="w-full rounded-2xl py-3"
                                    >
                                        <Plus className="w-5 h-5 mr-2" /> Add to Trip
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                {selectedCity && (
                    <AddToTripModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        item={{
                            name: selectedCity.name,
                            type: 'city'
                        }}
                    />
                )}

                {!loading && filteredCities.length === 0 && (
                    <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
                        <p className="text-slate-500 mb-4">No cities found matching your criteria</p>
                        <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedRegion('all') }}>
                            Clear Filters
                        </Button>
                    </div>
                )}
            </main>
        </div>
    )
}

export default CitySearch
