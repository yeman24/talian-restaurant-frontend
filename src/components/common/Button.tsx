import React from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children?: React.ReactNode
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
      whileHover,
      whileTap,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium tracking-wider uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#12141a] disabled:opacity-50 disabled:pointer-events-none cursor-pointer'

    const variants = {
      primary:
        'bg-[#12141a] hover:bg-[#202532] text-[#fcf5df] shadow-md shadow-black/10 font-semibold',
      gold:
        'bg-[#12141a] hover:bg-[#222836] text-[#fcf5df] font-semibold shadow-md shadow-black/15',
      outline:
        'border border-[#12141a] hover:bg-[#12141a] text-[#12141a] hover:text-[#fcf5df]',
      ghost:
        'text-[#12141a]/80 hover:text-[#12141a] hover:bg-[#12141a]/5',
      secondary:
        'bg-white hover:bg-[#f6eed2] text-[#12141a] border border-[#e2d7ba]',
    }

    const sizes = {
      sm: 'text-xs px-3.5 py-1.5 rounded-sm gap-1.5 font-sans tracking-widest',
      md: 'text-xs px-6 py-3 rounded-sm gap-2 tracking-[0.18em] font-sans',
      lg: 'text-sm px-8 py-4 rounded-sm gap-2.5 tracking-[0.22em] font-sans',
    }

    return (
      <motion.button
        ref={ref}
        disabled={disabled || isLoading}
        whileHover={disabled || isLoading ? undefined : whileHover !== undefined ? whileHover : { scale: 1.02, y: -1 }}
        whileTap={disabled || isLoading ? undefined : whileTap !== undefined ? whileTap : { scale: 0.98 }}
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
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
