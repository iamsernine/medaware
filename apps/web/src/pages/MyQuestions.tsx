import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useUser } from '../context/UserContext'

export function MyQuestions() {
  const { user } = useUser()
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) {
      setQuestions([])
      setError(null)
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    api.getQuestions({ author_id: user.id })
      .then((r) => setQuestions(r.data || []))
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false))
  }, [user?.id])

  if (!user) return <p>Select a patient user to see your questions.</p>
  if (user.role !== 'PATIENT') return <p>Only patients have "my questions."</p>

  if (loading) return <p>Loading...</p>
  if (error) return <p style={{ color: '#f55' }}>Error: {error}</p>
  if (questions.length === 0) return <p>You have not posted any questions yet.</p>

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {questions.map((q) => (
        <li key={q.id} style={{ borderBottom: '1px solid #333', padding: '12px 0' }}>
          <Link to={`/q/${q.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
            <strong>{q.title}</strong>
            <div style={{ fontSize: 14, color: '#888' }}>
              {q.status} · {new Date(q.created_at).toLocaleDateString()}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
