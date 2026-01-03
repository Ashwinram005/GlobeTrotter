import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const CreateTrip = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        destination: '',
        startDate: '',
        endDate: '',
        budget: 'Medium',
        travelers: { adults: 2, children: 0 },
        interests: []
    });

    const handleInterestToggle = (interest) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, we would save this data here.
        // For now, mock success and redirect.
        alert("Trip Created Successfully! (Mock)");
        navigate('/my-trips');
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
            <Navbar />

            <main className="max-w-4xl mx-auto p-6 md:p-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100"
                >
                    <div className="mb-10 text-center">
                        <h1 className="text-4xl font-black text-slate-900 mb-4">Plan Your Next Adventure</h1>
                        <p className="text-slate-500 text-lg">Tell us where you want to go, and we'll handle the rest.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        {/* 1. Destination */}
                        <div className="space-y-4">
                            <label className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                                Where to?
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="e.g., Tokyo, Paris, Bali..."
                                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-lg font-medium outline-none focus:border-blue-500 transition-colors"
                                value={formData.destination}
                                onChange={e => setFormData({ ...formData, destination: e.target.value })}
                            />
                        </div>

                        {/* 2. Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                                    When?
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Start</label>
                                        <input
                                            required
                                            type="date"
                                            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-medium outline-none focus:border-blue-500"
                                            value={formData.startDate}
                                            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">End</label>
                                        <input
                                            required
                                            type="date"
                                            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl font-medium outline-none focus:border-blue-500"
                                            value={formData.endDate}
                                            onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                                    Who?
                                </label>
                                <div className="flex gap-4">
                                    <div className="flex-1 bg-slate-50 p-4 rounded-xl border-2 border-slate-100 flex justify-between items-center">
                                        <span className="font-bold text-slate-600">Adults</span>
                                        <div className="flex items-center gap-3">
                                            <button type="button" onClick={() => setFormData({ ...formData, travelers: { ...formData.travelers, adults: Math.max(1, formData.travelers.adults - 1) } })} className="w-8 h-8 bg-white rounded-full text-slate-500 hover:bg-slate-200 font-bold">-</button>
                                            <span className="font-bold w-4 text-center">{formData.travelers.adults}</span>
                                            <button type="button" onClick={() => setFormData({ ...formData, travelers: { ...formData.travelers, adults: formData.travelers.adults + 1 } })} className="w-8 h-8 bg-blue-600 rounded-full text-white hover:bg-blue-700 font-bold">+</button>
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-slate-50 p-4 rounded-xl border-2 border-slate-100 flex justify-between items-center">
                                        <span className="font-bold text-slate-600">Kids</span>
                                        <div className="flex items-center gap-3">
                                            <button type="button" onClick={() => setFormData({ ...formData, travelers: { ...formData.travelers, children: Math.max(0, formData.travelers.children - 1) } })} className="w-8 h-8 bg-white rounded-full text-slate-500 hover:bg-slate-200 font-bold">-</button>
                                            <span className="font-bold w-4 text-center">{formData.travelers.children}</span>
                                            <button type="button" onClick={() => setFormData({ ...formData, travelers: { ...formData.travelers, children: formData.travelers.children + 1 } })} className="w-8 h-8 bg-blue-600 rounded-full text-white hover:bg-blue-700 font-bold">+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4. Budget */}
                        <div className="space-y-4">
                            <label className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                                Budget Style
                            </label>
                            <div className="grid grid-cols-3 gap-4">
                                {['Budget', 'Medium', 'Luxury'].map(level => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, budget: level })}
                                        className={`p-6 rounded-2xl border-2 font-bold text-lg transition-all ${formData.budget === level
                                                ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-lg shadow-blue-100 transform -translate-y-1'
                                                : 'border-slate-100 bg-white text-slate-400 hover:border-slate-300'
                                            }`}
                                    >
                                        {level === 'Budget' && '💸'}
                                        {level === 'Medium' && '💰'}
                                        {level === 'Luxury' && '💎'}
                                        <div className="mt-2 text-sm">{level}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 5. Interests */}
                        <div className="space-y-4">
                            <label className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
                                Interests
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {['Beaches', 'City', 'Adventure', 'History', 'Food', 'Nature', 'Relaxation', 'Nightlife', 'Shopping'].map(interest => (
                                    <button
                                        key={interest}
                                        type="button"
                                        onClick={() => handleInterestToggle(interest)}
                                        className={`px-6 py-3 rounded-xl font-bold transition-all border-2 ${formData.interests.includes(interest)
                                                ? 'bg-slate-800 text-white border-slate-800'
                                                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                                            }`}
                                    >
                                        {interest}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-8 border-t border-slate-100">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white text-xl font-bold py-6 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98]"
                            >
                                🚀 Create My Trip
                            </button>
                        </div>
                    </form>
                </motion.div>
            </main>
        </div>
    );
};

export default CreateTrip;
