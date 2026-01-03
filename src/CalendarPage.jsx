import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

const CalendarPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 1)); // Start Oct 2025 for demo

    // Mock Data (Consistent with MyTrips)
    const events = [
        { title: 'Kyoto Trip', date: new Date(2025, 9, 15), duration: 7, color: 'bg-blue-500' },
        { title: 'Paris Trip', date: new Date(2025, 8, 10), duration: 5, color: 'bg-purple-500' }, // Sept
        { title: 'Bali Trip', date: new Date(2025, 9, 5), duration: 10, color: 'bg-emerald-500' }, // Oct (Overlap demo)
        { title: 'New York Trip', date: new Date(2025, 11, 1), duration: 5, color: 'bg-indigo-500' }, // Dec
    ];

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    const days = [];
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const getEventsForDay = (date) => {
        if (!date) return [];
        return events.filter(event => {
            const eventEnd = new Date(event.date);
            eventEnd.setDate(eventEnd.getDate() + event.duration);
            return date >= event.date && date < eventEnd;
        });
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
            <Navbar />

            <main className="max-w-6xl mx-auto p-6 space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">
                            {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                        </h1>
                        <p className="text-slate-500 font-medium">Plan your journey ahead</p>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={prevMonth} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-600 transition">←</button>
                        <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 font-bold text-blue-600 transition">Today</button>
                        <button onClick={nextMonth} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-600 transition">→</button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 mb-4 text-center">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-sm font-bold text-slate-400 uppercase tracking-wider py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days */}
                    <div className="grid grid-cols-7 gap-4">
                        {days.map((date, index) => {
                            const dayEvents = getEventsForDay(date);
                            return (
                                <motion.div
                                    key={index}
                                    layout
                                    className={`min-h-[120px] p-3 rounded-2xl border ${date ? 'bg-slate-50 border-slate-100 hover:border-blue-300 transition-colors' : 'bg-transparent border-transparent'
                                        }`}
                                >
                                    {date && (
                                        <>
                                            <span className={`font-bold text-lg ${date.toDateString() === new Date().toDateString()
                                                    ? 'bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-full shadow-md shadow-blue-200'
                                                    : 'text-slate-400'
                                                }`}>
                                                {date.getDate()}
                                            </span>

                                            <div className="mt-2 space-y-1">
                                                {dayEvents.map((event, idx) => (
                                                    <div key={idx} className={`${event.color} text-white text-xs font-bold px-2 py-1.5 rounded-lg shadow-sm truncate`}>
                                                        {event.title}
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CalendarPage;
