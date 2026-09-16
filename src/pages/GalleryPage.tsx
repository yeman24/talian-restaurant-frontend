import React from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { GalleryLightbox } from '@/components/gallery/GalleryLightbox'

export const GalleryPage: React.FC = () => {
  return (
    <div>
      <PageHeader
        eyebrow="Visual Chronicle"
        title="Atmospheres of AURA"
        subtitle="A photographic collection spanning culinary plating, subterranean candlelight, the sommelier cellar, and Highland foraging dawns."
        breadcrumbs={[{ label: 'Gallery' }]}
        accentImage="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=85"
      />

      <GalleryLightbox />
    </div>
  )
}
