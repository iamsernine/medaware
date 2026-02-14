import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { useUser } from '../context/UserContext'

export function ActiveUserDropdown() {
  const { user, setUser } = useUser()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getUsers().then((r) => { setUsers(r.data || []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <span>Loading users...</span>
  return (
    <select
      value={user?.id ?? ''}
      onChange={(e) => {
        const u = users.find((u) => u.id === e.target.value)
        setUser(u ?? null)
      }}
      style={{ padding: '4px 8px', minWidth: 160 }}
    >
      <option value="">-- Select user --</option>
      {users.map((u) => (
        <option key={u.id} value={u.id}>
          {u.display_name} ({u.role}{u.is_verified_doctor ? ', verified' : ''})
        </option>
      ))}
    </select>
  )
}
