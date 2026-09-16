import React from 'react'
import { HeroSection } from '@/components/home/HeroSection'
import { TerroirStory } from '@/components/home/TerroirStory'
import { FeaturedCourses } from '@/components/home/FeaturedCourses'
import { AccoladesBanner } from '@/components/home/AccoladesBanner'
import { ExperiencePreview } from '@/components/home/ExperiencePreview'
import { ReservationCTA } from '@/components/home/ReservationCTA'

export const HomePage: React.FC = () => {
  return (
    <div className="relative">
      <HeroSection />
      <AccoladesBanner />
      <TerroirStory />
      <FeaturedCourses />
      <ExperiencePreview />
      <ReservationCTA />
    </div>
  )
}
