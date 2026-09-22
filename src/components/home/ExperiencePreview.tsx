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
      image: '/images/vault_dining.jpg',
      tag: 'Tables 1 – 10',
    },
    {
      title: 'The Chef’s Atelier Counter',
      subtitle: 'Front-Row Culinary Immersion',
      description:
        'An exclusive 6-seat marble counter directly facing the open kitchen pass, with courses presented by Chef Patron Euan Macleod.',
      image: '/images/chef_counter.jpg',
      tag: '6 Seats Only',
    },
    {
      title: 'The Sommelier Cellar Vault',
      subtitle: 'Private Sanctuary for Up to 12',
      description:
        'Surrounded by our 2,400-bottle rare reserve vintage collection, designed for intimate celebrations and bespoke wine pairings.',
      image: '/images/cellar2.jpg',
      tag: 'Private Dining',
    },
  ]

  return (
    <section className="py-24 lg:py-32 bg-[#f6eed2]/40 border-t border-[#e2d7ba]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <Compass className="w-3.5 h-3.5 text-[#12141a]" />
            <span className="text-xs uppercase tracking-[0.25em] text-[#12141a] font-sans font-semibold">
              The Spaces
            </span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#12141a] mb-4">
            Distinctive Dining Atmospheres
          </h2>
          <p className="text-[#4a5160] font-sans text-sm sm:text-base leading-relaxed">
            Every room at AURA offers an intimate perspective on Edinburgh’s architectural majesty
            and modern Scottish gastronomy.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {experiences.map((exp, idx) => (
            <motion.div
              key={exp.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              whileHover={{ y: -4 }}
              className="group relative rounded-xl overflow-hidden border border-[#e2d7ba] hover:border-[#12141a] bg-white flex flex-col justify-between shadow-md transition-colors"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <img
                  src={exp.image || '/images/vault_dining.jpg'}
                  alt={exp.title}
                  width="800"
                  height="600"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    if (e.currentTarget.src !== window.location.origin + '/images/vault_dining.jpg') {
                      e.currentTarget.src = '/images/vault_dining.jpg';
                    }
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-95 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 bg-[#12141a] text-[#fcf5df] text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full font-sans font-bold shadow-sm">
                  {exp.tag}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#12141a] block mb-1 font-sans font-semibold">
                    {exp.subtitle}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#12141a] mb-2">{exp.title}</h3>
                  <p className="text-xs text-[#5e6576] font-sans leading-relaxed mb-6">
                    {exp.description}
                  </p>
                </div>

                <Link
                  to="/reservations"
                  className="inline-flex items-center gap-1.5 text-xs tracking-widest uppercase text-[#12141a] hover:text-[#3a4254] transition-colors font-sans font-semibold pt-3 border-t border-[#e2d7ba]"
                >
                  <span>Reserve this space</span>
                  <Sparkles className="w-3 h-3 text-[#12141a]" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
