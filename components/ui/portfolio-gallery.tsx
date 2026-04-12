"use client"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react"

type PortfolioItem = { url: string; caption: string; category: string }

function Lightbox({ items, index, onClose }: {
  items: PortfolioItem[]
  index: number
  onClose: () => void
}) {
  const [current, setCurrent] = useState(index)
  const prev = () => setCurrent(i => (i - 1 + items.length) % items.length)
  const next = () => setCurrent(i => (i + 1) % items.length)

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2">
        <X className="w-6 h-6" />
      </button>

      {items.length > 1 && (
        <>
          <button
            onClick={e => { e.stopPropagation(); prev() }}
            className="absolute left-4 text-white/70 hover:text-white transition-colors p-2 bg-white/10 hover:bg-white/20 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={e => { e.stopPropagation(); next() }}
            className="absolute right-4 text-white/70 hover:text-white transition-colors p-2 bg-white/10 hover:bg-white/20 rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      <div className="flex flex-col items-center gap-4 px-16 max-w-4xl w-full" onClick={e => e.stopPropagation()}>
        <img
          src={items[current].url}
          alt={items[current].caption}
          className="w-full max-h-[70vh] object-cover rounded-xl"
        />
        <div className="text-center">
          <p className="text-white font-semibold">{items[current].caption}</p>
          <p className="text-white/50 text-sm">{items[current].category}</p>
        </div>
        {items.length > 1 && (
          <div className="flex gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all ${i === current ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/30"}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function PortfolioGallery({ portfolio }: { portfolio: PortfolioItem[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (!portfolio || portfolio.length === 0) return null

  return (
    <>
      <div>
        <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Images className="w-3.5 h-3.5" /> Portfolio
        </p>
        <div className="grid grid-cols-2 gap-2">
          {portfolio.map((item, i) => (
            <button
              key={i}
              onClick={() => setLightboxIndex(i)}
              className="group relative aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-white/5"
            >
              <img
                src={item.url}
                alt={item.caption}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex flex-col items-start justify-end p-2.5 opacity-0 group-hover:opacity-100">
                <span className="text-[10px] font-semibold bg-white/20 text-white px-1.5 py-0.5 rounded-md mb-1">{item.category}</span>
                <p className="text-xs font-semibold text-white leading-tight text-left">{item.caption}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox items={portfolio} index={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </>
  )
}
