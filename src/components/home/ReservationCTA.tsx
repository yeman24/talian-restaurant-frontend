import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/common/Button'
import { Calendar, Sparkles } from 'lucide-react'

export const ReservationCTA: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-[#0a0c10] to-[#050608] border-t border-stone-800/80">
      {/* Ambient gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#c5a059]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="p-10 sm:p-16 rounded-xl bg-[#0e1017]/90 border border-[#c5a059]/30 shadow-2xl shadow-black backdrop-blur-md"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
            <span className="text-[11px] tracking-[0.3em] uppercase text-[#c5a059] font-sans font-medium">
              Join Us at the Pass
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-light mb-6 leading-tight">
            Reserve Your Autumn Sittings
          </h2>

          <p className="text-stone-300 font-light text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-8">
            To preserve the unhurried intimacy of each service, AURA accommodates just 28 guests
            per evening across our historic vaults and Chef’s Atelier. Reservations open 90 days in
            advance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/reservations">
              <Button
                variant="gold"
                size="lg"
                leftIcon={<Calendar className="w-4 h-4" />}
                className="px-8 py-4 text-xs font-semibold"
              >
                Begin Reservation
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="px-7 py-4 text-xs">
                Private Dining Inquiries
              </Button>
            </Link>
          </div>

          <p className="text-[11px] text-stone-500 tracking-wider uppercase mt-8 font-sans">
            For parties of 7 or more, please contact our Maître d’ directly at +44 (0)131 556 8920
          </p>
        </motion.div>
      </div>
    </section>
  )
}
