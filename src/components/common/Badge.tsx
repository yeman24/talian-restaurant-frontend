import React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'outline' | 'subtle' | 'accent' | 'tag'
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'gold',
  children,
  ...props
}) => {
  const base =
    'inline-flex items-center text-[10px] tracking-[0.2em] uppercase font-medium px-2.5 py-1 rounded-full transition-colors'

  const variants = {
    gold: 'bg-[#12141a] text-[#fcf5df] border border-[#12141a]',
    outline: 'border border-[#12141a]/40 text-[#12141a] bg-transparent',
    subtle: 'bg-white text-[#12141a] border border-[#e2d7ba]',
    accent: 'bg-[#12141a]/10 text-[#12141a] border border-[#12141a]/20',
    tag: 'bg-[#f6eed2] text-[#12141a] border border-[#e2d7ba]',
  }

  return (
    <span className={cn(base, variants[variant], className)} {...props}>
      {children}
    </span>
  )
}
