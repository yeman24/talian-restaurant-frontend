import React from 'react'
import { motion } from 'framer-motion'
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
        accentImage="/images/vault_dining.jpg"
      />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6"
          >
            <ContactForm />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-6"
          >
            <MapAndHours />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
