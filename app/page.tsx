'use client'

import { useEffect } from 'react'
import { MotionConfig } from 'motion/react'
import { LandingNav } from '@/components/landing/landing-nav'
import { Hero } from '@/components/landing/hero'
import { Categories, How, Marquee, What } from '@/components/landing/sections-top'
import { Cta, Experts, Footer, Stats, Testimonials, Why } from '@/components/landing/sections-bottom'

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
      <main className="overflow-x-hidden bg-white antialiased [--lp-card-border:rgba(7,16,29,.08)] [--lp-card-shadow:0_1px_2px_rgba(7,16,29,.04),0_18px_40px_-20px_rgba(7,16,29,.16)] [--lp-card:#fff] dark:bg-[#07111E] dark:[--lp-card-border:rgba(129,185,233,.12)] dark:[--lp-card-shadow:0_24px_48px_-24px_rgba(0,0,0,.6)] dark:[--lp-card:#0D1B2E]">
        <LandingNav />
        <Hero />
        <Marquee />
        <Categories />
        <What />
        <How />
        <Stats />
        <Experts />
        <Why />
        <Testimonials />
        <Cta />
        <Footer />
      </main>
    </MotionConfig>
  )
}
