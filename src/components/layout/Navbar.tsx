import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Compass, User, Bell, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

export const Navbar: React.FC = () => {
    const { user, signOut } = useAuth()
    const [showMenu, setShowMenu] = useState(false)

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
                        <Link to="/my-trips" className="hover:text-primary-600 transition-colors">My Trips</Link>
                        <Link to="/dashboard" className="hover:text-primary-600 transition-colors">Destinations</Link>
                    </div>

                    <div className="flex items-center gap-4 border-l border-slate-100 pl-6">
                        <button className="p-2 text-slate-400 hover:text-primary-600 transition-colors">
                            <Bell className="w-5 h-5" />
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:border-primary-500 transition-all cursor-pointer overflow-hidden"
                            >
                                {user?.user_metadata?.avatar_url ? (
                                    <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-5 h-5" />
                                )}
                            </button>

                            <AnimatePresence>
                                {showMenu && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowMenu(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50"
                                        >
                                            <div className="px-4 py-3 border-b border-slate-100">
                                                <p className="text-sm font-bold text-slate-900">
                                                    {user?.user_metadata?.first_name || 'User'} {user?.user_metadata?.last_name || ''}
                                                </p>
                                                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                            </div>
                                            <Link
                                                to="/profile"
                                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-slate-700"
                                                onClick={() => setShowMenu(false)}
                                            >
                                                <Settings className="w-4 h-4" />
                                                <span className="text-sm font-medium">Settings</span>
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setShowMenu(false)
                                                    signOut()
                                                }}
                                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-red-600 w-full"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span className="text-sm font-medium">Logout</span>
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
