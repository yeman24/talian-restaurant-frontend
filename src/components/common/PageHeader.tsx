import React from 'react'
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
    <div className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-gradient-to-b from-[#f7ebc8]/60 via-[#fcf5df] to-[#fcf5df] border-b border-[#e2d7ba]">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-radial-luxury opacity-70 pointer-events-none" />
      {accentImage && (
        <div className="absolute inset-0 z-0 opacity-15 overflow-hidden">
          <img
            src={accentImage}
            alt=""
            width="1200"
            height="600"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center filter blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fcf5df] via-[#fcf5df]/80 to-transparent" />
        </div>
      )}

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 mb-6">
            <Link to="/" className="text-xs tracking-widest uppercase text-[#12141a]/60 hover:text-[#12141a] transition-colors font-sans">
              Home
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className="w-3 h-3 text-[#12141a]/40" />
                {crumb.href ? (
                  <Link
                    to={crumb.href}
                    className="text-xs tracking-widest uppercase text-[#12141a]/60 hover:text-[#12141a] transition-colors font-sans"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-xs tracking-widest uppercase text-[#12141a] font-semibold font-sans">
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {eyebrow && (
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="h-[1px] w-8 bg-[#12141a]/20" />
            <span className="text-xs tracking-[0.25em] uppercase text-[#12141a] font-semibold font-sans">
              {eyebrow}
            </span>
            <span className="h-[1px] w-8 bg-[#12141a]/20" />
          </div>
        )}

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-normal text-[#12141a] mb-6">
          {title}
        </h1>

        {subtitle && (
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#4a5160] leading-relaxed font-sans">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
