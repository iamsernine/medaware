import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { useUser } from '../context/UserContext'
import { Select } from './ui/select'
import { Label } from './ui/label'

export function ActiveUserDropdown() {
  const { user, setUser } = useUser()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getUsers().then((r) => { setUsers(r.data || []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <span className="text-sm text-muted-foreground">Loading users...</span>
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="active-user" className="text-xs text-muted-foreground">Active user</Label>
      <Select
        id="active-user"
        value={user?.id ?? ''}
        onChange={(e) => {
          const u = users.find((u) => u.id === e.target.value)
          setUser(u ?? null)
        }}
        className="min-w-[180px]"
      >
        <option value="">— Select user —</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.display_name} ({u.role}{u.is_verified_doctor ? ', verified' : ''})
          </option>
        ))}
      </Select>
    </div>
  )
}
