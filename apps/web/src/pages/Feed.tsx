import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useUser } from '../context/UserContext'
import { VoteButton } from '../components/VoteButton'

export function Feed() {
  const { user } = useUser()
  const [questions, setQuestions] = useState<any[]>([])
  const [meta, setMeta] = useState<{ page: number; total: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [tag, setTag] = useState('')
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<'newest' | 'votes'>('newest')

  const fetchQuestions = useCallback(() => {
    setLoading(true)
    setError(null)
    api.getQuestions({ search: search || undefined, tag: tag || undefined, page, limit: 20, sort, userId: user?.id })
      .then((r) => {
        setQuestions(r.data || [])
        setMeta((r as any).meta || null)
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false))
  }, [search, tag, page, sort, user?.id])

  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          style={{ padding: 8, flex: 1, minWidth: 120 }}
        />
        <input
          placeholder="Tag filter"
          value={tag}
          onChange={(e) => { setTag(e.target.value); setPage(1) }}
          style={{ padding: 8, width: 120 }}
        />
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value as 'newest' | 'votes'); setPage(1) }}
          style={{ padding: 8 }}
        >
          <option value="newest">Newest</option>
          <option value="votes">Most upvoted</option>
        </select>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: '#f55' }}>Error: {error}</p>
      ) : questions.length === 0 ? (
        <p>No questions yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {questions.map((q) => (
            <li key={q.id} style={{ borderBottom: '1px solid #333', padding: '12px 0', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ flexShrink: 0 }}>
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
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link to={`/q/${q.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  <strong>{q.title}</strong>
                  <div style={{ fontSize: 14, color: '#888', marginTop: 4 }}>
                    by {q.author?.display_name} · {q.status} · {new Date(q.created_at).toLocaleDateString()}
                    {q.tags?.length ? ` · ${q.tags.join(', ')}` : ''}
                  </div>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
      {meta && meta.total > 20 && (
        <div style={{ marginTop: 16 }}>
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
          <span style={{ margin: '0 16px' }}>Page {page}</span>
          <button disabled={page * 20 >= meta.total} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}
    </div>
  )
}
