import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ActiveUserDropdown } from './ActiveUserDropdown'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
      <header style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            <h1 style={{ margin: 0, fontSize: 24 }}>MedAware</h1>
          </Link>
          <nav style={{ marginTop: 8, fontSize: 14 }}>
            <Link to="/" style={{ marginRight: 16, color: '#888' }}>Feed</Link>
            <Link to="/patient/new" style={{ marginRight: 16, color: '#888' }}>Ask Question</Link>
            <Link to="/patient/mine" style={{ marginRight: 16, color: '#888' }}>My Questions</Link>
            <Link to="/doctor/inbox" style={{ color: '#888' }}>Doctor Inbox</Link>
          </nav>
        </div>
        <ActiveUserDropdown />
      </header>
      <main>{children}</main>
    </div>
  )
}
