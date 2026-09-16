import React from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { newsletterSchema, type NewsletterFormInput } from '@/lib/validations'
import { useToast } from '@/context/ToastContext'
import { Button } from '@/components/common/Button'
import { RESTAURANT_INFO } from '@/data/mockData'
import { Award, MapPin, ArrowRight } from 'lucide-react'

export const Footer: React.FC = () => {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormInput>({
    resolver: zodResolver(newsletterSchema),
  })

  const onSubmitNewsletter = async (data: NewsletterFormInput) => {
    // Simulate brief network submission
    await new Promise((resolve) => setTimeout(resolve, 600))
    toast({
      title: 'Welcome to the AURA Salon Gazette',
      message: `Thank you for subscribing (${data.email}). You will receive our seasonal release previews and private cellar invitations.`,
      type: 'success',
    })
    reset()
  }

  return (
    <footer className="bg-[#050608] border-t border-stone-800/80 relative text-stone-400 font-sans">
      {/* Accolades Banner */}
      <div className="border-b border-stone-800/60 py-10 bg-gradient-to-b from-[#08090c] to-[#050608]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {RESTAURANT_INFO.awards.map((award, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-3">
                <Award className="w-5 h-5 text-[#c5a059] mb-2 stroke-[1.5]" />
                <span className="text-white font-serif text-base tracking-wide">{award.title}</span>
                <span className="text-[11px] text-stone-500 uppercase tracking-widest mt-1">
                  {award.org}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link to="/" className="flex flex-col items-start mb-5">
              <span className="font-serif text-3xl tracking-[0.25em] text-white uppercase font-light">
                A U R A
              </span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#c5a059] mt-1">
                Edinburgh • 2 Michelin Stars
              </span>
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed max-w-sm mb-6 font-light">
              An unhurried celebration of hyper-seasonal Scottish terroir, wild Highland foraging,
              and timeless culinary craftsmanship in the historic vaults of Royal Terrace.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <span>Chef Patron: {RESTAURANT_INFO.chefPatron}</span>
              <span>•</span>
              <span>Cellar: {RESTAURANT_INFO.headSommelier}</span>
            </div>
          </div>

          {/* Quick Links Col */}
          <div className="lg:col-span-2">
            <h3 className="text-xs uppercase tracking-[0.25em] text-white font-semibold mb-5">
              Navigation
            </h3>
            <ul className="space-y-3 text-xs tracking-wider uppercase">
              <li>
                <Link to="/" className="hover:text-[#c5a059] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-[#c5a059] transition-colors">
                  Tasting Menus
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#c5a059] transition-colors">
                  Our Story & Terroir
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-[#c5a059] transition-colors">
                  The Gallery
                </Link>
              </li>
              <li>
                <Link to="/reservations" className="hover:text-[#c5a059] transition-colors">
                  Reservations
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#c5a059] transition-colors">
                  Contact & Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Hours & Location Col */}
          <div className="lg:col-span-3">
            <h3 className="text-xs uppercase tracking-[0.25em] text-white font-semibold mb-5">
              Service Hours
            </h3>
            <div className="space-y-3 text-xs text-stone-400">
              <div>
                <p className="text-stone-200 font-medium">Dinner Service</p>
                <p className="text-[11px] text-stone-500">Wed – Sat: 17:30 – 23:00</p>
              </div>
              <div>
                <p className="text-stone-200 font-medium">Lunch Service</p>
                <p className="text-[11px] text-stone-500">Fri & Sat: 12:00 – 14:30</p>
              </div>
              <div>
                <p className="text-stone-200 font-medium">Sunday Supper Tasting</p>
                <p className="text-[11px] text-stone-500">17:00 – 22:00</p>
              </div>
              <div className="pt-2">
                <p className="text-stone-200 font-medium flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
                  {RESTAURANT_INFO.address}
                </p>
              </div>
            </div>
          </div>

          {/* Newsletter Col */}
          <div className="lg:col-span-3">
            <h3 className="text-xs uppercase tracking-[0.25em] text-white font-semibold mb-3">
              Salon Gazette
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed mb-4">
              Receive seasonal harvest release notices, private cellar tastings, and culinary salon essays.
            </p>
            <form onSubmit={handleSubmit(onSubmitNewsletter)} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  {...register('email')}
                  className="w-full bg-[#101319] border border-stone-800 focus:border-[#c5a059] rounded-sm px-3.5 py-2.5 text-xs text-white placeholder-stone-600 focus:outline-none transition-colors"
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-rose-400">{errors.email.message}</p>
              )}
              <Button
                type="submit"
                variant="gold"
                size="sm"
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                className="w-full justify-center text-[10px]"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="mt-16 pt-8 border-t border-stone-900 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} AURA Edinburgh Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[11px] uppercase tracking-wider">
            <Link to="/contact" className="hover:text-stone-400 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-stone-400 transition-colors">
              Terms & Cancellation
            </Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-stone-400 transition-colors">
              Press Enquiries
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
