import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  breadcrumbs?: { label: string; href?: string }[]
  accentImage?: string
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  eyebrow,
  title,
  subtitle,
  breadcrumbs,
  accentImage,
}) => {
  return (
    <div className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden border-b border-stone-800/60">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-radial-luxury opacity-70 pointer-events-none" />
      {accentImage && (
        <div className="absolute inset-0 z-0 opacity-15 overflow-hidden">
          <img
            src={accentImage}
            alt=""
            className="w-full h-full object-cover object-center filter blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08090c] via-[#08090c]/80 to-transparent" />
        </div>
      )}

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 mb-6">
            <Link to="/" className="text-xs tracking-widest uppercase text-stone-400 hover:text-[#c5a059] transition-colors">
              Home
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className="w-3 h-3 text-stone-600" />
                {crumb.href ? (
                  <Link
                    to={crumb.href}
                    className="text-xs tracking-widest uppercase text-stone-400 hover:text-[#c5a059] transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-xs tracking-widest uppercase text-[#c5a059]">
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <span className="h-[1px] w-8 bg-[#c5a059]/40" />
            <span className="text-xs tracking-[0.3em] uppercase text-[#c5a059] font-medium font-sans">
              {eyebrow}
            </span>
            <span className="h-[1px] w-8 bg-[#c5a059]/40" />
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-light font-serif tracking-tight text-white mb-6"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-2xl mx-auto text-base sm:text-lg text-stone-300 font-light leading-relaxed font-sans"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  )
}
