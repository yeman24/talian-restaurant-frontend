import React from 'react'
import { motion } from 'framer-motion'
import { ButtonLink } from '@/components/common/ButtonLink'
import { ArrowRight } from 'lucide-react'

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[85vh] bg-[#fcf5df] flex items-center justify-center relative px-6 py-32 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f7ebc8]/50 via-[#fcf5df] to-[#fcf5df] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-xl mx-auto relative z-10"
      >
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="text-xs uppercase tracking-[0.25em] text-[#12141a] font-sans font-medium">
            Error 404
          </span>
        </div>

        <h1 className="font-serif text-5xl sm:text-6xl text-[#12141a] font-normal mb-4">
          An Uncharted Course
        </h1>

        <p className="text-[#5e6576] font-sans text-sm sm:text-base leading-relaxed mb-8">
          The culinary course or vintage you are seeking has not been plated. Please allow our
          Maître d’ to escort you back to the main dining room.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <ButtonLink to="/" variant="gold" size="md">
              Return to Dining Room
          </ButtonLink>
          <ButtonLink
              to="/menu"
              variant="outline"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Explore Autumn Menu
          </ButtonLink>
        </div>
      </motion.div>
    </div>
  )
}
