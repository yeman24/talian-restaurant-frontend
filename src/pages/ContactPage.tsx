import React from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { ContactForm } from '@/components/contact/ContactForm'
import { MapAndHours } from '@/components/contact/MapAndHours'

export const ContactPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        eyebrow="Concierge & Directions"
        title="Location & Enquiries"
        subtitle="14–16 Royal Terrace Vaults, Edinburgh. Carved into historic Georgian stone, overlooking Calton Hill."
        breadcrumbs={[{ label: 'Contact' }]}
        accentImage="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=85"
      />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-6">
            <ContactForm />
          </div>
          <div className="lg:col-span-6">
            <MapAndHours />
          </div>
        </div>
      </div>
    </div>
  )
}
