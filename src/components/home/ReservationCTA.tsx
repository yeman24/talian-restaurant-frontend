import React from 'react'
import { motion } from 'framer-motion'
import { ButtonLink } from '@/components/common/ButtonLink'
import { Calendar, Sparkles } from 'lucide-react'

export const ReservationCTA: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-[#fcf5df] to-[#f6eed2] border-t border-[#e2d7ba]">
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="p-10 sm:p-16 rounded-2xl bg-white border border-[#e2d7ba] shadow-xl"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#12141a]" />
            <span className="text-[11px] tracking-[0.25em] uppercase text-[#12141a] font-sans font-semibold">
              Join Us at the Pass
            </span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#12141a] mb-6 leading-tight">
            Reserve Your Autumn Sittings
          </h2>

          <p className="text-[#4a5160] font-sans text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-8">
            To preserve the unhurried intimacy of each service, AURA accommodates just 28 guests
            per evening across our historic vaults and Chef’s Atelier. Reservations open 90 days in
            advance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <ButtonLink
                to="/reservations"
                variant="gold"
                size="lg"
                leftIcon={<Calendar className="w-4 h-4" />}
                className="px-8 py-4 text-xs font-semibold"
              >
                Begin Reservation
            </ButtonLink>
            <ButtonLink to="/contact" variant="outline" size="lg" className="px-7 py-4 text-xs">
                Private Dining Inquiries
            </ButtonLink>
          </div>

          <p className="text-[11px] text-[#8c94a4] tracking-wider uppercase mt-8 font-sans">
            For parties of 7 or more, please contact our Maître d’ directly at +44 (0)131 556 8920
          </p>
        </motion.div>
      </div>
    </section>
  )
}
