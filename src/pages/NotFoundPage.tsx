import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/common/Button'
import { ArrowRight } from 'lucide-react'

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[85vh] flex items-center justify-center relative px-6 py-32 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-radial-luxury opacity-40 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-xl mx-auto relative z-10"
      >
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="text-xs uppercase tracking-[0.3em] text-[#c5a059] font-sans font-medium">
            Error 404
          </span>
        </div>

        <h1 className="font-serif text-5xl sm:text-6xl text-white font-light mb-4">
          An Uncharted Course
        </h1>

        <p className="text-stone-300 font-light text-sm sm:text-base leading-relaxed mb-8">
          The culinary course or vintage you are seeking has not been plated. Please allow our
          Maître d’ to escort you back to the main dining room.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <Button variant="gold" size="md">
              Return to Dining Room
            </Button>
          </Link>
          <Link to="/menu">
            <Button
              variant="outline"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Explore Autumn Menu
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
