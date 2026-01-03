import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from './AuthContext';

const Navbar = () => {
    const location = useLocation();
    const { user, signOut } = useAuth();

    const isActive = (path) => location.pathname === path ? "text-blue-600 font-bold" : "hover:text-blue-600 transition";

    return (
        <nav className="flex items-center justify-between px-8 py-4 bg-white/90 backdrop-blur-sm border-b sticky top-0 z-50 transition-all duration-300">
            <Link to="/" className="text-2xl font-black italic bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                GlobalTrotter
            </Link>
            <div className="flex gap-8 items-center font-semibold text-slate-600">
                <Link to="/" className={isActive('/')}>Home</Link>
                <Link to="/explore" className={isActive('/explore')}>Explore</Link>
                <Link to="/my-trips" className={isActive('/my-trips')}>My Trips</Link>
                <Link to="/community" className={isActive('/community')}>Community</Link>
                <Link to="/calendar" className={isActive('/calendar')}>Calendar</Link>
                <Link to="/admin" className={isActive('/admin')}>Admin</Link>
                {user ? (
                    <div className="flex gap-4 items-center">
                        <Link to="/profile">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 ring-4 ring-blue-50 hover:scale-105 transition-transform cursor-pointer">
                                {user.email ? user.email[0].toUpperCase() : 'U'}
                            </div>
                        </Link>
                        <button onClick={signOut} className="text-sm font-bold text-slate-500 hover:text-red-500">Sign Out</button>
                    </div>
                ) : (
                    <Link to="/login">
                        <button className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-slate-800 transition">Log In</button>
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
