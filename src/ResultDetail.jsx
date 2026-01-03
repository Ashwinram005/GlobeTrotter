import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

const ResultDetail = () => {
    const { id } = useParams();

    // Mock Data
    const items = [
        {
            id: 1,
            type: 'City',
            title: 'Kyoto',
            region: 'Asia',
            price: 1800,
            rating: 5.0,
            image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
            description: 'Experience the timeless beauty of Kyoto, where ancient traditions blend seamlessly with modern life. Visit Kinkaku-ji (the Golden Pavilion), walk through the thousands of vermilion torii gates at Fushimi Inari Taisha, and witness the sublime beauty of cherry blossoms in spring.',
            itinerary: [
                {
                    day: 1,
                    activities: [
                        { name: "Arrival & Check-in", expense: "$0" },
                        { name: "Walk to Kiyomizu-dera", expense: "$5 (Entry)" },
                        { name: "Dinner in Gion", expense: "$40" }
                    ]
                },
                {
                    day: 2,
                    activities: [
                        { name: "Fushimi Inari Hike", expense: "$0" },
                        { name: "Lunch at Tea House", expense: "$25" },
                        { name: "Arashiyama Bamboo Grove Walk", expense: "$10 (Transport)" }
                    ]
                },
                {
                    day: 3,
                    activities: [
                        { name: "Kinkaku-ji Visit", expense: "$4" },
                        { name: "Nishiki Market Food Tour", expense: "$30" },
                        { name: "Departure", expense: "$0" }
                    ]
                }
            ]
        },
        {
            id: 2,
            type: 'Activity',
            title: 'Scuba Diving',
            region: 'Oceania',
            price: 150,
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
            description: 'Dive into the crystal clear waters of the Great Barrier Reef. Encounter vibrant coral gardens, sea turtles, and an explosion of marine life.',
            itinerary: [
                {
                    day: 1,
                    activities: [
                        { name: "Equipment Fitting & Training", expense: "$0 (Included)" },
                        { name: "First Open Water Dive", expense: "$0 (Included)" },
                        { name: "Seafood BBQ Lunch", expense: "$20" }
                    ]
                },
                {
                    day: 2,
                    activities: [
                        { name: "Boat Ride to Outer Reef", expense: "$0 (Included)" },
                        { name: "Deep Dive Exploration", expense: "$0 (Included)" },
                        { name: "Sunset Cruise Return", expense: "$0 (Included)" }
                    ]
                },
                {
                    day: 3,
                    activities: [
                        { name: "Morning Snorkel Session", expense: "$0 (Included)" },
                        { name: "Photo Review & Debrief", expense: "$15 (Photos)" },
                        { name: "Return to Shore", expense: "$0" }
                    ]
                }
            ]
        },
        {
            id: 3,
            type: 'City',
            title: 'Paris',
            region: 'Europe',
            price: 2400,
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
            description: 'Paris, the capital of France, is a major European city and a global center for art, fashion, gastronomy and culture. Its 19th-century cityscape is crisscrossed by wide boulevards and the River Seine.',
            itinerary: [
                { day: 1, activities: [{ name: "Eiffel Tower Visit", expense: "$30" }, { name: "Seine River Cruise", expense: "$15" }] },
                { day: 2, activities: [{ name: "Louvre Museum Tour", expense: "$20" }, { name: "Montmartre Walk", expense: "$0" }] },
                { day: 3, activities: [{ name: "Shopping at Champs-Élysées", expense: "$100+" }, { name: "Departure", expense: "$0" }] }
            ]
        },
        {
            id: 4,
            type: 'Activity',
            title: 'Safari',
            region: 'Africa',
            price: 3000,
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
            description: ' embark on an unforgettable journey through the African savannah. Witness the majestic lions, elephants, and leopards in their natural habitat.',
            itinerary: [
                { day: 1, activities: [{ name: "Arrival at Lodge", expense: "$0" }, { name: "Evening Game Drive", expense: "$0 (Included)" }] },
                { day: 2, activities: [{ name: "Full Day Safari", expense: "$0 (Included)" }, { name: "Bush Dinner", expense: "$0 (Included)" }] },
                { day: 3, activities: [{ name: "Morning Walking Safari", expense: "$0 (Included)" }, { name: "Departure", expense: "$0" }] }
            ]
        },
        {
            id: 5,
            type: 'City',
            title: 'New York',
            region: 'Americas',
            price: 2000,
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
            description: 'New York City comprises 5 boroughs sitting where the Hudson River meets the Atlantic Ocean. At its core is Manhattan, a densely populated borough that’s among the world’s major commercial, financial and cultural centers.',
            itinerary: [
                { day: 1, activities: [{ name: "Times Square Walk", expense: "$0" }, { name: "Broadway Show", expense: "$150" }] },
                { day: 2, activities: [{ name: "Central Park Bike Ride", expense: "$20" }, { name: "Met Museum", expense: "$30" }] },
                { day: 3, activities: [{ name: "Statue of Liberty Ferry", expense: "$25" }, { name: "Departure", expense: "$0" }] }
            ]
        },
        {
            id: 6,
            type: 'Activity',
            title: 'Northern Lights',
            region: 'Europe',
            price: 400,
            rating: 5.0,
            image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=80',
            description: 'Witness the aurora borealis dancing across the night sky in a display of ethereal colors. A once-in-a-lifetime experience.',
            itinerary: [
                { day: 1, activities: [{ name: "Arrival in Tromso", expense: "$0" }, { name: "Northern Lights Chase", expense: "$100" }] },
                { day: 2, activities: [{ name: "Husky Sledding", expense: "$150" }, { name: "Sauna Experience", expense: "$30" }] },
                { day: 3, activities: [{ name: "Fjord Cruise", expense: "$80" }, { name: "Departure", expense: "$0" }] }
            ]
        },
    ];

    const item = items.find(i => i.id === Number(id));

    if (!item) return <div className="p-10 text-center">Item not found</div>;

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <Navbar />

            <main>
                {/* Hero */}
                <div className="relative h-[60vh] w-full">
                    <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-12">
                        <div className="max-w-4xl text-white">
                            <span className="bg-blue-600 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">{item.type}</span>
                            <h1 className="text-6xl font-bold mb-4">{item.title}</h1>
                            <div className="flex gap-6 text-lg font-medium">
                                <span>📍 {item.region}</span>
                                <span className="text-yellow-400">★ {item.rating} (124 reviews)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Content */}
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h2 className="text-3xl font-bold mb-6">About this trip</h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                {item.description}
                            </p>
                            <p className="text-lg text-slate-600 leading-relaxed mt-4">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                        </section>

                        {/* Itinerary Section */}
                        <section>
                            <h2 className="text-3xl font-bold mb-6">Itinerary for {item.title}</h2>
                            <div className="space-y-6">
                                {item.itinerary && item.itinerary.map((dayItem) => (
                                    <div key={dayItem.day} className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                                        <div className="mb-4">
                                            <span className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">Day {dayItem.day}</span>
                                        </div>

                                        {/* Header Row */}
                                        <div className="grid grid-cols-3 gap-4 mb-2 px-2 text-sm font-bold text-slate-400 uppercase tracking-wider">
                                            <div className="col-span-2">Physical Activity</div>
                                            <div className="text-right">Expense</div>
                                        </div>

                                        <div className="space-y-4">
                                            {dayItem.activities.map((act, i) => (
                                                <div key={i} className="grid grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm items-center">
                                                    <div className="col-span-2 font-bold text-slate-700 flex items-center gap-3">
                                                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                                        {act.name}
                                                    </div>
                                                    <div className="text-right font-bold text-slate-900 bg-slate-50 py-1 px-3 rounded-lg justify-self-end">
                                                        {act.expense}
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="flex justify-center">
                                                <div className="w-0.5 h-4 bg-slate-300"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold mb-6">Gallery</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <img src={`https://picsum.photos/seed/${item.id}1/400/300`} className="rounded-2xl w-full h-48 object-cover" alt="Gallery 1" />
                                <img src={`https://picsum.photos/seed/${item.id}2/400/300`} className="rounded-2xl w-full h-48 object-cover" alt="Gallery 2" />
                                <img src={`https://picsum.photos/seed/${item.id}3/400/300`} className="rounded-2xl w-full h-48 object-cover" alt="Gallery 3" />
                                <img src={`https://picsum.photos/seed/${item.id}4/400/300`} className="rounded-2xl w-full h-48 object-cover" alt="Gallery 4" />
                            </div>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold mb-6">Reviews</h2>
                            <div className="space-y-6">
                                {[1, 2].map(r => (
                                    <div key={r} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-300"></div>
                                            <div>
                                                <p className="font-bold">Happy Traveler {r}</p>
                                                <p className="text-xs text-slate-500">2 months ago</p>
                                            </div>
                                            <div className="ml-auto text-yellow-500">★★★★★</div>
                                        </div>
                                        <p className="text-slate-600">"This was absolutely the best experience of my life! Highly recommended."</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Start from</p>
                                    <p className="text-4xl font-bold text-slate-900">${item.price}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-green-600 font-bold text-sm bg-green-50 px-2 py-1 rounded">Available</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="bg-slate-50 p-4 rounded-xl flex justify-between items-center cursor-pointer hover:bg-slate-100 transition">
                                    <span className="font-bold text-slate-600">📅 Select Dates</span>
                                    <span>→</span>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl flex justify-between items-center cursor-pointer hover:bg-slate-100 transition">
                                    <span className="font-bold text-slate-600">👥 Travelers</span>
                                    <span>2 Adults</span>
                                </div>
                            </div>

                            <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                                Book Now
                            </button>
                            <p className="text-center text-xs text-slate-400 mt-4">Free cancellation up to 48 hours before the trip.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ResultDetail;
