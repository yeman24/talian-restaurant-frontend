import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'secondary' | 'gold'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium tracking-wider uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c5a059] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]'

    const variants = {
      primary:
        'bg-[#c5a059] hover:bg-[#d4af55] text-black shadow-lg shadow-[#c5a059]/15 hover:shadow-[#c5a059]/30 font-semibold',
      gold:
        'bg-gradient-to-r from-[#d4af55] via-[#c5a059] to-[#b38d43] hover:brightness-110 text-black font-semibold shadow-lg shadow-[#c5a059]/20',
      outline:
        'border border-[#c5a059]/40 hover:border-[#c5a059] text-[#f5eed8] hover:bg-[#c5a059]/10 hover:text-white backdrop-blur-sm',
      ghost:
        'text-stone-300 hover:text-[#c5a059] hover:bg-white/5',
      secondary:
        'bg-[#1a1e27] hover:bg-[#252b38] text-white border border-stone-800 hover:border-stone-700',
    }

    const sizes = {
      sm: 'text-xs px-3.5 py-1.5 rounded-sm gap-1.5 font-sans tracking-widest',
      md: 'text-xs px-6 py-3 rounded-sm gap-2 tracking-[0.18em] font-sans',
      lg: 'text-sm px-8 py-4 rounded-sm gap-2.5 tracking-[0.22em] font-sans',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'
