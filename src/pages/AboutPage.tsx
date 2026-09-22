import React from 'react'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/common/PageHeader'
import { Award, Sparkles, Trees } from 'lucide-react'
import { ButtonLink } from '@/components/common/ButtonLink'

export const AboutPage: React.FC = () => {
  const partners = [
    {
      title: 'Hand-Dived Scallops',
      partner: 'Kevin MacLeod',
      region: 'Scapa Flow, Orkney Islands',
      desc: 'Braving sub-zero tidal surges to harvest mature king scallops by hand without dredging sea floors.',
    },
    {
      title: 'Wild Stalked Venison',
      partner: 'Mar Lodge Conservation Estate',
      region: 'Cairngorms National Park',
      desc: 'Sustainable forest regeneration culls providing wild red deer nourished solely on heather and lichen.',
    },
    {
      title: 'Clothbound Cheddar',
      partner: 'The Reade Family',
      region: 'Isle of Mull, Inner Hebrides',
      desc: 'Raw milk cheese made with distillery grain spent mash from Tobermory and matured in cellars for 18 months.',
    },
    {
      title: 'Coastal Botanicals & Kelp',
      partner: 'Islay & East Lothian Foraging Brigade',
      region: 'Fife, Yellowcraigs & Hebrides',
      desc: 'Harvested at dawn: scurvy grass, sea buckthorn berries, dulse, and aromatic sweet meadowsweet.',
    },
  ]

  const timeline = [
    { year: '2021', title: 'The Vaults Restored', desc: 'Restoration of 18th-century Georgian cellars beneath Royal Terrace.' },
    { year: '2023', title: 'First Michelin Star', desc: 'Awarded One Michelin Star within 10 months of opening service.' },
    { year: '2024', title: '5 AA Rosettes', desc: 'Recognised with the highest culinary accolade by the AA Hospitality Awards.' },
    { year: '2025', title: 'Two Michelin Stars', desc: 'Promoted to Two Stars by the Michelin Guide UK for culinary masterclass.' },
  ]

  return (
    <div>
      <PageHeader
        eyebrow="Our Heritage & Terroir"
        title="Born of Stone, Heather, and Tides"
        subtitle="A culinary reflection of the Scottish wilderness, curated inside the historic stone vaults of Edinburgh."
        breadcrumbs={[{ label: 'About' }]}
        accentImage="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85"
      />

      <div className="max-w-7xl mx-auto px-6 py-20 space-y-28">
        {/* Story Section 1: The Founders */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
        >
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#12141a]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#12141a] font-sans font-semibold">
                The Leadership
              </span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#12141a] leading-tight">
              Chef Patron Euan Macleod & Head Sommelier Fiona Sinclair
            </h2>
            <p className="text-[#4a5160] font-sans text-sm sm:text-base leading-relaxed">
              Born in the Outer Hebrides and trained in Copenhagen, Paris, and San Sebastián, Chef
              Euan Macleod returned home to Scotland with an uncompromising vision: to liberate
              Scottish gastronomy from convention and elevate its untamed ingredients to world-class
              modernity.
            </p>
            <p className="text-[#5e6576] font-sans text-sm leading-relaxed">
              Together with Head Sommelier Fiona Sinclair—whose cellaring program champions rare
              biodynamic European estates alongside silent distillery single malt whiskies—AURA has
              become a sanctuary of quiet luxury and sensory revelation in Edinburgh.
            </p>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl overflow-hidden border border-[#e2d7ba] aspect-[3/4] bg-stone-100 shadow-md"
            >
              <img
                src="/images/chef_euan.jpg"
                alt="Chef Patron Euan Macleod"
                width="1200"
                height="1847"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover brightness-95"
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl overflow-hidden border border-[#e2d7ba] aspect-[3/4] bg-stone-100 mt-8 shadow-md"
            >
              <img
                src="/images/sommelier_fiona.jpg"
                alt="Head Sommelier Fiona Sinclair in Cellar"
                width="1200"
                height="1847"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover brightness-95"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Story Section 2: Terroir & Foraging Partners */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 mb-3">
              <Trees className="w-3.5 h-3.5 text-[#12141a]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#12141a] font-sans font-semibold">
                Provenance & Custodians
              </span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#12141a] mb-4">
              Partners of the Scottish Wilds
            </h2>
            <p className="text-[#4a5160] font-sans text-sm sm:text-base leading-relaxed">
              We do not purchase from commercial wholesalers. Our produce is procured through direct
              pacts with independent hand-divers, conservation estates, and small-batch crafters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {partners.map((p, idx) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl bg-white border border-[#e2d7ba] shadow-md hover:border-[#12141a] transition-colors flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#12141a] font-sans font-bold block mb-1">
                    {p.region}
                  </span>
                  <h3 className="font-serif text-2xl text-[#12141a] mb-2">{p.title}</h3>
                  <p className="text-xs text-[#12141a] font-medium mb-3 font-sans">{p.partner}</p>
                  <p className="text-xs text-[#5e6576] font-sans leading-relaxed">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Story Section 3: Architecture */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white border border-[#e2d7ba] rounded-2xl p-8 sm:p-12 shadow-md"
        >
          <div className="lg:col-span-5 rounded-xl overflow-hidden border border-[#e2d7ba] aspect-[4/3] bg-stone-100 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85"
              alt="The historic vaults at Royal Terrace Edinburgh"
              width="1000"
              height="750"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                if (e.currentTarget.src !== window.location.origin + '/images/vault_dining.jpg') {
                  e.currentTarget.src = '/images/vault_dining.jpg';
                }
              }}
              className="w-full h-full object-cover brightness-95"
            />
          </div>
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#12141a] font-sans font-semibold">
              The Architecture
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-[#12141a]">
              Restored 18th-Century Georgian Stone Vaults
            </h3>
            <p className="text-[#4a5160] font-sans text-sm leading-relaxed">
              Located on the eastern crest of Calton Hill along Edinburgh’s historic Royal Terrace,
              our dining sanctuary is carved beneath Georgian flagstones once traversed by 18th-century
              merchants and Scottish Enlightenment luminaries.
            </p>
            <p className="text-[#5e6576] font-sans text-xs leading-relaxed">
              Designed in collaboration with Edinburgh preservation artisans, the space blends
              exposed sandstone masonry with charred Scottish larch, tactile linens, warm bronze
              accents, and discreet acoustic engineering for complete subterranean peace.
            </p>
          </div>
        </motion.div>

        {/* Accolades Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 mb-3">
              <Award className="w-3.5 h-3.5 text-[#12141a]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#12141a] font-sans font-semibold">
                Milestones
              </span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#12141a]">
              The Path to Two Michelin Stars
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {timeline.map((item, idx) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl bg-white border border-[#e2d7ba] shadow-md relative"
              >
                <span className="font-serif text-4xl text-[#12141a] font-bold block mb-2">
                  {item.year}
                </span>
                <h4 className="font-serif text-2xl text-[#12141a] mb-2">{item.title}</h4>
                <p className="text-xs text-[#5e6576] font-sans leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center pt-8 border-t border-[#e2d7ba]"
        >
          <ButtonLink to="/reservations" variant="gold" size="lg">
              Reserve an Autumn Experience
          </ButtonLink>
        </motion.div>
      </div>
    </div>
  )
}
