import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDish } from '@/hooks/useDishes'
import { PageHeader } from '@/components/common/PageHeader'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Skeleton } from '@/components/common/Skeleton'
import { formatCurrency } from '@/lib/utils'
import {
  Wine,
  MapPin,
  Sparkles,
  ChevronLeft,
  Calendar,
  AlertCircle,
  Share2,
} from 'lucide-react'
import { useToast } from '@/context/ToastContext'

export const DishDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { data: dish, isLoading } = useDish(id)
  const { toast } = useToast()

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: 'Link Copied to Clipboard',
      message: 'You can now share this culinary course with your guests.',
      type: 'info',
    })
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-6 pt-40 pb-24">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <Skeleton className="lg:col-span-7 aspect-[4/3] w-full" />
          <div className="lg:col-span-5 space-y-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!dish) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 pt-32">
        <AlertCircle className="w-12 h-12 text-[#c5a059] mb-4" />
        <h2 className="font-serif text-3xl text-white font-light mb-2">Course Not Plated</h2>
        <p className="text-xs text-stone-400 max-w-sm mb-6">
          The requested culinary course could not be located in our seasonal autumn archive.
        </p>
        <Link to="/menu">
          <Button variant="gold" size="sm">
            Return to Menu
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        eyebrow={dish.courseNumber ? `Course 0${dish.courseNumber} • Autumn Tasting` : dish.category}
        title={dish.name}
        subtitle={dish.description}
        breadcrumbs={[
          { label: 'Menu', href: '/menu' },
          { label: dish.name },
        ]}
        accentImage={dish.image}
      />

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Imagery with overlay badges */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[4/3] rounded-xl overflow-hidden border border-stone-800 shadow-2xl bg-stone-900 group"
            >
              <img
                src={dish.image}
                alt={dish.name}
                className="w-full h-full object-cover object-center filter contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e1016]/90 via-transparent to-black/30" />

              {/* Badges on image */}
              <div className="absolute top-4 left-4 flex gap-2">
                {dish.isSignature && (
                  <span className="inline-flex items-center gap-1.5 bg-black/70 backdrop-blur-md text-[#c5a059] border border-[#c5a059]/40 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-semibold">
                    <Sparkles className="w-3 h-3 text-[#c5a059]" /> Signature Plating
                  </span>
                )}
                {dish.isChefRecommendation && (
                  <span className="bg-black/70 backdrop-blur-md text-stone-200 border border-stone-700 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                    Chef’s Selection
                  </span>
                )}
              </div>

              {/* Provenance Banner over bottom of photo */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-lg bg-[#0e1016]/85 backdrop-blur-md border border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-stone-200 text-xs">
                  <MapPin className="w-4 h-4 text-[#c5a059] shrink-0" />
                  <span className="font-light">{dish.provenance}</span>
                </div>
                <button
                  onClick={handleShare}
                  className="p-1.5 text-stone-400 hover:text-white rounded hover:bg-white/5 transition-colors"
                  title="Share dish"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Sourcing & Culinary Story */}
            <div className="p-6 rounded-xl bg-[#0e1017] border border-stone-800/80 space-y-3">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#c5a059] font-sans font-medium">
                Terroir & Heritage
              </span>
              <h3 className="font-serif text-2xl text-white font-light">The Culinary Story</h3>
              <p className="text-stone-300 font-light text-sm leading-relaxed">{dish.story}</p>
            </div>
          </div>

          {/* Right Column: Wine Pairing, Details, Pricing & Reservation CTA */}
          <div className="lg:col-span-5 space-y-8">
            {/* Header info card */}
            <div className="p-6 rounded-xl bg-[#0e1017] border border-stone-800 space-y-4">
              {dish.gaelicName && (
                <span className="text-sm font-serif italic text-[#c5a059] block">
                  {dish.gaelicName}
                </span>
              )}
              <div className="flex items-baseline justify-between border-b border-stone-800 pb-4">
                <span className="text-stone-400 text-xs uppercase tracking-widest">
                  A La Carte Equivalent
                </span>
                <span className="text-3xl font-serif text-white font-medium">
                  {formatCurrency(dish.price)}
                </span>
              </div>

              {/* Dietary Tags */}
              <div>
                <span className="text-[10px] uppercase tracking-widest text-stone-400 block mb-2 font-medium">
                  Dietary Profile
                </span>
                <div className="flex flex-wrap gap-2">
                  {dish.dietary.map((tag) => (
                    <Badge key={tag} variant="gold">
                      {tag}
                    </Badge>
                  ))}
                  {dish.allergens.length > 0 && (
                    <div className="text-[11px] text-stone-500 w-full pt-1">
                      Contains: {dish.allergens.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sommelier Pairing Card */}
            {dish.winePairing && (
              <div className="p-6 rounded-xl bg-[#141722] border border-[#c5a059]/40 shadow-xl space-y-3">
                <div className="flex items-center gap-2">
                  <Wine className="w-4 h-4 text-[#c5a059]" />
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#c5a059] font-sans font-medium">
                    Sommelier Pairing
                  </span>
                </div>

                <h4 className="font-serif text-xl text-white leading-snug">
                  {dish.winePairing.name}
                </h4>

                <div className="text-xs text-stone-400 space-y-1">
                  <p>
                    <span className="text-stone-300">Producer:</span> {dish.winePairing.producer}
                  </p>
                  <p>
                    <span className="text-stone-300">Vintage & Origin:</span>{' '}
                    {dish.winePairing.vintage} • {dish.winePairing.region}
                  </p>
                </div>

                <p className="text-xs text-stone-300 font-light italic leading-relaxed pt-2 border-t border-stone-800">
                  "{dish.winePairing.notes}"
                </p>
              </div>
            )}

            {/* Book to Taste CTA */}
            <div className="p-6 rounded-xl bg-[#0e1017] border border-stone-800 space-y-4">
              <span className="text-xs uppercase tracking-widest text-stone-300 font-medium block">
                Experience in Person
              </span>
              <p className="text-xs text-stone-400 font-light leading-relaxed">
                Featured as part of the 8-Course Autumn Tasting Menu or private cellar seating.
              </p>
              <div className="flex flex-col gap-3">
                <Link to="/reservations">
                  <Button
                    variant="gold"
                    size="md"
                    leftIcon={<Calendar className="w-4 h-4" />}
                    className="w-full justify-center"
                  >
                    Reserve Table for This Course
                  </Button>
                </Link>
                <Link to="/menu">
                  <Button variant="ghost" size="sm" leftIcon={<ChevronLeft className="w-4 h-4" />} className="w-full justify-center">
                    Back to Full Menu
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
