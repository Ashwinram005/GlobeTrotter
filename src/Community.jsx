import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import Navbar from "./Navbar";
import { toast, Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar, MapPin, Loader2, X, ArrowRight, Hexagon, LayoutGrid, Star
} from "lucide-react";

// --- ANIMATED GRID SYSTEM (THE "FRAMEWORK") ---
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

// --- MOCK DATA ---
const MOCK_FEEDBACKS = [
    {
        id: 1,
        title: "Hidden Gems of Kyoto",
        location: "Kyoto, Japan",
        author: "Sarah Jenkins",
        rating: 5,
        date: "2024-11-15",
        description: "The bamboo forest was crowded, but the smaller temples in the north were absolutely magical. I highly recommend...",
        full_review: "The bamboo forest was crowded, but the smaller temples in the north were absolutely magical. I highly recommend renting a bike and exploring the Arashiyama area early in the morning. The food at the local market was also a highlight! 10/10 would visit again."
    },
    {
        id: 2,
        title: "Backpacking Vietnam",
        location: "Hanoi, Vietnam",
        author: "Mike Ross",
        rating: 4,
        date: "2025-01-10",
        description: "Ha Long Bay is a must-see, but be careful with the tour operators. Some are very touristy.",
        full_review: "Ha Long Bay is a must-see, but be careful with the tour operators. We found a smaller boat tour that took us to less crowded caves. The street food in Hanoi is unbeatable - don't miss the Egg Coffee!"
    },
    {
        id: 3,
        title: "Iceland Road Trip",
        location: "Reykjavik, Iceland",
        author: "Emma Stone",
        rating: 5,
        date: "2024-12-05",
        description: "Driving the Ring Road was the experience of a lifetime. The waterfalls are even bigger in person.",
        full_review: "Driving the Ring Road was the experience of a lifetime. The waterfalls are even bigger in person. We saw the Northern Lights two nights in a row near Vik. Make sure to rent a 4x4 if you plan to go in winter!"
    },
    {
        id: 4,
        title: "Paris on a Budget",
        location: "Paris, France",
        author: "David Kim",
        rating: 3,
        date: "2024-10-20",
        description: "Beautiful city, but very expensive. The metro is confusing for beginners.",
        full_review: "Beautiful city, but very expensive. The metro is confusing for beginners. However, the museums are world-class. If you're under 26 and an EU resident, many are free!"
    }
];

const PAST_TRIPS_Gallery = [
    {
        id: 1,
        title: "Swiss Alps Hike",
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2071&auto=format&fit=crop",
        date: "August 2024",
    },
    {
        id: 2,
        title: "Santorini Sunset",
        image: "https://images.unsplash.com/photo-1613395877344-13d4c2ce5d5d?q=80&w=2070&auto=format&fit=crop",
        date: "July 2024",
    },
    {
        id: 3,
        title: "NYC City Break",
        image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop",
        date: "Summer 2024",
    },
    {
        id: 4,
        title: "Safari Adventure",
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop",
        date: "September 2024",
    }
];

// --- MAIN COMPONENT ---

export default function Community() {
    const { user } = useAuth();
    const [feedbacks, setFeedbacks] = useState(MOCK_FEEDBACKS);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % PAST_TRIPS_Gallery.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div className="min-h-screen bg-[#F7F5F2] font-sans text-[#1E1E1E] selection:bg-[#C2E812] selection:text-black overflow-x-hidden relative">
                <Navbar />
                <Toaster position="bottom-right" toastOptions={{ style: { background: '#1E1E1E', color: '#fff' } }} />

                {/* --- ANIMATED BLUE GRID LINES --- */}
                <FrameworkGrid />

                {/* --- HERO SECTION --- */}
                <div className="pt-32 pb-12 px-6 relative overflow-hidden">
                    <div className="w-full max-w-7xl mx-auto relative z-10 text-left">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-[#1E1E1E] rounded-2xl">
                                    <LayoutGrid className="w-8 h-8 text-white" />
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#1E1E1E]">
                                    Community Feedback
                                </h1>
                            </div>
                            <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-2xl leading-relaxed">
                                Real experiences, honest reviews. See what the community is saying about their recent trips.
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* --- CONTENT GRID --- */}
                <div className="w-full max-w-7xl mx-auto px-6 pb-24 relative z-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {feedbacks.map((feedback, index) => (
                            <FeedbackCard
                                key={feedback.id}
                                feedback={feedback}
                                index={index}
                                onViewDetails={() => setSelectedFeedback(feedback)}
                            />
                        ))}
                    </div>
                </div>

                {/* --- FEATURED GALLERY --- */}
                <div className="w-full max-w-7xl mx-auto px-6 pb-24 relative">
                    <div className="mb-12">
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#1E1E1E] mb-4">
                            Featured Moments
                        </h2>
                        <p className="text-lg font-medium text-gray-500 max-w-xl">
                            Highlights from the community's travels this month.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Main Big Image */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="lg:col-span-2 relative h-[400px] rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 bg-white group"
                        >
                            <div className="absolute inset-0 bg-[#F2F2F2]">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={currentImageIndex}
                                        src={PAST_TRIPS_Gallery[currentImageIndex].image}
                                        alt={PAST_TRIPS_Gallery[currentImageIndex].title}
                                        initial={{ opacity: 0, scale: 1.05 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.6 }}
                                        className="w-full h-full object-cover"
                                    />
                                </AnimatePresence>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end h-full">
                                <h3 className="text-2xl font-bold text-white mb-1">{PAST_TRIPS_Gallery[currentImageIndex].title}</h3>
                                <div className="flex items-center gap-2 font-medium text-white/80">
                                    <Calendar className="w-4 h-4" />
                                    {PAST_TRIPS_Gallery[currentImageIndex].date}
                                </div>
                            </div>
                        </motion.div>

                        {/* Grid of smaller photos */}
                        <div className="grid grid-cols-2 gap-4 h-[400px]">
                            {PAST_TRIPS_Gallery.slice(0, 4).map((event, index) => (
                                <div
                                    key={index}
                                    className={`relative rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-gray-100 ${currentImageIndex === index ? 'ring-2 ring-[#0061FE]' : ''}`}
                                    onClick={() => setCurrentImageIndex(index)}
                                >
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            {/* --- REVIEW MODAL --- */}
            <AnimatePresence>
                {selectedFeedback && <ReviewModal feedback={selectedFeedback} onClose={() => setSelectedFeedback(null)} />}
            </AnimatePresence>
        </>
    );
}

// --- SUB COMPONENTS ---

const FeedbackCard = ({ feedback, index, onViewDetails }) => {
    const rotation = index % 2 === 0 ? 1 : -1;

    return (
        <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1, type: "spring", bounce: 0.2 }}
            whileHover={{ y: -10, rotate: 0 }}
            className="relative flex flex-col bg-white rounded-[2rem] border-[3px] border-[#1E1E1E] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden cursor-pointer group"
            style={{ rotate: `${rotation}deg` }}
            onClick={onViewDetails}
        >
            {/* Banner */}
            <div className="h-40 bg-[#F2F2F2] relative overflow-hidden flex items-center justify-center border-b-[3px] border-[#1E1E1E]">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
                <div className={`absolute w-32 h-32 rounded-full mix-blend-multiply opacity-90 ${index % 2 === 0 ? 'bg-[#C2E812] -right-8 -top-8' : 'bg-[#0061FE] -left-8 -bottom-8'}`}></div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="text-5xl font-black text-[#1E1E1E]">{feedback.rating}/5</div>
                    <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < feedback.rating ? 'text-[#1E1E1E] fill-[#1E1E1E]' : 'text-gray-300'}`} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-8 flex-1 flex flex-col bg-white">
                <h2 className="text-2xl font-black leading-tight mb-2 text-[#1E1E1E] tracking-tight group-hover:text-[#0061FE] transition-colors text-left">
                    {feedback.title}
                </h2>
                <div className="flex items-center gap-2 mb-6 text-sm font-bold text-gray-400 uppercase tracking-widest text-left">
                    <span>by {feedback.author}</span>
                    <span>•</span>
                    <span>{feedback.date}</span>
                </div>

                <div className="flex flex-col gap-2 mb-6 text-left">
                    <div className="flex items-center gap-2 text-gray-600 font-bold">
                        <MapPin className="w-5 h-5 text-[#0061FE]" />
                        {feedback.location}
                    </div>
                </div>

                <p className="text-[#1E1E1E] text-lg font-medium leading-relaxed mb-8 text-left line-clamp-3">
                    "{feedback.description}"
                </p>

                <div className="mt-auto pt-6 border-t-[3px] border-dashed border-[#1E1E1E]/20 text-left">
                    <button className="flex items-center gap-2 font-black text-[#1E1E1E] group-hover:text-[#0061FE]">
                        <span className="text-lg">Read Full Review</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const ReviewModal = ({ feedback, onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1E1E]/90 backdrop-blur-md"
            onClick={onClose}
        >
            <div className="relative w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <motion.div
                    initial={{ rotate: 0, scale: 0.9, y: 0 }}
                    animate={{ rotate: -2, scale: 0.95, y: 5 }}
                    className="absolute inset-0 bg-white rounded-[2rem] border-[3px] border-[#1E1E1E] shadow-2xl"
                />
                <motion.div
                    initial={{ y: 100, scale: 0.8 }}
                    animate={{ y: 0, scale: 1 }}
                    exit={{ y: 100, scale: 0.8 }}
                    className="relative bg-white rounded-[2rem] border-[4px] border-[#1E1E1E] shadow-2xl overflow-hidden max-h-[80vh] overflow-y-auto"
                >
                    <div className="bg-[#1E1E1E] p-6 text-white flex justify-between items-start sticky top-0 z-10">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Hexagon className="w-5 h-5 text-[#C2E812] fill-[#C2E812]" />
                                <span className="text-xs font-black uppercase tracking-widest text-[#C2E812]">Verified Review</span>
                            </div>
                            <h3 className="text-2xl font-black leading-tight">{feedback.title}</h3>
                        </div>
                        <button onClick={onClose} className="bg-white/20 p-2 rounded-full hover:bg-white/40 transition">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-8 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
                        <div className="flex items-center justify-between mb-8 pb-8 border-b border-dashed border-gray-300">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-black text-xl">
                                    {feedback.author[0]}
                                </div>
                                <div>
                                    <div className="font-bold text-lg">{feedback.author}</div>
                                    <div className="text-sm text-gray-500">{feedback.date}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex gap-1 mb-1 justify-end">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-5 h-5 ${i < feedback.rating ? 'text-[#0061FE] fill-[#0061FE]' : 'text-gray-300'}`} />
                                    ))}
                                </div>
                                <div className="font-bold text-[#0061FE]">{feedback.location}</div>
                            </div>
                        </div>

                        <div className="prose prose-lg max-w-none text-[#1E1E1E]">
                            <p className="font-medium text-xl leading-relaxed">
                                {feedback.full_review}
                            </p>
                        </div>

                        <div className="mt-12 flex gap-4">
                            <button className="flex-1 bg-[#1E1E1E] text-white py-4 rounded-xl font-bold hover:bg-[#0061FE] transition shadow-lg">
                                Helpful
                            </button>
                            <button className="flex-1 border-2 border-[#1E1E1E] py-4 rounded-xl font-bold hover:bg-gray-50 transition">
                                Comment
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
