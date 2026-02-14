import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useUser } from '../context/UserContext'
import { VoteButton } from '../components/VoteButton'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Select } from '../components/ui/select'
import { Badge } from '../components/ui/badge'

export function Feed() {
  const { user } = useUser()
  const [questions, setQuestions] = useState<any[]>([])
  const [meta, setMeta] = useState<{ page: number; total: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [tag, setTag] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<'newest' | 'votes'>('newest')

  const fetchQuestions = useCallback(() => {
    setLoading(true)
    setError(null)
    api.getQuestions({ search: search || undefined, tag: tag || undefined, category: category || undefined, page, limit: 20, sort, userId: user?.id })
      .then((r) => {
        setQuestions(r.data || [])
        setMeta((r as any).meta || null)
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false))
  }, [search, tag, category, page, sort, user?.id])

  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="max-w-xs"
        />
        <Input
          placeholder="Tag filter"
          value={tag}
          onChange={(e) => { setTag(e.target.value); setPage(1) }}
          className="w-32"
        />
        <Select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1) }}
          className="w-36"
        >
          <option value="">All categories</option>
          <option value="GENERAL">General</option>
          <option value="SYMPTOMS">Symptoms</option>
          <option value="MEDICATION">Medication</option>
          <option value="DIAGNOSIS">Diagnosis</option>
          <option value="OTHER">Other</option>
        </Select>
        <Select
          value={sort}
          onChange={(e) => { setSort(e.target.value as 'newest' | 'votes'); setPage(1) }}
          className="w-40"
        >
          <option value="newest">Newest</option>
          <option value="votes">Most upvoted</option>
        </Select>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : error ? (
        <p className="text-destructive">Error: {error}</p>
      ) : questions.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">No questions yet.</p>
          </CardContent>
        </Card>
      ) : (
        <ul className="list-none space-y-3 p-0">
          {questions.map((q) => (
            <li key={q.id}>
              <Card className="overflow-hidden transition-colors hover:bg-card/80">
                <CardContent className="flex gap-4 p-4">
                  <div className="flex-shrink-0 pt-0.5">
                    <VoteButton
                      voteCount={q.voteCount ?? 0}
                      hasVoted={q.hasVoted}
                      onVote={async () => {
                        if (user) {
                          await api.voteQuestion(q.id, user.id)
                          fetchQuestions()
                        }
                      }}
                      onUnvote={async () => {
                        if (user) {
                          await api.unvoteQuestion(q.id, user.id)
                          fetchQuestions()
                        }
                      }}
                      disabled={!user}
                      title={!user ? 'Select a user to vote' : undefined}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link to={`/q/${q.id}`} className="block text-foreground no-underline hover:opacity-90">
                      <p className="font-semibold leading-tight">{q.title}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span>by {q.author?.display_name}</span>
                        <Badge variant="outline" className="text-xs">{q.category ?? 'GENERAL'}</Badge>
                        <Badge variant="secondary" className="text-xs">{q.status}</Badge>
                        <span>{new Date(q.created_at).toLocaleDateString()}</span>
                        {q.tags?.length ? (
                          <span className="flex gap-1">
                            {q.tags.map((t: string) => (
                              <Badge key={t} variant="outline">{t}</Badge>
                            ))}
                          </span>
                        ) : null}
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {meta && meta.total > 20 && (
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {Math.ceil(meta.total / 20)}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page * 20 >= meta.total}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
