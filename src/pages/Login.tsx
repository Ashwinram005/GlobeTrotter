import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion } from 'framer-motion'
import { User as UserIcon, Lock, ArrowRight, Compass } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Input, Button } from '../components/common/UI'
import { supabase } from '../services/supabase'

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof loginSchema>

const Login: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema)
    })

    const onSubmit = async (data: LoginFormValues) => {
        setLoading(true)
        setError(null)

        const { error: loginError } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        })

        if (loginError) {
            setError(loginError.message)
        } else {
            navigate('/dashboard')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex bg-white overflow-hidden">
            {/* Left Side: Visual/Branding (Desktop Only) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-primary-950 items-center justify-center p-12">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 to-transparent" />

                <div className="relative z-10 space-y-8 max-w-lg">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl"
                    >
                        <Compass className="w-10 h-10 text-white" />
                    </motion.div>

                    <div className="space-y-4">
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-6xl font-display font-bold text-white leading-tight"
                        >
                            Explore. <br />
                            <span className="text-primary-400">Dream.</span> <br />
                            Discover.
                        </motion.h1>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-xl text-primary-100/80 leading-relaxed font-light"
                        >
                            Your journey starts with a single click. Join thousands of travelers planning their perfect escapes.
                        </motion.p>
                    </div>
                </div>

                {/* Floating Stat Card */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="absolute bottom-12 left-12 p-6 glass-panel rounded-2xl border-white/10"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                        </div>
                        <div>
                            <p className="text-white font-semibold">12,403</p>
                            <p className="text-primary-200 text-sm">Trips created today</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-md space-y-12"
                >
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 lg:hidden mb-8">
                            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                                <Compass className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-display font-bold text-slate-900">GlobeTrotter</span>
                        </div>
                        <h2 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Welcome back</h2>
                        <p className="text-slate-500 font-medium">Please enter your details to sign in</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-6">
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="you@example.com"
                                {...register('email')}
                                error={errors.email?.message}
                            />

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
                                    <Link to="/forgot-password" size="sm" className="text-sm text-primary-600 font-semibold hover:text-primary-700 transition-colors">Forgot password?</Link>
                                </div>
                                <div className="relative group">
                                    <input
                                        type="password"
                                        className={`w-full pl-4 pr-12 py-3.5 bg-white border ${errors.password ? 'border-red-500' : 'border-slate-200'} rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all duration-300 placeholder:text-slate-400 shadow-sm`}
                                        placeholder="••••••••"
                                        {...register('password')}
                                    />
                                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                </div>
                                {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password.message}</p>}
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        <Button className="w-full py-4 text-lg rounded-2xl transition-transform active:scale-95" isLoading={loading}>
                            Sign In <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </form>

                    <p className="text-center text-slate-600">
                        Don't have an account? <Link to="/register" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">Create account</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

export default Login
