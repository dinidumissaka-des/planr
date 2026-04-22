import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  if (pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/signup/verify" ||
    pathname === "/forgot-password" ||
    pathname === "/forgot-password/sent" ||
    pathname === "/reset-password"

  const isPublicRoute = pathname === "/"

  if (!user && !isAuthRoute && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (user) {
    const role = user.user_metadata?.role as string | undefined
    const isConsultant = role === "consultant"
    const onboardingDone = user.user_metadata?.onboarding_completed === true
    const isOnboardingRoute = pathname.startsWith("/onboarding")
    const isConsultantRoute = pathname.startsWith("/consultant")

    if (pathname === "/") {
      return NextResponse.redirect(
        new URL(isConsultant ? "/consultant/dashboard" : "/dashboard", request.url)
      )
    }

    if (isAuthRoute) {
      return NextResponse.redirect(
        new URL(isConsultant ? "/consultant/dashboard" : "/dashboard", request.url)
      )
    }

    // Consultants bypass client onboarding and go straight to their dashboard
    if (isConsultant) {
      if (isOnboardingRoute) {
        return NextResponse.redirect(new URL("/consultant/dashboard", request.url))
      }

      const consultantProfileDone = user.user_metadata?.consultant_profile_completed === true
      const isConsultantOnboardingRoute = pathname.startsWith("/consultant/onboarding")

      // Gate: must complete profile before accessing the app
      if (!consultantProfileDone && !isConsultantOnboardingRoute) {
        return NextResponse.redirect(new URL("/consultant/onboarding", request.url))
      }
      if (consultantProfileDone && isConsultantOnboardingRoute) {
        return NextResponse.redirect(new URL("/consultant/dashboard", request.url))
      }

      // Block consultants from client-only routes (non-consultant, non-auth, non-api)
      if (!isConsultantRoute) {
        return NextResponse.redirect(new URL("/consultant/dashboard", request.url))
      }
      return supabaseResponse
    }

    // Client flow: onboarding gate
    if (isConsultantRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    if (!onboardingDone && !isOnboardingRoute) {
      return NextResponse.redirect(new URL("/onboarding", request.url))
    }
    if (onboardingDone && isOnboardingRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
