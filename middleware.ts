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
  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/signup/verify" ||
    pathname === "/forgot-password" ||
    pathname === "/forgot-password/sent" ||
    pathname === "/reset-password"

  if (!user && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (user) {
    const onboardingDone = user.user_metadata?.onboarding_completed === true
    const isOnboardingRoute = pathname.startsWith("/onboarding")

    if (isAuthRoute) {
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
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
