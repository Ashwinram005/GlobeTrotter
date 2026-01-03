import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const Dashboard = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100">
      <Navbar />

      <main className="max-w-6xl mx-auto p-6 space-y-16">
        {/* 2. Hero Section with Zoom Effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative h-[500px] w-full rounded-[2rem] overflow-hidden shadow-xl shadow-blue-100 group"
        >
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
            alt="Beach"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-16">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white text-7xl font-bold mb-6 leading-tight"
            >
              Discover your <br />drum escape.
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-blue-100 text-xl max-w-lg"
            >
              Plan your next adventure with GlobalTrotter's premium trip planner. Experience luxury, comfort, and unforgettable memories.
            </motion.p>
          </div>
        </motion.div>

        {/* 3. Floating Search Bar */}
        <div className="relative -mt-28 z-10 max-w-4xl mx-auto px-4">
          <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-4 border border-white/50">
            <div className="flex-grow flex items-center bg-slate-50 rounded-2xl px-6 border border-slate-100 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <span className="text-2xl mr-4">🔍</span>
              <input
                type="text"
                placeholder="Where is your next destination?"
                className="bg-transparent w-full py-5 outline-none font-medium placeholder:text-slate-400"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-300 transition-all active:scale-95">
              Search
            </button>
          </div>
        </div>

        {/* 3.5 Why Choose Us */}
        <section className="py-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Why Travel with GlobalTrotter?</h3>
            <p className="text-slate-500">We ensure every trip is a masterpiece of memories.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "🛡️", title: "Secure Booking", desc: "Your safety involves top-tier security standards." },
              { icon: "💎", title: "Premium Hotels", desc: "Access to world-class 5-star accommodations." },
              { icon: "🎧", title: "24/7 Support", desc: "We are here for you, anytime, anywhere." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg text-center"
              >
                <div className="text-5xl mb-6 bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto">{feature.icon}</div>
                <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                <p className="text-slate-500">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. Top Regional Selections (Refined) */}
        <section>
          <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
            Explore by Region <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['Europe', 'Asia', 'Africa', 'Americas', 'Oceania'].map((region, i) => (
              <motion.div
                key={region}
                whileHover={{ y: -5, opacity: 0.8 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2rem] text-white text-center cursor-pointer shadow-xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-2 opacity-10 text-6xl font-black group-hover:scale-150 transition-transform">
                  {region[0]}
                </div>
                <div className="text-4xl mb-3 relative z-10 transition-transform group-hover:rotate-12">map</div>
                <span className="font-bold relative z-10">{region}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 5. Popular Destinations (Detailed Cards) */}
        <section className="pb-12">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h3 className="text-3xl font-bold mb-2">Popular Destinations</h3>
              <p className="text-slate-500">Trending spots for this summer.</p>
            </div>
            <button className="text-blue-600 font-bold hover:underline">View all</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Bali, Indonesia", price: "$1,200", rating: "4.9", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80" },
              { title: "Paris, France", price: "$2,400", rating: "4.8", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80" },
              { title: "Kyoto, Japan", price: "$1,850", rating: "5.0", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80" }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200 border border-slate-100 group"
              >
                <div className="h-64 relative overflow-hidden">
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full px-3 py-1 text-sm font-bold shadow-sm z-10">
                    ⭐ {item.rating}
                  </div>
                  <img
                    src={item.img}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={item.title}
                  />
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-2xl text-slate-800 w-2/3">{item.title}</h4>
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-bold">{item.price}</span>
                  </div>
                  <p className="text-slate-500 mb-6 text-sm">Experience the beauty of {item.title.split(',')[0]} with an all-inclusive package.</p>
                  <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold hover:bg-slate-800 transition shadow-lg shadow-slate-300">
                    Book Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 6. Testimonials */}
        <section className="bg-blue-600 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 text-[20rem] font-black loading-none -mr-20 -mt-20">”</div>
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold mb-8">What Travelers Say</h3>
            <p className="text-2xl font-light italic mb-8">"GlobalTrotter changed the way I see the world. The planning was seamless, the destinations were breathtaking, and the support was unmatched."</p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full"></div>
              <div className="text-left">
                <p className="font-bold">Sarah Jenkins</p>
                <p className="text-blue-200 text-sm">Travel enthusiast</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Newsletter */}
        <section className="text-center py-12">
          <h3 className="text-3xl font-bold mb-4">Join our Newsletter</h3>
          <p className="text-slate-500 mb-8">Get exclusive offers and travel inspiration directly to your inbox.</p>
          <div className="flex max-w-md mx-auto gap-2">
            <input type="email" placeholder="Your email address" className="flex-grow p-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500" />
            <button className="bg-slate-900 text-white px-8 rounded-xl font-bold">Subscribe</button>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16 px-8 mt-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h4 className="text-white text-2xl font-bold italic mb-6">GlobalTrotter</h4>
            <p className="text-sm">Making the world accessible, one trip at a time.</p>
          </div>
          <div>
            <h5 className="text-white font-bold mb-4">Company</h5>
            <ul className="space-y-2 text-sm">
              <li>About Us</li>
              <li>Careers</li>
              <li>Blog</li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-bold mb-4">Support</h5>
            <ul className="space-y-2 text-sm">
              <li>Contact Us</li>
              <li>FAQ</li>
              <li>Terms of Service</li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-bold mb-4">Follow Us</h5>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-slate-700 rounded-full"></div>
              <div className="w-8 h-8 bg-slate-700 rounded-full"></div>
              <div className="w-8 h-8 bg-slate-700 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="text-center mt-16 pt-8 border-t border-slate-800 text-xs">
          © 2026 GlobalTrotter Inc. All rights reserved.
        </div>
      </footer>

      {/* Floating Action Button */}
      <Link to="/create-trip">
        <motion.button
          whileHover={{ scale: 1.1, rotate: 3 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-10 right-10 bg-blue-600 text-white px-8 py-4 rounded-2xl shadow-2xl shadow-blue-400 font-bold flex items-center gap-3 z-50 hover:bg-blue-700"
        >
          <span className="text-2xl">+</span> Plan a trip
        </motion.button>
      </Link>
    </div>
  );
};

export default Dashboard;