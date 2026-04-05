"use client"

import { useState } from "react"
import { X, ChevronDown, Upload, BadgeCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

const categories = [
  "Residential Architecture",
  "Interior Design",
  "Landscape Architecture",
  "Urban Design",
  "Structural Engineering",
  "Building Permits",
]

function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-gray-600/80 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#0D1B2E] rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-400 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 bg-gray-100 dark:bg-white/8 rounded-xl flex items-center justify-center">
            <BadgeCheck className="w-10 h-10 text-yellow-400" strokeWidth={1.5} />
          </div>
        </div>

        <h2 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-4">
          Your question has been sent successfully
        </h2>

        <div className="border-t border-gray-100 dark:border-white/8 mb-4" />

        <p className="text-sm text-gray-500 dark:text-gray-400 text-center leading-relaxed mb-5">
          You will get an reference number to access your answer through a
          notification and you will receive an email when your request is approved
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Find out more at the{" "}
          <a href="#" className="text-blue-500 hover:underline font-medium">
            Help Center
          </a>
        </p>
      </div>
    </div>
  )
}

export default function AskPage() {
  const router = useRouter()
  const [category, setCategory] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [question, setQuestion] = useState("")
  const [description, setDescription] = useState("")
  const [driveLink, setDriveLink] = useState("")
  const [submitted, setSubmitted] = useState(false)

  return (
    <>
      <div className="fixed inset-0 bg-gray-600/80 flex items-center justify-center z-40 p-4">
        {/* Modal */}
        <div className="flex w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl">
          {/* ── Left Panel ── */}
          <div
            className="w-[38%] relative flex flex-col justify-between p-8"
            style={{
              background: "linear-gradient(160deg, #8fa882 0%, #9aab8a 40%, #b5b87a 100%)",
            }}
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
                Lets get<br />started.
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                Select the problem category and then ask your problem. We will get
                back to you with the best solution.
              </p>
            </div>

            {/* Lamp image */}
            <div className="flex justify-center mt-6">
              <img
                src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&auto=format&fit=crop&q=80"
                alt="Desk lamp"
                className="w-48 h-64 object-cover object-top rounded-xl opacity-90"
                style={{
                  maskImage: "linear-gradient(to top, transparent 0%, black 30%)",
                  WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 30%)",
                }}
              />
            </div>
          </div>

          {/* ── Right Panel ── */}
          <div className="flex-1 bg-white dark:bg-[#0D1B2E] flex flex-col p-8 relative">
            <button
              onClick={() => router.push("/login")}
              className="absolute top-5 right-5 text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex-1 flex flex-col gap-4 mt-2">
              {/* Category dropdown */}
              <div className="relative w-fit">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-white/15 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  {category || "Select category"}
                  <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-500" />
                </button>
                {dropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-[#0D1B2E] border border-gray-200 dark:border-white/10 rounded-lg shadow-lg z-10 overflow-hidden">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => { setCategory(cat); setDropdownOpen(false) }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Input
                placeholder="Type your question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="h-12 border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-600 text-sm"
              />

              <Textarea
                placeholder="Describe your problem"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-600 text-sm flex-1 min-h-[140px]"
              />

              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Upload files or add multiple files in a public Google drive folder{" "}
                  <span className="text-red-500">*</span>
                </p>
                <Input
                  placeholder="Add Google Drive folder link (make permission public)"
                  value={driveLink}
                  onChange={(e) => setDriveLink(e.target.value)}
                  className="h-12 border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-600 text-sm mb-3"
                />
                <p className="text-sm text-gray-400 dark:text-gray-600 mb-3">or</p>
                <Button
                  variant="secondary"
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 border-0 gap-2 text-sm"
                >
                  <Upload className="w-4 h-4" />
                  Upload photos
                </Button>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Button
                className="w-full h-12 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-base rounded-xl"
                onClick={() => setSubmitted(true)}
              >
                Submit Question
              </Button>
              <button className="text-sm text-gray-500 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 transition-colors text-center">
                Ask later
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success modal layered on top */}
      {submitted && <SuccessModal onClose={() => router.push("/login")} />}
    </>
  )
}
