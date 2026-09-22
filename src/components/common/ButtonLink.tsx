import React from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface ButtonLinkProps extends LinkProps {
  children?: React.ReactNode
  variant?: 'primary' | 'outline' | 'ghost' | 'secondary' | 'gold'
  size?: 'sm' | 'md' | 'lg'
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  className?: string
}

export const ButtonLink: React.FC<ButtonLinkProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  className,
  ...props
}) => {
  const variants = {
    primary: 'bg-[#12141a] hover:bg-[#202532] text-[#fcf5df] shadow-md shadow-black/10 font-semibold',
    gold: 'bg-[#12141a] hover:bg-[#222836] text-[#fcf5df] font-semibold shadow-md shadow-black/15',
    outline: 'border border-[#12141a] hover:bg-[#12141a] text-[#12141a] hover:text-[#fcf5df]',
    ghost: 'text-[#12141a]/80 hover:text-[#12141a] hover:bg-[#12141a]/5',
    secondary: 'bg-white hover:bg-[#f6eed2] text-[#12141a] border border-[#e2d7ba]',
  }

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 rounded-sm gap-1.5 font-sans tracking-widest',
    md: 'text-xs px-6 py-3 rounded-sm gap-2 tracking-[0.18em] font-sans',
    lg: 'text-sm px-8 py-4 rounded-sm gap-2.5 tracking-[0.22em] font-sans',
  }

  return (
    <Link
      {...props}
      className={cn(
        'inline-flex items-center justify-center font-medium uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#12141a]',
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </Link>
  )
}
