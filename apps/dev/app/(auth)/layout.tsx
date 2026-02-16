/**
 * Auth Layout
 *
 * Simple layout for auth-related pages (test, etc.)
 */

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      {children}
    </div>
  )
}
