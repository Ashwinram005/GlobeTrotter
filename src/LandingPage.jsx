import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, Menu, X, Globe, Map, Compass, Star } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { scrollY } = useScroll();

    // Animations
    const shapeScale = useTransform(scrollY, [0, 600], [1, 0.2]);
    const shapeY = useTransform(scrollY, [0, 600], [0, 200]);
    const shapeOpacity = useTransform(scrollY, [0, 400], [0.8, 0]);

    // Features Data
    const features = [
        {
            title: "Smart Planning",
            description: <span className="text-gray-400">AI-powered itineraries that adapt to your style. <span className="text-[#0061FE] font-bold">Effortless travel.</span></span>,
            icon: <Globe className="w-12 h-12 text-[#0061FE]" />
        },
        {
            title: "Hidden Gems",
            description: <span className="text-gray-400">Discover places not found in guidebooks. <span className="text-[#FF5018] font-bold">Authentic experiences.</span></span>,
            icon: <Compass className="w-12 h-12 text-[#FF5018]" />
        },
        {
            title: "Community",
            description: <span className="text-gray-400">Connect with fellow travelers. <span className="text-yellow-400 font-bold">Share your journey.</span></span>,
            icon: <Map className="w-12 h-12 text-yellow-400" />
        }
    ];

    return (
        <div className="bg-[#101010] text-white min-h-screen font-sans overflow-x-hidden selection:bg-[#0061FE] selection:text-white">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-[#101010]/90 backdrop-blur-md text-white border-b border-white/10">
                <div className="container mx-auto px-6 py-6 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                            <img src="https://res.cloudinary.com/dfrojkr3z/image/upload/v1767442756/7260188-Photoroom_1_skaabs.png" alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">GlobalTrotter</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 font-medium text-gray-300">
                        <a href="#features" className="hover:text-[#0061FE] transition-colors">Features</a>
                        <a href="#destinations" className="hover:text-[#0061FE] transition-colors">Destinations</a>
                        <a href="#community" className="hover:text-[#0061FE] transition-colors">Community</a>
                        <button onClick={() => navigate('/login')} className="hover:text-[#0061FE]">Log in</button>
                        <button onClick={() => navigate('/login')} className="bg-white text-black px-5 py-2.5 rounded-sm hover:bg-gray-200 transition-colors font-bold">
                            Get Started
                        </button>
                    </div>
                    <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-40 bg-[#101010] text-white pt-24 px-6 md:hidden">
                    <div className="flex flex-col gap-6 text-xl font-bold">
                        <a href="#features" onClick={() => setIsMenuOpen(false)}>Features</a>
                        <a href="#destinations" onClick={() => setIsMenuOpen(false)}>Destinations</a>
                        <button onClick={() => navigate('/login')} className="text-left text-[#0061FE]">Log in</button>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
                {/* Background Grid */}
                <div className="absolute inset-0 z-0 opacity-20"
                    style={{
                        backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                        backgroundSize: '50px 50px'
                    }}>
                </div>



                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="max-w-4xl"
                        >
                            <h1 className="text-5xl md:text-8xl font-extrabold leading-[1] tracking-tighter mb-8">
                                Explore<span className="text-[#0061FE]">.</span><br />
                                Dream<span className="text-[#FF5018]">.</span><br />
                                Discover<span className="text-yellow-400">.</span>
                            </h1>
                            <p className="text-gray-400 text-xl max-w-2xl leading-relaxed mb-10 font-light">
                                Your personal AI travel companion. <br />
                                <span className="text-white">Plan trips, discover hidden gems, and connect with the world.</span>
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6">
                                <button onClick={() => navigate('/login')} className="bg-[#0061FE] text-white px-8 py-4 font-bold rounded-sm hover:bg-[#0050d6] transition-all flex items-center justify-center gap-3 group">
                                    Start Planning <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>

                        {/* Right: Hero Image */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="relative mt-12 lg:mt-0 hidden lg:block"
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-800 group transition-transform duration-500 hover:scale-[1.02]">
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#0061FE]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
                                <img
                                    src="https://res.cloudinary.com/dfrojkr3z/image/upload/v1767442233/89e3be2c085d13b03dab4e91c6e14fc7_xzv2le.jpg"
                                    alt="GlobalTrotter Dashboard"
                                    className="w-full h-auto object-cover"
                                />
                            </div>

                        </motion.div>
                    </div>
                </div>

                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500"
                >
                    <ChevronDown size={32} />
                </motion.div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-32 bg-[#101010] relative">
                <div className="container mx-auto px-6">
                    <div className="mb-20">
                        <span className="text-[#0061FE] font-bold tracking-widest uppercase mb-4 block">Features</span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Redefining Travel</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.2 }}
                                className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors"
                            >
                                <div className="mb-6">{feature.icon}</div>
                                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                                <p className="leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#050505] text-gray-400 py-16 border-t border-gray-900">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">GlobalTrotter</h2>
                    <p className="mb-8">Making the world accessible, one trip at a time.</p>
                    <p className="text-sm">© 2026 GlobalTrotter. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
