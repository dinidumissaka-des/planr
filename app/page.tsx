'use client'

import { useEffect } from 'react'
import { MotionConfig } from 'motion/react'
import { AnnouncementBar, LandingHeader } from '@/components/landing/nav'
import { Hero, SpecialismMarquee } from '@/components/landing/hero'
import { ProductSection, StatementPanel, StatsPanel } from '@/components/landing/product'
import { AiSection, Specialists } from '@/components/landing/ai'
import { Faq, FinalCta, Footer, StoriesPanel, Trust } from '@/components/landing/sections'

export default function Home() {
  useEffect(() => {
    const html = document.documentElement
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) html.style.scrollBehavior = 'smooth'
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
      <div className="relative overflow-x-clip bg-white antialiased dark:bg-[#07111E]">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-gray-900 focus:px-4 focus:py-2 focus:text-[14px] focus:text-white"
        >
          Skip to main content
        </a>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[max(900px,100svh)] bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,#E6F0F9_0%,transparent_70%),radial-gradient(ellipse_45%_40%_at_8%_78%,rgba(129,185,233,0.22),transparent_70%),radial-gradient(ellipse_40%_35%_at_95%_70%,rgba(225,193,166,0.18),transparent_70%)] dark:bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,#12263F_0%,transparent_70%),radial-gradient(ellipse_45%_40%_at_8%_78%,rgba(59,131,190,0.18),transparent_70%)]" />
        <AnnouncementBar />
        <LandingHeader />
        <main id="main" className="relative">
          <div className="flex flex-col lg:min-h-[max(580px,calc(100svh-103px))]">
            <Hero />
            <SpecialismMarquee />
          </div>
          <StatsPanel />
          <ProductSection />
          <StatementPanel />
          <AiSection />
          <Specialists />
          <StoriesPanel />
          <Trust />
          <Faq />
          <FinalCta />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  )
}
