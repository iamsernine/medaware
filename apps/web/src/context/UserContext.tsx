import { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  id: string
  display_name: string
  role: string
  is_verified_doctor: boolean
}

const UserContext = createContext<{ user: User | null; setUser: (u: User | null) => void } | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}
