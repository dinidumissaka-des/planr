"use client"

import { useEffect, useState } from "react"
import { ShieldCheck, ShieldX, Clock, CheckCircle, XCircle, BadgeCheck } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { createClient } from "@/lib/supabase"
import { fetchPendingCredentials, approveCredential, rejectCredential, type PendingCredential } from "@/lib/data"
import { Button } from "@/components/ui/button"

const CREDENTIAL_TYPE_LABEL: Record<string, string> = {
  license: "License",
  certification: "Certification",
  degree: "Degree",
  membership: "Membership",
}

export default function AdminCredentialsPage() {
  const [credentials, setCredentials] = useState<PendingCredential[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [acting, setActing] = useState<string | null>(null)
  const [toast, setToast] = useState<{ id: string; msg: string; ok: boolean } | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.is_admin === true) {
        setIsAdmin(true)
        fetchPendingCredentials().then(data => {
          setCredentials(data)
          setLoading(false)
        }).catch(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })
  }, [])

  function showToast(id: string, msg: string, ok: boolean) {
    setToast({ id, msg, ok })
    setTimeout(() => setToast(t => t?.id === id ? null : t), 3500)
  }

  async function handleApprove(cred: PendingCredential) {
    setActing(cred.id)
    try {
      await approveCredential(cred.id, cred.user_id)
      setCredentials(prev => prev.filter(c => c.id !== cred.id))
      showToast(cred.id, `Approved "${cred.title}" for ${cred.display_name}`, true)
    } catch {
      showToast(cred.id, "Something went wrong. Try again.", false)
    } finally {
      setActing(null)
    }
  }

  async function handleReject(cred: PendingCredential) {
    setActing(cred.id)
    try {
      await rejectCredential(cred.id, cred.user_id)
      setCredentials(prev => prev.filter(c => c.id !== cred.id))
      showToast(cred.id, `Rejected "${cred.title}" for ${cred.display_name}`, false)
    } catch {
      showToast(cred.id, "Something went wrong. Try again.", false)
    } finally {
      setActing(null)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#07111E] overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader title="Credential Review" />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-white/20 border-t-gray-900 dark:border-t-white animate-spin" />
            </div>
          )}

          {!loading && !isAdmin && (
            <div className="max-w-md mx-auto bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-8 text-center mt-8">
              <ShieldX className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-base font-semibold text-gray-800 dark:text-white mb-1">Access denied</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">This page is restricted to administrators.</p>
            </div>
          )}

          {!loading && isAdmin && (
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <BadgeCheck className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <h1 className="text-base font-bold text-gray-900 dark:text-white">Pending Credentials</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{credentials.length} awaiting review</p>
                </div>
              </div>

              {credentials.length === 0 && (
                <div className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-10 text-center">
                  <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-800 dark:text-white mb-1">All caught up</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">No credentials are pending review.</p>
                </div>
              )}

              <div className="space-y-3">
                {credentials.map(cred => (
                  <div key={cred.id} className="bg-white dark:bg-[#0D1B2E] border border-gray-100 dark:border-white/8 rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {CREDENTIAL_TYPE_LABEL[cred.credential_type] ?? cred.credential_type}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{cred.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{cred.issuing_body}{cred.issued_year ? ` · ${cred.issued_year}` : ""}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Submitted by <span className="font-medium text-gray-600 dark:text-gray-300">{cred.display_name}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={acting === cred.id}
                          onClick={() => handleReject(cred)}
                          className="h-8 px-3 text-xs border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 dark:bg-transparent"
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                        </Button>
                        <Button
                          size="sm"
                          disabled={acting === cred.id}
                          onClick={() => handleApprove(cred)}
                          className="h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium z-50 ${
          toast.ok
            ? "bg-emerald-600 text-white"
            : "bg-red-600 text-white"
        }`}>
          {toast.ok ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}
    </div>
  )
}
