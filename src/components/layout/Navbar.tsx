import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Compass, User, Bell, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

export const Navbar: React.FC = () => {
    const { user } = useAuth()

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/dashboard" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                        <Compass className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-display font-bold text-slate-900 tracking-tight">GlobeTrotter</span>
                </Link>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
                        <Link to="/dashboard" className="hover:text-primary-600 transition-colors">Explore</Link>
                        <Link to="/dashboard" className="hover:text-primary-600 transition-colors">My Trips</Link>
                        <Link to="/dashboard" className="hover:text-primary-600 transition-colors">Destinations</Link>
                    </div>

                    <div className="flex items-center gap-4 border-l border-slate-100 pl-6">
                        <button className="p-2 text-slate-400 hover:text-primary-600 transition-colors">
                            <Bell className="w-5 h-5" />
                        </button>
                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:border-primary-500 transition-all cursor-pointer overflow-hidden">
                            {user?.user_metadata?.avatar_url ? (
                                <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-5 h-5" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
