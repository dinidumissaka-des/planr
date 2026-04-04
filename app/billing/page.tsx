"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { CreditCard } from "lucide-react"

export default function BillingPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [card, setCard] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [zip, setZip] = useState("")
  const [agreed, setAgreed] = useState(false)

  function formatCard(val: string) {
    return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim()
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader title="Billing" icon={<CreditCard className="w-5 h-5 text-gray-700" />} />
        <div className="flex-1 overflow-y-auto flex items-center justify-center px-8 py-10">
      <div className="w-full max-w-4xl grid grid-cols-2 gap-24 items-start">

        {/* ── Left: Form ── */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">
            Get your answer from an Expert in minutes
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-8">
            Ask your question for a $1 join fee and $34/mo, then either cancel or continue for $36/mo thereafter.
          </p>

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Email address</label>
              <Input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-white border-gray-200 h-11 text-sm"
              />
            </div>

            {/* Card number */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Credit card number</label>
              <Input
                placeholder="0000 0000 0000 0000"
                value={card}
                onChange={e => setCard(formatCard(e.target.value))}
                className="bg-white border-gray-200 h-11 text-sm font-mono tracking-wide"
              />
            </div>

            {/* Expiry / CVV / ZIP */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Expiration</label>
                <Input
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={e => setExpiry(e.target.value)}
                  className="bg-white border-gray-200 h-11 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">CVV</label>
                <Input
                  placeholder="CVV"
                  value={cvv}
                  onChange={e => setCvv(e.target.value.slice(0, 4))}
                  className="bg-white border-gray-200 h-11 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">ZIP / Postal code</label>
                <Input
                  placeholder="12345"
                  value={zip}
                  onChange={e => setZip(e.target.value.slice(0, 10))}
                  className="bg-white border-gray-200 h-11 text-sm"
                />
              </div>
            </div>

            {/* Checkbox */}
            <label className="flex items-center gap-2.5 cursor-pointer pt-1">
              <Checkbox checked={agreed} onCheckedChange={v => setAgreed(!!v)} />
              <span className="text-sm text-gray-600">
                I agree all{" "}
                <a href="#" className="font-semibold text-gray-900 hover:underline">Privacy Policy</a>
                {" "}and Fees
              </span>
            </label>
          </div>

          {/* CTA */}
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full mt-6 h-12 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Connect now
          </button>

          <p className="text-xs text-gray-400 leading-relaxed mt-4">
            Avoid contractor fees. Get the answer you need.<br />Cancel anytime.
          </p>
        </div>

        {/* ── Right: How it works ── */}
        <div>
          {/* Architecture image */}
          <div className="rounded-2xl overflow-hidden mb-7 h-48">
            <img
              src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&auto=format&fit=crop&q=80"
              alt="Architecture"
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-6">How it works</h2>

          <div className="space-y-6">
            {[
              {
                n: "1",
                title: "Ask your question",
                body: "Tell us your situation. Ask any question in any category, anytime you want.",
              },
              {
                n: "2",
                title: "Let us match you",
                body: "We'll connect you in minutes with the best Expert for your question.",
              },
              {
                n: "3",
                title: "Chat with an Expert",
                body: "Talk, text, or chat till you have your answer. Members get unlimited conversations 24/7, so you'll always have an Expert ready to help.",
              },
            ].map(step => (
              <div key={step.n}>
                <p className="text-sm font-bold text-gray-900 mb-1">
                  {step.n}. {step.title}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
        </div>
      </div>
    </div>
  )
}
