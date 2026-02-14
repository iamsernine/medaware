import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useUser } from '../context/UserContext'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'

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

  if (!user) return <p className="text-muted-foreground">Select a user to see questions you've asked.</p>

  if (loading) return <p className="text-muted-foreground">Loading...</p>
  if (error) return <p className="text-destructive">Error: {error}</p>
  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">You have not posted any questions yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <ul className="list-none space-y-3 p-0">
      {questions.map((q) => (
        <li key={q.id}>
          <Link to={`/q/${q.id}`} className="block text-foreground no-underline hover:opacity-90">
            <Card className="transition-colors hover:bg-card/80">
              <CardContent className="p-4">
                <p className="font-semibold leading-tight">{q.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary">{q.status}</Badge>
                  <span>{new Date(q.created_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  )
}
