import React from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { newsletterSchema, type NewsletterFormInput } from '@/lib/validations'
import { useToast } from '@/context/ToastContext'
import { Button } from '@/components/common/Button'
import { RESTAURANT_INFO } from '@/data/mockData'
import { useSubmitNewsletter } from '@/hooks/useDishes'
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
  const newsletterMutation = useSubmitNewsletter()

  const onSubmitNewsletter = async (data: NewsletterFormInput) => {
    try {
      await newsletterMutation.mutateAsync(data)
      toast({
        title: 'Welcome to the AURA Salon Gazette',
        message: `Thank you for subscribing (${data.email}). You will receive our seasonal release previews and private cellar invitations.`,
        type: 'success',
      })
      reset()
    } catch (error) {
      toast({
        title: 'Subscription Unavailable',
        message: error instanceof Error ? error.message : 'Please try again shortly.',
        type: 'error',
      })
    }
  }

  return (
    <footer className="no-print bg-[#12141a] border-t border-[#1a1d26] relative text-[#b4bcc9] font-sans">
      {/* Accolades Banner */}
      <div className="border-b border-[#1a1d26] py-10 bg-[#0e1015]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {RESTAURANT_INFO.awards.map((award, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-3">
                <Award className="w-5 h-5 text-[#fcf5df] mb-2 stroke-[1.5]" />
                <span className="text-[#fcf5df] font-serif text-xl tracking-wide">{award.title}</span>
                <span className="text-[11px] text-[#8c94a4] uppercase tracking-widest mt-1 font-sans">
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
              <span className="font-serif text-4xl text-[#fcf5df] leading-none">
                Aura
              </span>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#d8caa4] mt-1 font-sans">
                Edinburgh • 2 Michelin Stars
              </span>
            </Link>
            <p className="text-sm text-[#b4bcc9] leading-relaxed max-w-sm mb-6 font-sans">
              An unhurried celebration of hyper-seasonal Scottish terroir, wild Highland foraging,
              and timeless culinary craftsmanship in the historic vaults of Royal Terrace.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#8c94a4] font-sans">
              <span>Chef Patron: {RESTAURANT_INFO.chefPatron}</span>
              <span>•</span>
              <span>Cellar: {RESTAURANT_INFO.headSommelier}</span>
            </div>
          </div>

          {/* Quick Links Col */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-serif text-[#fcf5df] mb-5">
              Navigation
            </h3>
            <ul className="space-y-3 text-xs tracking-wider uppercase font-sans">
              <li>
                <Link to="/" className="hover:text-[#fcf5df] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-[#fcf5df] transition-colors">
                  Tasting Menus
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#fcf5df] transition-colors">
                  Our Story & Terroir
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-[#fcf5df] transition-colors">
                  The Gallery
                </Link>
              </li>
              <li>
                <Link to="/reservations" className="hover:text-[#fcf5df] transition-colors">
                  Reservations
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#fcf5df] transition-colors">
                  Contact & Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Hours & Location Col */}
          <div className="lg:col-span-3">
            <h3 className="text-xl font-serif text-[#fcf5df] mb-5">
              Service Hours
            </h3>
            <div className="space-y-3 text-xs text-[#b4bcc9] font-sans">
              <div>
                <p className="text-[#fcf5df] font-medium">Dinner Service</p>
                <p className="text-[11px] text-[#8c94a4]">Wed – Sat: 17:30 – 23:00</p>
              </div>
              <div>
                <p className="text-[#fcf5df] font-medium">Lunch Service</p>
                <p className="text-[11px] text-[#8c94a4]">Fri & Sat: 12:00 – 14:30</p>
              </div>
              <div>
                <p className="text-[#fcf5df] font-medium">Sunday Supper Tasting</p>
                <p className="text-[11px] text-[#8c94a4]">17:00 – 22:00</p>
              </div>
              <div className="pt-2">
                <p className="text-[#fcf5df] font-medium flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#d8caa4]" />
                  {RESTAURANT_INFO.address}
                </p>
              </div>
            </div>
          </div>

          {/* Newsletter Col */}
          <div className="lg:col-span-3">
            <h3 className="text-xl font-serif text-[#fcf5df] mb-3">
              Salon Gazette
            </h3>
            <p className="text-xs text-[#b4bcc9] leading-relaxed mb-4 font-sans">
              Receive seasonal harvest release notices, private cellar tastings, and culinary salon essays.
            </p>
            <form onSubmit={handleSubmit(onSubmitNewsletter)} className="space-y-2 font-sans">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  {...register('email')}
                  className="w-full bg-[#1a1d26] border border-[#262b38] focus:border-[#fcf5df] rounded-sm px-3.5 py-2.5 text-xs text-[#fcf5df] placeholder-[#6b7382] focus:outline-none transition-colors"
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-rose-400">{errors.email.message}</p>
              )}
              <Button
                type="submit"
                variant="secondary"
                size="sm"
                isLoading={isSubmitting || newsletterMutation.isPending}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                className="w-full justify-center text-[10px] bg-[#fcf5df] text-[#12141a] hover:bg-white border-0"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="mt-16 pt-8 border-t border-[#1a1d26] flex flex-col md:flex-row items-center justify-between text-xs text-[#6b7382] gap-4 font-sans">
          <p>© {new Date().getFullYear()} AURA Edinburgh Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[11px] uppercase tracking-wider">
            <Link to="/contact" className="hover:text-[#b4bcc9] transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-[#b4bcc9] transition-colors">
              Terms & Cancellation
            </Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-[#b4bcc9] transition-colors">
              Press Enquiries
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
