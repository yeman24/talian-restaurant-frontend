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
    gold: 'bg-[#c5a059]/15 text-[#f5eed8] border border-[#c5a059]/40',
    outline: 'border border-stone-700 text-stone-300 bg-transparent',
    subtle: 'bg-[#181b23] text-stone-300 border border-stone-800',
    accent: 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40',
    tag: 'bg-[#101319] text-stone-400 border border-stone-800/80',
  }

  return (
    <span className={cn(base, variants[variant], className)} {...props}>
      {children}
    </span>
  )
}
