import React from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { ReservationWizard } from '@/components/reservations/ReservationWizard'
import { HelpCircle } from 'lucide-react'

export const ReservationsPage: React.FC = () => {
  const faqs = [
    {
      q: 'Can dietary restrictions and allergies be accommodated?',
      a: 'Yes. With at least 48 hours notice, Chef Euan Macleod and our culinary brigade can tailor the 8-Course Tasting Menu to pescatarian, vegetarian, vegan, gluten-free, or specific allergen requirements with zero compromise on technique or balance.',
    },
    {
      q: 'What is the table cancellation and deposit policy?',
      a: 'Due to the intimate 28-seat capacity of our dining room and our reliance on daily harvests from local hand-divers and foragers, cancellations or party size reductions must be provided at least 48 hours prior to service.',
    },
    {
      q: 'Is there a dress code?',
      a: 'We encourage smart elegant attire. Jackets are welcomed and preferred; sportswear, athletic footwear, and shorts are not permitted in the dining vault.',
    },
    {
      q: 'Are children accommodated?',
      a: 'To safeguard the contemplative, unhurried fine dining rhythm of our 3-hour tasting sequences, we welcome young guests aged 12 and above who will participate in the complete tasting menu.',
    },
    {
      q: 'How far in advance do reservations open?',
      a: 'Reservations are released on the first calendar day of each month at 09:00 GMT for the following 90 days. For exclusive vault buyouts or parties over 8 guests, please reach out via our contact concierge.',
    },
  ]

  return (
    <div>
      <PageHeader
        eyebrow="Table Bookings"
        title="Reserve an Experience"
        subtitle="We invite you to join us for our Autumn Tasting Menu. Every sitting is prepared with meticulous bespoke attention."
        breadcrumbs={[{ label: 'Reservations' }]}
        accentImage="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85"
      />

      {/* Main Reservation Flow */}
      <ReservationWizard />

      {/* FAQs and Hospitality Information */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-stone-800">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-[#c5a059]" />
            <span className="text-xs uppercase tracking-[0.28em] text-[#c5a059] font-sans font-medium">
              Guest Inquiries
            </span>
          </div>
          <h3 className="font-serif text-3xl text-white font-light">
            Dining Policies & Frequently Asked Questions
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="p-6 rounded-xl bg-[#0e1017] border border-stone-800/80 space-y-2"
            >
              <h4 className="font-serif text-base text-[#f5eed8] font-normal leading-snug">
                {faq.q}
              </h4>
              <p className="text-xs text-stone-400 font-light leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
