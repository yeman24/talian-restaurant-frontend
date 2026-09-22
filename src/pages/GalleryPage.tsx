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
        accentImage="/images/vault_dining.jpg"
      />

      <GalleryLightbox />
    </div>
  )
}
