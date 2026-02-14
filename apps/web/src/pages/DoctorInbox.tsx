import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

export function DoctorInbox() {
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setError(null)
    api.getQuestions({})
      .then((r) => {
        const open = (r.data || []).filter((q: any) => q.status === 'OPEN')
        setQuestions(open)
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p style={{ color: '#f55' }}>Error: {error}</p>
  if (questions.length === 0) return <p>No open questions.</p>

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {questions.map((q) => (
        <li key={q.id} style={{ borderBottom: '1px solid #333', padding: '12px 0' }}>
          <Link to={`/doctor/respond/${q.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
            <strong>{q.title}</strong>
            <div style={{ fontSize: 14, color: '#888' }}>
              by {q.author?.display_name} · {new Date(q.created_at).toLocaleDateString()}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
