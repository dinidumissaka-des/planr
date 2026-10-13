'use client'

import { useEffect } from 'react'
import { MotionConfig } from 'motion/react'
import { LandingNav } from '@/components/landing/landing-nav'
import { Hero } from '@/components/landing/hero'
import { Ask, Expertise, Cta, Footer, How, ProjectTypes, Quote, Tracker } from '@/components/landing/sections'

export default function Home() {
  useEffect(() => {
    const html = document.documentElement
    html.style.scrollBehavior = 'smooth'
    document.body.style.overflow = 'auto'
    document.body.style.height = 'auto'
    return () => {
      html.style.scrollBehavior = ''
      document.body.style.overflow = ''
      document.body.style.height = ''
    }
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <main className="overflow-x-hidden bg-[#F5F2EC] antialiased dark:bg-[#07111E]">
        <LandingNav />
        <Hero />
        <How />
        <Tracker />
        <Expertise />
        <ProjectTypes />
        <Ask />
        <Quote />
        <Cta />
        <Footer />
      </main>
    </MotionConfig>
  )
}
