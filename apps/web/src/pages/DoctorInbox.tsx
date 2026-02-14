import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'

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

  if (loading) return <p className="text-muted-foreground">Loading...</p>
  if (error) return <p className="text-destructive">Error: {error}</p>
  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">No open questions.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <ul className="list-none space-y-3 p-0">
      {questions.map((q) => (
        <li key={q.id}>
          <Link to={`/doctor/respond/${q.id}`} className="block text-foreground no-underline hover:opacity-90">
            <Card className="transition-colors hover:bg-card/80">
              <CardContent className="p-4">
                <p className="font-semibold leading-tight">{q.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>by {q.author?.display_name}</span>
                  <Badge variant="secondary">{new Date(q.created_at).toLocaleDateString()}</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  )
}
