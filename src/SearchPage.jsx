import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import {
    Search, Filter, MapPin, Tag, SlidersHorizontal, ArrowRight, LayoutGrid
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

const SearchPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("All");
    const [filterPrice, setFilterPrice] = useState(5000);
    const [sortBy, setSortBy] = useState("Recommended");
    const [groupBy, setGroupBy] = useState("None");

    // Mock Data (Preserved)
    const items = [
        { id: 1, type: 'City', title: 'Kyoto', region: 'Asia', price: 1800, rating: 5.0, image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80', description: 'Ancient traditions meet modern life.' },
        { id: 2, type: 'Activity', title: 'Scuba Diving', region: 'Oceania', price: 150, rating: 4.8, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80', description: 'Explore the Great Barrier Reef.' },
        { id: 3, type: 'City', title: 'Paris', region: 'Europe', price: 2400, rating: 4.7, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80', description: 'The city of lights and love.' },
        { id: 4, type: 'Activity', title: 'Safari', region: 'Africa', price: 3000, rating: 4.9, image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80', description: 'Wildlife adventure in the Savannah.' },
        { id: 5, type: 'City', title: 'New York', region: 'Americas', price: 2000, rating: 4.6, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80', description: 'The concrete jungle that never sleeps.' },
        { id: 6, type: 'Activity', title: 'Northern Lights', region: 'Europe', price: 400, rating: 5.0, image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=80', description: 'Magical aurora borealis experience.' },
    ];

    // Filtering & Sorting Logic
    const filteredItems = items
        .filter(item => (category === "All" || item.type === category))
        .filter(item => item.price <= filterPrice)
        .filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === "Price Low-High") return a.price - b.price;
            if (sortBy === "Price High-Low") return b.price - a.price;
            if (sortBy === "Rating") return b.rating - a.rating;
            return 0; // Recommended default
        });

    // Grouping Logic
    const groupedItems = groupBy === "None"
        ? { "Results": filteredItems }
        : filteredItems.reduce((acc, item) => {
            (acc[item.region] = acc[item.region] || []).push(item);
            return acc;
        }, {});

    return (
        <div className="min-h-screen bg-[#F7F5F2] font-sans text-[#1E1E1E] selection:bg-[#C2E812] selection:text-black overflow-x-hidden relative">
            <Navbar />
            <FrameworkGrid />

            <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)] pt-20 relative z-10">
                {/* --- SIDEBAR CONTROLS --- */}
                <aside className="w-full md:w-80 p-6 md:p-8 border-b md:border-b-0 md:border-r-[3px] border-[#1E1E1E] bg-[#F7F5F2]/80 backdrop-blur-sm z-40 sticky top-20 h-auto md:h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="mb-8 flex items-center gap-2">
                        <SlidersHorizontal className="w-6 h-6 text-[#1E1E1E]" />
                        <h2 className="text-2xl font-black text-[#1E1E1E] tracking-tight">FILTERS</h2>
                    </div>

                    {/* Search */}
                    <div className="mb-8">
                        <label className="text-xs font-black text-[#1E1E1E] uppercase tracking-wider mb-2 block">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="City or Activity..."
                                className="w-full pl-10 pr-4 py-3 bg-white border-[2px] border-[#1E1E1E] rounded-xl font-bold outline-none focus:ring-4 focus:ring-[#C2E812]/50 transition-all shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Type Category */}
                    <div className="mb-8">
                        <label className="text-xs font-black text-[#1E1E1E] uppercase tracking-wider mb-2 block">Type</label>
                        <div className="flex flex-col gap-2">
                            {['All', 'City', 'Activity'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setCategory(t)}
                                    className={`w-full py-3 px-4 rounded-xl text-left font-black transition-all border-[2px] flex justify-between items-center ${category === t
                                            ? 'bg-[#1E1E1E] text-white border-[#1E1E1E] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]'
                                            : 'bg-white text-gray-500 border-[#1E1E1E] hover:bg-gray-50'
                                        }`}
                                >
                                    {t}
                                    {category === t && <div className="w-2 h-2 bg-[#C2E812] rounded-full"></div>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="mb-8">
                        <div className="flex justify-between mb-2">
                            <label className="text-xs font-black text-[#1E1E1E] uppercase tracking-wider">Max Price</label>
                            <span className="font-black text-[#0061FE] text-lg">${filterPrice}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="5000"
                            step="100"
                            value={filterPrice}
                            onChange={(e) => setFilterPrice(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1E1E1E]"
                        />
                    </div>

                    {/* Sort & Group */}
                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-black text-[#1E1E1E] uppercase tracking-wider mb-2 block">Sort By</label>
                            <div className="relative">
                                <select
                                    className="w-full p-3 bg-white border-[2px] border-[#1E1E1E] rounded-xl outline-none font-bold cursor-pointer appearance-none"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="Recommended">Recommended</option>
                                    <option value="Price Low-High">Price: Low to High</option>
                                    <option value="Price High-Low">Price: High to Low</option>
                                    <option value="Rating">Top Rated</option>
                                </select>
                                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-[#1E1E1E]" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-black text-[#1E1E1E] uppercase tracking-wider mb-2 block">Group By</label>
                            <div className="relative">
                                <select
                                    className="w-full p-3 bg-white border-[2px] border-[#1E1E1E] rounded-xl outline-none font-bold cursor-pointer appearance-none"
                                    value={groupBy}
                                    onChange={(e) => setGroupBy(e.target.value)}
                                >
                                    <option value="None">None</option>
                                    <option value="Region">Region</option>
                                </select>
                                <LayoutGrid className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-[#1E1E1E]" />
                            </div>
                        </div>
                    </div>
                </aside>

                {/* --- RESULTS AREA --- */}
                <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                    <div className="max-w-6xl mx-auto space-y-12 pb-24">
                        {Object.keys(groupedItems).map((group, groupIndex) => (
                            <div key={group}>
                                {groupBy !== "None" && (
                                    <div className="flex items-center gap-4 mb-8">
                                        <h2 className="text-3xl font-black text-[#1E1E1E] tracking-tight">{group}</h2>
                                        <div className="h-px bg-[#1E1E1E]/20 flex-1"></div>
                                        <span className="font-mono font-bold text-[#0061FE] bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                                            {groupedItems[group].length} Results
                                        </span>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                                    <AnimatePresence mode="popLayout">
                                        {groupedItems[group].map((item, index) => (
                                            <ResultCard key={item.id} item={item} index={index} />
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ))}

                        {/* Empty State */}
                        {filteredItems.length === 0 && (
                            <div className="col-span-full py-20 text-center border-[3px] border-dashed border-[#1E1E1E]/20 rounded-[2.5rem]">
                                <div className="text-6xl mb-4 opacity-50">🔍</div>
                                <p className="text-2xl font-black text-[#1E1E1E] mb-2">No results found</p>
                                <p className="text-lg font-bold text-gray-500">Try adjusting your filters or search term.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

// --- RESULT CARD COMPONENT ---
const ResultCard = ({ item, index }) => {
    const rotation = index % 2 === 0 ? 1 : -1;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -8, rotate: 0 }}
            className="group relative flex flex-col bg-white rounded-[2rem] border-[3px] border-[#1E1E1E] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden cursor-pointer h-full"
            style={{ rotate: `${rotation}deg` }}
        >
            <div className="h-48 relative overflow-hidden border-b-[3px] border-[#1E1E1E]">
                <div className="absolute top-4 left-4 z-10">
                    <span className={`px-3 py-1 font-black uppercase text-xs border-2 border-black shadow-[2px_2px_0px_0px_black] ${item.type === 'City' ? 'bg-[#C2E812] text-[#1E1E1E]' : 'bg-[#0061FE] text-white'
                        }`}>
                        {item.type}
                    </span>
                </div>
                <img
                    src={item.image}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={item.title}
                />
                <div className="absolute bottom-4 right-4 bg-[#1E1E1E] text-white px-3 py-1 font-bold rounded-lg border-2 border-white/20 text-sm">
                    ${item.price}
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-black text-2xl text-[#1E1E1E] leading-tight group-hover:text-[#0061FE] transition-colors">{item.title}</h3>
                    <div className="flex items-center gap-1 font-black text-[#1E1E1E] bg-yellow-100 px-2 py-1 rounded-md text-xs border border-yellow-300">
                        <span>★</span> {item.rating}
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <MapPin className="w-3 h-3" />
                    {item.region}
                </div>

                <p className="text-gray-600 font-medium text-sm mb-6 line-clamp-2 leading-relaxed">
                    {item.description}
                </p>

                <div className="mt-auto pt-4 border-t-[3px] border-dashed border-[#1E1E1E]/10">
                    <Link to={`/explore/${item.id}`}>
                        <button className="w-full py-3 rounded-xl font-bold bg-[#F2F2F2] group-hover:bg-[#1E1E1E] text-[#1E1E1E] group-hover:text-white transition-all flex items-center justify-center gap-2">
                            View Details
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default SearchPage;
