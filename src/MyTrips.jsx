import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import {
    Calendar, MapPin, Clock, ArrowRight, LayoutGrid, Filter, ArrowUpDown, Plane
} from 'lucide-react';

// --- ANIMATED GRID SYSTEM ---
const FrameworkGrid = () => (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden h-full opacity-30">
        <motion.div
            initial={{ height: 0 }} animate={{ height: "100%" }} transition={{ duration: 1.5, ease: "easeInOut" }}
            className="w-px bg-[#0061FE]/20 absolute left-[40px] hidden md:block"
        />
        <motion.div
            initial={{ height: 0 }} animate={{ height: "100%" }} transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
            className="w-px bg-[#0061FE]/20 absolute left-[40px] md:left-[260px]"
        />
        <motion.div
            initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.5, delay: 0.1, ease: "easeInOut" }}
            className="absolute top-[180px] left-0 h-px bg-[#0061FE]/10"
        />
    </div>
);

const MyTrips = () => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [filterRegion, setFilterRegion] = useState('All');
    const [sortBy, setSortBy] = useState('Date');

    // Mock Data
    const trips = [
        {
            id: 1,
            status: 'upcoming',
            destination: 'Kyoto, Japan',
            date: 'Oct 15 - Oct 22, 2025',
            image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
            price: 1800,
            region: 'Asia',
            duration: '7 Days'
        },
        {
            id: 2,
            status: 'completed',
            destination: 'Paris, France',
            date: 'Sept 10 - Sept 15, 2025',
            image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
            price: 2400,
            region: 'Europe',
            duration: '5 Days'
        },
        {
            id: 3,
            status: 'ongoing',
            destination: 'Bali, Indonesia',
            date: 'Now',
            image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
            price: 1200,
            region: 'Asia',
            duration: '10 Days'
        },
        {
            id: 4,
            status: 'upcoming',
            destination: 'New York, USA',
            date: 'Dec 01 - Dec 05, 2025',
            image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
            price: 2000,
            region: 'Americas',
            duration: '5 Days'
        },
        {
            id: 5,
            status: 'completed',
            destination: 'Cape Town, South Africa',
            date: 'Aug 01 - Aug 10, 2025',
            image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e27?auto=format&fit=crop&w=1200&q=80',
            price: 1500,
            region: 'Africa',
            duration: '10 Days'
        }
    ];

    const filteredTrips = trips
        .filter(t => t.status === activeTab)
        .filter(t => filterRegion === 'All' || t.region === filterRegion)
        .sort((a, b) => {
            if (sortBy === "Price") return a.price - b.price;
            if (sortBy === "Duration") return parseInt(a.duration) - parseInt(b.duration);
            return 0;
        });

    return (
        <div className="min-h-screen bg-[#F7F5F2] font-sans text-[#1E1E1E] selection:bg-[#C2E812] selection:text-black overflow-x-hidden relative">
            <Navbar />
            <FrameworkGrid />

            {/* --- HERO SECTION --- */}
            <div className="pt-32 pb-12 px-6 relative overflow-hidden">
                <div className="w-full max-w-7xl mx-auto relative z-10 text-left">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-[#1E1E1E] rounded-2xl">
                                <Plane className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#1E1E1E]">
                                My Trips
                            </h1>
                        </div>
                        <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-2xl leading-relaxed">
                            Manage your adventures. Track your history. Plan your next escape.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="w-full max-w-7xl mx-auto px-6 pb-24 relative z-20 space-y-8">

                {/* --- CONTROLS BAR --- */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
                    {/* TABS */}
                    <div className="flex gap-2 p-1.5 bg-white border border-gray-200 rounded-2xl shadow-sm">
                        {['ongoing', 'upcoming', 'completed'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2.5 rounded-xl font-bold capitalize transition-all border-2 ${activeTab === tab
                                        ? 'bg-[#1E1E1E] text-white border-[#1E1E1E] shadow-md'
                                        : 'bg-transparent text-gray-500 border-transparent hover:bg-gray-100'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* FILTERS */}
                    <div className="flex flex-wrap gap-4">
                        <div className="bg-white px-4 py-2.5 rounded-xl border-2 border-[#1E1E1E] flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                            <Filter className="w-4 h-4 text-[#1E1E1E]" />
                            <span className="text-sm font-black text-[#1E1E1E] uppercase tracking-wider">Region</span>
                            <div className="w-px h-4 bg-gray-300"></div>
                            <select
                                value={filterRegion}
                                onChange={(e) => setFilterRegion(e.target.value)}
                                className="bg-transparent font-bold outline-none cursor-pointer text-[#1E1E1E]"
                            >
                                <option value="All">All Regions</option>
                                <option value="Europe">Europe</option>
                                <option value="Asia">Asia</option>
                                <option value="Americas">Americas</option>
                                <option value="Africa">Africa</option>
                            </select>
                        </div>

                        <div className="bg-white px-4 py-2.5 rounded-xl border-2 border-[#1E1E1E] flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                            <ArrowUpDown className="w-4 h-4 text-[#1E1E1E]" />
                            <span className="text-sm font-black text-[#1E1E1E] uppercase tracking-wider">Sort</span>
                            <div className="w-px h-4 bg-gray-300"></div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent font-bold outline-none cursor-pointer text-[#1E1E1E]"
                            >
                                <option value="Date">Date</option>
                                <option value="Price">Price</option>
                                <option value="Duration">Duration</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* --- TRIP GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    <AnimatePresence mode="popLayout">
                        {filteredTrips.map((trip, index) => (
                            <TripCard key={trip.id} trip={trip} index={index} />
                        ))}
                    </AnimatePresence>
                </div>

                {/* --- EMPTY STATE --- */}
                {filteredTrips.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="bg-white border-[3px] border-dashed border-[#1E1E1E] rounded-[2.5rem] p-16 text-center shadow-sm"
                    >
                        <div className="w-24 h-24 bg-[#F7F5F2] rounded-full flex items-center justify-center mx-auto mb-6 border-[3px] border-[#1E1E1E]">
                            <LayoutGrid className="w-12 h-12 text-[#1E1E1E]" />
                        </div>
                        <h3 className="text-3xl font-black text-[#1E1E1E] mb-2">No trips found</h3>
                        <p className="text-lg font-bold text-gray-500 mb-8 max-w-md mx-auto">
                            You don't have any {activeTab} trips in this region. Time to plan something new?
                        </p>
                        <Link to="/">
                            <button className="bg-[#1E1E1E] text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-[#0061FE] transition-all shadow-[4px_4px_0px_0px_black] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_black]">
                                Start Planning
                            </button>
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

// --- TRIP CARD COMPONENT ---
const TripCard = ({ trip, index }) => {
    const rotation = index % 2 === 0 ? 1 : -1;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.1, type: "spring", bounce: 0.2 }}
            whileHover={{ y: -10, rotate: 0 }}
            className="relative flex flex-col bg-white rounded-[2rem] border-[3px] border-[#1E1E1E] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden group h-full"
            style={{ rotate: `${rotation}deg` }}
        >
            {/* Banner Image */}
            <div className="h-56 relative overflow-hidden border-b-[3px] border-[#1E1E1E]">
                <img
                    src={trip.image}
                    alt={trip.destination}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>

                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                    {trip.status === 'ongoing' && (
                        <span className="bg-[#C2E812] text-[#1E1E1E] px-3 py-1 font-black uppercase text-xs border-2 border-black shadow-[2px_2px_0px_0px_black] animate-pulse">
                            Live Now
                        </span>
                    )}
                    {trip.status === 'upcoming' && (
                        <span className="bg-white text-[#0061FE] px-3 py-1 font-black uppercase text-xs border-2 border-black shadow-[2px_2px_0px_0px_black]">
                            Upcoming
                        </span>
                    )}
                    {trip.status === 'completed' && (
                        <span className="bg-gray-100 text-gray-500 px-3 py-1 font-black uppercase text-xs border-2 border-black">
                            Completed
                        </span>
                    )}
                </div>

                {/* Price Tag */}
                <div className="absolute bottom-4 right-4 bg-[#1E1E1E] text-white px-4 py-1.5 font-bold rounded-lg border-2 border-white/20 shadow-lg backdrop-blur-sm">
                    ${trip.price}
                </div>
            </div>

            {/* Content */}
            <div className="p-8 flex-1 flex flex-col">
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-5 h-5 text-[#0061FE]" />
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">{trip.region}</span>
                    </div>
                    <h2 className="text-3xl font-black leading-tight text-[#1E1E1E] group-hover:text-[#0061FE] transition-colors">
                        {trip.destination}
                    </h2>
                </div>

                <div className="flex flex-col gap-3 mb-8">
                    <div className="flex items-center gap-3 text-gray-700 font-bold bg-gray-50 p-2 rounded-lg border border-gray-100">
                        <Calendar className="w-5 h-5 text-[#1E1E1E]" />
                        {trip.date}
                    </div>
                    <div className="flex items-center gap-3 text-gray-700 font-bold bg-gray-50 p-2 rounded-lg border border-gray-100">
                        <Clock className="w-5 h-5 text-[#1E1E1E]" />
                        {trip.duration}
                    </div>
                </div>

                <div className="mt-auto pt-6 border-t-[3px] border-dashed border-[#1E1E1E]/10 flex gap-3">
                    <button className="flex-1 px-4 py-3 rounded-xl font-bold border-2 border-[#1E1E1E] text-[#1E1E1E] hover:bg-gray-100 transition text-center">
                        Itinerary
                    </button>
                    <button className="flex-1 px-4 py-3 rounded-xl font-bold bg-[#1E1E1E] text-white hover:bg-[#0061FE] transition shadow-[3px_3px_0px_0px_black] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_0px_black] text-center flex items-center justify-center gap-2">
                        {trip.status === 'completed' ? 'Review' : 'Manage'}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default MyTrips;
