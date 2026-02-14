import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ActiveUserDropdown } from './ActiveUserDropdown'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-6">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link to="/" className="block text-foreground no-underline hover:opacity-90">
              <h1 className="m-0 text-2xl font-bold tracking-tight">MedAware</h1>
            </Link>
            <nav className="mt-2 flex flex-wrap gap-4 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground">
                Feed
              </Link>
              <Link to="/new" className="text-muted-foreground hover:text-foreground">
                Ask Question
              </Link>
              <Link to="/mine" className="text-muted-foreground hover:text-foreground">
                My Questions
              </Link>
            </nav>
          </div>
          <ActiveUserDropdown />
        </header>
        <main>{children}</main>
      </div>
    </div>
  )
}
