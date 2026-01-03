import React from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { motion } from 'framer-motion'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// --- Input Component ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label className="text-sm font-medium text-slate-700 ml-1">
                        {label}
                    </label>
                )}
                <input
                    className={cn(
                        "w-full px-4 py-2.5 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 placeholder:text-slate-400",
                        error && "border-red-500 focus:ring-red-500",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
            </div>
        )
    }
)

// --- Button Component ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    isLoading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
    children,
    className,
    variant = 'primary',
    isLoading,
    ...props
}) => {
    const variants = {
        primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/20",
        secondary: "bg-secondary-500 text-white hover:bg-secondary-600 shadow-lg shadow-secondary-500/20",
        outline: "bg-transparent border border-slate-200 text-slate-700 hover:bg-slate-50",
        ghost: "bg-transparent text-slate-600 hover:bg-slate-100"
    }

    return (
        <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
                variants[variant],
                className
            )}
            disabled={isLoading}
            {...(props as any)}
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : children}
        </motion.button>
    )
}

// --- Card Component ---
export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
    return (
        <div className={cn(
            "glass-panel rounded-3xl p-8 shadow-2xl overflow-hidden",
            className
        )}>
            {children}
        </div>
    )
}
