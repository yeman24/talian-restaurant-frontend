import React from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDish } from '@/hooks/useDishes'
import { PageHeader } from '@/components/common/PageHeader'
import { Badge } from '@/components/common/Badge'
import { ButtonLink } from '@/components/common/ButtonLink'
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
        <AlertCircle className="w-12 h-12 text-[#12141a] mb-4" />
        <h2 className="font-serif text-3xl text-[#12141a] font-normal mb-2">Course Not Plated</h2>
        <p className="text-xs text-[#5e6576] font-sans max-w-sm mb-6">
          The requested culinary course could not be located in our seasonal autumn archive.
        </p>
        <ButtonLink to="/menu" variant="gold" size="sm">
            Return to Menu
        </ButtonLink>
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
              className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#e2d7ba] shadow-xl bg-stone-100 group"
            >
              <img
                src={dish.image || '/images/chanterelles.jpg'}
                alt={dish.name}
                width="1200"
                height="900"
                sizes="(min-width: 1024px) 55vw, 100vw"
                loading="eager"
                decoding="async"
                onError={(e) => {
                  if (e.currentTarget.src !== window.location.origin + '/images/chanterelles.jpg') {
                    e.currentTarget.src = '/images/chanterelles.jpg';
                  }
                }}
                className="w-full h-full object-cover object-center filter contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Badges on image */}
              <div className="absolute top-4 left-4 flex gap-2">
                {dish.isSignature && (
                  <span className="inline-flex items-center gap-1.5 bg-[#12141a] text-[#fcf5df] text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-bold shadow-md">
                    <Sparkles className="w-3 h-3 text-[#fcf5df]" /> Signature Plating
                  </span>
                )}
                {dish.isChefRecommendation && (
                  <span className="bg-white/95 text-[#12141a] border border-[#e2d7ba] text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-semibold shadow-md">
                    Chef’s Selection
                  </span>
                )}
              </div>

              {/* Provenance Banner over bottom of photo */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-[#e2d7ba] flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-2 text-[#12141a] text-xs">
                  <MapPin className="w-4 h-4 text-[#12141a] shrink-0" />
                  <span className="font-medium font-sans">{dish.provenance}</span>
                </div>
                <button
                  onClick={handleShare}
                  className="p-1.5 text-[#12141a] hover:text-black rounded hover:bg-black/5 transition-colors"
                  title="Share dish"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Sourcing & Culinary Story */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="p-6 rounded-2xl bg-white border border-[#e2d7ba] shadow-md space-y-3"
            >
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#12141a] font-sans font-semibold">
                Terroir & Heritage
              </span>
              <h3 className="font-serif text-3xl text-[#12141a]">The Culinary Story</h3>
              <p className="text-[#4a5160] font-sans text-sm leading-relaxed">{dish.story}</p>
            </motion.div>
          </div>

          {/* Right Column: Wine Pairing, Details, Pricing & Reservation CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="lg:col-span-5 space-y-8"
          >
            {/* Header info card */}
            <div className="p-6 rounded-2xl bg-white border border-[#e2d7ba] shadow-md space-y-4">
              {dish.gaelicName && (
                <span className="text-sm font-serif italic text-[#12141a]/70 block">
                  {dish.gaelicName}
                </span>
              )}
              <div className="flex items-baseline justify-between border-b border-[#e2d7ba] pb-4">
                <span className="text-[#5e6576] text-xs uppercase tracking-widest font-sans">
                  A La Carte Equivalent
                </span>
                <span className="text-3xl font-serif text-[#12141a] font-bold">
                  {formatCurrency(dish.price)}
                </span>
              </div>

              {/* Dietary Tags */}
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#12141a] block mb-2 font-bold font-sans">
                  Dietary Profile
                </span>
                <div className="flex flex-wrap gap-2">
                  {dish.dietary.map((tag) => (
                    <Badge key={tag} variant="tag">
                      {tag}
                    </Badge>
                  ))}
                  {dish.allergens.length > 0 && (
                    <div className="text-[11px] text-[#8c94a4] w-full pt-1 font-sans">
                      Contains: {dish.allergens.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sommelier Pairing Card */}
            {dish.winePairing && (
              <div className="p-6 rounded-2xl bg-[#fcf5df] border border-[#e2d7ba] shadow-md space-y-3">
                <div className="flex items-center gap-2">
                  <Wine className="w-4 h-4 text-[#12141a]" />
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#12141a] font-sans font-semibold">
                    Sommelier Pairing
                  </span>
                </div>

                <h4 className="font-serif text-2xl text-[#12141a] leading-snug">
                  {dish.winePairing.name}
                </h4>

                <div className="text-xs text-[#5e6576] space-y-1 font-sans">
                  <p>
                    <span className="text-[#12141a] font-medium">Producer:</span> {dish.winePairing.producer}
                  </p>
                  <p>
                    <span className="text-[#12141a] font-medium">Vintage & Origin:</span>{' '}
                    {dish.winePairing.vintage} • {dish.winePairing.region}
                  </p>
                </div>

                <p className="text-xs text-[#4a5160] font-sans italic leading-relaxed pt-2 border-t border-[#e2d7ba]">
                  "{dish.winePairing.notes}"
                </p>
              </div>
            )}

            {/* Book to Taste CTA */}
            <div className="p-6 rounded-2xl bg-white border border-[#e2d7ba] shadow-md space-y-4">
              <span className="text-xs uppercase tracking-widest text-[#12141a] font-bold font-sans block">
                Experience in Person
              </span>
              <p className="text-xs text-[#5e6576] font-sans leading-relaxed">
                Featured as part of the 8-Course Autumn Tasting Menu or private cellar seating.
              </p>
              <div className="flex flex-col gap-3">
                <ButtonLink
                    to="/reservations"
                    variant="gold"
                    size="md"
                    leftIcon={<Calendar className="w-4 h-4" />}
                    className="w-full justify-center"
                  >
                    Reserve Table for This Course
                </ButtonLink>
                <ButtonLink to="/menu" variant="outline" size="sm" leftIcon={<ChevronLeft className="w-4 h-4" />} className="w-full justify-center">
                    Back to Full Menu
                </ButtonLink>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
