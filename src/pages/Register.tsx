import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion } from 'framer-motion'
import { User, Compass, ArrowRight, MapPin, Phone } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Input, Button } from '../components/common/UI'
import { supabase } from '../services/supabase'

const signupSchema = z.object({
    firstName: z.string().min(2, 'First name is too short'),
    lastName: z.string().min(2, 'Last name is too short'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Invalid phone number'),
    city: z.string().min(2, 'City is required'),
    country: z.string().min(2, 'Country is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    additionalInfo: z.string().optional(),
})

type SignupFormValues = z.infer<typeof signupSchema>

const Register: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema)
    })

    const onSubmit = async (data: SignupFormValues) => {
        setLoading(true)
        setError(null)

        // Attempt registration
        const { error: signUpError, data: authData } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                    first_name: data.firstName,
                    last_name: data.lastName,
                    phone: data.phone,
                    city: data.city,
                    country: data.country,
                    additional_info: data.additionalInfo
                }
            }
        })

        if (signUpError) {
            setError(signUpError.message)
            setLoading(false)
            return
        }

        // Create profile (in case trigger didn't work)
        if (authData.user) {
            await supabase.from('profiles').upsert({
                id: authData.user.id,
                first_name: data.firstName,
                last_name: data.lastName,
                phone: data.phone,
                city: data.city,
                country: data.country,
                additional_info: data.additionalInfo
            })
        }

        navigate('/dashboard')
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex bg-white overflow-hidden">
            {/* Left Side: Visual (Desktop) */}
            <div className="hidden lg:flex lg:w-2/5 relative bg-primary-950 items-center justify-center p-12">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1502791451862-7bd8c1df43a7?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-transparent to-transparent" />

                <div className="relative z-10 space-y-6">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20"
                    >
                        <Compass className="w-8 h-8 text-white" />
                    </motion.div>
                    <div className="space-y-4">
                        <h2 className="text-4xl font-display font-bold text-white leading-tight">Join the <br /><span className="text-primary-400">GlobeTrotter</span> community</h2>
                        <p className="text-lg text-primary-100/70 font-light leading-relaxed">
                            Start planning your multi-city itineraries with our professional tools.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-3/5 flex items-center justify-center p-8 lg:p-16 bg-slate-50 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-2xl space-y-10 py-8"
                >
                    <div className="space-y-2">
                        <h1 className="text-3xl font-display font-bold text-slate-900">Create account</h1>
                        <p className="text-slate-500 font-medium">Join us to start planning your next professional trip.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                            <Input
                                label="First Name"
                                placeholder="John"
                                {...register('firstName')}
                                error={errors.firstName?.message}
                                className="bg-white"
                            />
                            <Input
                                label="Last Name"
                                placeholder="Doe"
                                {...register('lastName')}
                                error={errors.lastName?.message}
                                className="bg-white"
                            />
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="john@example.com"
                                {...register('email')}
                                error={errors.email?.message}
                                className="bg-white"
                            />
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700 ml-1">Phone Number</label>
                                <div className="relative">
                                    <input
                                        className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.phone ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all duration-200`}
                                        placeholder="+1 234 567 8900"
                                        {...register('phone')}
                                    />
                                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                </div>
                                {errors.phone && <p className="text-xs text-red-500 ml-1">{errors.phone.message}</p>}
                            </div>
                            <Input
                                label="City"
                                placeholder="New York"
                                {...register('city')}
                                error={errors.city?.message}
                                className="bg-white"
                            />
                            <Input
                                label="Country"
                                placeholder="USA"
                                {...register('country')}
                                error={errors.country?.message}
                                className="bg-white"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                {...register('password')}
                                error={errors.password?.message}
                                className="bg-white"
                            />

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700 ml-1">Additional Information (Optional)</label>
                                <textarea
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400 min-h-[120px] shadow-sm"
                                    placeholder="Tell us about your travel style..."
                                    {...register('additionalInfo')}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium text-center">
                                {error}
                            </div>
                        )}

                        <div className="pt-4">
                            <Button className="w-full py-4 text-lg rounded-2xl" isLoading={loading}>
                                Create Account <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    </form>

                    <p className="text-center text-slate-600">
                        Already have an account? <Link to="/login" className="text-primary-600 font-bold hover:underline">Log in</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

export default Register
