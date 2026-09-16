import React from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { Award, Sparkles, Trees } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/common/Button'

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
              <span className="text-xs uppercase tracking-[0.28em] text-[#c5a059] font-sans font-medium">
                The Leadership
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-light leading-tight">
              Chef Patron Euan Macleod & Head Sommelier Fiona Sinclair
            </h2>
            <p className="text-stone-300 font-light text-sm sm:text-base leading-relaxed">
              Born in the Outer Hebrides and trained in Copenhagen, Paris, and San Sebastián, Chef
              Euan Macleod returned home to Scotland with an uncompromising vision: to liberate
              Scottish gastronomy from convention and elevate its untamed ingredients to world-class
              modernity.
            </p>
            <p className="text-stone-400 font-light text-sm leading-relaxed">
              Together with Head Sommelier Fiona Sinclair—whose cellaring program champions rare
              biodynamic European estates alongside silent distillery single malt whiskies—AURA has
              become a sanctuary of quiet luxury and sensory revelation in Edinburgh.
            </p>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="rounded-lg overflow-hidden border border-stone-800 aspect-[3/4] bg-stone-900">
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=85"
                alt="Chef Patron Euan Macleod"
                className="w-full h-full object-cover brightness-90"
              />
            </div>
            <div className="rounded-lg overflow-hidden border border-stone-800 aspect-[3/4] bg-stone-900 mt-8">
              <img
                src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=85"
                alt="Head Sommelier Fiona Sinclair in Cellar"
                className="w-full h-full object-cover brightness-90"
              />
            </div>
          </div>
        </div>

        {/* Story Section 2: Terroir & Foraging Partners */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 mb-3">
              <Trees className="w-3.5 h-3.5 text-[#c5a059]" />
              <span className="text-xs uppercase tracking-[0.28em] text-[#c5a059] font-sans font-medium">
                Provenance & Custodians
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-light mb-4">
              Partners of the Scottish Wilds
            </h2>
            <p className="text-stone-400 font-light text-sm sm:text-base leading-relaxed">
              We do not purchase from commercial wholesalers. Our produce is procured through direct
              pacts with independent hand-divers, conservation estates, and small-batch crafters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {partners.map((p) => (
              <div
                key={p.title}
                className="p-6 rounded-xl bg-[#0e1017] border border-stone-800 hover:border-[#c5a059]/50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#c5a059] font-sans block mb-1">
                    {p.region}
                  </span>
                  <h3 className="font-serif text-xl text-white mb-2">{p.title}</h3>
                  <p className="text-xs text-stone-300 font-medium mb-3">{p.partner}</p>
                  <p className="text-xs text-stone-400 font-light leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Story Section 3: Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-[#0e1017] border border-stone-800/80 rounded-2xl p-8 sm:p-12">
          <div className="lg:col-span-5 rounded-lg overflow-hidden border border-stone-800 aspect-[4/3] bg-stone-900">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85"
              alt="The historic vaults at Royal Terrace Edinburgh"
              className="w-full h-full object-cover brightness-85"
            />
          </div>
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#c5a059] font-sans font-medium">
              The Architecture
            </span>
            <h3 className="font-serif text-3xl text-white font-light">
              Restored 18th-Century Georgian Stone Vaults
            </h3>
            <p className="text-stone-300 font-light text-sm leading-relaxed">
              Located on the eastern crest of Calton Hill along Edinburgh’s historic Royal Terrace,
              our dining sanctuary is carved beneath Georgian flagstones once traversed by 18th-century
              merchants and Scottish Enlightenment luminaries.
            </p>
            <p className="text-stone-400 font-light text-xs leading-relaxed">
              Designed in collaboration with Edinburgh preservation artisans, the space blends
              exposed sandstone masonry with charred Scottish larch, tactile linens, warm bronze
              accents, and discreet acoustic engineering for complete subterranean peace.
            </p>
          </div>
        </div>

        {/* Accolades Timeline */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 mb-3">
              <Award className="w-3.5 h-3.5 text-[#c5a059]" />
              <span className="text-xs uppercase tracking-[0.28em] text-[#c5a059] font-sans font-medium">
                Milestones
              </span>
            </div>
            <h2 className="font-serif text-3xl text-white font-light">
              The Path to Two Michelin Stars
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {timeline.map((item) => (
              <div
                key={item.year}
                className="p-6 rounded-xl bg-[#0a0c10] border border-stone-800/80 relative"
              >
                <span className="font-serif text-3xl text-[#c5a059] font-light block mb-2">
                  {item.year}
                </span>
                <h4 className="font-serif text-lg text-white mb-2">{item.title}</h4>
                <p className="text-xs text-stone-400 font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-8 border-t border-stone-800">
          <Link to="/reservations">
            <Button variant="gold" size="lg">
              Reserve an Autumn Experience
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
