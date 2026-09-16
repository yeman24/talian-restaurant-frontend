import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Compass, Sparkles } from 'lucide-react'

export const ExperiencePreview: React.FC = () => {
  const experiences = [
    {
      title: 'The Vault Dining Room',
      subtitle: 'Restored 18th-century Georgian Stone',
      description:
        'Subterranean tranquility under vaulted ceilings, lit with gentle candlelight and bespoke Scottish oak furnishings.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85',
      tag: 'Tables 1 – 10',
    },
    {
      title: 'The Chef’s Atelier Counter',
      subtitle: 'Front-Row Culinary Immersion',
      description:
        'An exclusive 6-seat marble counter directly facing the open kitchen pass, with courses presented by Chef Patron Euan Macleod.',
      image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=85',
      tag: '6 Seats Only',
    },
    {
      title: 'The Sommelier Cellar Vault',
      subtitle: 'Private Sanctuary for Up to 12',
      description:
        'Surrounded by our 2,400-bottle rare reserve vintage collection, designed for intimate celebrations and bespoke wine pairings.',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=85',
      tag: 'Private Dining',
    },
  ]

  return (
    <section className="py-24 lg:py-32 bg-[#0a0c10] border-t border-stone-800/60">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <Compass className="w-3.5 h-3.5 text-[#c5a059]" />
            <span className="text-xs uppercase tracking-[0.28em] text-[#c5a059] font-sans font-medium">
              The Spaces
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-light mb-4">
            Distinctive Dining Atmospheres
          </h2>
          <p className="text-stone-400 font-light text-sm sm:text-base leading-relaxed">
            Every room at AURA offers an intimate perspective on Edinburgh’s architectural majesty
            and modern Scottish gastronomy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {experiences.map((exp, idx) => (
            <motion.div
              key={exp.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="group relative rounded-lg overflow-hidden border border-stone-800/80 bg-[#12151d] flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-900">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-85 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12151d] via-transparent to-transparent" />
                <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-[#c5a059] text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full border border-[#c5a059]/30">
                  {exp.tag}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#c5a059] block mb-1 font-sans">
                    {exp.subtitle}
                  </span>
                  <h3 className="font-serif text-xl text-white mb-2">{exp.title}</h3>
                  <p className="text-xs text-stone-400 font-light leading-relaxed mb-6">
                    {exp.description}
                  </p>
                </div>

                <Link
                  to="/reservations"
                  className="inline-flex items-center gap-1.5 text-xs tracking-widest uppercase text-stone-300 hover:text-[#c5a059] transition-colors font-sans pt-3 border-t border-stone-800"
                >
                  <span>Reserve this space</span>
                  <Sparkles className="w-3 h-3 text-[#c5a059]" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
